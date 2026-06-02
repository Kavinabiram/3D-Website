import React, { useState } from 'react';
import ChocoCanvas from './components/canvas/ChocoCanvas';
import Loader from './components/dom/Loader';
import Navbar from './components/dom/Navbar';
import ConfiguratorModal from './components/dom/ConfiguratorModal';
import CustomCursor from './components/dom/ui/CustomCursor';

// Section DOM overlays
import FarmSection from './components/dom/Sections/FarmSection';
import HarvestSection from './components/dom/Sections/HarvestSection';
import FermentationSection from './components/dom/Sections/FermentationSection';
import DryingSection from './components/dom/Sections/DryingSection';
import RoastingSection from './components/dom/Sections/RoastingSection';
import GrindingSection from './components/dom/Sections/GrindingSection';
import TemperingSection from './components/dom/Sections/TemperingSection';
import MoldingSection from './components/dom/Sections/MoldingSection';
import CoolingSection from './components/dom/Sections/CoolingSection';
import RevealSection from './components/dom/Sections/RevealSection';

import useAudio from './hooks/useAudio';
import usePerformanceMonitor from './hooks/usePerformanceMonitor';
import useStore from './store/useStore';
import useScrollProgress from './hooks/useScrollProgress';

export const App: React.FC = () => {
  const [entered, setEntered] = useState(false);
  const activeSection = useStore((state) => state.activeSection);
  const { initAudio, toggleMute, playClick, soundMuted } = useAudio();

  // Initialize adaptive performance monitoring
  usePerformanceMonitor();

  // Track scroll timeline
  useScrollProgress();

  const handleEnter = () => {
    initAudio();
    setEntered(true);
  };

  return (
    <div className="relative min-h-screen text-cream-200 bg-[#1A0E0A] overflow-x-hidden select-none">
      {/* Cinematic Custom Cursor */}
      {entered && <CustomCursor />}

      {/* Cinematic Curtain Loader */}
      {!entered && <Loader onEnter={handleEnter} />}

      {entered && (
        <>
          {/* Main WebGL canvas */}
          <ChocoCanvas />

          {/* Floating UI Elements */}
          <Navbar
            soundMuted={soundMuted}
            onToggleMute={toggleMute}
            onClickSound={playClick}
          />

          {/* Configurator modal overlay - visible at Scene 10 (Reveal) */}
          {activeSection === 9 && (
            <div className="fixed inset-x-4 bottom-4 md:inset-x-auto md:right-8 md:bottom-8 z-40 pointer-events-none flex justify-center">
              <ConfiguratorModal onClickSound={playClick} />
            </div>
          )}

          {/* Scroll Container driving R3F Camera transitions via GSAP */}
          <main id="scroll-container" className="relative z-10 w-full h-[1000vh]">
            <FarmSection />
            <HarvestSection />
            <FermentationSection />
            <DryingSection />
            <RoastingSection />
            <GrindingSection />
            <TemperingSection />
            <MoldingSection />
            <CoolingSection />
            <RevealSection onClickSound={playClick} />
          </main>
        </>
      )}
    </div>
  );
};

export default App;
