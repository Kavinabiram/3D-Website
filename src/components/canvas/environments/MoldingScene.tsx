import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneProps {
  visible: boolean;
}

export const MoldingScene: React.FC<SceneProps> = ({ visible }) => {
  const streamRef = useRef<THREE.Mesh>(null);
  const moldsGroupRef = useRef<THREE.Group>(null);

  // Layout a 3x3 grid of chocolate mold cavities
  const rows = 3;
  const cols = 3;
  const cellSize = 0.5;
  const gap = 0.15;
  const startX = -((cols - 1) * (cellSize + gap)) / 2;
  const startZ = -((rows - 1) * (cellSize + gap)) / 2;

  const moldPositions = useMemo(() => {
    const list = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        list.push({
          x: startX + c * (cellSize + gap),
          z: startZ + r * (cellSize + gap),
          id: r * cols + c,
        });
      }
    }
    return list;
  }, []);

  useFrame((state) => {
    if (!visible) return;
    const elapsed = state.clock.getElapsedTime();

    // 1. Shake/Wiggle the pouring nozzle slightly
    if (streamRef.current) {
      streamRef.current.position.x = Math.sin(elapsed * 2.5) * 0.2;
      streamRef.current.position.z = Math.cos(elapsed * 1.5) * 0.15;
    }

    // 2. Animate filling process
    // Cavities will scale up or change height one by one to simulate filling
    if (moldsGroupRef.current) {
      moldsGroupRef.current.children.forEach((child, idx) => {
        // Let's create a delayed filling factor based on time
        const fillDelay = idx * 0.8;
        const fillTime = (elapsed % 8.0) - fillDelay;
        const fillPercent = THREE.MathUtils.clamp(fillTime / 0.6, 0.001, 1.0); // Smooth fill scale

        // Only scale Y (height of chocolate inside)
        const chocolateMesh = child.children[1];
        if (chocolateMesh) {
          chocolateMesh.scale.y = fillPercent;
          chocolateMesh.position.y = -0.1 + (fillPercent * 0.08);
        }
      });
    }
  });

  if (!visible) return null;

  return (
    <group position={[10, -12, -95]}>
      {/* Factory spot lights */}
      <spotLight position={[0, 6, 2]} angle={0.5} intensity={3} color="#F7B955" castShadow />
      <pointLight position={[0, 0, -2]} intensity={1.5} color="#D6A85F" distance={6} />

      {/* Dispenser Nozzle Arm */}
      <group position={[0, 2.5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.2, 1.0, 16]} />
          <meshPhysicalMaterial color="#D6A85F" roughness={0.12} metalness={1.0} clearcoat={1.0} />
        </mesh>
        {/* Support bar */}
        <mesh position={[0, 0.4, -2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 4, 16]} />
          <meshPhysicalMaterial color="#D6A85F" roughness={0.15} metalness={1.0} clearcoat={1.0} />
        </mesh>
      </group>
 
      {/* Pouring Chocolate Stream */}
      <mesh ref={streamRef} position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.12, 1.8, 16]} />
        <meshPhysicalMaterial
          color="#3D1C12"
          roughness={0.15}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </mesh>
 
      {/* Conveyor Belt Tray */}
      <mesh position={[0, -0.6, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.5, 0.12, 2.5]} />
        <meshPhysicalMaterial color="#110906" roughness={0.85} metalness={0.05} />
      </mesh>
      {/* Belt guides */}
      <mesh position={[-1.25, -0.4, 0]} castShadow>
        <boxGeometry args={[0.05, 0.4, 2.5]} />
        <meshPhysicalMaterial color="#D6A85F" roughness={0.15} metalness={1.0} clearcoat={1.0} />
      </mesh>
      <mesh position={[1.25, -0.4, 0]} castShadow>
        <boxGeometry args={[0.05, 0.4, 2.5]} />
        <meshPhysicalMaterial color="#D6A85F" roughness={0.15} metalness={1.0} clearcoat={1.0} />
      </mesh>

      {/* Grid of Molds */}
      <group ref={moldsGroupRef} position={[0, -0.5, 0]}>
        {moldPositions.map((pos) => (
          <group key={pos.id} position={[pos.x, 0, pos.z]}>
            {/* 1. Cavity Border (Tray frame) */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[cellSize + 0.08, 0.16, cellSize + 0.08]} />
              <meshPhysicalMaterial
                color="#23130E"
                roughness={0.3}
                metalness={0.2}
                clearcoat={0.5}
              />
            </mesh>

            {/* 2. Liquid Chocolate Filling Cavity */}
            <mesh position={[0, -0.06, 0]} scale={[1, 0.001, 1]} castShadow>
              <boxGeometry args={[cellSize - 0.02, 0.16, cellSize - 0.02]} />
              <meshPhysicalMaterial
                color="#3D1C12"
                roughness={0.12}
                clearcoat={1.0}
                clearcoatRoughness={0.05}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

export default MoldingScene;
