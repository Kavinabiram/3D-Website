import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneProps {
  visible: boolean;
}

export const FermentationScene: React.FC<SceneProps> = ({ visible }) => {
  const beansRef = useRef<THREE.InstancedMesh>(null);
  const steamRef = useRef<THREE.Points>(null);

  // Generate steam particles
  const steamCount = 35;
  const { steamPositions, steamVelocities } = useMemo(() => {
    const pos = new Float32Array(steamCount * 3);
    const vel = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.5;
      pos[i * 3 + 1] = -0.5 + Math.random() * 2.0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.0;

      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = Math.random() * 0.08 + 0.04; // Steam rising
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return { steamPositions: pos, steamVelocities: vel };
  }, []);

  // Generate static bean layout inside the box
  const beanCount = 80;
  const beansData = useMemo(() => {
    const list = [];
    for (let i = 0; i < beanCount; i++) {
      // Keep beans layered inside the box (-0.8 to +0.8 in X, -0.6 to +0.2 in Y, -0.5 to +0.5 in Z)
      const x = (Math.random() - 0.5) * 1.6;
      const y = -0.8 + Math.random() * 0.7;
      const z = (Math.random() - 0.5) * 1.0;
      const scaleX = 0.06 + Math.random() * 0.04;
      const scaleY = 0.08 + Math.random() * 0.04;
      const scaleZ = 0.06 + Math.random() * 0.03;
      list.push({ x, y, z, scaleX, scaleY, scaleZ });
    }
    return list;
  }, []);

  const tempObj = useMemo(() => new THREE.Object3D(), []);

  // Define bean color gradient transition over time
  const paleColor = useMemo(() => new THREE.Color('#EAD3B3'), []); // Pale cream-pink
  const brownColor = useMemo(() => new THREE.Color('#4B2418'), []); // Rich cocoa brown

  useFrame((state) => {
    if (!visible) return;
    const elapsed = state.clock.getElapsedTime();

    // 1. Heat-induced Color Transition
    // Animate color from pale to dark brown based on a slow wave
    const colorFactor = (Math.sin(elapsed * 0.3) + 1.0) / 2.0; // Oscillates 0.0 to 1.0
    const currentColor = paleColor.clone().lerp(brownColor, colorFactor);

    if (beansRef.current) {
      beansData.forEach((b, idx) => {
        tempObj.position.set(b.x, b.y, b.z);
        tempObj.scale.set(b.scaleX, b.scaleY, b.scaleZ);
        tempObj.rotation.set(idx * 0.1, idx * 0.2, idx * 0.3);
        tempObj.updateMatrix();
        beansRef.current!.setMatrixAt(idx, tempObj.matrix);
        beansRef.current!.setColorAt(idx, currentColor);
      });
      beansRef.current.instanceMatrix.needsUpdate = true;
      if (beansRef.current.instanceColor) {
        beansRef.current.instanceColor.needsUpdate = true;
      }
    }

    // 2. Rising Steam Animation
    if (steamRef.current) {
      const geo = steamRef.current.geometry;
      const posArr = geo.attributes.position.array as Float32Array;

      for (let i = 0; i < steamCount; i++) {
        posArr[i * 3] += steamVelocities[i * 3] * 0.5;
        posArr[i * 3 + 1] += steamVelocities[i * 3 + 1] * 0.5;
        posArr[i * 3 + 2] += steamVelocities[i * 3 + 2] * 0.5;

        // Reset steam particle at box level
        if (posArr[i * 3 + 1] > 2.5) {
          posArr[i * 3] = (Math.random() - 0.5) * 1.5;
          posArr[i * 3 + 1] = -0.5;
          posArr[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }
  });

  if (!visible) return null;

  return (
    <group position={[15, -12, -20]}>
      {/* Fermentation Box Lighting */}
      <spotLight position={[0, 6, 1]} angle={0.5} intensity={3.5} color="#D6A85F" castShadow />
      <pointLight position={[0, -0.2, 0]} intensity={1.5} color="#F7B955" distance={5} />

      {/* Fermentation Wooden Crate */}
      <mesh position={[0, -0.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.0, 1.2, 1.4]} />
        <meshPhysicalMaterial
          color="#5C4033" // Aged timber wood brown
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* Wooden crate details (slats) */}
      <mesh position={[0, -0.5, 0.71]} castShadow>
        <boxGeometry args={[1.9, 0.05, 0.02]} />
        <meshPhysicalMaterial color="#3D251D" roughness={0.95} />
      </mesh>
      <mesh position={[0, -0.2, 0.71]} castShadow>
        <boxGeometry args={[1.9, 0.05, 0.02]} />
        <meshPhysicalMaterial color="#3D251D" roughness={0.95} />
      </mesh>
      <mesh position={[0, -0.8, 0.71]} castShadow>
        <boxGeometry args={[1.9, 0.05, 0.02]} />
        <meshPhysicalMaterial color="#3D251D" roughness={0.95} />
      </mesh>

      {/* Fermenting Cocoa Beans */}
      <instancedMesh ref={beansRef} args={[null as any, null as any, beanCount]} castShadow>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial roughness={0.6} />
      </instancedMesh>

      {/* Heat Steam / Gas Vapor */}
      <points ref={steamRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[steamPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#EAD3B3"
          size={0.12}
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default FermentationScene;
