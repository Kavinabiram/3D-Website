import React from 'react';
import { motion } from 'framer-motion';

export const HeroSection: React.FC = () => {
  return (
    <section className="h-screen w-full flex flex-col items-center justify-between pt-40 pb-24 px-6 relative z-10 pointer-events-none select-none text-center text-cream-200">
      <div className="flex flex-col items-center max-w-4xl">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-xs font-semibold tracking-[0.35em] text-gold-500 uppercase mb-4"
        >
          Introducing
        </motion.span>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-8xl font-serif tracking-widest text-cream-100 uppercase mb-6"
        >
          ChocoVerse 3D
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.7 }}
          className="text-sm md:text-base font-sans max-w-xl text-cream-200/60 leading-relaxed font-light"
        >
          Step into a multisensory digital metaverse. A premium, hardware-accelerated chocolate journey combining Apple-level product craftsmanship and cinematic WebGL.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.0, delay: 1.2, repeat: Infinity, repeatType: 'reverse' }}
        className="flex flex-col items-center gap-2"
      >
        <span className="text-[9px] uppercase tracking-[0.25em] text-gold-500 font-bold">
          Scroll Down
        </span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-gold-500 to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
