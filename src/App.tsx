import React, { useState } from 'react';
import ChocoCanvas from './components/canvas/ChocoCanvas';
import Loader from './components/dom/Loader';
import Navbar from './components/dom/Navbar';
import ConfiguratorModal from './components/dom/ConfiguratorModal';
import CustomCursor from './components/dom/ui/CustomCursor';

// Section DOM overlays
import HeroSection from './components/dom/Sections/HeroSection';
import FactorySection from './components/dom/Sections/FactorySection';
import IngredientsSection from './components/dom/Sections/IngredientsSection';
import CollectionSection from './components/dom/Sections/CollectionSection';
import GiftSection from './components/dom/Sections/GiftSection';
import ContactSection from './components/dom/Sections/ContactSection';

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

          {/* Configurator modal overlay - visible at Zone 5 (Gift selection) */}
          {activeSection === 4 && (
            <div className="fixed inset-x-4 bottom-4 md:inset-x-auto md:right-8 md:bottom-8 z-40 pointer-events-none flex justify-center">
              <ConfiguratorModal onClickSound={playClick} />
            </div>
          )}

          {/* Scroll Container driving R3F Camera transitions via GSAP */}
          <main id="scroll-container" className="relative z-10 w-full h-[600vh]">
            <HeroSection />
            <FactorySection />
            <IngredientsSection />
            <CollectionSection />
            <GiftSection />
            <ContactSection onClickSound={playClick} />
          </main>
        </>
      )}
    </div>
  );
};

export default App;
