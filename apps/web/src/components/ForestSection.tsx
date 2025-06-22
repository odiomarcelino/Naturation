import React, { useEffect, useRef, useState } from 'react';

const RUBY_SEASON_URL = process.env.NEXT_PUBLIC_SEASON_API || 'http://localhost:4567/season';

const seasonColors: Record<string, string> = {
  spring: 'bg-green-200',
  summer: 'bg-yellow-200',
  autumn: 'bg-orange-200',
  winter: 'bg-blue-100',
};

const ForestSection = () => {
  const [season, setSeason] = useState('spring');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wasmLoaded, setWasmLoaded] = useState(false);
  const [wasm, setWasm] = useState<any>(null);

  useEffect(() => {
    const fetchSeason = () => {
      fetch(RUBY_SEASON_URL)
        .then((r) => r.json())
        .then((data) => setSeason(data.season))
        .catch(() => setSeason('spring'));
    };
    fetchSeason();
    const interval = setInterval(fetchSeason, 60_000); // update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    import('/wasm-particles/particles.js')
      .then(setWasm)
      .then(() => setWasmLoaded(true))
      .catch(() => setWasmLoaded(false));
  }, []);

  useEffect(() => {
    if (!wasmLoaded || !wasm || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let running = true;
    // Create 30 random particles
    let particles = Array.from({ length: 30 }, () => wasm.random_particle());
    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw background
      ctx.fillStyle = '#e6ffe6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Animate and draw particles
      for (let p of particles) {
        p.update();
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
      }
      requestAnimationFrame(draw);
    }
    draw();
    return () => { running = false; };
  }, [wasmLoaded, wasm]);

  return (
    <section className={`h-screen flex flex-col items-center justify-center transition-colors duration-700 ${seasonColors[season] || 'bg-green-200'}`}>
      <canvas ref={canvasRef} width={800} height={300} className="w-2/3 h-1/3 border-2 border-green-400 rounded-lg shadow-lg bg-green-100 mb-6" />
      <h2 className="text-4xl font-bold text-green-900 mb-4">Forest Section</h2>
      <div className="text-2xl font-semibold text-green-800 mb-2">Current Season: <span className="capitalize">{season}</span></div>
      <div className="text-green-700 opacity-80">(Ruby-powered season rotation: changes every hour)</div>
      <div className="text-xs text-green-700 opacity-60 mt-2">Rust/WASM-powered fireflies demo</div>
    </section>
  );
};

export default ForestSection;
