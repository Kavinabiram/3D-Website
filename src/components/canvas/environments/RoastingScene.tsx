import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneProps {
  visible: boolean;
}

export const RoastingScene: React.FC<SceneProps> = ({ visible }) => {
  const drumRef = useRef<THREE.Mesh>(null);
  const smokeRef = useRef<THREE.Points>(null);
  const sparksRef = useRef<THREE.Points>(null);
  const fireLightRef = useRef<THREE.PointLight>(null);

  // Generate smoke particles
  const smokeCount = 30;
  const { smokePositions, smokeVelocities } = useMemo(() => {
    const pos = new Float32Array(smokeCount * 3);
    const vel = new Float32Array(smokeCount * 3);
    for (let i = 0; i < smokeCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.2;
      pos[i * 3 + 1] = 0 + Math.random() * 2.0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.2;

      vel[i * 3] = (Math.random() - 0.5) * 0.04;
      vel[i * 3 + 1] = Math.random() * 0.06 + 0.03; // Smoke drifting up
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
    }
    return { smokePositions: pos, smokeVelocities: vel };
  }, []);

  // Generate sparks particles
  const sparkCount = 25;
  const { sparkPositions, sparkVelocities } = useMemo(() => {
    const pos = new Float32Array(sparkCount * 3);
    const vel = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.6;
      pos[i * 3 + 1] = -0.6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.2;

      vel[i * 3] = (Math.random() - 0.5) * 0.2;
      vel[i * 3 + 1] = Math.random() * 0.3 + 0.15; // Sparks shooting up fast
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    return { sparkPositions: pos, sparkVelocities: vel };
  }, []);

  useFrame((state) => {
    if (!visible) return;
    const elapsed = state.clock.getElapsedTime();

    // 1. Drum Rotation
    if (drumRef.current) {
      drumRef.current.rotation.z = -elapsed * 1.0; // Rotate on its axis
    }

    // 2. Fire Light Flicker
    if (fireLightRef.current) {
      fireLightRef.current.intensity = 3.0 + Math.sin(elapsed * 15.0) * 0.8;
    }

    // 3. Smoke simulation
    if (smokeRef.current) {
      const geo = smokeRef.current.geometry;
      const posArr = geo.attributes.position.array as Float32Array;

      for (let i = 0; i < smokeCount; i++) {
        posArr[i * 3] += smokeVelocities[i * 3] * 0.5;
        posArr[i * 3 + 1] += smokeVelocities[i * 3 + 1] * 0.5;
        posArr[i * 3 + 2] += smokeVelocities[i * 3 + 2] * 0.5;

        // Reset smoke
        if (posArr[i * 3 + 1] > 3) {
          posArr[i * 3] = (Math.random() - 0.5) * 1.2;
          posArr[i * 3 + 1] = 0;
          posArr[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }

    // 4. Sparks simulation
    if (sparksRef.current) {
      const geo = sparksRef.current.geometry;
      const posArr = geo.attributes.position.array as Float32Array;

      for (let i = 0; i < sparkCount; i++) {
        posArr[i * 3] += sparkVelocities[i * 3] * 0.4;
        posArr[i * 3 + 1] += sparkVelocities[i * 3 + 1] * 0.4;
        posArr[i * 3 + 2] += sparkVelocities[i * 3 + 2] * 0.4;

        // Apply gravity to sparks
        sparkVelocities[i * 3 + 1] -= 0.01;

        // Reset spark
        if (posArr[i * 3 + 1] < -0.8 || posArr[i * 3 + 1] > 2.5) {
          posArr[i * 3] = (Math.random() - 0.5) * 1.6;
          posArr[i * 3 + 1] = -0.6;
          posArr[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
          sparkVelocities[i * 3 + 1] = Math.random() * 0.3 + 0.15;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }
  });

  if (!visible) return null;

  return (
    <group position={[5, 8, -50]}>
      {/* Intense fire lights */}
      <pointLight
        ref={fireLightRef}
        position={[0, -1.2, 0]}
        intensity={3.5}
        color="#F7B955"
        distance={6}
        castShadow
      />
      <spotLight position={[0, 6, 2]} angle={0.6} intensity={2} color="#D6A85F" castShadow />

      {/* Rotating Roasting Drum */}
      <mesh ref={drumRef} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 2.4, 32]} />
        <meshPhysicalMaterial
          color="#B97A3D" // Copper
          roughness={0.12}
          metalness={1.0}
          clearcoat={1.0}
          clearcoatRoughness={0.03}
        />
      </mesh>

      {/* Drum band details */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[1.22, 1.22, 0.1, 32]} />
        <meshPhysicalMaterial color="#4B2418" metalness={1.0} roughness={0.15} clearcoat={1.0} />
      </mesh>

      {/* Roaster Supports */}
      <mesh position={[-1.3, -1.0, 0]} castShadow>
        <boxGeometry args={[0.2, 2.0, 0.4]} />
        <meshPhysicalMaterial color="#2D140F" metalness={0.9} roughness={0.2} clearcoat={0.5} />
      </mesh>
      <mesh position={[1.3, -1.0, 0]} castShadow>
        <boxGeometry args={[0.2, 2.0, 0.4]} />
        <meshPhysicalMaterial color="#2D140F" metalness={0.9} roughness={0.2} clearcoat={0.5} />
      </mesh>

      {/* Coals/Glow Bed underneath */}
      <mesh position={[0, -1.6, 0]} receiveShadow>
        <boxGeometry args={[2.0, 0.3, 1.6]} />
        <meshStandardMaterial color="#2D140F" roughness={0.9} />
      </mesh>

      {/* Rising Smoke points */}
      <points ref={smokeRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[smokePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#4B2418"
          size={0.18}
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Shooting Sparks points */}
      <points ref={sparksRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[sparkPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#F7B955"
          size={0.06}
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default RoastingScene;
