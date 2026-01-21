import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

interface Hotspot {
  x: number; // percentage
  y: number; // percentage
  title: string;
  description: string;
}

interface HotspotImageProps {
  src: string;
  alt: string;
  hotspots: Hotspot[];
  className?: string;
}

export const HotspotImage = ({ src, alt, hotspots, className = '' }: HotspotImageProps) => {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  return (
    <div className={`relative ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover rounded-lg" />

      {hotspots.map((hotspot, index) => (
        <div
          key={index}
          className="absolute"
          style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
          onMouseEnter={() => setActiveHotspot(index)}
          onMouseLeave={() => setActiveHotspot(null)}
        >
          {/* Hotspot button */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.2 }}
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-brand-500 text-white shadow-lg hover:shadow-brand-500/50 transition-shadow cursor-pointer"
          >
            <Plus className="w-5 h-5" />

            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full bg-brand-500 animate-ping opacity-75" />
          </motion.button>

          {/* Tooltip */}
          <AnimatePresence>
            {activeHotspot === index && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-1/2 -translate-x-1/2 top-12 z-50 w-64 p-4 rounded-lg bg-slate-800/95 backdrop-blur-sm border border-brand-500/30 shadow-xl pointer-events-none"
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-slate-800 border-l border-t border-brand-500/30" />

                <h4 className="text-sm font-semibold text-brand-400 mb-1">
                  {hotspot.title}
                </h4>
                <p className="text-xs text-neutral-300">
                  {hotspot.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
