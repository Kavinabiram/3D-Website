import React from 'react';
import { motion } from 'framer-motion';

export const TemperingSection: React.FC = () => {
  return (
    <section className="h-screen w-full flex items-center justify-end px-4 sm:px-8 md:px-24 relative z-10 pointer-events-none text-cream-200">
      <div className="max-w-md pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="bg-cocoa-900/50 backdrop-blur-md border border-white/10 p-5 sm:p-8 rounded-3xl shadow-glass flex flex-col gap-4"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] text-gold-500 uppercase">
            Step 07 — Mixing & Tempering
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-wider text-cream-100 uppercase">
            Crystalline Temper
          </h2>
          <p className="text-xs md:text-sm font-light text-cream-200/70 leading-relaxed">
            Floating ingredients like sugar crystals, milk solids, and fine cocoa powder swirl in a hot vortex. Precision tempering cools and heats the liquid to establish Form V cocoa butter crystals, giving the chocolate its signature snap and high-gloss sheen.
          </p>
          
          <div className="flex items-center gap-6 mt-2">
            <div>
              <div className="text-xl font-serif font-bold text-gold-500">31°C - 32°C</div>
              <div className="text-[8px] uppercase tracking-widest text-cream-200/40">Tempering Temp</div>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div>
              <div className="text-xl font-serif font-bold text-gold-500">Beta V</div>
              <div className="text-[8px] uppercase tracking-widest text-cream-200/40">Crystal Form</div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-white/5">
            <span className="text-[9px] uppercase tracking-widest text-gold-500/60 font-semibold block">
              Ambient Sound Design
            </span>
            <span className="text-[10px] italic text-cream-200/50 block">
              Viscous fluid churning, soft rhythmic scrapers, smooth liquid eddies.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TemperingSection;
