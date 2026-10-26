import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Import shaders
import vertexShader from '../../../shaders/goldEnergy/vertex.glsl';
import fragmentShader from '../../../shaders/goldEnergy/fragment.glsl';

export const GoldTrails: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: 2.0 },
      uGoldColor: { value: new THREE.Color('#D6A85F') },
    }),
    []
  );

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [uniforms]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    material.uniforms.uTime.value = elapsed;
    if (meshRef.current) {
      // Gentle group rotation
      meshRef.current.rotation.y = elapsed * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, -5]}>
      {/* Create three glowing ribbons orbiting the center */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          rotation={[0, (i * Math.PI) / 1.5, Math.PI / 4]}
          position={[0, 0, 0]}
          material={material}
        >
          <torusGeometry args={[3.5, 0.04, 8, 64]} />
        </mesh>
      ))}
    </group>
  );
};

export default GoldTrails;
