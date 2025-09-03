import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigation } from './components/Navigation';
import { PresentationTimer } from './components/PresentationTimer';
import { PresenterNotes } from './components/PresenterNotes';
import { FullscreenNotice } from './components/FullscreenNotice';
import { IntroSlide } from './components/slides/IntroSlide';
import { AboutSlide } from './components/slides/AboutSlide';
import { MarketsSlide } from './components/slides/MarketsSlide';
import { ProjectsSlide } from './components/slides/ProjectsSlide';
import { AIProductsSlide } from './components/slides/AIProductsSlide';
import { MethodologySlide } from './components/slides/MethodologySlide';
import { ContactSlide } from './components/slides/ContactSlide';

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const slides = [
    { component: IntroSlide, name: 'Introdução' },
    { component: AboutSlide, name: 'Sobre a CelPlan' },
    { component: MarketsSlide, name: 'Mercados' },
    { component: ProjectsSlide, name: 'Projetos' },
    { component: AIProductsSlide, name: 'Soluções de IA' },
    { component: MethodologySlide, name: 'Metodologia' },
    { component: ContactSlide, name: 'Contato' },
  ];

  const slideNotes = {
    0: "Apresentação inicial da CelPlan.\n• Enfatizar os 32 anos de experiência\n• Destacar transformação de dados em inteligência\n• Mencionar presença global",
    1: "Detalhes sobre a empresa.\n• Fundada em 1992\n• 150+ funcionários\n• Certificações ISO\n• Investimento em P&D",
    2: "Mercados de atuação.\n• Telecomunicações (5G/4G)\n• Smart Cities\n• Energia Inteligente\n• IA e Machine Learning",
    3: "Projetos de transformação digital.\n• ANPTrilhos/USTDA - Eficiência metro-ferroviária\n• EDP Vila Velha - Smart Grid LTE\n• Vale EFVM - Ferrovia 4.0",
    4: "Soluções de IA desenvolvidas.\n• Sistema de Captação\n• Portal RAG\n• Transcrição com IA\n• VISAO - Detecção de EPIs",
    5: "Metodologia de trabalho.\n• Abordagem centrada em problemas\n• Desenvolvimento ágil\n• Arquitetura escalável",
    6: "Informações de contato.\n• Incentivar agendamento de reunião\n• Disponibilizar QR Code\n• Mencionar canais de comunicação"
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight' || e.key === ' ') handleNext();
    if (e.key >= '1' && e.key <= '9') {
      const slideIndex = parseInt(e.key) - 1;
      if (slideIndex < slides.length) setCurrentSlide(slideIndex);
    }
    if (e.key === 'f' || e.key === 'F') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
    if (e.key === 't' || e.key === 'T') setShowTimer(!showTimer);
    if (e.key === 'n' || e.key === 'N') setShowNotes(!showNotes);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide, showTimer, showNotes]);

  const handlePrevious = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  };

  const handleNavigate = (index: number) => {
    setCurrentSlide(index);
  };

  const CurrentSlideComponent = slides[currentSlide].component;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CurrentSlideComponent />
        </motion.div>
      </AnimatePresence>

      <Navigation
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onNavigate={handleNavigate}
        slideNames={slides.map(s => s.name)}
      />

      {showTimer && <PresentationTimer />}
      {showNotes && <PresenterNotes slideNotes={slideNotes} currentSlide={currentSlide} />}
      
      {/* Fullscreen notice for first slide */}
      {currentSlide === 0 && <FullscreenNotice />}

      {/* Background Animation */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-transparent" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 -right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
}

export default App;
