import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../../../store/useStore';
import { createGoldFoilGeometry } from './geometryHelpers';

export const ChocolateBar: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  const activeSection = useStore((state) => state.activeSection);
  const config = useStore((state) => state.config);

  // Pre-generate crumpled gold foil wrapper
  const goldFoilGeom = useMemo(() => createGoldFoilGeometry(1.9, 2.76, 0.04), []);

  // Map baseType to high-end chocolate color hexes
  const chocolateColor = React.useMemo(() => {
    switch (config.baseType) {
      case 'milk':
        return '#3D1C12'; // Creamy milk chocolate
      case 'white':
        return '#F1E6D2'; // High-end white chocolate
      case 'dark':
      default:
        return '#1C0D0A'; // Dark cocoa
    }
  }, [config.baseType]);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Slow atmospheric rotation when active
    const elapsed = state.clock.getElapsedTime();
    if (activeSection === 0) {
      meshRef.current.rotation.y = Math.sin(elapsed * 0.2) * 0.3;
      meshRef.current.rotation.x = elapsed * 0.15;

      // Interactive mouse parallax
      const mx = state.pointer.x * 0.3;
      const my = state.pointer.y * 0.3;
      meshRef.current.rotation.y += mx;
      meshRef.current.rotation.x += my;
    } else {
      // Zone transitions: rotate and transition smoothly
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, elapsed * 0.05, 0.05);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, Math.PI / 4, 0.05);
    }
  });

  // Procedural construction of a 4x6 chocolate bar grid
  const tiles: React.ReactNode[] = [];
  const rows = 6;
  const cols = 4;
  const tileSize = 0.4;
  const gap = 0.04;
  const startX = -((cols - 1) * (tileSize + gap)) / 2;
  const startY = -((rows - 1) * (tileSize + gap)) / 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (tileSize + gap);
      const y = startY + r * (tileSize + gap);
      tiles.push(
        <mesh key={`${r}-${c}`} position={[x, y, 0.06]} castShadow receiveShadow>
          {/* Beveled chocolate square */}
          <boxGeometry args={[tileSize, tileSize, 0.08]} />
          <meshPhysicalMaterial
            color={chocolateColor}
            roughness={0.2}
            metalness={0.05}
            clearcoat={0.9}
            clearcoatRoughness={0.08}
            sheen={0.65}
            sheenColor={new THREE.Color('#4A2015')}
          />
        </mesh>
      );
    }
  }

  return (
    <group ref={meshRef}>
      {/* Chocolate Base Board */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[cols * (tileSize + gap) + 0.1, rows * (tileSize + gap) + 0.1, 0.12]} />
        <meshPhysicalMaterial
          color={chocolateColor}
          roughness={0.22}
          metalness={0.04}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          sheen={0.55}
          sheenColor={new THREE.Color('#4A2015')}
        />
      </mesh>

      {/* Grid of squares */}
      {tiles}

      {/* Luxury Gold Wrapper Core */}
      <mesh position={[0, 0, -0.06]} receiveShadow>
        <primitive object={goldFoilGeom} />
        <meshPhysicalMaterial
          color="#D6A85F"
          roughness={0.08}
          metalness={1.0}
          clearcoat={1.0}
          clearcoatRoughness={0.03}
        />
      </mesh>
    </group>
  );
};

export default ChocolateBar;
