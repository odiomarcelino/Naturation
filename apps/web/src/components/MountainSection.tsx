import React from 'react';
import { motion } from 'framer-motion';

const MountainSection = () => (
  <section className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-200 to-blue-200 relative overflow-hidden">
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="z-10"
    >
      <h2 className="text-5xl font-extrabold text-gray-900 drop-shadow-lg mb-8">Mountain Section</h2>
      <div className="text-lg text-gray-800 bg-white/60 rounded-xl px-6 py-4 shadow-lg backdrop-blur-md">
        More features coming soon
      </div>
    </motion.div>
    {/* Animated mountains */}
    <svg className="absolute bottom-0 left-0 w-full h-1/2 z-0" viewBox="0 0 1920 540" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 500 L400 300 L800 500 L1200 350 L1600 500 L1920 400 V540 H0Z" fill="#b0c4de" />
      <path d="M0 540 L600 400 L1000 540 L1500 420 L1920 540 V540 H0Z" fill="#8fa4b3" />
    </svg>
  </section>
);

export default MountainSection;
