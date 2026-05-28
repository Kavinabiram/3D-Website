import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Import shaders
import vertexShader from '../../../shaders/liquidWaves/vertex.glsl';
import fragmentShader from '../../../shaders/liquidWaves/fragment.glsl';

export const LiquidChocolate: React.FC = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: 1.0 },
      uWaveHeight: { value: 0.6 },
      uChocolateColor: { value: new THREE.Color('#4B2418') },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, -8]} receiveShadow>
      <planeGeometry args={[30, 20, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite
        shadowSide={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default LiquidChocolate;
