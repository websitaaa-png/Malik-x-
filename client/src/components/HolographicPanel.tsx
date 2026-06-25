import React from 'react';
import { motion } from 'framer-motion';

interface HolographicPanelProps {
  children: React.ReactNode;
  className?: string;
}

const HolographicPanel: React.FC<HolographicPanelProps> = ({ children, className }) => {
  return (
    <motion.div
      className={`hud-panel relative p-4 ${className}`}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Optional: Add subtle scanline or grid overlay for more holographic feel */}
      <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)' , backgroundSize: '10px 10px' }}></div>
      {children}
    </motion.div>
  );
};

export default HolographicPanel;
