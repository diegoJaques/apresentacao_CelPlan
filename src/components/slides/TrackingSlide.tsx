import { motion } from 'framer-motion';
import { useState } from 'react';
import { Slide } from '../Slide';
import { Target, Eye, Zap, BarChart3, Database, Clock, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { ImageModal, ClickableImage } from '../ImageModal';

export const TrackingSlide = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: '', alt: '', title: '' });

  const openModal = (src: string, alt: string, title: string) => {
    setSelectedImage({ src, alt, title });
    setModalOpen(true);
  };

  const technologies = [
    "Python",
    "ffmpeg-python",
    "ReID (Re-Identification)",
    "AWS SQS",
    "Torchreid Framework",
    "OSNet Model"
  ];

  const steps = [
    {
      number: "1",
      title: "Detecção de Falha",
      description: "Câmera B detecta oclusão da placa e registra timestamp",
      icon: XCircle,
      color: "text-red-400"
    },
    {
      number: "2",
      title: "Cálculo Espacial",
      description: "Sistema calcula distância (<1km) entre câmeras A e B",
      icon: Target,
      color: "text-blue-400"
    },
    {
      number: "3",
      title: "Janela Temporal",
      description: "Define busca de 108s baseado em velocidade de motos",
      icon: Clock,
      color: "text-yellow-400"
    },
    {
      number: "4",
      title: "ReID e Recuperação",
      description: "Busca por similaridade recupera placa da Câmera A",
      icon: CheckCircle,
      color: "text-green-400"
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
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full mb-2">
            <Target className="w-4 h-4" />
            <span className="text-xs font-bold">EM PRODUÇÃO - SISTEMA FORENSE</span>
          </div>

          <h2 className="text-4xl font-display font-bold mb-2">
            <span className="gradient-text">Busca Forense - ReID</span>
          </h2>

          <p className="text-lg text-neutral-300">
            Recuperação de Placas via Rastreamento Inteligente
          </p>
        </motion.div>

        {/* Problema vs Solução - Destaque Visual com Imagens */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-3 mb-3"
        >
          {/* PROBLEMA - Câmera B */}
          <div className="glass-effect p-3 rounded-xl border-2 border-red-500/30">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-bold text-red-400">PROBLEMA</h3>
            </div>
            <ClickableImage
              src="/cases-sucesso/Tracking/camera-b-placa-tampada.jpg"
              alt="Câmera B - Placa obstruída pelo motoqueiro"
              title="Câmera B - Placa Tampada"
              className="w-full h-32 object-cover rounded-lg mb-2"
              onClick={() => openModal(
                "/cases-sucesso/Tracking/camera-b-placa-tampada.jpg",
                "Câmera B (radar) - Placa obstruída deliberadamente pelo motoqueiro. ALPR falha = dado nulo = multa perdida",
                "Câmera B - Placa Obstruída"
              )}
            />
            <div className="space-y-1 text-xs">
              <p className="text-neutral-200">
                <span className="font-bold text-red-400">❌ Oclusão:</span> Motoqueiro tampa placa
              </p>
              <p className="text-neutral-200">
                <span className="font-bold text-red-400">❌ ALPR Falha:</span> Dado nulo
              </p>
              <p className="text-neutral-200">
                <span className="font-bold text-red-400">❌ Impacto:</span> Perda de receita
              </p>
            </div>
          </div>

          {/* SOLUÇÃO - Câmera A */}
          <div className="glass-effect p-3 rounded-xl border-2 border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <h3 className="text-sm font-bold text-green-400">SOLUÇÃO</h3>
            </div>
            <ClickableImage
              src="/cases-sucesso/Tracking/camera-a-placa-visivel.png"
              alt="Câmera A - Placa recuperada via ReID"
              title="Câmera A - Placa Recuperada"
              className="w-full h-32 object-cover rounded-lg mb-2"
              onClick={() => openModal(
                "/cases-sucesso/Tracking/camera-a-placa-visivel.png",
                "Câmera A (anterior) - Sistema de ReID recupera o veículo e placa através de busca forense com filtro espaço-temporal",
                "Câmera A - Placa Recuperada"
              )}
            />
            <div className="space-y-1 text-xs">
              <p className="text-neutral-200">
                <span className="font-bold text-green-400">✓ Busca Forense:</span> Recupera da Câmera A
              </p>
              <p className="text-neutral-200">
                <span className="font-bold text-green-400">✓ Filtro ST:</span> 900s → 108s
              </p>
              <p className="text-neutral-200">
                <span className="font-bold text-green-400">✓ Resultado:</span> Multa aplicada
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-3 mb-3">
          {/* Como Funciona */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="glass-effect p-4 rounded-xl h-full">
              <h3 className="text-sm font-bold text-accent-400 mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                FILTRO ESPAÇO-TEMPORAL (ST)
              </h3>

              <div className="grid md:grid-cols-2 gap-2 mb-3">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="glass-effect p-2 rounded-lg"
                    >
                      <div className="flex items-start gap-2">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full ${step.color.replace('text-', 'bg-')}/20 flex items-center justify-center`}>
                          <span className={`text-xs font-bold ${step.color}`}>{step.number}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 mb-0.5">
                            <Icon className={`w-3 h-3 ${step.color}`} />
                            <div className="text-xs font-bold text-white">{step.title}</div>
                          </div>
                          <div className="text-xs text-neutral-400">{step.description}</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="border-t border-neutral-700 pt-2">
                <h4 className="text-xs font-bold text-neutral-400 mb-2">STACK TECNOLÓGICA</h4>
                <div className="flex flex-wrap gap-1.5">
                  {technologies.map((tech, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.05 }}
                      className="px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded-full text-xs font-medium"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Benefícios e Métricas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            {/* Métricas */}
            <div className="glass-effect p-3 rounded-xl">
              <h4 className="text-xs font-bold text-accent-400 mb-2 flex items-center gap-2">
                <BarChart3 className="w-3 h-3" />
                RESULTADOS
              </h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Redução Tempo Busca</span>
                    <span className="text-green-400 font-bold">-90%</span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">900s → 108s</div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Precisão ReID</span>
                    <span className="text-blue-400 font-bold">Alta</span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">12 candidatos vs 10.000</div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Economia GPU</span>
                    <span className="text-purple-400 font-bold">Sob Demanda</span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div className="bg-purple-400 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">GPU apenas quando necessário</div>
                </div>
              </div>
            </div>

            {/* Benefícios Principais */}
            <div className="glass-effect p-3 rounded-xl">
              <h4 className="text-xs font-bold text-neutral-400 mb-2">VANTAGENS</h4>
              <div className="space-y-1.5">
                <div className="flex items-start gap-1.5">
                  <DollarSign className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-neutral-200">TCO reduzido (GPU sob demanda)</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <Zap className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-neutral-200">Busca direta sem decodificar</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <Database className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-neutral-200">Fila SQS robusta</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <Target className="w-3 h-3 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-neutral-200">Alta precisão (12 vs 10k)</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-3"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-bold">Recuperando receita com inteligência artificial</span>
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
