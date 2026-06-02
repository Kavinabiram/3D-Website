import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CocoaParticles from '../shared/CocoaParticles';
import { createCocoaPodGeometry } from '../shared/geometryHelpers';

interface SceneProps {
  visible: boolean;
}

export const FarmScene: React.FC<SceneProps> = ({ visible }) => {
  const leavesRef1 = useRef<THREE.Group>(null);
  const leavesRef2 = useRef<THREE.Group>(null);
  const leavesRef3 = useRef<THREE.Group>(null);

  // Generate realistic cocoa pod geometry once
  const podGeom = useMemo(() => createCocoaPodGeometry(), []);

  useFrame((state) => {
    if (!visible) return;
    const elapsed = state.clock.getElapsedTime();
    
    // Wind leaf sway animation
    const sway = Math.sin(elapsed * 0.8) * 0.05;
    if (leavesRef1.current) leavesRef1.current.rotation.z = sway;
    if (leavesRef2.current) leavesRef2.current.rotation.x = sway * 0.8;
    if (leavesRef3.current) leavesRef3.current.rotation.z = sway * -0.7;
  });

  if (!visible) return null;

  return (
    <group position={[0, 0, 0]}>
      {/* Volumetric ambient warm lights */}
      <spotLight
        position={[4, 8, 4]}
        angle={0.6}
        intensity={3.0}
        color="#F7B955"
        castShadow
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-4, 5, -2]} intensity={0.5} color="#D6A85F" />

      {/* Forest Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#1C0D0A" roughness={0.9} />
      </mesh>

      {/* Tree 1: Left Foreground */}
      <group position={[-2.5, -3, 1]}>
        {/* Trunk */}
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.25, 4, 8]} />
          <meshStandardMaterial color="#23130E" roughness={0.95} />
        </mesh>
        {/* Leaves */}
        <group ref={leavesRef1} position={[0, 4, 0]}>
          <mesh castShadow position={[0, 0, 0]}>
            <dodecahedronGeometry args={[1.2, 1]} />
            <meshStandardMaterial color="#4B2418" roughness={0.85} />
          </mesh>
          <mesh castShadow position={[0.4, 0.6, -0.3]} scale={0.8}>
            <dodecahedronGeometry args={[1.2, 1]} />
            <meshStandardMaterial color="#B97A3D" roughness={0.85} />
          </mesh>
        </group>
        {/* Hanging Cocoa Pods */}
        <mesh position={[0.2, 1.8, 0.1]} rotation={[0.4, 0.2, -0.3]} scale={0.16} castShadow>
          <primitive object={podGeom} />
          <meshStandardMaterial color="#B97A3D" roughness={0.7} />
        </mesh>
        <mesh position={[-0.15, 2.3, -0.2]} rotation={[-0.2, -0.4, 0.5]} scale={0.14} castShadow>
          <primitive object={podGeom} />
          <meshStandardMaterial color="#F7B955" roughness={0.7} />
        </mesh>
      </group>

      {/* Tree 2: Right Middleground */}
      <group position={[2.8, -3, -2]}>
        {/* Trunk */}
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.28, 5, 8]} />
          <meshStandardMaterial color="#1C0D0A" roughness={0.95} />
        </mesh>
        {/* Leaves */}
        <group ref={leavesRef2} position={[0, 5, 0]}>
          <mesh castShadow>
            <dodecahedronGeometry args={[1.4, 1]} />
            <meshStandardMaterial color="#3D1C12" roughness={0.85} />
          </mesh>
          <mesh castShadow position={[-0.5, 0.5, 0.4]} scale={0.85}>
            <dodecahedronGeometry args={[1.2, 1]} />
            <meshStandardMaterial color="#4B2418" roughness={0.85} />
          </mesh>
        </group>
        {/* Hanging Cocoa Pods */}
        <mesh position={[-0.2, 2.5, 0.15]} rotation={[0.3, 0.5, -0.2]} scale={0.17} castShadow>
          <primitive object={podGeom} />
          <meshStandardMaterial color="#B97A3D" roughness={0.7} />
        </mesh>
      </group>

      {/* Tree 3: Center Background */}
      <group position={[0.5, -3, -5]}>
        {/* Trunk */}
        <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.12, 0.22, 4.4, 8]} />
          <meshStandardMaterial color="#23130E" roughness={0.95} />
        </mesh>
        {/* Leaves */}
        <group ref={leavesRef3} position={[0, 4.4, 0]}>
          <mesh castShadow>
            <dodecahedronGeometry args={[1.1, 1]} />
            <meshStandardMaterial color="#4B2418" roughness={0.85} />
          </mesh>
        </group>
        {/* Hanging Cocoa Pod */}
        <mesh position={[0.18, 2.0, -0.1]} rotation={[0.1, -0.2, 0.3]} scale={0.15} castShadow>
          <primitive object={podGeom} />
          <meshStandardMaterial color="#F7B955" roughness={0.7} />
        </mesh>
      </group>

      {/* Swirling forest particles representing pollen/dust */}
      <CocoaParticles count={60} />
    </group>
  );
};

export default FarmScene;
