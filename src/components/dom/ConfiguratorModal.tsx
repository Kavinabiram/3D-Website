import React from 'react';
import useStore from '../../store/useStore';
import confetti from 'canvas-confetti';

interface ConfiguratorModalProps {
  onClickSound: () => void;
}

export const ConfiguratorModal: React.FC<ConfiguratorModalProps> = ({ onClickSound }) => {
  const config = useStore((state) => state.config);
  const updateConfig = useStore((state) => state.updateConfig);
  const getPrice = useStore((state) => state.getPrice);

  const handleBaseChange = (base: 'dark' | 'milk' | 'white') => {
    onClickSound();
    updateConfig((prev) => {
      prev.baseType = base;
    });
  };

  const handleToppingToggle = (topping: string) => {
    onClickSound();
    updateConfig((prev) => {
      if (prev.toppings.includes(topping)) {
        prev.toppings = prev.toppings.filter((t) => t !== topping);
      } else {
        prev.toppings.push(topping);
      }
    });
  };

  const handlePackagingChange = (pkg: 'classic' | 'premium' | 'collector') => {
    onClickSound();
    updateConfig((prev) => {
      prev.packaging = pkg;
    });
  };

  const triggerOrderReveal = () => {
    onClickSound();
    // Fire elegant gold-themed confetti blast
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#D6A85F', '#B97A3D', '#F7B955', '#4B2418', '#F5E8D3'],
    });
  };

  return (
    <div className="w-full md:w-96 bg-cocoa-900/80 backdrop-blur-xl border border-white/10 p-4 sm:p-6 rounded-3xl text-cream-200 pointer-events-auto shadow-glass flex flex-col gap-4 sm:gap-6">
      <div>
        <h2 className="text-xl font-serif tracking-widest text-gold-500 uppercase mb-1">
          Choco Lab
        </h2>
        <p className="text-[10px] uppercase tracking-widest text-cream-200/50">
          Design your custom luxury chocolate bar
        </p>
      </div>

      <hr className="border-white/10" />

      {/* Chocolate Base Type */}
      <div>
        <label className="text-xs font-semibold tracking-widest uppercase text-cream-200/70 mb-3 block">
          1. Base Cocoa Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['dark', 'milk', 'white'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleBaseChange(type)}
              className={`py-2 text-[10px] tracking-widest uppercase font-semibold border rounded-full transition-all duration-300 cursor-pointer ${
                config.baseType === type
                  ? 'border-gold-500 bg-gold-500 text-cocoa-900'
                  : 'border-white/10 bg-transparent text-cream-200 hover:border-cream-200/30'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Premium Toppings */}
      <div>
        <label className="text-xs font-semibold tracking-widest uppercase text-cream-200/70 mb-3 block">
          2. Infused Ingredients
        </label>
        <div className="flex flex-col gap-2">
          {[
            { id: 'gold_dust', name: 'Luxury Gold Leaf Dust (+$5.00)' },
            { id: 'sea_salt', name: 'Fleur de Sel Sea Salt (+$1.50)' },
            { id: 'raspberry', name: 'Dried Raspberries (+$2.00)' },
            { id: 'hazelnut', name: 'Roasted Hazelnuts (+$2.00)' },
          ].map((item) => {
            const active = config.toppings.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleToppingToggle(item.id)}
                className={`flex items-center justify-between px-4 py-2.5 text-[10px] tracking-widest uppercase font-semibold border rounded-xl transition-all duration-300 text-left cursor-pointer ${
                  active
                    ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                    : 'border-white/10 bg-transparent text-cream-200 hover:border-cream-200/30'
                }`}
              >
                <span>{item.name}</span>
                <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                  active ? 'border-gold-500 bg-gold-500' : 'border-white/30'
                }`}>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cocoa-900" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Packaging Selection */}
      <div>
        <label className="text-xs font-semibold tracking-widest uppercase text-cream-200/70 mb-3 block">
          3. Collection Packaging
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'classic', name: 'Classic' },
            { id: 'premium', name: 'Premium (+$4.50)' },
            { id: 'collector', name: 'Collector (+$8.00)' },
          ].map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => handlePackagingChange(pkg.id as any)}
              className={`py-2 text-[9px] tracking-widest uppercase font-semibold border rounded-full transition-all duration-300 cursor-pointer ${
                config.packaging === pkg.id
                  ? 'border-gold-500 bg-gold-500 text-cocoa-900'
                  : 'border-white/10 bg-transparent text-cream-200 hover:border-cream-200/30'
              }`}
            >
              {pkg.name}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Pricing and Action CTA */}
      <div className="flex items-center justify-between mt-2">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-cream-200/40">
            Total Valuation
          </div>
          <div className="text-2xl font-serif text-gold-500 font-bold">
            ${getPrice().toFixed(2)}
          </div>
        </div>
        
        <button
          onClick={triggerOrderReveal}
          className="px-6 py-3 text-xs uppercase tracking-widest font-bold text-cocoa-900 bg-gold-500 hover:bg-gold-400 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          Reserve Bar
        </button>
      </div>
    </div>
  );
};

export default ConfiguratorModal;
