import React, { useEffect, useRef, useState } from 'react';

interface SkySectionProps {
  isNight: boolean;
  weather: {
    temperature?: number;
    windspeed?: number;
    weathercode?: number;
  } | null;
}

const weatherIcons: Record<number, string> = {
  0: '☀️', // Clear
  1: '🌤️', // Mainly clear
  2: '⛅', // Partly cloudy
  3: '☁️', // Overcast
  45: '🌫️', // Fog
  48: '🌫️',
  51: '🌦️', // Drizzle
  53: '🌦️',
  55: '🌦️',
  61: '🌧️', // Rain
  63: '🌧️',
  65: '🌧️',
  71: '🌨️', // Snow
  73: '🌨️',
  75: '🌨️',
  80: '🌦️', // Showers
  81: '🌦️',
  82: '🌦️',
  95: '⛈️', // Thunderstorm
  96: '⛈️',
  99: '⛈️',
};

const SkySection = ({ isNight, weather }: SkySectionProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rainCount, setRainCount] = useState<number | null>(null);

  // Fetch rain stats on mount and every 10s
  useEffect(() => {
    const fetchStats = () => {
      fetch('/api/stats')
        .then((r) => r.json())
        .then((data) => {
          const rain = data.stats?.find((s: any) => s.type === 'rain');
          setRainCount(rain ? rain.count : 0);
        })
        .catch(() => setRainCount(null));
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let frame = 0;
    let localClouds: { x: number; y: number; layer: number }[] = [];

    // Helper for animated gradient
    let gradientShift = 0;

    const draw = () => {
      frame++;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Animated gradient sky
      gradientShift += 0.002;
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      if (isNight) {
        grad.addColorStop(0, `rgba(10,10,40,1)`);
        grad.addColorStop(1, `rgba(30,30,70,1)`);
      } else {
        grad.addColorStop(0, `rgba(${135 + 20 * Math.sin(gradientShift)},206,250,1)`);
        grad.addColorStop(1, `rgba(200,230,255,1)`);
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Sun or moon with glow
      const sunX = width - 140;
      const sunY = 120;
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 70, 0, Math.PI * 2);
      ctx.fillStyle = isNight ? '#fff6' : '#ffd70066';
      ctx.shadowColor = isNight ? '#fff' : '#ffd700';
      ctx.shadowBlur = 60;
      ctx.fill();
      ctx.restore();
      ctx.beginPath();
      ctx.arc(sunX, sunY, 40, 0, Math.PI * 2);
      ctx.fillStyle = isNight ? '#fff' : '#ffd700';
      ctx.shadowBlur = 0;
      ctx.fill();

      // Generate clouds every ~1s (assuming 60fps)
      if (frame % 60 === 0) {
        localClouds.push({ x: -120, y: 50 + Math.random() * (height * 0.4), layer: Math.random() > 0.5 ? 1 : 2 });
        if (localClouds.length > 18) localClouds.shift();
      }
      // Move and draw clouds (layered, with soft edges)
      const wind = weather?.windspeed ?? 5;
      localClouds.forEach((c, i) => {
        c.x += wind * (c.layer === 1 ? 0.18 : 0.12);
        ctx.save();
        ctx.globalAlpha = c.layer === 1 ? 0.5 : 0.3;
        ctx.fillStyle = c.layer === 1 ? '#fff' : '#e0f7fa';
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, 60 + 20 * c.layer, 30 + 10 * c.layer, 0, 0, Math.PI * 2);
        ctx.ellipse(c.x + 40, c.y + 10, 40 + 10 * c.layer, 20 + 5 * c.layer, 0, 0, Math.PI * 2);
        ctx.ellipse(c.x - 40, c.y + 10, 40 + 10 * c.layer, 20 + 5 * c.layer, 0, 0, Math.PI * 2);
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.restore();
      });

      // If rainy, draw rain
      if (weather?.weathercode && [61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weather.weathercode)) {
        fetch('/api/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'rain' }),
        }).catch(() => {});
        for (let i = 0; i < 40; i++) {
          const rx = Math.random() * width;
          const ry = Math.random() * height * 0.7;
          ctx.strokeStyle = '#a3bffa';
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx, ry + 15 + Math.random() * 10);
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.7;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
      requestAnimationFrame(draw);
    };
    draw();
    return () => {};
  }, [isNight, weather]);

  return (
    <section className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-300 to-blue-100 relative overflow-hidden">
      <canvas ref={canvasRef} width={1920} height={1080} className="w-full h-full absolute inset-0 z-0" />
      <div className="absolute left-8 bottom-8 text-base opacity-90 space-y-2 z-10 bg-white/60 rounded-xl px-6 py-4 shadow-lg backdrop-blur-md">
        <div className="font-medium text-sky-900">Click anywhere to toggle day/night.</div>
        {weather && (
          <div className="flex items-center gap-3 text-lg">
            <span className="text-3xl">{weatherIcons[weather.weathercode ?? 0]}</span>
            <span>Temp: <span className="font-semibold">{weather.temperature ?? '–'}°C</span> · Wind: <span className="font-semibold">{weather.windspeed ?? '–'} km/h</span></span>
          </div>
        )}
        <div className="text-xs mt-2 text-sky-800">Total rain events: <span className="font-bold">{rainCount !== null ? rainCount : '–'}</span></div>
      </div>
      <h2 className="text-5xl font-extrabold text-sky-900 drop-shadow-lg z-10 mt-12">Sky Section</h2>
    </section>
  );
};

export default SkySection;
