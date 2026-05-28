import React from 'react';
import { motion } from 'framer-motion';

export const IngredientsSection: React.FC = () => {
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
            Zone 03 — Origin Story
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-wider text-cream-100 uppercase">
            Premium Ingredients
          </h2>
          <p className="text-xs md:text-sm font-light text-cream-200/70 leading-relaxed">
            We harvest raw pods from organic plantations in Ecuador and Madagascar. The seeds undergo slow fermentation before they are roasted to reveal their caramelized accents and deep aroma.
          </p>
          
          <div className="flex flex-col gap-2 mt-2">
            {[
              { label: 'Ecuador Single Origin', value: '75% Dark Cocoa' },
              { label: 'Madagascar Single Origin', value: '82% Bourbon Roasted' },
            ].map((ingredient, idx) => (
              <div key={idx} className="flex justify-between items-center text-[10px] tracking-widest uppercase font-semibold">
                <span className="text-cream-200/60">{ingredient.label}</span>
                <span className="text-gold-500">{ingredient.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IngredientsSection;
