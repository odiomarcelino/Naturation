"use client";
// River scene – demonstrates Rust→WASM ripple simulation
// If the compiled WASM is present under ../../../../services/rs-particles/pkg we load it dynamically.
// Fallback JS ripple is used if WASM is missing (e.g., during first install without wasm-pack).

import { useEffect, useRef, useState } from 'react';

interface Ripple {
  x: number;
  y: number;
  r: number;
}

export default function River() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // load WASM module once (non-blocking)
  useEffect(() => {
    (async () => {
      try {
        // Try to load WASM from public directory (Vercel compatible)
        await import('/rs-particles/particles.js');
        console.log('WASM ripple module loaded from public/rs-particles.');
        // Here you would wire up functions exported from Rust.
      } catch (err) {
        console.log('WASM module not found yet, falling back to JS ripples');
      }
    })();
  }, []);

  // draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let frame = 0;
    const draw = () => {
      frame++;
      const { width, height } = canvas;
      ctx.fillStyle = '#1e3a8a'; // deep blue river
      ctx.fillRect(0, 0, width, height);

      // animate ripples
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
  }, [ripples]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipples((prev) => [
      ...prev,
      { x: e.clientX - rect.left, y: e.clientY - rect.top, r: 0 },
    ]);
  };

  return (
    <main className="w-full h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        className="w-full h-full cursor-crosshair"
        onClick={handleClick}
      />
    </main>
  );
}
