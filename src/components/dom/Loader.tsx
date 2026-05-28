import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';

interface LoaderProps {
  onEnter: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onEnter }) => {
  const isLoaded = useStore((state) => state.isLoaded);
  const setIsLoaded = useStore((state) => state.setIsLoaded);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading cycle for 3D assets
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoaded(true);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [setIsLoaded]);

  return (
    <AnimatePresence>
      {!progress.toFixed ? null : (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#0A0503]"
          style={{
            background: 'radial-gradient(circle at center, #1A0E0A 0%, #0A0503 100%)'
          }}
        >
          {/* Subtle background animated noise/grain could go here */}
          
          <div className="relative flex flex-col items-center max-w-lg px-6 text-center select-none z-10">
            {/* 3D-like Intersecting Rings Loader */}
            <div className="relative w-32 h-32 mb-12 perspective-[1000px] flex items-center justify-center">
              <motion.div 
                animate={{ rotateX: 360, rotateY: 180, rotateZ: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-gold-500/30 shadow-[0_0_15px_rgba(214,168,95,0.2)]"
                style={{ transformStyle: 'preserve-3d' }}
              />
              <motion.div 
                animate={{ rotateX: -360, rotateY: 360, rotateZ: -180 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border border-gold-400/50"
                style={{ transformStyle: 'preserve-3d' }}
              />
              <motion.div 
                animate={{ rotateX: 180, rotateY: -360, rotateZ: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-gold-600/80 border-dashed"
                style={{ transformStyle: 'preserve-3d' }}
              />
              {/* Center Glow */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-4 h-4 bg-gold-500 rounded-full blur-[8px]"
              />
            </div>

            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-4xl md:text-5xl font-serif tracking-[0.3em] text-gold-500 uppercase mb-4 drop-shadow-2xl"
            >
              ChocoVerse 3D
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-xs md:text-sm uppercase tracking-[0.4em] text-cream-200/60 mb-16"
            >
              Futuristic Luxury Chocolate
            </motion.p>

            {/* Loading Action Area */}
            <div className="h-20 flex items-center justify-center relative w-full">
              {!isLoaded ? (
                <div className="flex flex-col items-center w-64">
                  <div className="w-full h-[2px] bg-cocoa-800 relative rounded-full overflow-hidden mb-4 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-gold-600 to-gold-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: 'easeOut' }}
                    />
                  </div>
                  <div className="text-sm font-sans tracking-[0.2em] text-gold-500/80">
                    {progress < 100 ? `${progress}%` : 'READY'}
                  </div>
                </div>
              ) : (
                <motion.button
                  onClick={onEnter}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0px 0px 20px rgba(214,168,95,0.4)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 text-xs uppercase tracking-[0.3em] font-bold text-cocoa-900 bg-gradient-to-r from-gold-500 to-gold-400 border border-gold-400 rounded-full cursor-pointer transition-all duration-300"
                >
                  Enter Experience
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
