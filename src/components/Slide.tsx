import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SlideProps {
  children: ReactNode;
  className?: string;
  background?: 'gradient' | 'dark' | 'image';
  backgroundImage?: string;
}

export const Slide = ({ 
  children, 
  className = '', 
  background = 'dark',
  backgroundImage 
}: SlideProps) => {
  const getBackgroundClass = () => {
    switch (background) {
      case 'gradient':
        return 'bg-slate-900';
      case 'image':
        return '';
      default:
        return 'bg-slate-900';
    }
  };

  const backgroundStyle = backgroundImage 
    ? { 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    : {};

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen w-full flex items-center justify-center p-12 ${getBackgroundClass()} ${className}`}
      style={backgroundStyle}
    >
      <div className="max-w-7xl w-full">
        {children}
      </div>
    </motion.section>
  );
};