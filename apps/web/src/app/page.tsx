"use client";
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import RiverSection from '../components/RiverSection';
import SkySection3D from '../components/SkySection3D';
import ForestSection from '../components/ForestSection';
import DesertSection from '../components/DesertSection';
import MountainSection from '../components/MountainSection';
import NightSkySection from '../components/NightSkySection';

interface WeatherResp {
  weather: {
    temperature?: number;
    windspeed?: number;
  };
}

export default function Home() {
  const socketRef = useRef<Socket | null>(null);
  const [isNight, setIsNight] = useState(false);
  const [weather, setWeather] = useState<WeatherResp['weather'] | null>(null);

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

  const toggleDayNight = () => {
    setIsNight((v) => !v);
    socketRef.current?.send(JSON.stringify({ type: 'toggleSky' }));
  };

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-300 to-blue-500 text-white">
      <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Sky Environment</h1>
      <p className="text-lg opacity-80">A beautiful, animated sky will live here soon. ☁️</p>
      <div className="mt-8 text-base opacity-60">(Click navigation above to explore other environments)</div>
    </main>
  );
}
