import { motion } from 'framer-motion';
import { useState } from 'react';
import { Slide } from '../Slide';
import { Map, Layers, Zap, Target, BarChart3, FileCheck, Database, Brain, CheckCircle, XCircle } from 'lucide-react';
import { ImageModal, ClickableImage } from '../ImageModal';

export const RumoSlide = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: '', alt: '', title: '' });

  const openModal = (src: string, alt: string, title: string) => {
    setSelectedImage({ src, alt, title });
    setModalOpen(true);
  };

  const technologies = [
    "Python 3.11",
    "FastAPI",
    "PostgreSQL",
    "PostGIS",
    "Google Vision API",
    "Gemini LLM",
    "Tesseract OCR",
    "React 18",
    "TypeScript",
    "Leaflet",
    "Celery",
    "Redis",
    "Docker"
  ];

  const steps = [
    {
      number: "1",
      title: "Upload PDFs",
      description: "Upload múltiplo de relatórios de sondagem",
      icon: FileCheck,
      color: "text-blue-400"
    },
    {
      number: "2",
      title: "Classificação",
      description: "Identificação automática do tipo (SP/ST/SM)",
      icon: Layers,
      color: "text-green-400"
    },
    {
      number: "3",
      title: "OCR Inteligente",
      description: "Google Vision + Tesseract (fallback duplo)",
      icon: Brain,
      color: "text-purple-400"
    },
    {
      number: "4",
      title: "Parsing com IA",
      description: "Regex + Gemini LLM (fallback inteligente)",
      icon: Target,
      color: "text-yellow-400"
    },
    {
      number: "5",
      title: "Visualização GIS",
      description: "Plotagem em mapa interativo com heatmap",
      icon: Map,
      color: "text-red-400"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "IA Híbrida",
      description: "Regex + Gemini LLM para máxima precisão",
      color: "text-purple-400"
    },
    {
      icon: Target,
      title: "Score 0-100",
      description: "Sistema de confiança automatizado",
      color: "text-blue-400"
    },
    {
      icon: Layers,
      title: "3 Tipos de Sondagem",
      description: "SP, ST e SM suportados",
      color: "text-green-400"
    },
    {
      icon: Map,
      title: "Mapa de Calor",
      description: "Análise de densidade espacial",
      color: "text-red-400"
    },
    {
      icon: Database,
      title: "PostGIS",
      description: "Análise geoespacial avançada",
      color: "text-cyan-400"
    },
    {
      icon: FileCheck,
      title: "Exportação Múltipla",
      description: "CSV, Excel, GeoJSON",
      color: "text-yellow-400"
    }
  ];

  return (
    <Slide>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-3"
        >
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-full mb-2">
            <Map className="w-4 h-4" />
            <span className="text-xs font-bold">EM PRODUÇÃO - PLATAFORMA GIS</span>
          </div>

          <h2 className="text-4xl font-display font-bold mb-2">
            <span className="gradient-text">GeoInsight Platform</span>
          </h2>

          <p className="text-lg text-neutral-300">
            Análise Geotécnica Automatizada com IA
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-3 mb-3">
          {/* Coluna Principal - Workflow e Problema/Solução */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-2"
          >
            {/* Problema vs Solução */}
            <div className="glass-effect p-3 rounded-xl">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <h4 className="text-xs font-bold text-red-400 mb-1.5 flex items-center gap-1.5">
                    <XCircle className="w-3 h-3" />
                    PROBLEMA
                  </h4>
                  <ul className="space-y-0.5 text-xs text-neutral-300">
                    <li>• Análise manual demorada</li>
                    <li>• Erros de digitação</li>
                    <li>• Falta visualização espacial</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-green-400 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3" />
                    SOLUÇÃO
                  </h4>
                  <ul className="space-y-0.5 text-xs text-neutral-300">
                    <li>• OCR + fallback duplo</li>
                    <li>• IA híbrida (Regex + LLM)</li>
                    <li>• Mapas GIS + heatmap</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Workflow */}
            <div className="glass-effect p-3 rounded-xl">
              <h3 className="text-sm font-bold text-accent-400 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                WORKFLOW
              </h3>

              <div className="grid md:grid-cols-5 gap-1.5">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="glass-effect p-2 rounded-lg h-full">
                        <div className={`w-5 h-5 rounded-full ${step.color.replace('text-', 'bg-')}/20 flex items-center justify-center mx-auto mb-1`}>
                          <span className={`text-xs font-bold ${step.color}`}>{step.number}</span>
                        </div>
                        <Icon className={`w-4 h-4 ${step.color} mx-auto mb-1`} />
                        <div className="text-xs font-bold text-white mb-0.5">{step.title}</div>
                        <div className="text-xs text-neutral-400 leading-tight">{step.description}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Stack Tecnológica */}
            <div className="glass-effect p-2 rounded-xl">
              <h4 className="text-xs font-bold text-neutral-400 mb-2">STACK</h4>
              <div className="flex flex-wrap gap-1">
                {technologies.map((tech, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.03 }}
                    className="px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded-full text-xs font-medium"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Coluna Direita - Diferenciais */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <div className="glass-effect p-3 rounded-xl">
              <h4 className="text-xs font-bold text-accent-400 mb-2 flex items-center gap-2">
                <BarChart3 className="w-3 h-3" />
                DIFERENCIAIS
              </h4>
              <div className="space-y-1.5">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
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
          </motion.div>
        </div>

        {/* Screenshots do Sistema */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="glass-effect p-3 rounded-xl"
        >
          <h3 className="text-xs font-bold text-neutral-400 mb-2 text-center">PLATAFORMA EM OPERAÇÃO</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="glass-effect p-2 rounded-lg">
              <ClickableImage
                src="/cases-sucesso/Rumo/dashboard.png"
                alt="Dashboard principal da plataforma GeoInsight"
                title="Dashboard Principal"
                className="w-full h-32 object-cover rounded"
                onClick={() => openModal(
                  "/cases-sucesso/Rumo/dashboard.png",
                  "Dashboard principal com visão geral dos projetos, sondagens processadas e métricas em tempo real",
                  "Dashboard GeoInsight Platform"
                )}
              />
              <div className="text-center mt-1 text-xs text-neutral-400">Dashboard</div>
            </div>
            <div className="glass-effect p-2 rounded-lg">
              <ClickableImage
                src="/cases-sucesso/Rumo/mapa-de-calor.png"
                alt="Mapa de calor com densidade de sondagens georreferenciadas"
                title="Mapa de Calor Interativo"
                className="w-full h-32 object-cover rounded"
                onClick={() => openModal(
                  "/cases-sucesso/Rumo/mapa-de-calor.png",
                  "Mapa de calor (heatmap) mostrando densidade espacial de sondagens com análise de padrões geotécnicos",
                  "Mapa de Calor GIS - Análise Espacial"
                )}
              />
              <div className="text-center mt-1 text-xs text-neutral-400">Mapa de Calor</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-3"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-bold">Transformando análise geotécnica manual em inteligência automatizada</span>
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
