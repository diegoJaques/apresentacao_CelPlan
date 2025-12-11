export interface SlideConfig {
  id: string;
  name: string;
  component: string;
  enabled: boolean;
  category: 'core' | 'cases' | 'technical';
  tags: string[];
}

export interface PresentationProfile {
  name: string;
  description: string;
  enabledSlides: string[];
}

// Configuração de todos os slides disponíveis
export const slidesConfig: SlideConfig[] = [
  {
    id: 'intro',
    name: 'Introdução',
    component: 'IntroSlide',
    enabled: true,
    category: 'core',
    tags: ['intro', 'all']
  },
  {
    id: 'about',
    name: 'Sobre a CelPlan',
    component: 'AboutSlide',
    enabled: true,
    category: 'core',
    tags: ['company', 'all']
  },
  {
    id: 'markets',
    name: 'Mercados',
    component: 'MarketsSlide',
    enabled: true,
    category: 'core',
    tags: ['markets', 'all']
  },
  {
    id: 'projects',
    name: 'Projetos',
    component: 'ProjectsSlide',
    enabled: true,
    category: 'core',
    tags: ['projects', 'telecom', 'energy']
  },
  {
    id: 'ai-products',
    name: 'Soluções de IA',
    component: 'AIProductsSlide',
    enabled: false,
    category: 'technical',
    tags: ['ai', 'products', 'all']
  },
  {
    id: 'celplanner',
    name: 'CelPlanner™ - RF Planning',
    component: 'CelPlannerSlide',
    enabled: true,
    category: 'cases',
    tags: ['case', 'telecom', 'rf', 'planning', 'gis']
  },
  {
    id: 'serbom',
    name: 'SERBOM - pLTE',
    component: 'SerbomSlide',
    enabled: true,
    category: 'cases',
    tags: ['case', 'telecom', 'plte', 'try-buy']
  },
  {
    id: 'cellwireless',
    name: 'Case ANATEL',
    component: 'CellWirelessSlide',
    enabled: true,
    category: 'cases',
    tags: ['case', 'telecom', 'anatel']
  },
  {
    id: 'oportunidades',
    name: 'Sistema Multiagentes',
    component: 'OportunidadesSlide',
    enabled: true,
    category: 'cases',
    tags: ['case', 'ai', 'multiagent']
  },
  {
    id: 'rag',
    name: 'Plataforma RAG',
    component: 'RAGSlide',
    enabled: true,
    category: 'cases',
    tags: ['case', 'ai', 'rag']
  },
  {
    id: 'visao',
    name: 'VISÃO - Segurança',
    component: 'VisaoSlide',
    enabled: true,
    category: 'cases',
    tags: ['case', 'ai', 'vision', 'safety']
  },
  {
    id: 'tracking',
    name: 'Busca Forense - ReID',
    component: 'TrackingSlide',
    enabled: true,
    category: 'cases',
    tags: ['case', 'ai', 'vision', 'tracking', 'reid', 'transit']
  },
  {
    id: 'rumo',
    name: 'Rumo - GeoInsight',
    component: 'RumoSlide',
    enabled: true,
    category: 'cases',
    tags: ['case', 'ai', 'gis', 'ocr', 'infrastructure']
  },
  {
    id: 'celphone',
    name: 'CelPhone™ - QoE',
    component: 'CelPhoneSlide',
    enabled: true,
    category: 'cases',
    tags: ['case', 'telecom', 'qoe', 'monitoring', 'mobile']
  },
  {
    id: 'moe',
    name: 'MOE - Expertise TIC',
    component: 'MOESlide',
    enabled: true,
    category: 'core',
    tags: ['moe', 'services', 'telecom', 'all']
  },
  {
    id: 'methodology',
    name: 'Metodologia',
    component: 'MethodologySlide',
    enabled: true,
    category: 'core',
    tags: ['methodology', 'all']
  },
  {
    id: 'contact',
    name: 'Contato',
    component: 'ContactSlide',
    enabled: true,
    category: 'core',
    tags: ['contact', 'all']
  }
];

// Perfis de apresentação predefinidos
export const presentationProfiles: PresentationProfile[] = [
  {
    name: 'Completa',
    description: 'Apresentação completa com todos os slides',
    enabledSlides: ['intro', 'about', 'markets', 'projects',
                   'celplanner', 'serbom', 'cellwireless', 'oportunidades', 'rag', 'visao', 'tracking', 'rumo', 'celphone',
                   'moe', 'methodology', 'contact']
  },
  {
    name: 'Telecomunicações',
    description: 'Foco em projetos e cases de telecom',
    enabledSlides: ['intro', 'about', 'markets', 'projects',
                   'celplanner', 'serbom', 'cellwireless', 'celphone', 'moe', 'methodology', 'contact']
  },
  {
    name: 'Inteligência Artificial',
    description: 'Foco em soluções de IA',
    enabledSlides: ['intro', 'about', 'oportunidades',
                   'rag', 'visao', 'tracking', 'rumo', 'methodology', 'contact']
  },
  {
    name: 'Energia',
    description: 'Foco em projetos de energia e segurança',
    enabledSlides: ['intro', 'about', 'markets', 'projects', 'visao', 
                   'methodology', 'contact']
  },
  {
    name: 'Executiva',
    description: 'Versão resumida para apresentações executivas',
    enabledSlides: ['intro', 'about', 'markets', 'contact']
  }
];

// Função para obter slides ativos baseado no perfil
export const getActiveSlides = (profileName: string): string[] => {
  const profile = presentationProfiles.find(p => p.name === profileName);
  if (!profile) {
    // Retorna todos os slides habilitados por padrão
    return slidesConfig.filter(s => s.enabled).map(s => s.id);
  }
  return profile.enabledSlides;
};

// Função para alternar visibilidade de um slide
export const toggleSlide = (slideId: string, configs: SlideConfig[]): SlideConfig[] => {
  return configs.map(slide => 
    slide.id === slideId 
      ? { ...slide, enabled: !slide.enabled }
      : slide
  );
};

// Função para aplicar um perfil
export const applyProfile = (profileName: string, configs: SlideConfig[]): SlideConfig[] => {
  const profile = presentationProfiles.find(p => p.name === profileName);
  if (!profile) return configs;
  
  return configs.map(slide => ({
    ...slide,
    enabled: profile.enabledSlides.includes(slide.id)
  }));
};