"use client";

import { useEffect, useState } from 'react';

const query = `{
  stats { type count }
}`;

const sections = [
  { name: 'River', language: 'Go', description: 'Real-time ripples via WebSocket', path: '/services/go-socket/main.go' },
  { name: 'Sky', language: 'Python', description: 'Live weather-driven sky/clouds (FastAPI)', path: '/services/py-weather/main.py' },
  { name: 'Forest', language: 'Ruby', description: 'Seasonal color changes (Sinatra)', path: '/services/rb-cron/app_server.rb' },
  { name: 'Night Sky', language: 'PHP', description: 'Dynamic SVG flower blooming', path: '/services/php-legacy/public/flower.php' },
  { name: 'Particles', language: 'Rust', description: 'High-performance WASM particle system', path: '/services/rs-particles/src/lib.rs' },
  { name: 'Stats API', language: 'TypeScript/Next.js', description: 'Unified stats and GraphQL API', path: '/apps/web/src/pages/api' },
];

export default function Dashboard() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetch('/api/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
      .then((r) => r.json())
      .then((data) => setStats(data.data.stats))
      .catch(() => setStats([]));
  }, []);

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">🌿 Polyglot Nature Animation Dashboard</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Live Stats</h2>
        <ul className="list-disc ml-6">
          {stats.map((s: any) => (
            <li key={s.type} className="mb-1">{s.type}: <span className="font-mono">{s.count}</span></li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Sections & Technologies</h2>
        <ul className="divide-y divide-gray-200">
          {sections.map((sec) => (
            <li key={sec.name} className="py-3">
              <div className="font-bold">{sec.name} <span className="text-xs bg-gray-200 rounded px-2 py-1 ml-2">{sec.language}</span></div>
              <div className="text-sm text-gray-700">{sec.description}</div>
              <a href={sec.path} className="text-xs text-blue-600 underline" target="_blank" rel="noopener noreferrer">Source</a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
