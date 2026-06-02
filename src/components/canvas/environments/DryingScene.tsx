import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneProps {
  visible: boolean;
}

export const DryingScene: React.FC<SceneProps> = ({ visible }) => {
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const dustRef = useRef<THREE.Points>(null);
  const beansRef = useRef<THREE.InstancedMesh>(null);

  // Generate wind dust particles
  const dustCount = 40;
  const { dustPositions, dustVelocities } = useMemo(() => {
    const pos = new Float32Array(dustCount * 3);
    const vel = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5.0;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2.0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4.0;

      vel[i * 3] = -(Math.random() * 0.15 + 0.15); // Wind blowing left
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }
    return { dustPositions: pos, dustVelocities: vel };
  }, []);

  // Generate spread beans on trays
  const beanCount = 90;
  const beansData = useMemo(() => {
    const list = [];
    for (let i = 0; i < beanCount; i++) {
      // Divide into two trays: Tray Left (x: -1.4 to -0.2), Tray Right (x: 0.2 to 1.4)
      const isLeft = Math.random() > 0.5;
      const x = isLeft
        ? -1.2 + (Math.random() * 1.0)
        : 0.2 + (Math.random() * 1.0);
      const y = -0.58;
      const z = -1.2 + (Math.random() * 2.4);

      const scaleX = 0.05 + Math.random() * 0.03;
      const scaleY = 0.04 + Math.random() * 0.02;
      const scaleZ = 0.07 + Math.random() * 0.04;
      list.push({ x, y, z, scaleX, scaleY, scaleZ });
    }
    return list;
  }, []);

  const tempObj = useMemo(() => new THREE.Object3D(), []);
  const beanColor = useMemo(() => new THREE.Color('#4B2418'), []); // Sun-dried roasted-brown beans

  useFrame((state) => {
    if (!visible) return;
    const elapsed = state.clock.getElapsedTime();

    // 1. Time-lapse Sun Sweep Animation
    // Animate directional light angle to sweep across the scene like a time-lapse sun
    const sunAngle = elapsed * 0.4;
    if (sunLightRef.current) {
      sunLightRef.current.position.set(
        Math.cos(sunAngle) * 8.0,
        6.0,
        Math.sin(sunAngle) * 5.0
      );
    }

    // 2. Lay out beans inside the instanced mesh
    if (beansRef.current) {
      beansData.forEach((b, idx) => {
        tempObj.position.set(b.x, b.y, b.z);
        tempObj.scale.set(b.scaleX, b.scaleY, b.scaleZ);
        tempObj.rotation.set(0.1, idx * 0.4, Math.PI / 2); // Beans laid flat
        tempObj.updateMatrix();
        beansRef.current!.setMatrixAt(idx, tempObj.matrix);
        beansRef.current!.setColorAt(idx, beanColor);
      });
      beansRef.current.instanceMatrix.needsUpdate = true;
      if (beansRef.current.instanceColor) {
        beansRef.current.instanceColor.needsUpdate = true;
      }
    }

    // 3. Wind blown dust particles
    if (dustRef.current) {
      const geo = dustRef.current.geometry;
      const posArr = geo.attributes.position.array as Float32Array;

      for (let i = 0; i < dustCount; i++) {
        posArr[i * 3] += dustVelocities[i * 3] * 0.5;
        posArr[i * 3 + 1] += dustVelocities[i * 3 + 1] * 0.5;
        posArr[i * 3 + 2] += dustVelocities[i * 3 + 2] * 0.5;

        // Reset dust particles at right side
        if (posArr[i * 3] < -2.5) {
          posArr[i * 3] = 2.5;
          posArr[i * 3 + 1] = (Math.random() - 0.5) * 2.0;
          posArr[i * 3 + 2] = (Math.random() - 0.5) * 4.0;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }
  });

  if (!visible) return null;

  return (
    <group position={[20, 2, -35]}>
      {/* Time-lapse Sweep Sun Directional Light */}
      <directionalLight
        ref={sunLightRef}
        position={[8, 6, 0]}
        intensity={2.5}
        color="#FDFBF7"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <ambientLight intensity={0.15} color="#EAD3B3" />

      {/* Sun Drying Platforms / Racks */}
      <group position={[0, -0.6, 0]}>
        {/* Left Tray */}
        <mesh position={[-0.7, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.1, 0.08, 2.6]} />
          <meshStandardMaterial color="#2D140F" roughness={0.9} />
        </mesh>
        
        {/* Right Tray */}
        <mesh position={[0.7, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.1, 0.08, 2.6]} />
          <meshStandardMaterial color="#2D140F" roughness={0.9} />
        </mesh>

        {/* Supporting wooden frames */}
        <mesh position={[-0.7, -0.6, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.08, 1.2, 0.08]} />
          <meshStandardMaterial color="#1C0D0A" roughness={0.95} />
        </mesh>
        <mesh position={[0.7, -0.6, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.08, 1.2, 0.08]} />
          <meshStandardMaterial color="#1C0D0A" roughness={0.95} />
        </mesh>
      </group>

      {/* Beans instanced mesh */}
      <instancedMesh ref={beansRef} args={[null as any, null as any, beanCount]} castShadow>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial roughness={0.65} />
      </instancedMesh>

      {/* Wind dust particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#D6A85F"
          size={0.05}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </points>
    </group>
  );
};

export default DryingScene;
