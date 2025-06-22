import React, { useEffect, useRef, useState } from 'react';

interface WeatherResp {
  weather: {
    temperature?: number;
    windspeed?: number;
    weathercode?: number;
  };
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

const SkySection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isNight, setIsNight] = useState(false);
  const [weather, setWeather] = useState<WeatherResp['weather'] | null>(null);
  const [rainCount, setRainCount] = useState<number | null>(null);

  // Fetch weather once on mount
  useEffect(() => {
    fetch('/api/weather')
      .then((r) => r.json())
      .then((data: WeatherResp) => setWeather(data.weather))
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Fetch rain stats on mount and every 10s
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
    let localClouds: { x: number; y: number }[] = [];

    const draw = () => {
      frame++;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Sky color based on weather
      let skyColor = isNight ? '#0a0a2a' : '#87cefa';
      if (weather?.weathercode && [3, 45, 48, 51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weather.weathercode)) {
        skyColor = isNight ? '#22223a' : '#b0c4de'; // Cloudy or rainy
      }
      ctx.fillStyle = skyColor;
      ctx.fillRect(0, 0, width, height);

      // sun or moon
      ctx.fillStyle = isNight ? '#fff' : '#ffd700';
      ctx.beginPath();
      ctx.arc(width - 100, 100, 40, 0, Math.PI * 2);
      ctx.fill();

      // generate clouds every ~1s (assuming 60fps)
      if (frame % 60 === 0) {
        localClouds.push({ x: -120, y: 50 + Math.random() * (height * 0.4) });
        if (localClouds.length > 15) localClouds.shift();
      }
      // move and draw clouds
      const wind = weather?.windspeed ?? 5;
      localClouds.forEach((c) => {
        c.x += wind * 0.2;
        ctx.fillStyle = '#ffffffcc';
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, 60, 30, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // If rainy, draw rain
      if (weather?.weathercode && [61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weather.weathercode)) {
        // Record a rain event
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
          ctx.stroke();
        }
      }

      requestAnimationFrame(draw);
    };
    draw();
    return () => {};
  }, [isNight, weather]);

  const toggleDayNight = () => {
    setIsNight((v) => !v);
  };

  return (
    <section className="h-screen flex items-center justify-center bg-gradient-to-b from-sky-300 to-blue-100 relative" onClick={toggleDayNight}>
      <canvas ref={canvasRef} width={1920} height={1080} className="w-full h-full absolute inset-0 z-0" />
      <div className="absolute left-4 bottom-4 text-sm opacity-80 space-y-1 z-10">
        <div>Click anywhere to toggle day/night.</div>
        {weather && (
          <div className="flex items-center gap-2">
            <span className="text-2xl">{weatherIcons[weather.weathercode ?? 0]}</span>
            <span>Temp: {weather.temperature ?? '–'}°C · Wind: {weather.windspeed ?? '–'} km/h</span>
          </div>
        )}
        <div className="text-xs mt-1">Total rain events: {rainCount !== null ? rainCount : '–'}</div>
      </div>
      <h2 className="text-4xl font-bold text-sky-900 z-10">Sky Section</h2>
    </section>
  );
};

export default SkySection;
