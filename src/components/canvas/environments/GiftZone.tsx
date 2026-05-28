import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../../../store/useStore';

interface ZoneProps {
  visible: boolean;
}

export const GiftZone: React.FC<ZoneProps> = ({ visible }) => {
  const config = useStore((state) => state.config);
  const groupRef = useRef<THREE.Group>(null);

  // Map packaging to custom box colors
  const boxColor = useMemo(() => {
    switch (config.packaging) {
      case 'premium':
        return '#D6A85F'; // Luxury Gold Box
      case 'collector':
        return '#2D140F'; // Premium Dark Wood
      case 'classic':
      default:
        return '#4B2418'; // Melted Chocolate Brown
    }
  }, [config.packaging]);

  // Generate deterministic topping positions
  const toppingsData = useMemo(() => {
    const list: { type: string; pos: [number, number, number]; scale: number }[] = [];
    
    // Hazelnuts positions
    if (config.toppings.includes('hazelnut')) {
      for (let i = 0; i < 8; i++) {
        list.push({
          type: 'hazelnut',
          pos: [Math.sin(i) * 0.6, 0.1, Math.cos(i) * 0.4],
          scale: 0.08 + Math.random() * 0.04
        });
      }
    }

    // Raspberry positions
    if (config.toppings.includes('raspberry')) {
      for (let i = 0; i < 10; i++) {
        list.push({
          type: 'raspberry',
          pos: [Math.sin(i * 2) * 0.5, 0.08, Math.cos(i * 1.5) * 0.5],
          scale: 0.06 + Math.random() * 0.03
        });
      }
    }

    // Sea Salt positions
    if (config.toppings.includes('sea_salt')) {
      for (let i = 0; i < 15; i++) {
        list.push({
          type: 'sea_salt',
          pos: [(Math.random() - 0.5) * 1.2, 0.07, (Math.random() - 0.5) * 0.8],
          scale: 0.03 + Math.random() * 0.02
        });
      }
    }

    // Gold Dust positions
    if (config.toppings.includes('gold_dust')) {
      for (let i = 0; i < 20; i++) {
        list.push({
          type: 'gold_dust',
          pos: [(Math.random() - 0.5) * 1.4, 0.07, (Math.random() - 0.5) * 0.9],
          scale: 0.02 + Math.random() * 0.02
        });
      }
    }

    return list;
  }, [config.toppings]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const elapsed = state.clock.getElapsedTime();
    
    // Slow orbit rotation of the box
    groupRef.current.rotation.y = elapsed * 0.15;
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={[0, 0.5, -30]}>
      {/* Studio Lighting */}
      <spotLight position={[0, 6, 2]} angle={0.4} intensity={4} color="#F5E8D3" castShadow />
      <directionalLight position={[3, 3, 3]} intensity={1} color="#D6A85F" />

      {/* Gift Box Base tray */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 0.3, 1.2]} />
        <meshPhysicalMaterial
          color={boxColor}
          roughness={0.15}
          metalness={0.2}
          clearcoat={1.0}
        />
      </mesh>

      {/* Gift Box Lid resting adjacent */}
      <mesh castShadow position={[-1.2, -0.05, 0.4]} rotation={[0.2, 0.1, -0.4]}>
        <boxGeometry args={[1.82, 0.1, 1.22]} />
        <meshPhysicalMaterial
          color={boxColor}
          roughness={0.15}
          metalness={0.2}
          clearcoat={1.0}
        />
      </mesh>

      {/* Configured Toppings floating/resting inside the box tray */}
      {toppingsData.map((item, idx) => {
        if (item.type === 'hazelnut') {
          return (
            <mesh key={idx} position={item.pos} scale={item.scale} castShadow>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial color="#8B5A2B" roughness={0.7} />
            </mesh>
          );
        }
        if (item.type === 'raspberry') {
          return (
            <mesh key={idx} position={item.pos} scale={item.scale} castShadow>
              <cylinderGeometry args={[0.8, 1, 1, 8]} />
              <meshStandardMaterial color="#D02090" roughness={0.6} />
            </mesh>
          );
        }
        if (item.type === 'sea_salt') {
          return (
            <mesh key={idx} position={item.pos} scale={item.scale} castShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshPhysicalMaterial color="#FFFFFF" roughness={0.1} transmission={0.9} thickness={0.5} />
            </mesh>
          );
        }
        if (item.type === 'gold_dust') {
          return (
            <mesh key={idx} position={item.pos} scale={item.scale}>
              <dodecahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#D6A85F" metalness={0.9} roughness={0.1} />
            </mesh>
          );
        }
        return null;
      })}
    </group>
  );
};

export default GiftZone;
