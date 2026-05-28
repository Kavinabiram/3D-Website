import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ZoneProps {
  visible: boolean;
}

export const GalleryZone: React.FC<ZoneProps> = ({ visible }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const elapsed = state.clock.getElapsedTime();
    
    // Animate item floats
    const items = groupRef.current.getObjectByName('gallery-items');
    if (items) {
      items.children.forEach((child, index) => {
        child.position.y = Math.sin(elapsed * 1.5 + index) * 0.15 + 0.8;
        child.rotation.y = elapsed * 0.5 + index;
      });
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={[0, 2, -22]}>
      {/* Dynamic gallery spotlight beams */}
      <spotLight position={[-3, 6, 2]} angle={0.3} intensity={4} color="#F5E8D3" castShadow />
      <spotLight position={[0, 6, 2]} angle={0.3} intensity={4} color="#D6A85F" castShadow />
      <spotLight position={[3, 6, 2]} angle={0.3} intensity={4} color="#F7B955" castShadow />

      {/* Gallery Pedestals */}
      <group position={[0, -1.5, 0]}>
        {/* Left Stand */}
        <mesh position={[-2.5, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.6, 2.0, 32]} />
          <meshPhysicalMaterial color="#1C0D0A" roughness={0.4} metalness={0.8} />
        </mesh>
        
        {/* Center Stand */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.6, 2.0, 32]} />
          <meshPhysicalMaterial color="#1C0D0A" roughness={0.4} metalness={0.8} />
        </mesh>
        
        {/* Right Stand */}
        <mesh position={[2.5, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.6, 2.0, 32]} />
          <meshPhysicalMaterial color="#1C0D0A" roughness={0.4} metalness={0.8} />
        </mesh>
      </group>

      {/* Floating Chocolates */}
      <group name="gallery-items">
        {/* Left Item: Luxury Truffle */}
        <mesh position={[-2.5, 0.8, 0]} castShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshPhysicalMaterial
            color="#2D140F"
            roughness={0.8}
            bumpScale={0.03}
            clearcoat={0.3}
          />
        </mesh>

        {/* Center Item: Caramel Gold Pyramid */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <coneGeometry args={[0.35, 0.5, 4]} />
          <meshPhysicalMaterial
            color="#D6A85F"
            roughness={0.18}
            metalness={0.95}
            clearcoat={1.0}
          />
        </mesh>

        {/* Right Item: Dusted Cube */}
        <mesh position={[2.5, 0.8, 0]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshPhysicalMaterial
            color="#4B2418"
            roughness={0.35}
            metalness={0.1}
            sheen={1.0}
            sheenColor={new THREE.Color('#D6A85F')}
          />
        </mesh>
      </group>
    </group>
  );
};

export default GalleryZone;
