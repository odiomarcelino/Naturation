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
    <main className="w-full min-h-screen bg-gradient-to-b from-blue-100 to-green-100" onClick={toggleDayNight}>
      <SkySection3D />
      <RiverSection />
      <ForestSection />
      <DesertSection />
      <MountainSection />
      <NightSkySection isNight={isNight} />
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
