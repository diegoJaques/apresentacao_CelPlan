import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export const GlassCard = ({ children, className = '', hover = true, delay = 0 }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/5 backdrop-blur-md
        border border-white/10
        shadow-xl shadow-brand-500/10
        transition-all duration-300
        ${hover ? 'hover:shadow-2xl hover:shadow-brand-500/20 hover:border-brand-500/30' : ''}
        ${className}
      `}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
