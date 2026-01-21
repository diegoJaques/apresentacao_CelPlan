import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  IntroSlideV3,
  AboutSlideV3,
  IntellectualCapitalSlideV3,
  ChallengesSlideV3,
  ValuePropositionSlideV3,
  PillarsSlideV3,
  ConnectivitySlideV3,
  AIDataSlideV3,
  IoTSlideV3,
  VisionSlideV3,
  ServicesSlideV3,
  ContactSlideV3
} from './slides';
import { ThemeToggle } from '../ThemeToggle';
import { ExportManagerV2 } from './ExportManagerV2';

export const PresentationAppV3 = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides = [
    IntroSlideV3,
    AboutSlideV3,
    IntellectualCapitalSlideV3,
    ChallengesSlideV3,
    ValuePropositionSlideV3,
    PillarsSlideV3,
    ConnectivitySlideV3,
    AIDataSlideV3,
    IoTSlideV3,
    VisionSlideV3,
    ServicesSlideV3,
    ContactSlideV3
  ];

  const slideNames = [
    'Capa',
    'Quem Somos',
    'Capital Intelectual',
    'Desafios',
    'Proposta de Valor',
    '7 Pilares',
    'Conectividade',
    'IA e Dados',
    'IoT Low Power',
    'Video Analytics',
    'Serviços',
    'Contato'
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    if (index !== currentSlide) {
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(slides.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const CurrentSlideComponent = slides[currentSlide];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Export Manager */}
      <ExportManagerV2
        slides={slides}
        slideNames={slideNames}
        currentSlide={currentSlide}
        goToSlide={goToSlide}
      />

      {/* Theme Toggle e Slide Counter */}
      <div className="fixed top-8 right-8 z-50 flex items-center gap-3">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ThemeToggle />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="px-4 py-2 rounded-full bg-brand-500/20 backdrop-blur-sm border border-brand-500/30"
        >
          <span className="text-brand-600 dark:text-brand-300 font-semibold text-sm">
            {currentSlide + 1} / {slides.length}
          </span>
        </motion.div>
      </div>

      {/* Slide Content */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0 slide-container"
        >
          <CurrentSlideComponent />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-full bg-slate-200/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-300 dark:border-white/10">
        {slides.map((_, index) => (
          <button
            key={index}
            data-slide-index={index}
            onClick={() => goToSlide(index)}
            className="group relative"
            aria-label={`Ir para slide ${index + 1}`}
          >
            <div
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${currentSlide === index
                  ? 'w-8 bg-brand-500'
                  : 'bg-neutral-400 dark:bg-neutral-500 hover:bg-brand-400'
                }
              `}
            />

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 rounded-lg bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {slideNames[index]}
            </div>
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      {currentSlide > 0 && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onClick={prevSlide}
          className="fixed left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-brand-500/20 hover:bg-brand-500/40 border border-brand-500/30 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 group"
          aria-label="Slide anterior"
        >
          <svg className="w-6 h-6 text-slate-700 dark:text-white group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      )}

      {currentSlide < slides.length - 1 && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          onClick={nextSlide}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-brand-500/20 hover:bg-brand-500/40 border border-brand-500/30 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 group"
          aria-label="Próximo slide"
        >
          <svg className="w-6 h-6 text-slate-700 dark:text-white group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      )}

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-300 dark:bg-slate-800/50 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-500 via-primary-500 to-brand-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: (currentSlide + 1) / slides.length }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: 'left' }}
        />
      </div>

      {/* Keyboard Shortcuts Hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-lg bg-slate-200/80 dark:bg-slate-800/30 backdrop-blur-sm text-neutral-600 dark:text-neutral-400 text-xs"
      >
        Use <kbd className="px-2 py-1 rounded bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-neutral-300">←</kbd>{' '}
        <kbd className="px-2 py-1 rounded bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-neutral-300">→</kbd>{' '}
        ou <kbd className="px-2 py-1 rounded bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-neutral-300">Espaço</kbd> para navegar
      </motion.div>
    </div>
  );
};
