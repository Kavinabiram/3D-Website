import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, PerformanceMonitor } from '@react-three/drei';
import SceneController from './SceneController';
import PostProcessingPipeline from './PostProcessingPipeline';
import useStore from '../../store/useStore';

export const ChocoCanvas: React.FC = () => {
  const dpr = useStore((state) => state.dpr);
  const setDpr = useStore((state) => state.setDpr);

  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none bg-[#1A0E0A]">
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        shadows
        dpr={dpr}
        camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 100 }}
      >
        <color attach="background" args={['#1A0E0A']} />
        <fog attach="fog" args={['#1A0E0A', 6, 20]} />
        
        {/* Dynamic DPR Scaling for performance */}
        <PerformanceMonitor
          onDecline={() => setDpr(Math.max(1.0, dpr - 0.25))}
          onIncline={() => setDpr(Math.min(2.0, dpr + 0.25))}
        />

        <Suspense fallback={null}>
          <ambientLight intensity={0.2} color="#F5E8D3" />
          <directionalLight
            position={[5, 10, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
            color="#D6A85F"
          />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#F7B955" />
          
          <SceneController />
          <PostProcessingPipeline />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ChocoCanvas;
