import React, { useEffect, useState } from 'react';

const PHP_FLOWER_URL = process.env.NEXT_PUBLIC_FLOWER_API || 'http://localhost:8001/flower.php';

interface NightSkySectionProps {
  isNight: boolean;
}

const NightSkySection = ({ isNight }: NightSkySectionProps) => {
  const [svg, setSvg] = useState('');
  const [bloom, setBloom] = useState(false);
  const [bloomCount, setBloomCount] = useState<number | null>(null);

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

  return (
    <section className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 to-blue-800">
      <div
        className="transition-transform duration-500 cursor-pointer"
        onMouseEnter={() => handleBloom(true)}
        onMouseLeave={() => handleBloom(false)}
        dangerouslySetInnerHTML={{ __html: svg }}
        style={{ width: 120, height: 120 }}
        title="Hover to bloom!"
      />
      <h2 className="text-4xl font-bold text-white mt-8">Night Sky Section</h2>
      <div className="text-white opacity-80 mt-2">Hover the flower to make it bloom (PHP-powered SVG)</div>
      <div className="text-xs text-white opacity-70 mt-1">Total blooms: {bloomCount !== null ? bloomCount : '–'}</div>
    </section>
  );
};

export default NightSkySection;
