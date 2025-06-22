"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Sky' },
  { href: '/river', label: 'River' },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-4 bg-black/40 px-4 py-2 rounded-full text-sm backdrop-blur-md">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`px-3 py-1 rounded-full hover:bg-white/20 transition-colors ${
            pathname === href ? 'bg-white/30' : ''
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
