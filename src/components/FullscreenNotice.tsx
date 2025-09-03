import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize } from 'lucide-react';

export const FullscreenNotice = () => {
  const [showNotice, setShowNotice] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const checkFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', checkFullscreen);
    checkFullscreen();

    // Auto-hide notice after 8 seconds
    const timer = setTimeout(() => {
      setShowNotice(false);
    }, 8000);

    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
      clearTimeout(timer);
    };
  }, []);

  // Hide if already in fullscreen
  if (isFullscreen) return null;

  return (
    <AnimatePresence>
      {showNotice && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <motion.div
            className="glass-effect px-6 py-4 rounded-xl shadow-xl"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          >
            <div className="flex items-center gap-3">
              <Maximize className="w-5 h-5 text-accent-500" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Melhor experiência em tela cheia
                </p>
                <p className="text-xs text-neutral-300">
                  Pressione <kbd className="px-2 py-1 bg-white/10 rounded text-accent-500 font-bold">F11</kbd> para entrar em tela cheia
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};