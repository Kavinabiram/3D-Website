import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../../../store/useStore';
import ChocolateBar from '../shared/ChocolateBar';
import CocoaParticles from '../shared/CocoaParticles';
import GoldTrails from '../shared/GoldTrails';

interface SceneProps {
  visible: boolean;
}

export const RevealScene: React.FC<SceneProps> = ({ visible }) => {
  const config = useStore((state) => state.config);
  const groupRef = useRef<THREE.Group>(null);
  const toppingsGroupRef = useRef<THREE.Group>(null);

  // Generate dynamic floating toppings that orbit the bar
  const toppingsData = useMemo(() => {
    const list: { type: string; pos: [number, number, number]; scale: number; speed: number }[] = [];
    
    if (config.toppings.includes('hazelnut')) {
      for (let i = 0; i < 6; i++) {
        list.push({
          type: 'hazelnut',
          pos: [Math.sin(i) * 1.5, (Math.random() - 0.5) * 1.8, Math.cos(i) * 1.5],
          scale: 0.12 + Math.random() * 0.05,
          speed: 0.3 + Math.random() * 0.4
        });
      }
    }

    if (config.toppings.includes('raspberry')) {
      for (let i = 0; i < 6; i++) {
        list.push({
          type: 'raspberry',
          pos: [Math.cos(i * 1.5) * 1.6, (Math.random() - 0.5) * 1.8, Math.sin(i * 1.5) * 1.6],
          scale: 0.09 + Math.random() * 0.04,
          speed: 0.2 + Math.random() * 0.4
        });
      }
    }

    if (config.toppings.includes('sea_salt')) {
      for (let i = 0; i < 10; i++) {
        list.push({
          type: 'sea_salt',
          pos: [(Math.random() - 0.5) * 2.2, (Math.random() - 0.5) * 2.2, (Math.random() - 0.5) * 2.2],
          scale: 0.06 + Math.random() * 0.03,
          speed: 0.1 + Math.random() * 0.2
        });
      }
    }

    if (config.toppings.includes('gold_dust')) {
      for (let i = 0; i < 12; i++) {
        list.push({
          type: 'gold_dust',
          pos: [(Math.random() - 0.5) * 2.5, (Math.random() - 0.5) * 2.5, (Math.random() - 0.5) * 2.5],
          scale: 0.04 + Math.random() * 0.04,
          speed: 0.4 + Math.random() * 0.6
        });
      }
    }

    return list;
  }, [config.toppings]);

  useFrame((state) => {
    if (!visible) return;
    const elapsed = state.clock.getElapsedTime();
    
    // Slow hero rotating orbit of the chocolate bar
    if (groupRef.current) {
      groupRef.current.rotation.y = elapsed * 0.15;
      groupRef.current.rotation.x = Math.sin(elapsed * 0.1) * 0.15;
      
      // Mouse Parallax drift
      const mx = state.pointer.x * 0.2;
      const my = state.pointer.y * 0.2;
      groupRef.current.rotation.y += mx;
      groupRef.current.rotation.x += my;
    }

    // Animate the floating toppings in orbital paths
    if (toppingsGroupRef.current) {
      toppingsGroupRef.current.children.forEach((child, index) => {
        const item = toppingsData[index];
        if (!item) return;

        // Circular horizontal drift
        const theta = index + elapsed * item.speed;
        child.position.x = Math.sin(theta) * (1.2 + Math.abs(item.pos[1]) * 0.3);
        child.position.z = Math.cos(theta) * (1.2 + Math.abs(item.pos[1]) * 0.3);
        child.position.y = item.pos[1] + Math.sin(elapsed * 0.8 + index) * 0.08;
        child.rotation.x = elapsed * 0.4 + index;
        child.rotation.y = elapsed * 0.2;
      });
    }
  });

  if (!visible) return null;

  return (
    <group position={[0, 0, -130]}>
      {/* Studio Premium Lighting */}
      <spotLight
        position={[2, 6, 4]}
        angle={0.6}
        penumbra={1}
        intensity={4}
        color="#F5E8D3"
        castShadow
        shadow-bias={-0.0001}
      />
      <spotLight
        position={[-3, -4, 3]}
        angle={0.8}
        penumbra={1}
        intensity={1.5}
        color="#D6A85F"
      />
      <directionalLight position={[0, 0, 5]} intensity={0.5} color="#4B2418" />

      {/* Floating Chocolate Bar */}
      <group ref={groupRef} scale={1.3}>
        <ChocolateBar />
      </group>

      {/* Floating toppings wrapping the bar */}
      <group ref={toppingsGroupRef}>
        {toppingsData.map((item, idx) => {
          if (item.type === 'hazelnut') {
            return (
              <mesh key={idx} scale={item.scale} castShadow>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color="#8B5A2B" roughness={0.7} />
              </mesh>
            );
          }
          if (item.type === 'raspberry') {
            return (
              <mesh key={idx} scale={item.scale} castShadow>
                <cylinderGeometry args={[0.8, 1, 1, 8]} />
                <meshStandardMaterial color="#D02090" roughness={0.6} />
              </mesh>
            );
          }
          if (item.type === 'sea_salt') {
            return (
              <mesh key={idx} scale={item.scale} castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshPhysicalMaterial color="#FFFFFF" roughness={0.1} transmission={0.9} thickness={0.5} />
              </mesh>
            );
          }
          if (item.type === 'gold_dust') {
            return (
              <mesh key={idx} scale={item.scale}>
                <dodecahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color="#D6A85F" metalness={0.95} roughness={0.05} />
              </mesh>
            );
          }
          return null;
        })}
      </group>

      {/* Atmosphere dust and gold trail orbits */}
      <CocoaParticles count={90} />
      <GoldTrails />
    </group>
  );
};

export default RevealScene;
