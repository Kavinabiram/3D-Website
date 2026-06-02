import React from 'react';
import { motion } from 'framer-motion';
import useStore from '../../../store/useStore';

interface RevealSectionProps {
  onClickSound?: () => void;
}

export const RevealSection: React.FC<RevealSectionProps> = ({ onClickSound }) => {
  const config = useStore((state) => state.config);
  const getPrice = useStore((state) => state.getPrice);

  const getToppingLabel = (top: string) => {
    switch (top) {
      case 'gold_dust':
        return '24K Gold Dust';
      case 'sea_salt':
        return 'Fleur de Sel';
      case 'raspberry':
        return 'Dried Raspberries';
      case 'hazelnut':
        return 'Caramelized Hazelnuts';
      default:
        return top;
    }
  };

  const getPackagingLabel = (pack: string) => {
    switch (pack) {
      case 'premium':
        return 'Premium Gift Box';
      case 'collector':
        return 'Collector Wooden Case';
      case 'classic':
      default:
        return 'Classic Wrapper';
    }
  };

  return (
    <section className="h-screen w-full flex flex-col items-center justify-between pt-36 pb-24 px-6 relative z-10 pointer-events-none select-none text-center text-cream-200">
      {/* Top Title */}
      <div className="flex flex-col items-center max-w-2xl">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-xs font-semibold tracking-[0.4em] text-gold-400 uppercase mb-3"
        >
          Luxury Finished Bar
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.0, delay: 0.1 }}
          className="text-4xl md:text-6xl font-serif tracking-widest text-cream-100 uppercase mb-4"
        >
          The Masterpiece
        </motion.h2>
        <p className="text-xs md:text-sm font-light text-cream-200/50 max-w-lg leading-relaxed">
          Crafted from bean to bar through ten precise stages of physical and chemical artistry. Customize your blend using the console below.
        </p>
      </div>

      {/* Center Details Box (Visible on Scroll) */}
      <div className="max-w-lg pointer-events-auto w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.0, delay: 0.2 }}
          className="bg-cocoa-900/60 backdrop-blur-lg border border-white/10 p-6 rounded-3xl shadow-glass flex flex-col gap-4 text-left"
        >
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-xs tracking-wider text-gold-500 font-bold uppercase">Recipe Specifications</span>
            <span className="text-lg font-serif font-semibold text-cream-100">${getPrice().toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-cream-200/40 block mb-1">Cacao Base</span>
              <span className="font-medium text-cream-200 uppercase">{config.baseType} ({config.cacaoPercentage}%)</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-cream-200/40 block mb-1">Packaging</span>
              <span className="font-medium text-cream-200">{getPackagingLabel(config.packaging)}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[9px] uppercase tracking-widest text-cream-200/40 block mb-1">Selected Toppings</span>
              <span className="font-medium text-cream-200">
                {config.toppings.length > 0 
                  ? config.toppings.map(getToppingLabel).join(', ') 
                  : 'Pure Cacao Blend (No toppings)'}
              </span>
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={() => {
                if (onClickSound) onClickSound();
                alert('Order submitted successfully! Experience the taste of digital luxury.');
              }}
              className="w-full py-3 text-center text-xs uppercase tracking-[0.25em] font-bold text-cocoa-900 bg-gradient-to-r from-gold-500 to-gold-400 border border-gold-400 rounded-full cursor-pointer hover:shadow-[0_0_15px_rgba(214,168,95,0.4)] transition-all duration-300"
            >
              Order Recipe
            </button>
          </div>

          <div className="mt-1 flex flex-col gap-1">
            <span className="text-[8px] uppercase tracking-widest text-gold-500/50 font-bold block text-center">
              Ambient Sound Design
            </span>
            <span className="text-[9px] italic text-cream-200/40 text-center block">
              Orchestral swell, clean chocolate snap, golden wrapper crinkle.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RevealSection;
