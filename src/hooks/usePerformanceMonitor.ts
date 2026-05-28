import { useEffect, useRef } from 'react';
import useStore from '../store/useStore';

export const usePerformanceMonitor = () => {
  const dpr = useStore((state) => state.dpr);
  const setDpr = useStore((state) => state.setDpr);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const lowFpsCount = useRef(0);

  useEffect(() => {
    let animationFrameId: number;

    const checkFPS = () => {
      frameCount.current++;
      const now = performance.now();
      const delta = now - lastTime.current;

      if (delta >= 1000) { // Check every 1 second
        const fps = (frameCount.current * 1000) / delta;

        if (fps < 45) {
          lowFpsCount.current++;
          if (lowFpsCount.current >= 3 && dpr > 1.0) {
            // Lower DPR if FPS remains low for 3 consecutive seconds
            setDpr(Math.max(1.0, dpr - 0.25));
            lowFpsCount.current = 0;
          }
        } else {
          lowFpsCount.current = 0;
        }

        frameCount.current = 0;
        lastTime.current = now;
      }

      animationFrameId = requestAnimationFrame(checkFPS);
    };

    animationFrameId = requestAnimationFrame(checkFPS);
    return () => cancelAnimationFrame(animationFrameId);
  }, [dpr, setDpr]);
};

export default usePerformanceMonitor;
