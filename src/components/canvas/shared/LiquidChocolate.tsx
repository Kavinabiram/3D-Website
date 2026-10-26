import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Import shaders
import vertexShader from '../../../shaders/liquidWaves/vertex.glsl';
import fragmentShader from '../../../shaders/liquidWaves/fragment.glsl';

type LiquidChocolateProps = JSX.IntrinsicElements['mesh'] & {
  planeArgs?: [number, number, number, number];
};

export const LiquidChocolate: React.FC<LiquidChocolateProps> = ({ planeArgs = [30, 20, 64, 64], ...props }) => {
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
    <mesh receiveShadow {...props}>
      <planeGeometry args={planeArgs} />
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
