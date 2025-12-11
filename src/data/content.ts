export const companyInfo = {
  name: "CelPlan",
  tagline: "Global Technology Solutions",
  subtitle: "32 Anos de Inovação e Excelência Tecnológica",
  founded: 1992,
  employees: "150+",
  headquarters: "Delaware, EUA",
  subsidiaries: ["CelPlan Technologies, Inc. (EUA)", "CelPlan Brasil"],
  investment: "Mais de 2 milhões em P&D por ano",
  globalReach: "Projetos em todos os continentes",
  description: "Líder mundial em soluções tecnológicas avançadas, transformando desafios complexos em oportunidades de crescimento através de inovação contínua e expertise técnica de classe mundial.",
  valueProposition: "Acelere sua transformação digital com soluções personalizadas que combinam décadas de experiência com as mais avançadas tecnologias de IA e telecomunicações."
};

export const certifications = [
  { name: "ISO 9001", description: "Todas as empresas CelPlan" },
  { name: "ISO 45001", description: "CelPlan Chile" },
  { name: "ANATEL", description: "Certificação regulatória Brasil" },
  { name: "FCC", description: "Federal Communications Commission (EUA)" }
];

export const markets = [
  { 
    title: "Telecomunicações",
    icon: "📡",
    description: "Redes 4G/5G públicas e privadas",
    technologies: ["4G", "5G", "Narrowband", "RF/Spectrum"]
  },
  {
    title: "Smart Cities",
    icon: "🏙️",
    description: "ICT, Transporte, Vigilância e Logística",
    technologies: ["IoT", "IA", "Big Data", "Cloud"]
  },
  {
    title: "Energia Inteligente",
    icon: "⚡",
    description: "Smart Grid, AMI, ADMS",
    technologies: ["Smart Grid", "AMI", "ADMS", "Automação"]
  },
  {
    title: "Inteligência Artificial",
    icon: "🤖",
    description: "Soluções de IA e Machine Learning",
    technologies: ["NLP", "Visão Computacional", "RAG", "LLM"]
  }
];

export const products = {
  wireless: [
    {
      name: "CellDesigner™",
      description: "Suite completa de ferramentas de planejamento RF",
      features: ["Propagação 3D", "Otimização automática", "Simulação de tráfego"]
    },
    {
      name: "CellExperience™",
      description: "Ferramenta preditiva de experiência do cliente",
      features: ["Análise de satisfação", "Predição de gargalos", "Otimização CAPEX"]
    },
    {
      name: "CellPhone™",
      description: "Solução crowd-sourcing para avaliação de UX",
      features: ["Medição direta do usuário", "Mapeamento geográfico", "Rating de sessões"]
    }
  ],
  ai: [
    {
      name: "Organização Inteligente de Dados",
      universe: "generative",
      description: "Seus dados estão espalhados, desorganizados - PDFs, planilhas, e-mails, vídeos, áudios - impossível de analisar",
      solution: "Transformamos dados estruturados e não estruturados em conhecimento que a IA consegue processar",
      benefit: "Todos os dados conectados e consultáveis instantaneamente",
      features: ["Múltiplos formatos", "Processamento inteligente", "Busca semântica"],
      technologies: ["React", "N8N", "Pinecone", "LLM"]
    },
    {
      name: "Sistema de Transcrição Inteligente",
      universe: "generative", 
      description: "Horas desperdiçadas transcrevendo reuniões, vídeos e áudios manualmente",
      solution: "3 horas de vídeo processadas em apenas 5 minutos com 95% de precisão",
      benefit: "36x mais rápido + múltiplos idiomas + insights automáticos",
      features: ["Precisão superior a 95%", "Múltiplos idiomas simultâneos", "Insights automáticos"],
      technologies: ["Python", "FastAPI", "Whisper", "Gemini"]
    },
    {
      name: "Análise Visual Inteligente",
      universe: "vision",
      description: "Impossível monitorar e analisar tudo que acontece visualmente na sua operação",
      solution: "IA que enxerga, identifica, conta, monitora e alerta sobre qualquer coisa em imagens e vídeos",
      benefit: "Monitoramento 24/7 + detecção instantânea de anomalias + análise temporal inteligente",
      features: ["Monitoramento contínuo", "Detecção de anomalias", "Análise comportamental"],
      technologies: ["Python", "OpenCV", "YOLOv8", "Docker"]
    },
    {
      name: "Plataforma de Multiagentes",
      universe: "automation",
      description: "Equipe desperdiça tempo em tarefas repetitivas que IA poderia fazer melhor",
      solution: "Múltiplos agentes especializados trabalhando 24/7 sem parar",
      benefit: "98% menos tempo operacional + operação que nunca dorme",
      features: ["Agentes especializados", "Trabalho 24/7", "Automação completa"],
      technologies: ["React", "TypeScript", "Supabase", "OpenAI"]
    }
  ]
};

export const methodology = {
  title: "Metodologia Colaborativa que Garante RoI",
  subtitle: "A única metodologia que educa antes de implementar",
  recentCase: {
    title: "Mais Recente: Treinamento Setor Energia",
    date: "Maio 2025 - SENDI",
    description: "Capacitação especializada para empresas do setor energia",
    image: "/images/treinamento-sendi.png"
  },
  pillars: [
    {
      title: "Capacitação Especializada",
      description: "Treinamos funcionários do cliente sobre IA, casos de sucesso e oportunidades para identificar onde IA pode gerar maior impacto",
      icon: "graduation"
    },
    {
      title: "Análise Consultiva a 4 Mãos", 
      description: "Cliente + CelPlan juntos mapeando dores, urgências e ROI potencial através de workshops colaborativos",
      icon: "handshake"
    },
    {
      title: "Desenvolvimento Centrado em Problemas",
      description: "Soluções nascidas de problemas reais identificados em conjunto, com desenvolvimento ágil e feedback contínuo",
      icon: "target"
    },
    {
      title: "Escalabilidade e Evolução Contínua",
      description: "Arquitetura em microserviços preparada para crescimento com ciclo contínuo de capacitação e melhorias",
      icon: "refresh"
    }
  ],
  valueProposition: "Não vendemos soluções prontas. Educamos, analisamos juntos e construímos IA que realmente transforma seu negócio."
};

export const achievements = [
  {
    year: 2024,
    title: "Projeto LLM ANATEL",
    description: "Desenvolvimento de LLM temático para marco regulatório"
  },
  {
    year: 2024,
    title: "20 Most Promising Tech Solutions",
    description: "Reconhecimento pelo CIO Review para indústria Telecom"
  },
  {
    year: 2023,
    title: "Golden Cooperation Award",
    description: "Prêmio de cooperação internacional - Brasil"
  }
];

export const futureVision = {
  title: "Visão de Futuro",
  areas: [
    {
      title: "Visão Computacional Avançada",
      items: [
        "Detecção de garimpo via satélite",
        "Manutenção preditiva de infraestrutura",
        "Análise automática de conformidade"
      ]
    },
    {
      title: "IA Generativa Segura",
      items: [
        "Proteção LGPD com tokenização",
        "Análise de dados sensíveis",
        "Geração de conteúdo corporativo"
      ]
    },
    {
      title: "Digital Twin",
      items: [
        "Modelagem de redes complexas",
        "Simulação de cenários",
        "Otimização em tempo real"
      ]
    }
  ]
};

export const contactInfo = {
  website: "www.celplan.com",
  email: "diego.jaques@celplan.com.br",
  phone: "+55 19 98376-0039",
  corporatePhone: "+55 61 3039-9500",
  address: {
    brazil: "Campinas - SP, Brasil",
    usa: "1920 Association Dr, Reston, VA 20191, USA"
  },
  social: {
    linkedin: "celplan-international",
    github: "celplan"
  },
  presenter: {
    name: "Diego Jaques",
    title: "Especialista em IA e Transformação Digital",
    email: "diego.jaques@celplan.com.br",
    phone: "+55 19 98376-0039"
  }
};