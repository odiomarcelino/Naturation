import React from 'react';
import { motion } from 'framer-motion';

const DesertSection = () => (
  <section className="h-screen flex items-center justify-center bg-gradient-to-b from-yellow-200 to-yellow-400 relative overflow-hidden">
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="z-10"
    >
      <h2 className="text-5xl font-extrabold text-yellow-800 drop-shadow-lg mb-8">Desert Section</h2>
      <div className="text-lg text-yellow-900 bg-white/60 rounded-xl px-6 py-4 shadow-lg backdrop-blur-md">
        More features coming soon
      </div>
    </motion.div>
    {/* Animated sand dunes */}
    <svg className="absolute bottom-0 left-0 w-full h-1/3 z-0" viewBox="0 0 1920 360" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 320 Q480 200 960 320 T1920 320 V360 H0Z" fill="#f7e9b0" />
      <path d="M0 340 Q600 260 1200 340 T1920 340 V360 H0Z" fill="#f5d97c" />
    </svg>
  </section>
);

export default DesertSection;
