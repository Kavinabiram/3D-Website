import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', updateMouse);
    window.addEventListener('mouseover', handleMouseOver);
    document.body.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('mousemove', updateMouse);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-gold-500 pointer-events-none z-50 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        scale: isHovered ? 1.4 : 1,
        backgroundColor: isHovered ? 'rgba(214, 168, 95, 0.15)' : 'rgba(214, 168, 95, 0)',
        borderColor: isHovered ? '#F7B955' : '#D6A85F',
      }}
      transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.4 }}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
    </motion.div>
  );
};

export default CustomCursor;
