import React, { useEffect, useRef, useState } from 'react';

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

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw water background
      ctx.fillStyle = '#4fc3f7';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw ripples
      const now = Date.now();
      ripplesRef.current = ripplesRef.current.filter(r => now - r.t < 1200);
      ripplesRef.current.forEach(r => {
        const age = (now - r.t) / 1200;
        const radius = 10 + age * 80;
        ctx.save();
        ctx.globalAlpha = 1 - age;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
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
    <section className="h-screen flex flex-col items-center justify-center bg-blue-200 relative">
      <canvas
        ref={canvasRef}
        width={1200}
        height={400}
        className="w-3/4 h-2/5 border-2 border-blue-400 rounded-lg shadow-lg bg-blue-300"
        onClick={handleCanvasClick}
      />
      <h2 className="text-4xl font-bold text-blue-900 mt-8">River Section (Go-powered ripples!)</h2>
      <div className="absolute left-4 bottom-4 text-blue-800 opacity-80">
        Click the river to create ripples (WebSocket demo)
        <div className="mt-1 text-xs">Total ripples: {rippleCount !== null ? rippleCount : '–'}</div>
      </div>
    </section>
  );
};

export default RiverSection;
