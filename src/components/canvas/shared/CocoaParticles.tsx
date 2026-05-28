import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CocoaParticles: React.FC<{ count?: number }> = ({ count = 120 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Generate initial particle coordinates and speed variables
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 15;

      const speedX = (Math.random() - 0.5) * 0.05;
      const speedY = (Math.random() + 0.1) * 0.15; // Drift upwards
      const speedZ = (Math.random() - 0.5) * 0.05;

      const scale = 0.04 + Math.random() * 0.08;
      const isGold = Math.random() > 0.6; // 40% gold flakes, 60% cocoa dust

      data.push({ x, y, z, speedX, speedY, speedZ, scale, isGold });
    }
    return data;
  }, [count]);

  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const goldColor = useMemo(() => new THREE.Color('#D6A85F'), []);
  const cocoaColor = useMemo(() => new THREE.Color('#4B2418'), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    particles.forEach((p, idx) => {
      // Apply drift dynamics
      p.y += p.speedY * 0.05;
      p.x += Math.sin(time + p.y) * 0.003;
      p.z += Math.cos(time + p.x) * 0.003;

      // Wrap particles back when they drift out of bounds
      if (p.y > 7.5) p.y = -7.5;
      if (p.x > 7.5) p.x = -7.5;
      if (p.x < -7.5) p.x = 7.5;

      tempObject.position.set(p.x, p.y, p.z);
      tempObject.scale.setScalar(p.scale);

      // Add subtle rotations
      tempObject.rotation.y = time * 0.1 + idx;
      tempObject.rotation.x = time * 0.05;

      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(idx, tempObject.matrix);
      meshRef.current!.setColorAt(idx, p.isGold ? goldColor : cocoaColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]} castShadow>
      {/* Dynamic low-poly shapes */}
      <dodecahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial roughness={0.4} metalness={0.8} />
    </instancedMesh>
  );
};

export default CocoaParticles;
