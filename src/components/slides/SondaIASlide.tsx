import { motion } from 'framer-motion';
import { useState } from 'react';
import { Slide } from '../Slide';
import { Map, Layers, Zap, Target, BarChart, FileCheck, Settings, Rocket } from 'lucide-react';
import { ImageModal, ClickableImage } from '../ImageModal';

export const SondaIASlide = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: '', alt: '', title: '' });

  const openModal = (src: string, alt: string, title: string) => {
    setSelectedImage({ src, alt, title });
    setModalOpen(true);
  };

  const benefits = [
    {
      icon: Zap,
      title: "Redução de Tempo",
      description: "Automação elimina digitação manual de relatórios",
      highlight: "Rápido",
      color: "text-blue-400"
    },
    {
      icon: Settings,
      title: "Eficiência Operacional",
      description: "Processamento simultâneo de múltiplos documentos",
      highlight: "Auto",
      color: "text-green-400"
    },
    {
      icon: Target,
      title: "Precisão e Confiabilidade",
      description: "Validação automática com score de qualidade",
      highlight: "0-100",
      color: "text-purple-400"
    },
    {
      icon: Map,
      title: "Visualização Inteligente",
      description: "Mapas interativos com análise espacial avançada",
      highlight: "GIS",
      color: "text-orange-400"
    }
  ];

  const techStack = ["Python", "React", "PostgreSQL", "PostGIS", "Machine Learning", "OCR"];

  const workflow = [
    { step: 1, title: "Upload", description: "PDFs de Sondagem", icon: FileCheck },
    { step: 2, title: "Extração", description: "OCR Inteligente", icon: Layers },
    { step: 3, title: "Validação", description: "IA valida dados", icon: Target },
    { step: 4, title: "Visualização", description: "Mapas e Heatmaps", icon: Map }
  ];

  return (
    <Slide>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full mb-4">
            <Map className="w-5 h-5" />
            <span className="text-sm font-bold">SISTEMA EM PRODUÇÃO</span>
          </div>

          <h2 className="text-5xl font-display font-bold mb-3">
            <span className="gradient-text">SondaIA - GeoInsight Platform</span>
          </h2>

          <p className="text-xl text-neutral-300">
            Plataforma Inteligente de Análise Geotécnica Automatizada
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Problema e Solução */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass-effect p-6 rounded-xl h-full">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* O Desafio */}
                <div>
                  <h3 className="text-lg font-bold text-red-400 mb-3">O DESAFIO</h3>
                  <p className="text-sm text-neutral-200 mb-3">
                    Projetos de infraestrutura demandam análise rápida e precisa de relatórios de sondagem geotécnica
                  </p>
                  <ul className="space-y-2 text-sm text-neutral-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>Análise manual demorada de PDFs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>Alto risco de erros na digitação</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>Dificuldade de visualização espacial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>Retrabalho em projetos de infraestrutura</span>
                    </li>
                  </ul>
                </div>

                {/* Nossa Solução */}
                <div>
                  <h3 className="text-lg font-bold text-green-400 mb-3">NOSSA SOLUÇÃO</h3>
                  <p className="text-sm text-neutral-200 mb-3">
                    Automação completa da extração e análise de dados geotécnicos com Inteligência Artificial
                  </p>
                  <ul className="space-y-2 text-sm text-neutral-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Extração automática via OCR inteligente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Conversão automática de coordenadas UTM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Score de confiança (0-100) por documento</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Visualização em mapas com heatmaps</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Workflow */}
              <div className="border-t border-neutral-700 pt-4">
                <h4 className="text-sm font-bold text-neutral-400 mb-3">COMO FUNCIONA</h4>
                <div className="grid grid-cols-4 gap-2">
                  {workflow.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="text-center"
                      >
                        <div className="glass-effect p-3 rounded-lg mb-2">
                          <Icon className="w-8 h-8 text-accent-400 mx-auto" />
                        </div>
                        <div className="text-xs font-bold text-white">{item.title}</div>
                        <div className="text-xs text-neutral-400">{item.description}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Métricas e Tech Stack */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Benefícios com Métricas */}
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="glass-effect p-3 rounded-xl"
                >
                  <div className="flex items-start gap-2">
                    <Icon className={`w-6 h-6 ${benefit.color} flex-shrink-0`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-bold text-white">{benefit.title}</h4>
                        <span className={`text-sm font-bold ${benefit.color}`}>
                          {benefit.highlight}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300">{benefit.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="glass-effect p-4 rounded-xl"
            >
              <h4 className="text-sm font-bold text-neutral-400 mb-3 flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                STACK TECNOLÓGICA
              </h4>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-500/20 text-primary-400
                             rounded text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Diferenciais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          className="glass-effect p-4 rounded-xl mb-6"
        >
          <h3 className="text-sm font-bold text-neutral-400 mb-3 text-center">DIFERENCIAIS DA PLATAFORMA</h3>
          <div className="grid md:grid-cols-5 gap-3">
            <div className="glass-effect p-3 rounded-lg text-center">
              <BarChart className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-white mb-1">3 Tipos de Sondagem</div>
              <div className="text-xs text-neutral-400">SP, ST, SM</div>
            </div>
            <div className="glass-effect p-3 rounded-lg text-center">
              <Zap className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-white mb-1">Tempo Real</div>
              <div className="text-xs text-neutral-400">WebSocket</div>
            </div>
            <div className="glass-effect p-3 rounded-lg text-center">
              <Layers className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-white mb-1">Análise Espacial</div>
              <div className="text-xs text-neutral-400">Interpolação</div>
            </div>
            <div className="glass-effect p-3 rounded-lg text-center">
              <FileCheck className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-white mb-1">Múltiplos Formatos</div>
              <div className="text-xs text-neutral-400">Excel, CSV, GeoJSON</div>
            </div>
            <div className="glass-effect p-3 rounded-lg text-center">
              <Settings className="w-6 h-6 text-pink-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-white mb-1">Integração</div>
              <div className="text-xs text-neutral-400">SharePoint</div>
            </div>
          </div>
        </motion.div>

        {/* Screenshots */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="glass-effect p-4 rounded-xl"
        >
          <h3 className="text-sm font-bold text-neutral-400 mb-3 text-center">PLATAFORMA EM OPERAÇÃO</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-effect p-2 rounded-lg">
              <ClickableImage
                src="/cases-sucesso/SondaIA/Captura de tela 2025-11-04 125506.png"
                alt="Dashboard SondaIA"
                title="Dashboard de Análise Geotécnica"
                className="w-full h-24 object-cover rounded"
                onClick={() => openModal(
                  "/cases-sucesso/SondaIA/Captura de tela 2025-11-04 125506.png",
                  "Dashboard principal com mapa interativo e visualização de sondagens geotécnicas",
                  "Dashboard de Análise Geotécnica"
                )}
              />
            </div>
            <div className="glass-effect p-2 rounded-lg">
              <ClickableImage
                src="/cases-sucesso/SondaIA/Captura de tela 2025-11-04 125600.png"
                alt="Interface SondaIA"
                title="Gestão de Documentos e Processamento"
                className="w-full h-24 object-cover rounded"
                onClick={() => openModal(
                  "/cases-sucesso/SondaIA/Captura de tela 2025-11-04 125600.png",
                  "Interface de gestão de documentos com status de processamento em tempo real",
                  "Gestão de Documentos e Processamento"
                )}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-neutral-300 italic">
            "Transformando análise geotécnica manual em inteligência automatizada para decisões mais rápidas e precisas"
          </p>
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
