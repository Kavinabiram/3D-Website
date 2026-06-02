import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneProps {
  visible: boolean;
}

export const TemperingScene: React.FC<SceneProps> = ({ visible }) => {
  const vortexRef = useRef<THREE.Group>(null);
  const liquidPoolRef = useRef<THREE.Mesh>(null);

  // Generate deterministic ingredient paths
  const ingredients = useMemo(() => {
    const list = [];
    const types = ['sugar', 'milk', 'nut', 'cocoa'];
    for (let i = 0; i < 40; i++) {
      const type = types[i % types.length];
      const radius = 1.0 + Math.random() * 2.2;
      const angle = (i * Math.PI * 2) / 10 + Math.random() * 0.5;
      const speed = 0.5 + Math.random() * 1.0;
      const heightOffset = (Math.random() - 0.5) * 3.0; // Distribution height
      const scale = 0.08 + Math.random() * 0.08;

      list.push({ type, radius, angle, speed, heightOffset, scale });
    }
    return list;
  }, []);

  useFrame((state) => {
    if (!visible) return;
    const elapsed = state.clock.getElapsedTime();

    // 1. Swirl Ingredients in a Vortex
    if (vortexRef.current) {
      vortexRef.current.children.forEach((child, idx) => {
        const item = ingredients[idx];
        if (!item) return;

        // Swirl dynamics: angle shifts continuously
        const angle = item.angle + elapsed * item.speed * 0.8;
        // Spiral inward/outward slightly
        const radius = item.radius + Math.sin(elapsed * 0.5 + idx) * 0.15;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = item.heightOffset + Math.sin(elapsed * 1.2 + idx) * 0.15;

        child.position.set(x, y, z);
        child.rotation.y = elapsed * 1.5 + idx;
        child.rotation.x = elapsed * 0.5;
      });
    }

    // 2. Animate Chocolate Pool Waves
    if (liquidPoolRef.current) {
      liquidPoolRef.current.rotation.z = elapsed * 0.04;
    }
  });

  if (!visible) return null;

  return (
    <group position={[-10, -15, -80]}>
      {/* Studio Lighting */}
      <spotLight position={[0, 8, 2]} angle={0.6} intensity={4} color="#F5E8D3" castShadow />
      <directionalLight position={[3, -2, 2]} intensity={0.8} color="#D6A85F" />

      {/* Swirling Ingredients Group */}
      <group ref={vortexRef}>
        {ingredients.map((item, index) => {
          if (item.type === 'sugar') {
            return (
              <mesh key={index} scale={item.scale} castShadow>
                {/* Sugar Crystals */}
                <boxGeometry args={[1, 1, 1]} />
                <meshPhysicalMaterial
                  color="#FFFFFF"
                  roughness={0.05}
                  transmission={0.95}
                  thickness={0.8}
                  ior={1.55}
                  clearcoat={1.0}
                />
              </mesh>
            );
          }
          if (item.type === 'milk') {
            return (
              <mesh key={index} scale={item.scale} castShadow>
                {/* Milk Drops */}
                <sphereGeometry args={[0.8, 16, 16]} />
                <meshPhysicalMaterial
                  color="#FFFFFA"
                  roughness={0.02}
                  clearcoat={1.0}
                  clearcoatRoughness={0.01}
                  transmission={0.3}
                  thickness={0.4}
                />
              </mesh>
            );
          }
          if (item.type === 'nut') {
            return (
              <mesh key={index} scale={item.scale} castShadow>
                {/* Hazelnuts */}
                <sphereGeometry args={[1, 16, 16]} />
                <meshPhysicalMaterial
                  color="#8B5A2B"
                  roughness={0.85}
                  clearcoat={0.1}
                />
              </mesh>
            );
          }
          // Cocoa Powder Flakes
          return (
            <mesh key={index} scale={item.scale}>
              <dodecahedronGeometry args={[0.9, 0]} />
              <meshPhysicalMaterial
                color="#2C140F"
                roughness={0.95}
              />
            </mesh>
          );
        })}
      </group>

      {/* Glossy Tempered Chocolate Pool below */}
      <mesh
        ref={liquidPoolRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.4, 0]}
        receiveShadow
      >
        <planeGeometry args={[12, 12, 16, 16]} />
        <meshPhysicalMaterial
          color="#3D1C12"
          roughness={0.1}
          metalness={0.05}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          sheen={1.0}
          sheenColor={new THREE.Color('#4A2015')}
        />
      </mesh>
    </group>
  );
};

export default TemperingScene;
