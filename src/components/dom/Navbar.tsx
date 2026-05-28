import React from 'react';
import useStore from '../../store/useStore';

interface NavbarProps {
  soundMuted: boolean;
  onToggleMute: () => void;
  onClickSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ soundMuted, onToggleMute, onClickSound }) => {
  const activeSection = useStore((state) => state.activeSection);
  const sections = ['Cosmos', 'Factory', 'Origin', 'Gallery', 'Gift'];

  const handleScrollTo = (index: number) => {
    onClickSound();
    const height = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: (height / 4) * index,
      behavior: 'smooth',
    });
  };

  return (
    <header className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-6xl pointer-events-auto">
      <nav className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-cocoa-900/40 backdrop-blur-lg border border-white/10 rounded-full shadow-glass">
        <div className="flex items-center gap-2 md:gap-3 select-none cursor-pointer" onClick={() => handleScrollTo(0)}>
          <span className="text-base md:text-xl font-serif tracking-widest text-gold-500 uppercase">ChocoVerse</span>
          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
        </div>
        
        <ul className="hidden lg:flex items-center gap-8">
          {sections.map((sec, idx) => (
            <li key={sec}>
              <button
                onClick={() => handleScrollTo(idx)}
                className={`text-xs tracking-widest uppercase transition-all duration-300 font-semibold cursor-pointer ${
                  activeSection === idx ? 'text-gold-500 scale-105' : 'text-cream-200/60 hover:text-cream-200'
                }`}
              >
                {sec}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 md:gap-6">
          {/* Spatial Sound Toggle visualizer */}
          <button
            onClick={() => {
              onClickSound();
              onToggleMute();
            }}
            className="flex items-center gap-1 md:gap-1.5 h-4 cursor-pointer focus:outline-none"
            aria-label="Toggle Sound"
          >
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`w-[2px] rounded-full bg-gold-500 transition-all duration-300 ${
                  soundMuted ? 'h-1.5' : 'h-full animate-pulse-slow'
                }`}
                style={{
                  animationDelay: `${i * 0.15}s`,
                  height: soundMuted ? '6px' : undefined
                }}
              />
            ))}
          </button>

          <button 
            onClick={() => handleScrollTo(4)}
            className="px-3 py-1.5 md:px-5 md:py-2 text-[9px] md:text-xs uppercase tracking-wider font-semibold text-cocoa-900 bg-gold-500 hover:bg-gold-400 border border-gold-500 hover:scale-105 transition-all duration-300 rounded-full cursor-pointer whitespace-nowrap"
          >
            Design Custom Bar
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
