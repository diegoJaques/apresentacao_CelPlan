import { motion } from 'framer-motion';
import { useState } from 'react';
import { Slide } from '../Slide';
import { Radio, Map, Layers, Zap, Target, BarChart3, Cpu, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { ImageModal, ClickableImage } from '../ImageModal';

export const CelPlannerSlide = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: '', alt: '', title: '' });

  const openModal = (src: string, alt: string, title: string) => {
    setSelectedImage({ src, alt, title });
    setModalOpen(true);
  };

  const technologies = [
    "Python",
    "QGIS",
    "PostgreSQL",
    "PostGIS",
    "RF Propagation Models",
    "3D Terrain Analysis",
    "PyQt",
    "Leaflet",
    "Shapely",
    "Geopandas",
    "Network Optimization"
  ];

  const features = [
    {
      icon: Map,
      title: "Visualização GIS",
      description: "Mapas interativos com múltiplas camadas",
      color: "text-blue-400"
    },
    {
      icon: Radio,
      title: "Análise RF",
      description: "Modelos de propagação avançados",
      color: "text-green-400"
    },
    {
      icon: Layers,
      title: "Planejamento 3D",
      description: "Análise de terreno e obstáculos",
      color: "text-purple-400"
    },
    {
      icon: Target,
      title: "Otimização de Sites",
      description: "Posicionamento inteligente de ERBs",
      color: "text-yellow-400"
    },
    {
      icon: TrendingUp,
      title: "Análise de Cobertura",
      description: "Predição de área de serviço",
      color: "text-red-400"
    },
    {
      icon: Cpu,
      title: "Processamento Paralelo",
      description: "Cálculos distribuídos de alta performance",
      color: "text-cyan-400"
    }
  ];

  const benefits = [
    {
      label: "Tempo de Planejamento",
      value: "-70%",
      color: "text-green-400",
      description: "Redução no tempo de projeto"
    },
    {
      label: "Precisão RF",
      value: "+85%",
      color: "text-blue-400",
      description: "Acurácia nas predições"
    },
    {
      label: "Otimização Sites",
      value: "-40%",
      color: "text-purple-400",
      description: "Redução no número de sites"
    }
  ];

  const clients = [
    "Copel",
    "Petrobras",
    "Brisanet",
    "CPFL",
    "IEZ Telecom",
    "EDP",
    "ALGAR",
    "CEMIG",
    "Tropico"
  ];

  return (
    <Slide>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-3"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full mb-2">
            <Radio className="w-4 h-4" />
            <span className="text-xs font-bold">FERRAMENTA DE PLANEJAMENTO RF</span>
          </div>

          <h2 className="text-4xl font-display font-bold mb-2">
            <span className="gradient-text">CelPlanner™</span>
          </h2>

          <p className="text-lg text-neutral-300">
            Planejamento Inteligente de Redes Wireless
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-3 mb-3">
          {/* Coluna Principal - Screenshot e Problema/Solução */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-2"
          >
            {/* Screenshot do Sistema */}
            <div className="glass-effect p-3 rounded-xl">
              <ClickableImage
                src="/cases-sucesso/CelPlanner/CelPlanner imagens.png"
                alt="Interface do CelPlanner com análise de cobertura RF e visualização GIS"
                title="CelPlanner - Planejamento RF"
                className="w-full h-64 object-cover rounded-lg"
                onClick={() => openModal(
                  "/cases-sucesso/CelPlanner/CelPlanner imagens.png",
                  "Interface completa do CelPlanner mostrando análise de cobertura RF, visualização 3D de terreno e ferramentas de planejamento de rede",
                  "CelPlanner - Ferramenta de Planejamento RF"
                )}
              />
            </div>

            {/* Problema vs Solução */}
            <div className="glass-effect p-3 rounded-xl">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <h4 className="text-xs font-bold text-red-400 mb-1.5 flex items-center gap-1.5">
                    <XCircle className="w-3 h-3" />
                    DESAFIOS
                  </h4>
                  <ul className="space-y-0.5 text-xs text-neutral-300">
                    <li>• Planejamento RF manual e demorado</li>
                    <li>• Ferramentas caras e complexas</li>
                    <li>• Dificuldade em analisar grandes áreas</li>
                    <li>• Integração limitada com GIS</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-green-400 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3" />
                    SOLUÇÃO
                  </h4>
                  <ul className="space-y-0.5 text-xs text-neutral-300">
                    <li>• Planejamento automatizado com IA</li>
                    <li>• Interface intuitiva e customizável</li>
                    <li>• Processamento distribuído de alta performance</li>
                    <li>• Integração nativa com QGIS</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Stack Tecnológica */}
            <div className="glass-effect p-2 rounded-xl">
              <h4 className="text-xs font-bold text-neutral-400 mb-2">TECNOLOGIAS</h4>
              <div className="flex flex-wrap gap-1">
                {technologies.map((tech, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.03 }}
                    className="px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded-full text-xs font-medium"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Clientes */}
            <div className="glass-effect p-2 rounded-xl">
              <h4 className="text-xs font-bold text-brand-400 mb-2">CLIENTES</h4>
              <div className="flex flex-wrap gap-1">
                {clients.map((client, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="px-2 py-0.5 bg-brand-500/20 text-brand-300 rounded-full text-xs font-medium"
                  >
                    {client}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Coluna Direita - Features e Benefícios */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            {/* Features */}
            <div className="glass-effect p-3 rounded-xl">
              <h4 className="text-xs font-bold text-accent-400 mb-2 flex items-center gap-2">
                <Zap className="w-3 h-3" />
                FUNCIONALIDADES
              </h4>
              <div className="space-y-1.5">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="glass-effect p-1.5 rounded-lg"
                    >
                      <div className="flex items-start gap-1.5">
                        <Icon className={`w-3 h-3 ${feature.color} flex-shrink-0 mt-0.5`} />
                        <div>
                          <div className="text-xs font-bold text-white">{feature.title}</div>
                          <div className="text-xs text-neutral-400">{feature.description}</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Benefícios/Métricas */}
            <div className="glass-effect p-3 rounded-xl">
              <h4 className="text-xs font-bold text-accent-400 mb-2 flex items-center gap-2">
                <BarChart3 className="w-3 h-3" />
                RESULTADOS
              </h4>
              <div className="space-y-2">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-400">{benefit.label}</span>
                      <span className={`${benefit.color} font-bold`}>{benefit.value}</span>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-2">
                      <div
                        className={`${benefit.color.replace('text-', 'bg-')} h-2 rounded-full`}
                        style={{ width: `${Math.abs(parseInt(benefit.value))}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">{benefit.description}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-center mt-3"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-bold">Transformando planejamento RF em inteligência geoespacial</span>
          </div>
        </motion.div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageSrc={selectedImage.src}
        imageAlt={selectedImage.alt}
        title={selectedImage.title}
      />
    </Slide>
  );
};
