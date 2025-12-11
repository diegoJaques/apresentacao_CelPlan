import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigation } from './Navigation';
import { PresentationTimer } from './PresentationTimer';
import { PresenterNotes } from './PresenterNotes';
import { FullscreenNotice } from './FullscreenNotice';
import { IntroSlide } from './slides/IntroSlide';
import { AboutSlide } from './slides/AboutSlide';
import { MarketsSlide } from './slides/MarketsSlide';
import { ProjectsSlide } from './slides/ProjectsSlide';
import { AIProductsSlide } from './slides/AIProductsSlide';
import { SerbomSlide } from './slides/SerbomSlide';
import { CellWirelessSlide } from './slides/CellWirelessSlide';
import { OportunidadesSlide } from './slides/OportunidadesSlide';
import { RAGSlide } from './slides/RAGSlide';
import { VisaoSlide } from './slides/VisaoSlide';
import { TrackingSlide } from './slides/TrackingSlide';
import { RumoSlide } from './slides/RumoSlide';
import { CelPhoneSlide } from './slides/CelPhoneSlide';
import { CelPlannerSlide } from './slides/CelPlannerSlide';
import { MOESlide } from './slides/MOESlide';
import { MethodologySlide } from './slides/MethodologySlide';
import { ContactSlide } from './slides/ContactSlide';
import { slidesConfig, getActiveSlides, presentationProfiles } from '../config/slideConfig';
import { ProfileSelector } from './ProfileSelector';

function PresentationApp() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [currentProfile, setCurrentProfile] = useState('Completa');
  const [activeSlideIds, setActiveSlideIds] = useState<string[]>(getActiveSlides('Completa'));

  // Mapeamento de componentes
  const slideComponents: { [key: string]: React.ComponentType } = {
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

  // Filtra slides ativos baseado na configuração
  const slides = slidesConfig
    .filter(config => activeSlideIds.includes(config.id))
    .map(config => ({
      component: slideComponents[config.component],
      name: config.name,
      id: config.id
    }));

  const slideNotes: { [key: string]: string } = {
    'intro': "Apresentação inicial da CelPlan.\n• Enfatizar os 32 anos de experiência\n• Destacar transformação de dados em inteligência\n• Mencionar presença global",
    'about': "Detalhes sobre a empresa.\n• Fundada em 1992\n• 150+ funcionários\n• Certificações ISO\n• Investimento em P&D",
    'markets': "Mercados de atuação.\n• Telecomunicações (5G/4G)\n• Smart Cities\n• Energia Inteligente\n• IA e Machine Learning",
    'projects': "Projetos de transformação digital.\n• ANPTrilhos/USTDA - Eficiência metro-ferroviária\n• EDP Vila Velha - Smart Grid LTE\n• Vale EFVM - Ferrovia 4.0",
    'cellwireless': "Case ANATEL - CellWireless SM.\n• ~40 unidades fornecidas\n• Monitoração 24/7 autônoma\n• Geolocalização TDOA\n• Enfatizar modernização do órgão regulador",
    'oportunidades': "Sistema Multiagentes em produção.\n• Em uso interno CelPlan e BlackBox\n• Análise inteligente de editais\n• Decisão GO/NO-GO automatizada\n• Redução de 75% no tempo de análise",
    'rag': "Plataforma RAG em produção.\n• Desenvolvida e em uso para clientes\n• 90% de redução no tempo de busca\n• Respostas 100% baseadas em documentos\n• Segurança e privacidade garantidas",
    'visao': "Sistema VISÃO - Parceria Tellus.\n• Em desenvolvimento\n• Deep Learning + OCR\n• Análise de produtividade\n• Conformidade de segurança\n• 6 tipos de EPIs detectados",
    'tracking': "Sistema de ReID para recuperação de placas.\n• MOSTRAR foto B (problema): Motoqueiro tampa placa = multa perdida\n• MOSTRAR foto A (solução): Sistema recupera placa de câmera anterior\n• Filtro espaço-temporal reduz busca de 15min para ~2min (900s → 108s)\n• GPU sob demanda (custo-eficiente, não 24/7)\n• Arquitetura robusta com fila SQS\n• Precisão: busca em 12 candidatos vs 10.000",
    'rumo': "GeoInsight Platform - Análise geotécnica automatizada.\n• MOSTRAR dashboard: Visão geral de projetos e sondagens processadas\n• MOSTRAR mapa de calor: Densidade espacial e análise de padrões\n• Workflow em 5 passos: Upload → Classificação → OCR → Parsing IA → Visualização GIS\n• IA Híbrida: Regex + Gemini LLM para máxima precisão\n• Score de confiança 0-100 (validação automática)\n• 3 tipos de sondagem: SP (vermelho), ST (amarelo), SM (verde)\n• PostGIS: Análise geoespacial avançada com interpolação\n• Elimina digitação manual + reduz erros + visualização espacial\n• Exportação múltipla: CSV, Excel, GeoJSON",
    'celphone': "CelPhone™ - Medição de QoE (Quality of Experience) em Campo.\n• MOSTRAR app no Google Play: Aplicativo disponível para Android\n• MOSTRAR coleta: Medição em campo com georreferenciamento\n• MOSTRAR infraestrutura: Servidor AWS processando dados em tempo real\n• Diferencial: Mede satisfação DIRETA do usuário (não via core da rede)\n• Aplicativo instalado no celular: avalia desempenho onde o usuário está\n• Georreferenciamento: cada medição com localização precisa\n• Heatmap de satisfação: visualização geográfica da qualidade percebida\n• Visibilidade completa: dados para usuário, regulador e operador\n• Analytics em tempo real: servidor recebe informações continuamente\n• Stack: Android/iOS App + AWS Cloud + Geolocalização + Heatmap Visualization",
    'celplanner': "CelPlanner™ - Ferramenta de Planejamento RF.\n• MOSTRAR interface: Visualização de mapas com análise de cobertura RF\n• MOSTRAR análise 3D: Predição de propagação com modelo de terreno\n• Diferencial: Planejamento RF automatizado com IA e visualização GIS\n• Clientes: Copel, Petrobras, Brisanet, CPFL, IEZ Telecom, EDP, ALGAR, CEMIG, Tropico\n• Tecnologias suportadas: WiFi, LTE, 5G, LoRa\n• Módulos: Ponto-Área, Ponto-Multi-Ponto, Ponto-a-Ponto\n• Cálculos: Link Budget, Interferência, Capacidade, Microondas\n• Visualização GIS nativa: Mapas interativos com múltiplas camadas\n• Modelos de propagação avançados: Análise RF precisa\n• Análise 3D de terreno: Consideração de obstáculos e topografia\n• Otimização inteligente: Posicionamento automático de sites\n• Stack: Python + QGIS + PostGIS + RF Models + PyQt + Network Optimization",
    'moe': "MOE - Mão de Obra Especializada para TIC.\n• Enfatizar 3 pilares principais: Redes & Infraestrutura, Gestão & Execução, TI/Dados/DevOps\n• Clientes de referência: Claro, TIM, Nokia, Huawei, SBA, Unifique\n• PILAR 1 (DNA): Engenharia de RF, CORE de rede, otimização, times QUAD\n• PILAR 2 (Garantia): PMO, mapeamento de processos, governança QA\n• PILAR 3 (Futuro): Data Science/BI, DevOps, arquitetos cloud/on-premise\n• Diferenciais: Expertise comprovada, equipes gerenciadas (não só alocação), resultados mensuráveis\n• Mais que alocação: entregamos gestão completa e know-how",
    'methodology': "Metodologia de trabalho.\n• Abordagem centrada em problemas\n• Desenvolvimento ágil\n• Arquitetura escalável",
    'contact': "Informações de contato.\n• Incentivar agendamento de reunião\n• Disponibilizar QR Code\n• Mencionar canais de comunicação"
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
    if (e.key === 'p' || e.key === 'P') {
      // Cicla entre os perfis de apresentação
      const profiles = presentationProfiles.map(p => p.name);
      const currentIndex = profiles.indexOf(currentProfile);
      const nextIndex = (currentIndex + 1) % profiles.length;
      const nextProfile = profiles[nextIndex];
      setCurrentProfile(nextProfile);
      setActiveSlideIds(getActiveSlides(nextProfile));
      setCurrentSlide(0); // Volta ao início ao mudar perfil
    }
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

      <ProfileSelector
        currentProfile={currentProfile}
        onProfileChange={(profile) => {
          setCurrentProfile(profile);
          setActiveSlideIds(getActiveSlides(profile));
          setCurrentSlide(0);
        }}
      />

      <Navigation
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onNavigate={handleNavigate}
        slides={slides}
      />

      {showTimer && <PresentationTimer />}
      {showNotes && slides[currentSlide] && (
        <PresenterNotes
          slideNotes={slideNotes}
          currentSlide={slides[currentSlide].id}
        />
      )}

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

export default PresentationApp;
