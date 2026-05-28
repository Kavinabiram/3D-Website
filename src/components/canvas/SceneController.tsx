import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import useStore from '../../store/useStore';

import CosmosZone from './environments/CosmosZone';
import FactoryZone from './environments/FactoryZone';
import IngredientsZone from './environments/IngredientsZone';
import GalleryZone from './environments/GalleryZone';
import GiftZone from './environments/GiftZone';

gsap.registerPlugin(ScrollTrigger);

export const SceneController: React.FC = () => {
  const { camera } = useThree();
  const activeSection = useStore((state) => state.activeSection);
  const setActiveSection = useStore((state) => state.setActiveSection);

  const targetCamPos = useRef(new THREE.Vector3(0, 0, 5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    // Scroll triggers to synchronize camera offsets across 6 distinct phases
    const scrollTrigger = ScrollTrigger.create({
      trigger: '#scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      onUpdate: (self) => {
        const progress = self.progress;

        // Phase 1: Zone 1 (Cosmos) to Zone 2 (Factory)
        if (progress < 0.166) {
          const t = progress / 0.166;
          targetCamPos.current.set(
            THREE.MathUtils.lerp(0, 3, t),
            THREE.MathUtils.lerp(0, 4, t),
            THREE.MathUtils.lerp(5, -8, t)
          );
          targetLookAt.current.set(0, THREE.MathUtils.lerp(0, 1, t), 0);
          setActiveSection(0);
        }
        // Phase 2: Zone 2 (Factory) to Zone 3 (Ingredients)
        else if (progress >= 0.166 && progress < 0.333) {
          const t = (progress - 0.166) / 0.167;
          targetCamPos.current.set(
            THREE.MathUtils.lerp(3, 12, t),
            THREE.MathUtils.lerp(4, -2, t),
            THREE.MathUtils.lerp(-8, -15, t)
          );
          targetLookAt.current.set(THREE.MathUtils.lerp(0, 12, t), -2, -15);
          setActiveSection(1);
        }
        // Phase 3: Zone 3 (Ingredients) to Zone 4 (Gallery)
        else if (progress >= 0.333 && progress < 0.5) {
          const t = (progress - 0.333) / 0.167;
          targetCamPos.current.set(
            THREE.MathUtils.lerp(12, 0, t),
            THREE.MathUtils.lerp(-2, 2, t),
            THREE.MathUtils.lerp(-15, -22, t)
          );
          targetLookAt.current.set(0, 2, -22);
          setActiveSection(2);
        }
        // Phase 4: Zone 4 (Gallery) to Zone 5 (Gift Box)
        else if (progress >= 0.5 && progress < 0.666) {
          const t = (progress - 0.5) / 0.166;
          targetCamPos.current.set(
            THREE.MathUtils.lerp(0, 0, t),
            THREE.MathUtils.lerp(2, 1.2, t),
            THREE.MathUtils.lerp(-22, -30, t)
          );
          targetLookAt.current.set(0, 0.5, -30);
          setActiveSection(3);
        }
        // Phase 5: Zone 5 Configurator Focus
        else if (progress >= 0.666 && progress < 0.833) {
          const t = (progress - 0.666) / 0.167;
          targetCamPos.current.set(
            0,
            THREE.MathUtils.lerp(1.2, 0.8, t),
            THREE.MathUtils.lerp(-30, -29, t)
          );
          targetLookAt.current.set(0, 0.4, -30);
          setActiveSection(4);
        }
        // Phase 6: Zone 6 (Contact View transition)
        else {
          const t = (progress - 0.833) / 0.167;
          targetCamPos.current.set(
            THREE.MathUtils.lerp(0, 0, t),
            THREE.MathUtils.lerp(0.8, 6, t),
            THREE.MathUtils.lerp(-29, -22, t)
          );
          targetLookAt.current.set(0, 0, -30);
          setActiveSection(5);
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

  return (
    <>
      <CosmosZone visible={activeSection === 0} />
      <FactoryZone visible={activeSection === 1} />
      <IngredientsZone visible={activeSection === 2} />
      <GalleryZone visible={activeSection === 3} />
      <GiftZone visible={activeSection === 4 || activeSection === 5} />
    </>
  );
};

export default SceneController;
