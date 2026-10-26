import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../../../store/useStore';
import ChocolateBar from '../shared/ChocolateBar';
import CocoaParticles from '../shared/CocoaParticles';
import GoldTrails from '../shared/GoldTrails';
import InstancedToppings from '../shared/InstancedToppings';

interface SceneProps {
  visible: boolean;
}

export const RevealScene: React.FC<SceneProps> = ({ visible }) => {
  const config = useStore((state) => state.config);
  const groupRef = useRef<THREE.Group>(null);

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

      {/* Floating toppings wrapping the bar using highly optimized InstancedMesh */}
      <InstancedToppings toppings={config.toppings} />

      {/* Atmosphere dust and gold trail orbits */}
      <CocoaParticles count={90} />
      <GoldTrails />
    </group>
  );
};

export default RevealScene;
