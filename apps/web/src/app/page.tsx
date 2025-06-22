"use client";
import { useEffect, useRef, useState } from 'react';

interface WeatherResp {
  weather: {
    temperature?: number;
    windspeed?: number;
  };
}
import { io, Socket } from 'socket.io-client';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const [isNight, setIsNight] = useState(false);
  const [weather, setWeather] = useState<WeatherResp['weather'] | null>(null);
  const [clouds, setClouds] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const socket = io('/api/socket');
    socketRef.current = socket;
    socket.on('connect', () => console.log('socket connected'));
    socket.on('message', (data: string) => {
      try {
        const evt = JSON.parse(data);
        if (evt.type === 'toggleSky') setIsNight((v) => !v);
      } catch {}
    });
    return () => {
      socket.close();
    };
  }, []);

  // Fetch weather once on mount
  useEffect(() => {
    fetch('/api/weather')
      .then((r) => r.json())
      .then((data: WeatherResp) => setWeather(data.weather))
      .catch(() => {});
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

      // simple animated sun/moon
      // sky background
      ctx.fillStyle = isNight ? '#0a0a2a' : '#87cefa';
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

      requestAnimationFrame(draw);
    };
    draw();
  }, [isNight]);

  const toggleDayNight = () => {
    setIsNight((v) => !v);
    socketRef.current?.send(JSON.stringify({ type: 'toggleSky' }));
  };

  return (
    <main className="w-full h-screen overflow-hidden relative" onClick={toggleDayNight}>
      <canvas ref={canvasRef} width={1920} height={1080} className="w-full h-full" />
      <div className="absolute left-4 bottom-4 text-sm opacity-80 space-y-1">
        <div>Click anywhere to toggle day/night.</div>
        {weather && (
          <div>
            Temp: {weather.temperature ?? '–'}°C · Wind: {weather.windspeed ?? '–'} km/h
          </div>
        )}
      </div>
    </main>
  );
}
