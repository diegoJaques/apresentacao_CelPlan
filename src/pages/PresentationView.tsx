import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigation } from '../components/Navigation';
import { FullscreenNotice } from '../components/FullscreenNotice';
import { IntroSlide } from '../components/slides/IntroSlide';
import { AboutSlide } from '../components/slides/AboutSlide';
import { MarketsSlide } from '../components/slides/MarketsSlide';
import { ProjectsSlide } from '../components/slides/ProjectsSlide';
import { AIProductsSlide } from '../components/slides/AIProductsSlide';
import { SerbomSlide } from '../components/slides/SerbomSlide';
import { CellWirelessSlide } from '../components/slides/CellWirelessSlide';
import { OportunidadesSlide } from '../components/slides/OportunidadesSlide';
import { RAGSlide } from '../components/slides/RAGSlide';
import { VisaoSlide } from '../components/slides/VisaoSlide';
import { TrackingSlide } from '../components/slides/TrackingSlide';
import { RumoSlide } from '../components/slides/RumoSlide';
import { CelPhoneSlide } from '../components/slides/CelPhoneSlide';
import { CelPlannerSlide } from '../components/slides/CelPlannerSlide';
import { MOESlide } from '../components/slides/MOESlide';
import { MethodologySlide } from '../components/slides/MethodologySlide';
import { ContactSlide } from '../components/slides/ContactSlide';
import { slidesConfig } from '../config/slideConfig';
import { presentationService } from '../services/api';
import type { VendorInfo } from '../types/api';

export default function PresentationView() {
  const { id } = useParams<{ id: string }>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [vendorInfo, setVendorInfo] = useState<VendorInfo | null>(null);
  const [activeSlideIds, setActiveSlideIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Verificar se cliente está validado
  const isValidated = sessionStorage.getItem('client_validated') === 'true';
  const sessionPresentationId = sessionStorage.getItem('presentation_id');

  // Mapeamento de componentes (todos disponíveis)
  const slideComponents: { [key: string]: React.ComponentType<any> } = {
    IntroSlide,
    AboutSlide,
    MarketsSlide,
    ProjectsSlide,
    AIProductsSlide,
    SerbomSlide,
    CellWirelessSlide,
    OportunidadesSlide,
    RAGSlide,
    VisaoSlide,
    TrackingSlide,
    RumoSlide,
    CelPhoneSlide,
    CelPlannerSlide,
    MOESlide,
    MethodologySlide,
    ContactSlide
  };

  // Carregar dados da apresentação
  useEffect(() => {
    const loadPresentation = async () => {
      if (!id) {
        setError('ID de apresentação inválido');
        setIsLoading(false);
        return;
      }

      try {
        const data = await presentationService.getById(id);
        setVendorInfo(data.vendorInfo);
        setActiveSlideIds(data.selectedSlides);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Apresentação não encontrada');
        setIsLoading(false);
      }
    };

    loadPresentation();
  }, [id]);

  // Redirecionar se não validado ou ID não corresponde
  if (!isValidated || sessionPresentationId !== id) {
    return <Navigate to={`/apresentacao/${id}`} replace />;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando apresentação...</div>
      </div>
    );
  }

  // Error state
  if (error || !vendorInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4">
        <div className="glass-effect rounded-2xl p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-300 mb-4">Erro</h1>
          <p className="text-slate-300">{error || 'Não foi possível carregar a apresentação'}</p>
        </div>
      </div>
    );
  }

  // Filtra slides ativos baseado na configuração customizada
  const slides = slidesConfig
    .filter(config => activeSlideIds.includes(config.id))
    .map(config => ({
      component: slideComponents[config.component],
      name: config.name,
      id: config.id
    }));

  const handleKeyPress = (e: KeyboardEvent) => {
    // Apenas navegação básica para clientes
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight' || e.key === ' ') handleNext();
    if (e.key === 'f' || e.key === 'F') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const handlePrevious = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  const CurrentSlideComponent = slides[currentSlide]?.component;
  const isContactSlide = slides[currentSlide]?.id === 'contact';

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Conteúdo dos slides */}
      <div className="relative z-10 h-screen flex items-center justify-center p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full max-w-7xl mx-auto"
          >
            {CurrentSlideComponent && (
              isContactSlide && vendorInfo ? (
                <ContactSlide vendorInfo={vendorInfo} />
              ) : (
                <CurrentSlideComponent />
              )
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navegação */}
      <Navigation
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onNavigate={setCurrentSlide}
        slides={slides}
        isReadOnly={true}
      />

      {/* Aviso de fullscreen no primeiro slide */}
      {currentSlide === 0 && <FullscreenNotice />}
    </div>
  );
}
