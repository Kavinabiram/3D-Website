import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface InstancedToppingsProps {
  toppings: string[];
}

const dummy = new THREE.Object3D();

export const InstancedToppings: React.FC<InstancedToppingsProps> = ({ toppings }) => {
  const hazelnutRef = useRef<THREE.InstancedMesh>(null);
  const raspberryRef = useRef<THREE.InstancedMesh>(null);
  const saltRef = useRef<THREE.InstancedMesh>(null);
  const goldRef = useRef<THREE.InstancedMesh>(null);

  const hazelnutCount = toppings.includes('hazelnut') ? 40 : 0;
  const raspberryCount = toppings.includes('raspberry') ? 40 : 0;
  const saltCount = toppings.includes('sea_salt') ? 60 : 0;
  const goldCount = toppings.includes('gold_dust') ? 80 : 0;

  // Generate deterministic paths
  const generateData = (count: number, radRange: [number, number], yRange: [number, number], scaleRange: [number, number], speedRange: [number, number]) => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        radius: radRange[0] + Math.random() * (radRange[1] - radRange[0]),
        yOffset: yRange[0] + Math.random() * (yRange[1] - yRange[0]),
        scale: scaleRange[0] + Math.random() * (scaleRange[1] - scaleRange[0]),
        speed: speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]),
        phase: Math.random() * Math.PI * 2,
      });
    }
    return data;
  };

  const hazelnutData = useMemo(() => generateData(hazelnutCount, [1.4, 2.0], [-1.0, 1.0], [0.08, 0.15], [0.2, 0.6]), [hazelnutCount]);
  const raspberryData = useMemo(() => generateData(raspberryCount, [1.2, 1.8], [-1.2, 1.2], [0.06, 0.12], [0.3, 0.7]), [raspberryCount]);
  const saltData = useMemo(() => generateData(saltCount, [1.8, 2.5], [-1.5, 1.5], [0.04, 0.08], [0.1, 0.4]), [saltCount]);
  const goldData = useMemo(() => generateData(goldCount, [1.5, 2.8], [-1.8, 1.8], [0.02, 0.06], [0.5, 1.0]), [goldCount]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    const updateInstancedMesh = (mesh: THREE.InstancedMesh | null, data: any[]) => {
      if (!mesh) return;
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const angle = item.phase + elapsed * item.speed;
        dummy.position.set(
          Math.cos(angle) * item.radius,
          item.yOffset + Math.sin(elapsed + i) * 0.1,
          Math.sin(angle) * item.radius
        );
        dummy.rotation.set(elapsed * 0.4 + i, elapsed * 0.2, 0);
        dummy.scale.setScalar(item.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    };

    updateInstancedMesh(hazelnutRef.current, hazelnutData);
    updateInstancedMesh(raspberryRef.current, raspberryData);
    updateInstancedMesh(saltRef.current, saltData);
    updateInstancedMesh(goldRef.current, goldData);
  });

  return (
    <group>
      {hazelnutCount > 0 && (
        <instancedMesh ref={hazelnutRef} args={[null, null, hazelnutCount]} castShadow>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#8B5A2B" roughness={0.7} />
        </instancedMesh>
      )}
      {raspberryCount > 0 && (
        <instancedMesh ref={raspberryRef} args={[null, null, raspberryCount]} castShadow>
          <cylinderGeometry args={[0.8, 1, 1, 8]} />
          <meshStandardMaterial color="#D02090" roughness={0.6} />
        </instancedMesh>
      )}
      {saltCount > 0 && (
        <instancedMesh ref={saltRef} args={[null, null, saltCount]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshPhysicalMaterial color="#FFFFFF" roughness={0.1} transmission={0.9} thickness={0.5} />
        </instancedMesh>
      )}
      {goldCount > 0 && (
        <instancedMesh ref={goldRef} args={[null, null, goldCount]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#D6A85F" metalness={0.95} roughness={0.05} />
        </instancedMesh>
      )}
    </group>
  );
};

export default InstancedToppings;
