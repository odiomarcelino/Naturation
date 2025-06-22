import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Cloud, Sky } from '@react-three/drei';
import { a, useSpring } from '@react-spring/three';

function AnimatedSun() {
  // Animate sun position for a dynamic effect
  const { position } = useSpring({
    position: [30, 30, -30],
    config: { mass: 1, tension: 120, friction: 30 },
  });
  return (
    <a.mesh position={position as any}>
      <sphereGeometry args={[4, 32, 32]} />
      <meshStandardMaterial emissive="#fff700" color="#fff700" emissiveIntensity={1.5} />
    </a.mesh>
  );
}

export default function SkySection3D() {
  return (
    <section className="h-screen w-full">
      <Canvas camera={{ position: [0, 10, 40], fov: 60 }} shadows>
        <ambientLight intensity={0.7} />
        <directionalLight position={[30, 30, -30]} intensity={1.2} castShadow />
        <Suspense fallback={null}>
          <Sky distance={45000} sunPosition={[30, 30, -30]} inclination={0.1} azimuth={0.25} />
          <AnimatedSun />
          <Stars radius={100} depth={50} count={300} factor={4} saturation={0.5} fade speed={1} />
          <Cloud position={[-10, 15, 0]} speed={0.2} opacity={0.6} segments={30} />
          <Cloud position={[10, 18, -10]} speed={0.15} opacity={0.5} segments={25} />
          <Cloud position={[-20, 12, 10]} speed={0.18} opacity={0.4} segments={20} />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <h2 className="text-6xl font-extrabold text-white drop-shadow-2xl text-center">Sky Section 3D</h2>
      </div>
    </section>
  );
}
