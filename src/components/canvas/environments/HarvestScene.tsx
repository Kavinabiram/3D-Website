import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createCocoaPodGeometry } from '../shared/geometryHelpers';

interface SceneProps {
  visible: boolean;
}

export const HarvestScene: React.FC<SceneProps> = ({ visible }) => {
  const leftHalfRef = useRef<THREE.Mesh>(null);
  const rightHalfRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Generate realistic cocoa pod geometry
  const podGeom = useMemo(() => createCocoaPodGeometry(), []);

  // Generate dripping particles
  const particleCount = 40;
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Start in the center of the pod
      pos[i * 3] = (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

      vel[i * 3] = (Math.random() - 0.5) * 0.05;
      vel[i * 3 + 1] = -(Math.random() * 0.15 + 0.1); // Gravity drop
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame((state) => {
    if (!visible) return;
    const elapsed = state.clock.getElapsedTime();

    // Oscillating split animation
    const splitAmount = 0.5 + Math.sin(elapsed * 1.2) * 0.25; // Opens and closes organically
    if (leftHalfRef.current) {
      leftHalfRef.current.position.x = -splitAmount;
      leftHalfRef.current.rotation.z = splitAmount * 0.4;
    }
    if (rightHalfRef.current) {
      rightHalfRef.current.position.x = splitAmount;
      rightHalfRef.current.rotation.z = -splitAmount * 0.4;
    }

    // Dripping juice particle simulation
    if (particlesRef.current) {
      const geo = particlesRef.current.geometry;
      const posArr = geo.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        // Apply velocity
        posArr[i * 3] += velocities[i * 3] * 0.1;
        posArr[i * 3 + 1] += velocities[i * 3 + 1] * 0.1;
        posArr[i * 3 + 2] += velocities[i * 3 + 2] * 0.1;

        // Reset if too low
        if (posArr[i * 3 + 1] < -4) {
          posArr[i * 3] = (Math.random() - 0.5) * 0.4;
          posArr[i * 3 + 1] = 0;
          posArr[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }
  });

  // Seeds inside: create an array of bean offsets
  const seedOffsets = useMemo(() => {
    const offsets = [];
    for (let i = 0; i < 24; i++) {
      offsets.push({
        pos: [
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 1.2,
          (Math.random() - 0.5) * 0.3,
        ] as [number, number, number],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
        scale: 0.08 + Math.random() * 0.04,
      });
    }
    return offsets;
  }, []);

  if (!visible) return null;

  return (
    <group position={[0, -10, -10]}>
      {/* Studio Close-Up Lighting */}
      <spotLight position={[0, 5, 2]} angle={0.4} intensity={4} color="#F5E8D3" castShadow />
      <directionalLight position={[-2, 3, -1]} intensity={0.5} color="#D6A85F" />

      {/* Pod Holder Branch */}
      <mesh position={[0, 1.8, 0]} rotation={[0, 0, Math.PI / 2.2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 3, 12]} />
        <meshStandardMaterial color="#2D140F" roughness={0.9} />
      </mesh>

      {/* Ripe Cocoa Pod Split halves */}
      <group position={[0, 0, 0]}>
        {/* Left Pod Half - Scaled to represent a cut shell */}
        <mesh ref={leftHalfRef} position={[-0.4, 0, 0]} scale={[0.38, 0.75, 0.75]} castShadow receiveShadow>
          <primitive object={podGeom} />
          <meshStandardMaterial color="#B97A3D" roughness={0.7} />
        </mesh>

        {/* Right Pod Half - Scaled to represent a cut shell */}
        <mesh ref={rightHalfRef} position={[0.4, 0, 0]} scale={[0.38, 0.75, 0.75]} castShadow receiveShadow>
          <primitive object={podGeom} />
          <meshStandardMaterial color="#B97A3D" roughness={0.7} />
        </mesh>

        {/* Core seeds revealed in center */}
        <group position={[0, 0, 0]}>
          {seedOffsets.map((seed, index) => (
            <mesh
              key={index}
              position={seed.pos}
              rotation={seed.rot}
              scale={seed.scale}
              castShadow
            >
              {/* Cocoa seed shape */}
              <sphereGeometry args={[1, 16, 12]} />
              <meshPhysicalMaterial
                color="#FDFBF7"
                roughness={0.15}
                clearcoat={1.0}
                clearcoatRoughness={0.1}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* Dripping juice/pulp particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#FFF"
          size={0.06}
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>
    </group>
  );
};

export default HarvestScene;
