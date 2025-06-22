import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const WS_URL = process.env.NEXT_PUBLIC_RIVER_WS_URL || 'ws://localhost:8080/ws';

interface Ripple {
  x: number;
  y: number;
  t: number; // timestamp
}

const RiverSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const [rippleCount, setRippleCount] = useState<number | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    ws.onopen = () => console.log('River WebSocket connected');
    ws.onclose = () => console.log('River WebSocket disconnected');
    ws.onerror = (e) => console.error('River WebSocket error', e);
    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (data.type === 'ripple' && typeof data.x === 'number' && typeof data.y === 'number') {
          ripplesRef.current.push({ x: data.x, y: data.y, t: Date.now() });
        }
      } catch {}
    };
    return () => ws.close();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let running = true;
    // GSAP animated water gradient
    let gradShift = { val: 0 };
    gsap.to(gradShift, { val: 1, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Animated water background
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, `rgba(79,195,247,1)`);
      grad.addColorStop(1, `rgba(${100 + 40 * gradShift.val},${180 + 30 * gradShift.val},255,1)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw ripples
      const now = Date.now();
      ripplesRef.current = ripplesRef.current.filter(r => now - r.t < 1200);
      ripplesRef.current.forEach(r => {
        const age = (now - r.t) / 1200;
        const radius = 10 + age * 80;
        ctx.save();
        ctx.globalAlpha = 1 - age;
        ctx.strokeStyle = `rgba(255,255,255,${1 - age})`;
        ctx.lineWidth = 2 + 2 * (1 - age);
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });
      requestAnimationFrame(draw);
    };
    draw();
    return () => { running = false; };
  }, []);

  useEffect(() => {
    // Fetch ripple stats on mount and every 10s
    const fetchStats = () => {
      fetch('/api/stats')
        .then((r) => r.json())
        .then((data) => {
          const ripple = data.stats?.find((s: any) => s.type === 'ripple');
          setRippleCount(ripple ? ripple.count : 0);
        })
        .catch(() => setRippleCount(null));
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    wsRef.current?.send(JSON.stringify({ type: 'ripple', x, y }));
    // Draw local ripple immediately
    ripplesRef.current.push({ x, y, t: Date.now() });
    // Record ripple event in stats
    fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'ripple' }),
    }).catch(() => {});
  };

  return (
    <section className="h-screen flex items-center justify-center bg-gradient-to-b from-blue-300 to-blue-500 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10"
      >
        <h2 className="text-5xl font-extrabold text-blue-900 drop-shadow-lg mb-8">River Section</h2>
        <div className="text-lg text-blue-900 bg-white/60 rounded-xl px-6 py-4 shadow-lg backdrop-blur-md">
          Ripple events: <span className="font-bold">{rippleCount !== null ? rippleCount : '–'}</span>
        </div>
      </motion.div>
      <canvas ref={canvasRef} width={1920} height={1080} className="w-full h-full absolute inset-0 z-0" />
    </section>
  );
};

export default RiverSection;
