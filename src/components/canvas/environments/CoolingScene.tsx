import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneProps {
  visible: boolean;
}

export const CoolingScene: React.FC<SceneProps> = ({ visible }) => {
  const mistRef = useRef<THREE.Points>(null);
  const barsGroupRef = useRef<THREE.Group>(null);

  // Generate frost mist particles
  const mistCount = 40;
  const { mistPositions, mistVelocities } = useMemo(() => {
    const pos = new Float32Array(mistCount * 3);
    const vel = new Float32Array(mistCount * 3);
    for (let i = 0; i < mistCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2.2;
      pos[i * 3 + 1] = 0.5 + Math.random() * 1.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2.2;

      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = -(Math.random() * 0.05 + 0.02); // Falling cold mist
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return { mistPositions: pos, mistVelocities: vel };
  }, []);

  useFrame((state) => {
    if (!visible) return;
    const elapsed = state.clock.getElapsedTime();

    // 1. Hardening Color & Gloss transition
    // Shrink and make material satin matte based on osc
    if (barsGroupRef.current) {
      const coolingPhase = (Math.sin(elapsed * 0.8) + 1.0) / 2.0; // 0 (warm/glossy) to 1 (hard/satin)
      
      barsGroupRef.current.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshPhysicalMaterial;
        if (mat) {
          // Increase roughness from 0.1 (wet) to 0.45 (hardened chocolate)
          mat.roughness = THREE.MathUtils.lerp(0.12, 0.42, coolingPhase);
          mat.clearcoat = THREE.MathUtils.lerp(1.0, 0.2, coolingPhase);
          
          // Tint color slightly cool as it hardens
          const warmChoco = new THREE.Color('#3D1C12');
          const coldChoco = new THREE.Color('#2C1813');
          mat.color.copy(warmChoco).lerp(coldChoco, coolingPhase);
        }
      });
    }

    // 2. Cold Mist particles
    if (mistRef.current) {
      const geo = mistRef.current.geometry;
      const posArr = geo.attributes.position.array as Float32Array;

      for (let i = 0; i < mistCount; i++) {
        posArr[i * 3] += mistVelocities[i * 3] * 0.5;
        posArr[i * 3 + 1] += mistVelocities[i * 3 + 1] * 0.5;
        posArr[i * 3 + 2] += mistVelocities[i * 3 + 2] * 0.5;

        // Reset mist particle
        if (posArr[i * 3 + 1] < -0.4) {
          posArr[i * 3] = (Math.random() - 0.5) * 2.2;
          posArr[i * 3 + 1] = 2.0;
          posArr[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }
  });

  if (!visible) return null;

  return (
    <group position={[20, -5, -110]}>
      {/* Cold blue/white lighting */}
      <spotLight position={[0, 6, 0]} angle={0.7} intensity={3.5} color="#A0C8F0" castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#FFF" />

      {/* Conveyor Belt Platform */}
      <mesh position={[0, -0.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.0, 0.1, 2.6]} />
        <meshPhysicalMaterial color="#110906" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* Refrigeration Tunnel Enclosure (Arch) */}
      <mesh position={[0, 0.4, 0]} rotation={[0, 0, 0]} receiveShadow castShadow>
        {/* Hollow ring segment representing arch */}
        <torusGeometry args={[1.2, 0.08, 12, 24, Math.PI]} />
        <meshPhysicalMaterial
          color="#3E3E3E" // Stainless Steel look
          roughness={0.15}
          metalness={1.0}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Molded Bars Cooling */}
      <group ref={barsGroupRef} position={[0, -0.32, 0]}>
        {/* Bar 1 */}
        <mesh position={[-0.45, 0, -0.6]} rotation={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.8]} />
          <meshPhysicalMaterial color="#3D1C12" roughness={0.12} clearcoat={1.0} />
        </mesh>
        
        {/* Bar 2 */}
        <mesh position={[0.45, 0, 0.15]} rotation={[0, -0.05, 0]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.8]} />
          <meshPhysicalMaterial color="#3D1C12" roughness={0.12} clearcoat={1.0} />
        </mesh>

        {/* Bar 3 */}
        <mesh position={[-0.3, 0, 0.7]} rotation={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.8]} />
          <meshPhysicalMaterial color="#3D1C12" roughness={0.12} clearcoat={1.0} />
        </mesh>
      </group>

      {/* Cold Frost Vapor / Mist */}
      <points ref={mistRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[mistPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#A0D0FF"
          size={0.08}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default CoolingScene;
