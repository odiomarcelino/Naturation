"use client";
// River scene – immersive, interactive, with parallax and sound
import { useEffect, useRef, useState } from 'react';

interface Ripple {
  x: number;
  y: number;
  r: number;
}

const PARALLAX_LAYERS = [
  { color: '#0f172a', speed: 0.1, height: 120 }, // far background
  { color: '#1e293b', speed: 0.2, height: 80 },  // mid background
  { color: '#2563eb', speed: 0.4, height: 40 },  // near water
];

export default function River() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Load ambient river sound
  useEffect(() => {
    const audioEl = new Audio('/river-ambience.mp3');
    audioEl.loop = true;
    audioEl.volume = 0.4;
    setAudio(audioEl);
    return () => { audioEl.pause(); };
  }, []);

  // Play sound on first interaction
  useEffect(() => {
    if (!audio) return;
    const play = () => { audio.play().catch(() => {}); window.removeEventListener('pointerdown', play); };
    window.addEventListener('pointerdown', play);
    return () => window.removeEventListener('pointerdown', play);
  }, [audio]);

  // draw loop with parallax
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let frame = 0;
    const draw = () => {
      frame++;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      // Parallax backgrounds
      PARALLAX_LAYERS.forEach((layer, i) => {
        const offset = Math.sin(frame * 0.01 + i) * 10 + mouseX * layer.speed;
        ctx.fillStyle = layer.color;
        ctx.fillRect(0, height - layer.height - offset, width, layer.height + offset);
      });
      // Water surface
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(0, height - 200, width, 200);
      // Animate ripples
      setRipples((prev) =>
        prev
          .map((r) => ({ ...r, r: r.r + 1 }))
          .filter((r) => r.r < 150)
      );
      ripples.forEach((r) => {
        ctx.strokeStyle = `rgba(255,255,255,${1 - r.r / 150})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
      });
      requestAnimationFrame(draw);
    };
    draw();
  }, [ripples, mouseX]);

  // Mouse/touch parallax
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseX((e.clientX - rect.left) / rect.width);
    setMouseY((e.clientY - rect.top) / rect.height);
  };

  // Ripple on click/tap
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    let x = 0, y = 0;
    if ('touches' in e && e.touches.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else if ('clientX' in e) {
      const rect = e.currentTarget.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    setRipples((prev) => [...prev, { x, y, r: 0 }]);
  };

  return (
    <main className="w-full h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        className="w-full h-full cursor-crosshair touch-none"
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        onTouchStart={handleClick}
      />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 text-lg pointer-events-none select-none drop-shadow-lg">
        <span>Move your mouse or tap to create ripples in the river.</span>
      </div>
    </main>
  );
}
