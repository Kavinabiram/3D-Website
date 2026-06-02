import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneProps {
  visible: boolean;
}

export const GrindingScene: React.FC<SceneProps> = ({ visible }) => {
  const wheelLeftRef = useRef<THREE.Mesh>(null);
  const wheelRightRef = useRef<THREE.Mesh>(null);
  const liquidRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!visible) return;
    const elapsed = state.clock.getElapsedTime();

    // Rotate grinding wheels in opposite directions
    if (wheelLeftRef.current) {
      wheelLeftRef.current.rotation.y = elapsed * 0.8;
    }
    if (wheelRightRef.current) {
      wheelRightRef.current.rotation.y = -elapsed * 0.8;
    }

    // Animate flow of chocolate stream (wave displacement)
    if (liquidRef.current) {
      liquidRef.current.position.y = -1.2 + Math.sin(elapsed * 2.0) * 0.05;
      liquidRef.current.scale.x = 1.0 + Math.sin(elapsed * 4.0) * 0.04;
    }
  });

  if (!visible) return null;

  return (
    <group position={[-15, 0, -65]}>
      {/* Spotlight and rim lights */}
      <spotLight position={[-2, 6, 2]} angle={0.5} intensity={3.5} color="#D6A85F" castShadow />
      <pointLight position={[0, -1, 0]} intensity={1.5} color="#4B2418" distance={4} />

      {/* Granite Grinder Base */}
      <mesh position={[0, -1.8, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.6, 1.8, 0.4, 32]} />
        <meshPhysicalMaterial color="#1C0D0A" roughness={0.7} metalness={0.7} />
      </mesh>

      {/* Center Pin Axis */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 2.6, 16]} />
        <meshPhysicalMaterial color="#D6A85F" roughness={0.12} metalness={1.0} clearcoat={1.0} />
      </mesh>

      {/* Grinding Wheel Left */}
      <mesh ref={wheelLeftRef} position={[-0.7, -0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.65, 0.65, 0.4, 32]} />
        <meshPhysicalMaterial color="#4A4A4A" roughness={0.85} metalness={0.0} />
      </mesh>

      {/* Grinding Wheel Right */}
      <mesh ref={wheelRightRef} position={[0.7, -0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.65, 0.65, 0.4, 32]} />
        <meshPhysicalMaterial color="#4A4A4A" roughness={0.85} metalness={0.0} />
      </mesh>

      {/* Scraping Arm structure */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[1.8, 0.12, 0.2]} />
        <meshPhysicalMaterial color="#D6A85F" roughness={0.15} metalness={1.0} clearcoat={1.0} />
      </mesh>

      {/* Viscous chocolate flowing stream oozing from center bottom */}
      <mesh ref={liquidRef} position={[0, -1.2, 0.8]} castShadow>
        <cylinderGeometry args={[0.2, 0.35, 1.4, 16]} />
        <meshPhysicalMaterial
          color="#3D1C12" // Melted chocolate color
          roughness={0.12}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
        />
      </mesh>
    </group>
  );
};

export default GrindingScene;
