import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeToggle } from '../ThemeToggle';
import { ExportManagerV2 } from './ExportManagerV2';
import { presentationStore, type PresentationData } from '../../lib/presentationStore';
import { presentationsApi } from '../../lib/api';
import { InlineEditProvider } from '../../contexts/InlineEditContext';
import { EditModeControls } from '../EditModeControls';
import { FixCasesSlide } from './FixCasesSlide';

// Import TODOS os slides originais - vamos usar eles!
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
  CasesSlideV3Backend as CasesSlideV3,  // Usando versão com backend
  ContactSlideV3
} from './slides';

// Slides originais em ordem
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
  CasesSlideV3,
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
  'Cases de Sucesso',
  'Contato'
];

export const PresentationAppV3Hybrid = () => {
  const { presentationId } = useParams<{ presentationId?: string }>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [presentationData, setPresentationData] = useState<PresentationData | null>(null);
  const [visibleSlidesIndexes, setVisibleSlidesIndexes] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublicView, setIsPublicView] = useState(false);

  // Carrega dados apenas para controle de visibilidade
  useEffect(() => {
    loadPresentationData();
  }, [presentationId]);

  const loadPresentationData = async () => {
    try {
      setIsLoading(true);

      // Se houver presentationId na URL, busca do backend (visualização pública)
      if (presentationId) {
        console.log('🌐 Visualização pública:', presentationId);
        setIsPublicView(true);

        try {
          const response = await presentationsApi.get(presentationId);

          if (response.success && response.presentation) {
            // TODO: Processar dados do backend e mapear para formato do presentation
            console.log('✅ Apresentação carregada do backend:', response.presentation);

            // Por enquanto, mostra todos os slides
            setVisibleSlidesIndexes([...Array(13).keys()]);
            // setPresentationData() - implementar mapeamento
          } else {
            console.warn('Apresentação não encontrada');
            setVisibleSlidesIndexes([...Array(13).keys()]);
          }
        } catch (error) {
          console.error('❌ Erro ao carregar apresentação do backend:', error);
          setVisibleSlidesIndexes([...Array(13).keys()]);
        }
      } else {
        // Comportamento original: carrega do localStorage
        console.log('📱 Visualização local (localStorage)');
        setIsPublicView(false);

        const data = await presentationStore.getPresentation();

      if (data && data.slides.length > 0) {
        // Usa dados salvos apenas para controlar quais slides estão visíveis
        const visibleIndexes = data.slides
          .filter(s => s.isVisible)
          .map(s => {
            // Mapeia o ID do slide para o índice original
            const index = slideNames.findIndex(name => s.name === name);
            return index !== -1 ? index : null;
          })
          .filter(idx => idx !== null) as number[];

        setVisibleSlidesIndexes(visibleIndexes.length > 0 ? visibleIndexes : [...Array(13).keys()]);
        setPresentationData(data);
      } else {
        // Se não houver dados, mostra todos os slides (13 slides total)
        setVisibleSlidesIndexes([...Array(13).keys()]);
      }
    }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Em caso de erro, mostra todos os slides (13 slides total)
      setVisibleSlidesIndexes([...Array(13).keys()]);
    } finally {
      setIsLoading(false);
    }
  };

  // Pega o componente do slide baseado no índice visível
  const getCurrentSlideComponent = () => {
    const actualIndex = visibleSlidesIndexes[currentSlide];
    if (actualIndex !== undefined && originalSlides[actualIndex]) {
      return originalSlides[actualIndex];
    }
    return () => <div className="flex items-center justify-center h-screen">Slide não encontrado</div>;
  };

  const CurrentSlideComponent = getCurrentSlideComponent();

  const nextSlide = () => {
    if (currentSlide < visibleSlidesIndexes.length - 1) {
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
          goToSlide(visibleSlidesIndexes.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, visibleSlidesIndexes.length]);

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

  // Pega os nomes dos slides visíveis
  const visibleSlideNames = visibleSlidesIndexes.map(idx => slideNames[idx] || `Slide ${idx + 1}`);

  return (
    <InlineEditProvider>
      <div className="relative w-full h-screen overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Correção temporária do slide de Cases - DESABILITADO */}
      {/* <FixCasesSlide /> */}

      {/* Export Manager - DESABILITADO */}
      {/* <ExportManagerV2
        slides={originalSlides}
        slideNames={slideNames}
        currentSlide={currentSlide}
        goToSlide={goToSlide}
      /> */}

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
            {currentSlide + 1} / {visibleSlidesIndexes.length}
          </span>
        </motion.div>

        {/* Indicador de slides editáveis */}
        {presentationData && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-500/30"
            title="Controle de visibilidade ativo"
          >
            <span className="text-blue-600 dark:text-blue-400 font-medium text-xs">
              EDITÁVEL
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
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-full bg-slate-200/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-300 dark:border-white/10">
        {visibleSlidesIndexes.map((_, index) => (
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
              {visibleSlideNames[index]}
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

      {currentSlide < visibleSlidesIndexes.length - 1 && (
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
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-brand-400 to-primary-400"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentSlide + 1) / visibleSlidesIndexes.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Botão de Reload para recarregar visibilidade */}
      <button
        onClick={loadPresentationData}
        className="fixed bottom-8 right-8 z-50 w-10 h-10 rounded-full bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/30 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 group"
        title="Recarregar configurações de visibilidade"
      >
        <svg className="w-5 h-5 text-brand-600 dark:text-brand-400 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>

      {/* Edit Mode Controls - DESABILITADO */}
      {/* <EditModeControls /> */}
    </div>
    </InlineEditProvider>
  );
};