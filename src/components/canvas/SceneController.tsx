import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import useStore from '../../store/useStore';

import FarmScene from './environments/FarmScene';
import HarvestScene from './environments/HarvestScene';
import FermentationScene from './environments/FermentationScene';
import DryingScene from './environments/DryingScene';
import RoastingScene from './environments/RoastingScene';
import GrindingScene from './environments/GrindingScene';
import TemperingScene from './environments/TemperingScene';
import MoldingScene from './environments/MoldingScene';
import CoolingScene from './environments/CoolingScene';
import RevealScene from './environments/RevealScene';

gsap.registerPlugin(ScrollTrigger);

export const SceneController: React.FC = () => {
  const { camera } = useThree();
  const activeSection = useStore((state) => state.activeSection);
  const setActiveSection = useStore((state) => state.setActiveSection);

  const targetCamPos = useRef(new THREE.Vector3(0, 2, 8));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    // Scroll triggers to synchronize camera paths across 10 distinct storytelling stages
    const scrollTrigger = ScrollTrigger.create({
      trigger: '#scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      onUpdate: (self) => {
        const progress = self.progress;

        // Phase 1: progress < 0.1 (Scene 1: Farm)
        if (progress < 0.1) {
          const t = progress / 0.1;
          targetCamPos.current.set(
            0,
            THREE.MathUtils.lerp(2, -8, t),
            THREE.MathUtils.lerp(8, -10, t)
          );
          targetLookAt.current.set(
            0, 
            THREE.MathUtils.lerp(0, -10, t), 
            THREE.MathUtils.lerp(0, -10, t)
          );
          setActiveSection(0);
        }
        // Phase 2: progress >= 0.1 && progress < 0.2 (Scene 2: Harvest to Scene 3: Fermentation)
        else if (progress >= 0.1 && progress < 0.2) {
          const t = (progress - 0.1) / 0.1;
          targetCamPos.current.set(
            THREE.MathUtils.lerp(0, 15, t),
            THREE.MathUtils.lerp(-8, -10, t),
            THREE.MathUtils.lerp(-10, -20, t)
          );
          targetLookAt.current.set(
            THREE.MathUtils.lerp(0, 15, t),
            THREE.MathUtils.lerp(-10, -12, t),
            THREE.MathUtils.lerp(-10, -20, t)
          );
          setActiveSection(1);
        }
        // Phase 3: progress >= 0.2 && progress < 0.3 (Scene 3: Fermentation to Scene 4: Drying)
        else if (progress >= 0.2 && progress < 0.3) {
          const t = (progress - 0.2) / 0.1;
          targetCamPos.current.set(
            THREE.MathUtils.lerp(15, 20, t),
            THREE.MathUtils.lerp(-10, 4, t),
            THREE.MathUtils.lerp(-20, -35, t)
          );
          targetLookAt.current.set(
            THREE.MathUtils.lerp(15, 20, t),
            THREE.MathUtils.lerp(-12, 2, t),
            THREE.MathUtils.lerp(-20, -35, t)
          );
          setActiveSection(2);
        }
        // Phase 4: progress >= 0.3 && progress < 0.4 (Scene 4: Drying to Scene 5: Roasting)
        else if (progress >= 0.3 && progress < 0.4) {
          const t = (progress - 0.3) / 0.1;
          targetCamPos.current.set(
            THREE.MathUtils.lerp(20, 5, t),
            THREE.MathUtils.lerp(4, 10, t),
            THREE.MathUtils.lerp(-35, -50, t)
          );
          targetLookAt.current.set(
            THREE.MathUtils.lerp(20, 5, t),
            THREE.MathUtils.lerp(2, 8, t),
            THREE.MathUtils.lerp(-35, -50, t)
          );
          setActiveSection(3);
        }
        // Phase 5: progress >= 0.4 && progress < 0.5 (Scene 5: Roasting to Scene 6: Grinding)
        else if (progress >= 0.4 && progress < 0.5) {
          const t = (progress - 0.4) / 0.1;
          targetCamPos.current.set(
            THREE.MathUtils.lerp(5, -15, t),
            THREE.MathUtils.lerp(10, 2, t),
            THREE.MathUtils.lerp(-50, -65, t)
          );
          targetLookAt.current.set(
            THREE.MathUtils.lerp(5, -15, t),
            THREE.MathUtils.lerp(8, 0, t),
            THREE.MathUtils.lerp(-50, -65, t)
          );
          setActiveSection(4);
        }
        // Phase 6: progress >= 0.5 && progress < 0.6 (Scene 6: Grinding to Scene 7: Tempering)
        else if (progress >= 0.5 && progress < 0.6) {
          const t = (progress - 0.5) / 0.1;
          targetCamPos.current.set(
            THREE.MathUtils.lerp(-15, -10, t),
            THREE.MathUtils.lerp(2, -13, t),
            THREE.MathUtils.lerp(-65, -80, t)
          );
          targetLookAt.current.set(
            THREE.MathUtils.lerp(-15, -10, t),
            THREE.MathUtils.lerp(0, -15, t),
            THREE.MathUtils.lerp(-65, -80, t)
          );
          setActiveSection(5);
        }
        // Phase 7: progress >= 0.6 && progress < 0.7 (Scene 7: Tempering to Scene 8: Molding)
        else if (progress >= 0.6 && progress < 0.7) {
          const t = (progress - 0.6) / 0.1;
          targetCamPos.current.set(
            THREE.MathUtils.lerp(-10, 10, t),
            THREE.MathUtils.lerp(-13, -10, t),
            THREE.MathUtils.lerp(-80, -95, t)
          );
          targetLookAt.current.set(
            THREE.MathUtils.lerp(-10, 10, t),
            THREE.MathUtils.lerp(-15, -12, t),
            THREE.MathUtils.lerp(-80, -95, t)
          );
          setActiveSection(6);
        }
        // Phase 8: progress >= 0.7 && progress < 0.8 (Scene 8: Molding to Scene 9: Cooling)
        else if (progress >= 0.7 && progress < 0.8) {
          const t = (progress - 0.7) / 0.1;
          targetCamPos.current.set(
            THREE.MathUtils.lerp(10, 20, t),
            THREE.MathUtils.lerp(-10, -3, t),
            THREE.MathUtils.lerp(-95, -110, t)
          );
          targetLookAt.current.set(
            THREE.MathUtils.lerp(10, 20, t),
            THREE.MathUtils.lerp(-12, -5, t),
            THREE.MathUtils.lerp(-95, -110, t)
          );
          setActiveSection(7);
        }
        // Phase 9: progress >= 0.8 && progress < 0.9 (Scene 9: Cooling to Scene 10: Reveal)
        else if (progress >= 0.8 && progress < 0.9) {
          const t = (progress - 0.8) / 0.1;
          targetCamPos.current.set(
            THREE.MathUtils.lerp(20, 0, t),
            THREE.MathUtils.lerp(-3, 1.2, t),
            THREE.MathUtils.lerp(-110, -127, t)
          );
          targetLookAt.current.set(
            THREE.MathUtils.lerp(20, 0, t),
            THREE.MathUtils.lerp(-5, 0.4, t),
            THREE.MathUtils.lerp(-110, -130, t)
          );
          setActiveSection(8);
        }
        // Phase 10: progress >= 0.9 (Scene 10: Reveal Focus)
        else {
          const t = (progress - 0.9) / 0.1;
          targetCamPos.current.set(
            0,
            1.2,
            THREE.MathUtils.lerp(-127, -126, t)
          );
          targetLookAt.current.set(0, 0.4, -130);
          setActiveSection(9);
        }
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [camera, setActiveSection]);

  useFrame(() => {
    // Slerp camera coordinates smoothly
    camera.position.lerp(targetCamPos.current, 0.05);

    const currentLook = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
    currentLook.lerp(targetLookAt.current, 0.05);
    camera.lookAt(currentLook);
  });

  // Performance Optimization: Render active scene and its direct neighbors to ensure smooth fly-throughs without pop-in
  const isVisible = (index: number) => {
    return activeSection === index || activeSection === index - 1 || activeSection === index + 1;
  };

  return (
    <>
      <FarmScene visible={isVisible(0)} />
      <HarvestScene visible={isVisible(1)} />
      <FermentationScene visible={isVisible(2)} />
      <DryingScene visible={isVisible(3)} />
      <RoastingScene visible={isVisible(4)} />
      <GrindingScene visible={isVisible(5)} />
      <TemperingScene visible={isVisible(6)} />
      <MoldingScene visible={isVisible(7)} />
      <CoolingScene visible={isVisible(8)} />
      <RevealScene visible={isVisible(9)} />
    </>
  );
};

export default SceneController;
