import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

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
    // TODO: Update the import path below to the correct WASM JS output once available.
    // import('/wasm-particles/particles.js')
    //   .then(setWasm)
    //   .then(() => setWasmLoaded(true))
    //   .catch(() => setWasmLoaded(false));
    setWasmLoaded(false); // Prevents build error for now
  }, []);

  useEffect(() => {
    if (!wasmLoaded || !wasm || !canvasRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let running = true;
    // Create 30 random particles
    let particles = Array.from({ length: 30 }, () => wasm.random_particle());
    function draw() {
      if (!running || !ctx) return;
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
    <section className={`h-screen flex items-center justify-center bg-gradient-to-b from-green-200 to-green-400 relative overflow-hidden`}>
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10"
      >
        <h2 className="text-5xl font-extrabold text-green-900 drop-shadow-lg mb-8">Forest Section</h2>
        <div className="text-lg text-green-900 bg-white/60 rounded-xl px-6 py-4 shadow-lg backdrop-blur-md">
          Season: <span className="font-bold capitalize">{season}</span> (More features coming soon)
        </div>
      </motion.div>
      {/* Animated SVG trees */}
      <svg className="absolute bottom-0 left-0 w-full h-1/2 z-0" viewBox="0 0 1920 540" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
          <motion.rect initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.2 }} x="200" y="400" width="30" height="120" fill="#7c5e3c" />
          <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 1.2, delay: 0.4 }} cx="215" cy="400" r="60" fill="#3cb371" />
        </g>
        <g>
          <motion.rect initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.5 }} x="600" y="420" width="30" height="100" fill="#7c5e3c" />
          <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 1.2, delay: 0.7 }} cx="615" cy="420" r="50" fill="#228b22" />
        </g>
        <g>
          <motion.rect initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.8 }} x="1200" y="410" width="30" height="110" fill="#7c5e3c" />
          <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 1.2, delay: 1.0 }} cx="1215" cy="410" r="55" fill="#2e8b57" />
        </g>
      </svg>
    </section>
  );
};

export default ForestSection;
