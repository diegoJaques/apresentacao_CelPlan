import { motion } from 'framer-motion';
import { useState } from 'react';
import { Slide } from '../Slide';
import { Eye, HardHat, Activity, MapPin, Brain, Gauge, Users, Target } from 'lucide-react';
import { ImageModal, ClickableImage } from '../ImageModal';

export const VisaoSlide = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: '', alt: '', title: '' });

  const openModal = (src: string, alt: string, title: string) => {
    setSelectedImage({ src, alt, title });
    setModalOpen(true);
  };

  const models = [
    { name: "YOLOv8n", size: "6MB", fps: "50+", color: "text-green-400" },
    { name: "YOLOv8s", size: "22MB", fps: "40+", color: "text-blue-400" },
    { name: "YOLOv8m", size: "50MB", fps: "30+", color: "text-yellow-400" },
    { name: "YOLOv8l", size: "87MB", fps: "25+", color: "text-orange-400" },
    { name: "YOLOv8x", size: "136MB", fps: "20+", color: "text-red-400" }
  ];

  const technologies = [
    {
      icon: Brain,
      title: "Deep Learning",
      description: "YOLOv8 para detecção de objetos em tempo real"
    },
    {
      icon: Eye,
      title: "OCR Avançado",
      description: "Leitura de coordenadas e identificação de equipes"
    },
    {
      icon: MapPin,
      title: "Mapeamento",
      description: "Análise geoespacial de produtividade"
    }
  ];

  return (
    <Slide>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full mb-4">
            <Users className="w-5 h-5" />
            <span className="text-sm font-bold">EM DESENVOLVIMENTO - PARCERIA TELLUS</span>
          </div>
          
          <h2 className="text-4xl font-display font-bold mb-3">
            <span className="gradient-text">VISÃO - Segurança Inteligente</span>
          </h2>
          
          <p className="text-lg text-neutral-300">
            Modelo treinado para Tellus - Análise de produtividade e conformidade de segurança
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          {/* Tecnologias Principais */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass-effect p-4 rounded-xl">
              <h3 className="text-base font-bold text-accent-400 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" />
                TECNOLOGIAS INTEGRADAS
              </h3>
              
              <div className="grid md:grid-cols-3 gap-3 mb-4">
                {technologies.map((tech, index) => {
                  const Icon = tech.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="glass-effect p-3 rounded-lg text-center"
                    >
                      <Icon className="w-8 h-8 text-accent-400 mx-auto mb-2" />
                      <h4 className="text-xs font-bold text-white mb-1">{tech.title}</h4>
                      <p className="text-xs text-neutral-300">{tech.description}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* EPIs Detectados - Texto Compacto */}
              <div className="border-t border-neutral-700 pt-2 mb-2">
                <h4 className="text-xs font-bold text-neutral-400 mb-1">6 TIPOS DE EPIs DETECTADOS</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  <span className="text-accent-400 font-medium">Capacetes</span>, <span className="text-accent-400 font-medium">Óculos</span>, <span className="text-accent-400 font-medium">Máscaras</span>, <span className="text-accent-400 font-medium">Luvas</span>, <span className="text-accent-400 font-medium">Coletes</span> e <span className="text-accent-400 font-medium">Botas</span> de segurança
                </p>
              </div>

              {/* Funcionalidades */}
              <div className="grid md:grid-cols-2 gap-3">
                <div className="glass-effect p-3 rounded-lg">
                  <h4 className="text-xs font-bold text-green-400 mb-2">ANÁLISE DE PRODUTIVIDADE</h4>
                  <ul className="space-y-1 text-xs text-neutral-300">
                    <li>• Mapeamento de equipes em tempo real</li>
                    <li>• Identificação de gargalos operacionais</li>
                    <li>• Relatórios de eficiência por coordenadas</li>
                  </ul>
                </div>
                <div className="glass-effect p-3 rounded-lg">
                  <h4 className="text-xs font-bold text-red-400 mb-2">CONFORMIDADE DE SEGURANÇA</h4>
                  <ul className="space-y-1 text-xs text-neutral-300">
                    <li>• Detecção automática de não conformidades</li>
                    <li>• Alertas em tempo real</li>
                    <li>• Histórico de compliance por área</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Modelos e Performance */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Performance dos Modelos */}
            <div className="glass-effect p-3 rounded-xl">
              <h4 className="text-xs font-bold text-neutral-400 mb-2 flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                5 MODELOS DISPONÍVEIS
              </h4>
              <div className="space-y-2">
                {models.map((model, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-center justify-between p-2 bg-neutral-800/50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${model.color}`}>{model.name}</span>
                      <span className="text-xs text-neutral-400">({model.size})</span>
                    </div>
                    <span className="text-xs font-bold text-white">{model.fps} FPS</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Aplicações */}
            <div className="glass-effect p-3 rounded-xl">
              <h4 className="text-xs font-bold text-neutral-400 mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                APLICAÇÕES
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  <span className="text-xs text-neutral-300">Empresas de Energia</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-xs text-neutral-300">Construção Civil</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-xs text-neutral-300">Indústria Pesada</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Screenshots */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-effect p-3 rounded-xl"
        >
          <h3 className="text-xs font-bold text-neutral-400 mb-2 text-center">SISTEMA EM DESENVOLVIMENTO</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-effect p-2 rounded-lg">
              <ClickableImage
                src="/cases-sucesso/Visao/Imagem1.png"
                alt="Interface de Detecção"
                title="Detecção em Tempo Real"
                className="w-full h-24 object-cover rounded"
                onClick={() => openModal(
                  "/cases-sucesso/Visao/Imagem1.png",
                  "Interface do sistema VISÃO mostrando detecção de EPIs em tempo real com análise de conformidade",
                  "Detecção de EPIs em Tempo Real"
                )}
              />
            </div>
            <div className="glass-effect p-2 rounded-lg">
              <ClickableImage
                src="/cases-sucesso/Visao/dashboard.png"
                alt="Dashboard de Análise"
                title="Dashboard Analítico"
                className="w-full h-24 object-cover rounded"
                onClick={() => openModal(
                  "/cases-sucesso/Visao/dashboard.png",
                  "Dashboard analítico com métricas de produtividade e conformidade de segurança das equipes",
                  "Dashboard de Produtividade e Segurança"
                )}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center mt-6"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 
                        text-white px-6 py-3 rounded-full">
            <HardHat className="w-5 h-5 text-orange-400" />
            <span className="text-sm font-bold">
              Reduzindo acidentes através de inteligência artificial
            </span>
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