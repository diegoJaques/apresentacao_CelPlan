import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  currentSlide: number;
  totalSlides: number;
  onNavigate: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  slideNames: string[];
}

export const Navigation = ({
  currentSlide,
  totalSlides,
  onNavigate,
  onPrevious,
  onNext,
  slideNames
}: NavigationProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Navigation Controls */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect px-6 py-3 rounded-full flex items-center gap-2"
        >
          <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => onNavigate(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 
                  ${currentSlide === index 
                    ? 'w-8 bg-accent-500' 
                    : 'bg-gray-500 hover:bg-gray-400'}`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Slide Counter */}
      <div className="fixed top-8 right-8 z-30">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-effect px-4 py-2 rounded-full"
        >
          <span className="text-accent-500 font-bold">{currentSlide + 1}</span>
          <span className="text-gray-400"> / {totalSlides}</span>
        </motion.div>
      </div>

      {/* Menu Toggle */}
      <div className="fixed top-8 left-8 z-30">
        <motion.button
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setMenuOpen(!menuOpen)}
          className="glass-effect p-3 rounded-full hover:bg-white/10 transition-colors"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Slide Menu */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: menuOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-80 glass-effect z-20 p-8 pt-24 overflow-y-auto"
      >
        <h3 className="text-xl font-bold mb-6 gradient-text">Navegação</h3>
        <div className="space-y-2">
          {slideNames.map((name, index) => (
            <button
              key={index}
              onClick={() => {
                onNavigate(index);
                setMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all 
                ${currentSlide === index 
                  ? 'bg-accent-500/20 text-accent-500 font-semibold' 
                  : 'hover:bg-white/10 text-gray-300'}`}
            >
              <span className="text-sm opacity-50 mr-2">{index + 1}.</span>
              {name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Keyboard Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-8 right-8 text-xs text-gray-500 hidden md:block"
      >
        Use ← → ou Space para navegar
      </motion.div>
    </>
  );
};