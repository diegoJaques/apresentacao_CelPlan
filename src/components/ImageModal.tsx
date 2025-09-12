import { motion, AnimatePresence } from 'framer-motion';
import { X, Expand } from 'lucide-react';
import { useEffect } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  title?: string;
}

export const ImageModal = ({ isOpen, onClose, imageSrc, imageAlt, title }: ImageModalProps) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative max-w-6xl w-full pointer-events-auto">
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ delay: 0.1 }}
                onClick={onClose}
                className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 
                         hover:bg-white/20 transition-colors group"
              >
                <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
              </motion.button>

              {/* Image Container */}
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-effect p-4 rounded-xl"
              >
                {title && (
                  <div className="mb-3 pb-3 border-b border-neutral-700">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                  </div>
                )}
                
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="w-full h-auto max-h-[75vh] object-contain rounded-lg"
                />
                
                {imageAlt && (
                  <div className="mt-3 pt-3 border-t border-neutral-700">
                    <p className="text-sm text-neutral-300 text-center">{imageAlt}</p>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Component for clickable images with hover effects
interface ClickableImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  onClick: () => void;
}

export const ClickableImage = ({ src, alt, title, className = "", onClick }: ClickableImageProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className={`${className} transition-all duration-300 group-hover:brightness-110`}
      />
      
      {/* Hover Overlay with Expand Icon */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-black/40 rounded flex items-center justify-center
                   pointer-events-none"
      >
        <motion.div
          initial={{ scale: 0 }}
          whileHover={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="bg-white/20 backdrop-blur-sm p-3 rounded-full"
        >
          <Expand className="w-6 h-6 text-white" />
        </motion.div>
      </motion.div>
      
      {title && (
        <p className="text-xs text-neutral-400 text-center mt-1">{title}</p>
      )}
    </motion.div>
  );
};