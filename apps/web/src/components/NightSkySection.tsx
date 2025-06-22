import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const PHP_FLOWER_URL = process.env.NEXT_PUBLIC_FLOWER_API || 'http://localhost:8001/flower.php';

interface NightSkySectionProps {
  isNight: boolean;
}

const NightSkySection = ({ isNight }: NightSkySectionProps) => {
  const [svg, setSvg] = useState('');
  const [bloom, setBloom] = useState(false);
  const [bloomCount, setBloomCount] = useState<number | null>(null);
  const starCanvasRef = useRef<HTMLCanvasElement>(null);

  const fetchFlower = (bloomState: boolean) => {
    fetch(`${PHP_FLOWER_URL}?bloom=${bloomState ? 1 : 0}`)
      .then((r) => r.json())
      .then((data) => setSvg(data.svg))
      .catch(() => setSvg(''));
  };

  useEffect(() => {
    fetchFlower(bloom);
  }, [bloom]);

  useEffect(() => {
    // Fetch bloom stats on mount and every 10s
    const fetchStats = () => {
      fetch('/api/stats')
        .then((r) => r.json())
        .then((data) => {
          const bloom = data.stats?.find((s: any) => s.type === 'bloom');
          setBloomCount(bloom ? bloom.count : 0);
        })
        .catch(() => setBloomCount(null));
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleBloom = (b: boolean) => {
    setBloom(b);
    if (b) {
      fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'bloom' }),
      }).catch(() => {});
    }
  };

  // Star twinkle effect
  useEffect(() => {
    const canvas = starCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let running = true;
    // Generate stars
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.7 + Math.random() * 1.7,
      alpha: Math.random(),
    }));
    function animateStars() {
      if (!running || !canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star, i) => {
        star.alpha += (Math.random() - 0.5) * 0.07;
        if (star.alpha < 0.2) star.alpha = 0.2;
        if (star.alpha > 1) star.alpha = 1;
        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });
      requestAnimationFrame(animateStars);
    }
    animateStars();
    return () => { running = false; };
  }, [isNight]);

  return (
    <section className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 to-blue-800 relative overflow-hidden">
      <canvas ref={starCanvasRef} width={1920} height={1080} className="w-full h-full absolute inset-0 z-0" />
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10"
      >
        <div
          className="transition-transform duration-500 cursor-pointer"
          onMouseEnter={() => handleBloom(true)}
          onMouseLeave={() => handleBloom(false)}
          dangerouslySetInnerHTML={{ __html: svg }}
          style={{ width: 120, height: 120 }}
          title="Hover to bloom!"
        />
        <h2 className="text-5xl font-extrabold text-indigo-100 drop-shadow-lg mt-8 mb-4">Night Sky Section</h2>
        <div className="text-lg text-indigo-100 bg-white/20 rounded-xl px-6 py-4 shadow-lg backdrop-blur-md">
          Bloom events: <span className="font-bold">{bloomCount !== null ? bloomCount : '–'}</span>
        </div>
      </motion.div>
    </section>
  );
};

export default NightSkySection;
