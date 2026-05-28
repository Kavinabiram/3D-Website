import React from 'react';
import { motion } from 'framer-motion';

export const CollectionSection: React.FC = () => {
  return (
    <section className="h-screen w-full flex items-center justify-start px-4 sm:px-8 md:px-24 relative z-10 pointer-events-none text-cream-200">
      <div className="max-w-md pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="bg-cocoa-900/50 backdrop-blur-md border border-white/10 p-5 sm:p-8 rounded-3xl shadow-glass flex flex-col gap-4"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] text-gold-500 uppercase">
            Zone 04 — Premium Catalogue
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-wider text-cream-100 uppercase">
            Luxury Gallery
          </h2>
          <p className="text-xs md:text-sm font-light text-cream-200/70 leading-relaxed">
            Discover a showcase of our finest culinary sculptures. Each product is finished with gold leaf flakes and organic sea salt, representing decades of master tempering techniques.
          </p>
          
          <div className="flex flex-col gap-2 mt-2">
            {[
              { name: 'Dark Truffle Cube', desc: '72% Single-Origin Ganache' },
              { name: 'Caramel Gold Pyramid', desc: 'Whipped Salted Butter Caramel' },
              { name: 'Dusted Bronze Block', desc: 'Hazelnuts & Cocoa nibs crust' },
            ].map((product, idx) => (
              <div key={idx} className="flex justify-between items-center text-[10px] tracking-widest uppercase font-semibold">
                <span className="text-cream-200">{product.name}</span>
                <span className="text-gold-500/80 font-normal">{product.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CollectionSection;
