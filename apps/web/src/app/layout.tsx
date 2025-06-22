import '../globals.css';
import Nav from '../components/Nav';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Nature Animation Showcase',
  description: 'Polyglot Vercel demo – immersive natural scenes',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-skyDay dark:bg-skyNight text-white transition-colors duration-700">
        <Nav />
        {children}
      </body>
    </html>
  );
}
