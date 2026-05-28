import React from 'react';
import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing';
import useStore from '../../store/useStore';

export const PostProcessingPipeline: React.FC = () => {
  const dpr = useStore((state) => state.dpr);

  // Disable heavy postprocessing on low performance settings
  if (dpr <= 1.0) {
    return null;
  }

  return (
    <EffectComposer>
      <DepthOfField
        focusDistance={0.012}
        focalLength={0.02}
        bokehScale={2}
        height={480}
      />
      <Bloom
        luminanceThreshold={0.25}
        luminanceSmoothing={0.9}
        height={300}
        intensity={0.65}
      />
      <Vignette
        eskil={false}
        offset={0.4}
        darkness={0.7}
      />
    </EffectComposer>
  );
};

export default PostProcessingPipeline;
