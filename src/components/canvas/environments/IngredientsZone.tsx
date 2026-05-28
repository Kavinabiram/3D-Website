import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ZoneProps {
  visible: boolean;
}

export const IngredientsZone: React.FC<ZoneProps> = ({ visible }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const elapsed = state.clock.getElapsedTime();
    
    // Slow rotational drift for floating pods
    groupRef.current.children.forEach((child, index) => {
      child.rotation.y = elapsed * 0.15 + index;
      child.rotation.x = Math.sin(elapsed * 0.1 + index) * 0.2;
      child.position.y += Math.sin(elapsed * 0.5 + index) * 0.002;
    });
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={[12, -2, -15]}>
      {/* Dynamic warm sunset-like ambient lighting */}
      <directionalLight position={[-2, 4, 3]} intensity={1.8} color="#F7B955" />
      <pointLight position={[0, 0, 0]} intensity={1.2} color="#D6A85F" distance={8} />

      {/* Floating Cocoa Pod 1 */}
      <group position={[-2, 1, 0]} scale={0.7}>
        <mesh castShadow receiveShadow>
          {/* Squeezed sphere to resemble pod shape */}
          <sphereGeometry args={[1, 32, 16]} />
          <meshStandardMaterial color="#B97A3D" roughness={0.75} bumpScale={0.05} />
        </mesh>
        {/* Stem */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 8]} />
          <meshStandardMaterial color="#4B2418" roughness={0.9} />
        </mesh>
      </group>

      {/* Floating Cocoa Pod 2 */}
      <group position={[2, -1, -2]} scale={0.5}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1, 32, 16]} />
          <meshStandardMaterial color="#4B2418" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
          <meshStandardMaterial color="#2D140F" roughness={0.9} />
        </mesh>
      </group>

      {/* Floating Cocoa Seeds/Beans */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * 1.5) * 2.2,
            Math.cos(i * 2.0) * 1.5,
            (Math.random() - 0.5) * 2
          ]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
          scale={0.15}
          castShadow
        >
          {/* Squash sphere into cocoa bean bean shape */}
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#2D140F" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
};

export default IngredientsZone;
