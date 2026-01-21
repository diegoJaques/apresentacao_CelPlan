import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeToggle } from '../ThemeToggle';
import { ExportManagerV2 } from './ExportManagerV2';
import { presentationStore, type PresentationData, type Slide } from '../../lib/presentationStore';
import { getCurrentPresentationData } from '../../lib/presentationDataMigration';
import { DynamicSlideRenderer } from './DynamicSlideRenderer';

// Import dos slides originais como fallback
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

// Mapeamento dos slides originais para fallback
const originalSlides = [
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

export const PresentationAppV3Dynamic = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [presentationData, setPresentationData] = useState<PresentationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useDynamicData, setUseDynamicData] = useState(true);

  // Carrega dados da apresentação
  useEffect(() => {
    loadPresentationData();
  }, []);

  const loadPresentationData = async () => {
    setIsLoading(true);
    try {
      let data = await presentationStore.getPresentation();

      // Se não houver dados salvos, usa os dados migrados
      if (!data || data.slides.length === 0 || data.id === 'default') {
        console.log('Carregando dados padrão migrados...');
        data = getCurrentPresentationData();
        await presentationStore.savePresentation(data);
      }

      setPresentationData(data);
      setUseDynamicData(true);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setUseDynamicData(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtra apenas slides visíveis
  const visibleSlides = presentationData?.slides.filter(s => s.isVisible) || [];
  const slideNames = visibleSlides.map(s => s.name);

  // Função para obter o componente do slide
  const getSlideComponent = (index: number) => {
    if (!useDynamicData || !visibleSlides[index]) {
      // Fallback para slides originais
      return originalSlides[index] || (() => <div>Slide não encontrado</div>);
    }

    // Usa o renderizador dinâmico para slides com dados
    const slideData = visibleSlides[index];

    // Para slides que usam Swiper (Pillars e Services), ainda usa os originais
    // pois eles têm animações 3D complexas
    const swiperSlides = ['slide_pillars', 'slide_services'];
    if (swiperSlides.includes(slideData.id)) {
      // Mapeia para o índice correto do slide original
      if (slideData.id === 'slide_pillars') return PillarsSlideV3;
      if (slideData.id === 'slide_services') return ServicesSlideV3;
    }

    // Renderiza dinamicamente com os dados salvos
    return () => <DynamicSlideRenderer slideData={slideData} />;
  };

  const CurrentSlideComponent = getSlideComponent(currentSlide);

  const nextSlide = () => {
    if (currentSlide < visibleSlides.length - 1) {
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

  // Keyboard navigation
  useEffect(() => {
    if (!presentationData?.settings?.enableKeyboardNav) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
          nextSlide();
          break;
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'Home':
          goToSlide(0);
          break;
        case 'End':
          goToSlide(visibleSlides.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, visibleSlides.length, presentationData]);

  // Auto-play
  useEffect(() => {
    if (!presentationData?.settings?.autoPlay) return;

    const interval = setInterval(() => {
      if (currentSlide < visibleSlides.length - 1) {
        nextSlide();
      } else {
        goToSlide(0); // Loop back to first slide
      }
    }, presentationData.settings.autoPlayInterval || 5000);

    return () => clearInterval(interval);
  }, [currentSlide, presentationData, visibleSlides.length]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-slate-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando apresentação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Export Manager */}
      <ExportManagerV2
        slides={originalSlides}
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
            {currentSlide + 1} / {visibleSlides.length}
          </span>
        </motion.div>

        {/* Indicador de Dados Dinâmicos */}
        {useDynamicData && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="px-3 py-1 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/30"
            title="Usando dados dinâmicos do admin"
          >
            <span className="text-green-600 dark:text-green-400 font-medium text-xs">
              LIVE
            </span>
          </motion.div>
        )}
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
      {presentationData?.settings?.showNavigation !== false && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-full bg-slate-200/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-300 dark:border-white/10">
          {visibleSlides.map((_, index) => (
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
      )}

      {/* Navigation Arrows */}
      {presentationData?.settings?.showNavigation !== false && (
        <>
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

          {currentSlide < visibleSlides.length - 1 && (
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
        </>
      )}

      {/* Progress Bar */}
      {presentationData?.settings?.showProgress !== false && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-brand-400 to-primary-400"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentSlide + 1) / visibleSlides.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}

      {/* Botão de Reload para recarregar dados */}
      <button
        onClick={loadPresentationData}
        className="fixed bottom-8 right-8 z-50 w-10 h-10 rounded-full bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/30 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 group"
        title="Recarregar dados da apresentação"
      >
        <svg className="w-5 h-5 text-brand-600 dark:text-brand-400 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
};