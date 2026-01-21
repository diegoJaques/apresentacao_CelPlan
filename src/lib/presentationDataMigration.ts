// Migração dos dados atuais dos slides hardcoded para o novo sistema de armazenamento
import { type Slide, type PresentationData } from './presentationStore';

export const getCurrentPresentationData = (): PresentationData => {
  return {
    id: 'celplan_v3',
    title: 'CelPlan - Apresentação Corporativa V3',
    description: 'Tecnologia e Inovação em Telecomunicações',
    version: 1,
    theme: {
      primaryColor: '#7c3aed',
      secondaryColor: '#3b82f6',
      accentColor: '#f97316',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        small: '0.875rem',
        medium: '1rem',
        large: '1.5rem',
        xlarge: '3rem'
      }
    },
    slides: [
      // Slide 1 - Intro/Capa
      {
        id: 'slide_intro',
        name: 'Capa',
        template: 'cover',
        isVisible: true,
        order: 0,
        content: {
          id: 'content_intro',
          type: 'cover',
          title: 'CelPlan',
          subtitle: 'Transformando Conectividade em Resultados',
          description: 'Líder em soluções de rede sem fio e tecnologia 5G para operadoras globais',
          items: [],
          image: '/images/celplan-logo-light.png',
          backgroundColor: '',
          textColor: '',
          customCSS: '',
          components: []
        },
        animations: {
          entry: 'fadeIn',
          exit: 'fadeOut',
          duration: 500
        }
      },

      // Slide 2 - Quem Somos
      {
        id: 'slide_about',
        name: 'Quem Somos',
        template: 'grid',
        isVisible: true,
        order: 1,
        content: {
          id: 'content_about',
          type: 'grid',
          title: 'Quem Somos',
          subtitle: 'Uma Jornada de Inovação Global',
          description: '',
          items: [
            {
              icon: 'Building2',
              year: '1992',
              title: 'Fundada no Brasil',
              description: 'Hoje uma corporação de Delaware (EUA)',
              color: 'brand'
            },
            {
              icon: 'Users',
              value: '100%',
              title: 'Propriedade dos Funcionários',
              description: 'Empresa autofinanciada e independente',
              color: 'primary'
            },
            {
              icon: 'Globe',
              value: '30+',
              title: 'Anos de Experiência',
              description: 'Pioneiros em tecnologia wireless',
              color: 'accent'
            },
            {
              icon: 'Award',
              value: '500+',
              title: 'Projetos Entregues',
              description: 'Em mais de 40 países',
              color: 'brand'
            }
          ],
          backgroundColor: '',
          textColor: '',
          customCSS: '',
          components: []
        },
        animations: {
          entry: 'slideRight',
          exit: 'slideLeft',
          duration: 500
        }
      },

      // Slide 3 - Capital Intelectual
      {
        id: 'slide_intellectual',
        name: 'Capital Intelectual',
        template: 'stats',
        isVisible: true,
        order: 2,
        content: {
          id: 'content_intellectual',
          type: 'stats',
          title: 'Capital Intelectual',
          subtitle: 'Nossa Força está nas Pessoas',
          description: '',
          items: [
            {
              value: '85%',
              label: 'Engenheiros',
              description: 'Time altamente técnico',
              gradient: 'from-brand-400 to-brand-600'
            },
            {
              value: '22',
              label: 'PhDs',
              description: 'Doutores em tecnologia',
              gradient: 'from-primary-400 to-primary-600'
            },
            {
              value: '100+',
              label: 'Especialistas',
              description: 'Em 5G e wireless',
              gradient: 'from-accent-400 to-accent-600'
            },
            {
              value: '40+',
              label: 'Países',
              description: 'Experiência global',
              gradient: 'from-green-400 to-green-600'
            }
          ],
          backgroundColor: '',
          textColor: '',
          customCSS: '',
          components: []
        },
        animations: {
          entry: 'slideUp',
          exit: 'slideDown',
          duration: 500
        }
      },

      // Slide 4 - Desafios
      {
        id: 'slide_challenges',
        name: 'Desafios',
        template: 'comparison',
        isVisible: true,
        order: 3,
        content: {
          id: 'content_challenges',
          type: 'comparison',
          title: 'Desafios da Indústria',
          subtitle: 'Transformando Problemas em Oportunidades',
          description: '',
          items: [
            {
              problem: 'Explosão de Dados',
              solution: 'Otimização inteligente de rede com IA',
              icon: 'TrendingUp'
            },
            {
              problem: 'Cobertura Indoor Deficiente',
              solution: 'Soluções DAS e small cells avançadas',
              icon: 'Wifi'
            },
            {
              problem: 'Custos Operacionais Elevados',
              solution: 'Automação e eficiência energética',
              icon: 'DollarSign'
            },
            {
              problem: 'Complexidade 5G',
              solution: 'Plataforma unificada de gestão',
              icon: 'Cpu'
            }
          ],
          backgroundColor: '',
          textColor: '',
          customCSS: '',
          components: []
        },
        animations: {
          entry: 'zoom',
          exit: 'zoom',
          duration: 500
        }
      },

      // Slide 5 - Proposta de Valor
      {
        id: 'slide_value',
        name: 'Proposta de Valor',
        template: 'cards',
        isVisible: true,
        order: 4,
        content: {
          id: 'content_value',
          type: 'cards',
          title: 'Nossa Proposta de Valor',
          subtitle: 'Por que escolher a CelPlan',
          description: '',
          items: [
            {
              title: 'Expertise Técnica',
              description: '30+ anos de experiência em wireless',
              icon: 'Award',
              color: 'brand'
            },
            {
              title: 'Soluções End-to-End',
              description: 'Do planejamento à otimização',
              icon: 'Layers',
              color: 'primary'
            },
            {
              title: 'Tecnologia Proprietária',
              description: 'Software e ferramentas exclusivas',
              icon: 'Cpu',
              color: 'accent'
            },
            {
              title: 'Suporte Global',
              description: 'Presença em 40+ países',
              icon: 'Globe',
              color: 'green'
            }
          ],
          backgroundColor: '',
          textColor: '',
          customCSS: '',
          components: []
        },
        animations: {
          entry: 'fadeIn',
          exit: 'fadeOut',
          duration: 500
        }
      },

      // Slide 6 - 7 Pilares
      {
        id: 'slide_pillars',
        name: '7 Pilares',
        template: 'carousel',
        isVisible: true,
        order: 5,
        content: {
          id: 'content_pillars',
          type: 'carousel',
          title: 'Os 7 Pilares CelPlan',
          subtitle: 'Nossa abordagem integrada para excelência em telecomunicações',
          description: '',
          items: [
            {
              number: '01',
              title: 'Software & Plataformas',
              description: 'Ferramentas proprietárias de última geração para design, otimização e análise de redes wireless.',
              icon: 'Code',
              gradient: 'from-purple-500 to-indigo-600',
              specs: ['CelPlanner', 'CelOptimizer', 'APIs REST', 'Cloud Native']
            },
            {
              number: '02',
              title: 'Engenharia de RF',
              description: 'Expertise profunda em propagação, cobertura e capacidade para todas as tecnologias wireless.',
              icon: 'Radio',
              gradient: 'from-blue-500 to-cyan-600',
              specs: ['5G NR', 'LTE Advanced', 'Massive MIMO', 'Beamforming']
            },
            {
              number: '03',
              title: 'Small Cells & DAS',
              description: 'Soluções de cobertura indoor e densificação urbana com tecnologia de ponta.',
              icon: 'Building',
              gradient: 'from-green-500 to-emerald-600',
              specs: ['Neutral Host', 'Multi-operator', 'C-RAN', 'Edge Computing']
            },
            {
              number: '04',
              title: 'Analytics & Big Data',
              description: 'Inteligência de dados para tomada de decisão estratégica e otimização contínua.',
              icon: 'BarChart',
              gradient: 'from-orange-500 to-red-600',
              specs: ['Machine Learning', 'Predictive Analytics', 'Real-time KPIs', 'BI Dashboards']
            },
            {
              number: '05',
              title: 'IoT & Low Power',
              description: 'Conectividade especializada para bilhões de dispositivos IoT com eficiência energética.',
              icon: 'Cpu',
              gradient: 'from-pink-500 to-rose-600',
              specs: ['LoRaWAN', 'NB-IoT', 'LTE-M', 'Industrial IoT']
            },
            {
              number: '06',
              title: 'Serviços Profissionais',
              description: 'Consultoria expert e implementação hands-on com metodologia comprovada.',
              icon: 'Users',
              gradient: 'from-teal-500 to-cyan-600',
              specs: ['Consulting', 'Training', 'Managed Services', '24/7 Support']
            },
            {
              number: '07',
              title: 'Inovação & P&D',
              description: 'Investimento contínuo em pesquisa para antecipar o futuro das telecomunicações.',
              icon: 'Lightbulb',
              gradient: 'from-indigo-500 to-purple-600',
              specs: ['6G Research', 'AI/ML Labs', 'Standards', 'Patents']
            }
          ],
          backgroundColor: '',
          textColor: '',
          customCSS: '',
          components: []
        },
        animations: {
          entry: 'slideRight',
          exit: 'slideLeft',
          duration: 500
        }
      },

      // Slide 7 - Conectividade
      {
        id: 'slide_connectivity',
        name: 'Conectividade',
        template: 'grid',
        isVisible: true,
        order: 6,
        content: {
          id: 'content_connectivity',
          type: 'grid',
          title: 'Conectividade Total',
          subtitle: 'Tecnologias que suportamos',
          description: '',
          items: [
            { name: '5G NR', category: 'Celular', status: 'active' },
            { name: 'LTE/4G', category: 'Celular', status: 'active' },
            { name: 'WiFi 7', category: 'WiFi', status: 'new' },
            { name: 'WiFi 6E', category: 'WiFi', status: 'active' },
            { name: 'LoRaWAN', category: 'IoT', status: 'active' },
            { name: 'NB-IoT', category: 'IoT', status: 'active' },
            { name: 'Private 5G', category: 'Enterprise', status: 'trending' },
            { name: 'CBRS', category: 'Enterprise', status: 'active' },
            { name: 'O-RAN', category: 'Open', status: 'trending' },
            { name: 'Edge Computing', category: 'Computing', status: 'new' },
            { name: 'Satellite', category: 'Satellite', status: 'active' },
            { name: '6G Research', category: 'Future', status: 'research' }
          ],
          backgroundColor: '',
          textColor: '',
          customCSS: '',
          components: []
        },
        animations: {
          entry: 'fadeIn',
          exit: 'fadeOut',
          duration: 500
        }
      },

      // Slide 8 - IA e Dados
      {
        id: 'slide_aidata',
        name: 'IA e Dados',
        template: 'features',
        isVisible: true,
        order: 7,
        content: {
          id: 'content_aidata',
          type: 'features',
          title: 'Inteligência Artificial & Analytics',
          subtitle: 'Transformando dados em decisões estratégicas',
          description: '',
          items: [
            {
              title: 'Otimização Preditiva',
              description: 'ML para prever e prevenir problemas de rede',
              icon: 'Brain',
              metrics: ['99.9% Precisão', '60% Redução MTTR', 'Real-time']
            },
            {
              title: 'Automação Inteligente',
              description: 'Self-Organizing Networks (SON) com IA',
              icon: 'Bot',
              metrics: ['Zero-touch', '24/7 Operação', '80% Eficiência']
            },
            {
              title: 'Analytics Avançado',
              description: 'Insights profundos de comportamento e performance',
              icon: 'ChartBar',
              metrics: ['100+ KPIs', 'Dashboards', 'Alertas Smart']
            }
          ],
          backgroundColor: '',
          textColor: '',
          customCSS: '',
          components: []
        },
        animations: {
          entry: 'slideUp',
          exit: 'slideDown',
          duration: 500
        }
      },

      // Slide 9 - IoT Low Power
      {
        id: 'slide_iot',
        name: 'IoT Low Power',
        template: 'showcase',
        isVisible: true,
        order: 8,
        content: {
          id: 'content_iot',
          type: 'showcase',
          title: 'IoT & Conectividade Low Power',
          subtitle: 'Conectando bilhões de dispositivos com eficiência',
          description: 'Soluções especializadas para o ecossistema IoT',
          items: [
            {
              category: 'Smart Cities',
              solutions: ['Iluminação Inteligente', 'Gestão de Tráfego', 'Monitoramento Ambiental', 'Segurança Pública'],
              icon: 'Building',
              color: 'blue'
            },
            {
              category: 'Indústria 4.0',
              solutions: ['Sensores Industriais', 'Manutenção Preditiva', 'Asset Tracking', 'Automação'],
              icon: 'Factory',
              color: 'orange'
            },
            {
              category: 'Agricultura',
              solutions: ['Irrigação Inteligente', 'Monitoramento de Solo', 'Rastreamento de Gado', 'Drones'],
              icon: 'Leaf',
              color: 'green'
            },
            {
              category: 'Utilities',
              solutions: ['Smart Meters', 'Gestão de Energia', 'Detecção de Vazamentos', 'Grid Intelligence'],
              icon: 'Zap',
              color: 'yellow'
            }
          ],
          backgroundColor: '',
          textColor: '',
          customCSS: '',
          components: []
        },
        animations: {
          entry: 'zoom',
          exit: 'zoom',
          duration: 500
        }
      },

      // Slide 10 - Video Analytics
      {
        id: 'slide_vision',
        name: 'Video Analytics',
        template: 'vision',
        isVisible: true,
        order: 9,
        content: {
          id: 'content_vision',
          type: 'vision',
          title: 'Visão do Futuro',
          subtitle: 'Video Analytics & Computer Vision',
          description: 'Inteligência visual para cidades e empresas mais seguras',
          items: [
            {
              title: 'Segurança Inteligente',
              features: ['Detecção de Anomalias', 'Reconhecimento Facial', 'Análise Comportamental'],
              icon: 'Shield'
            },
            {
              title: 'Gestão de Multidões',
              features: ['Contagem de Pessoas', 'Mapa de Calor', 'Prevenção de Incidentes'],
              icon: 'Users'
            },
            {
              title: 'Retail Analytics',
              features: ['Customer Journey', 'Queue Management', 'Conversion Rate'],
              icon: 'ShoppingBag'
            },
            {
              title: 'Traffic Management',
              features: ['Fluxo de Veículos', 'Detecção de Acidentes', 'Smart Parking'],
              icon: 'Car'
            }
          ],
          backgroundColor: '',
          textColor: '',
          customCSS: '',
          components: []
        },
        animations: {
          entry: 'slideRight',
          exit: 'slideLeft',
          duration: 500
        }
      },

      // Slide 11 - Serviços
      {
        id: 'slide_services',
        name: 'Serviços',
        template: 'services',
        isVisible: true,
        order: 10,
        content: {
          id: 'content_services',
          type: 'services',
          title: 'Nossos Serviços',
          subtitle: 'Soluções completas de ponta a ponta',
          description: '',
          items: [
            {
              phase: 'Planejamento',
              title: 'Design & Planejamento',
              services: ['RF Planning', 'Network Design', 'Capacity Planning', 'Business Case'],
              icon: 'Compass',
              color: 'blue'
            },
            {
              phase: 'Implementação',
              title: 'Deploy & Integração',
              services: ['Site Survey', 'Installation', 'Integration', 'Commissioning'],
              icon: 'Wrench',
              color: 'green'
            },
            {
              phase: 'Otimização',
              title: 'Otimização & Performance',
              services: ['Drive Test', 'Optimization', 'Troubleshooting', 'KPI Improvement'],
              icon: 'TrendingUp',
              color: 'purple'
            },
            {
              phase: 'Operação',
              title: 'Managed Services',
              services: ['24/7 NOC', 'Monitoring', 'Maintenance', 'SLA Management'],
              icon: 'Headphones',
              color: 'orange'
            },
            {
              phase: 'Evolução',
              title: 'Modernização & Upgrade',
              services: ['5G Migration', 'Cloud RAN', 'Network Slicing', 'Edge Deploy'],
              icon: 'Rocket',
              color: 'red'
            },
            {
              phase: 'Capacitação',
              title: 'Training & Certificação',
              services: ['Technical Training', 'Certification Programs', 'Workshops', 'Knowledge Transfer'],
              icon: 'GraduationCap',
              color: 'indigo'
            }
          ],
          backgroundColor: '',
          textColor: '',
          customCSS: '',
          components: []
        },
        animations: {
          entry: 'slideUp',
          exit: 'slideDown',
          duration: 500
        }
      },

      // Slide 12 - Cases de Sucesso
      {
        id: 'slide_cases',
        name: 'Cases de Sucesso',
        template: 'cases',
        isVisible: true,
        order: 11,
        content: {
          id: 'content_cases',
          type: 'cases',
          title: 'Cases de Sucesso',
          subtitle: 'Transformando desafios em resultados excepcionais',
          description: 'Mais de 1000+ projetos realizados com sucesso',
          items: [],
          backgroundColor: '',
          textColor: '',
          customCSS: '',
          components: []
        },
        animations: {
          entry: 'fadeIn',
          exit: 'fadeOut',
          duration: 500
        }
      },

      // Slide 13 - Contato
      {
        id: 'slide_contact',
        name: 'Contato',
        template: 'contact',
        isVisible: true,
        order: 12,
        content: {
          id: 'content_contact',
          type: 'contact',
          title: 'Vamos Conversar?',
          subtitle: 'Transforme seus desafios em soluções inovadoras',
          description: '',
          items: [
            {
              icon: 'Mail',
              label: 'Email',
              value: 'contato@celplan.com',
              link: 'mailto:contato@celplan.com',
              color: 'brand'
            },
            {
              icon: 'Phone',
              label: 'Telefone',
              value: '+55 11 3032-3032',
              link: 'tel:+551130323032',
              color: 'primary'
            },
            {
              icon: 'Globe',
              label: 'Website',
              value: 'www.celplan.com',
              link: 'https://www.celplan.com',
              color: 'accent'
            },
            {
              icon: 'MapPin',
              label: 'Localização',
              value: 'São Paulo, Brasil',
              link: null,
              color: 'brand'
            }
          ],
          backgroundColor: '',
          textColor: '',
          customCSS: '',
          components: []
        },
        animations: {
          entry: 'fadeIn',
          exit: 'fadeOut',
          duration: 500
        }
      }
    ],
    settings: {
      autoPlay: false,
      autoPlayInterval: 5000,
      enableKeyboardNav: true,
      enableSwipeNav: true,
      showNavigation: true,
      showProgress: true
    },
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'CelPlan Team',
      company: 'CelPlan Technologies'
    }
  };
};