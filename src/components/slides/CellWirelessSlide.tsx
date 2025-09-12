import { motion } from 'framer-motion';
import { useState } from 'react';
import { Slide } from '../Slide';
import { Radio, MapPin, Clock, Shield, Award, Wifi } from 'lucide-react';
import { ImageModal, ClickableImage } from '../ImageModal';

export const CellWirelessSlide = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: '', alt: '', title: '' });

  const openModal = (src: string, alt: string, title: string) => {
    setSelectedImage({ src, alt, title });
    setModalOpen(true);
  };
  const features = [
    {
      icon: Radio,
      title: "Cobertura Ampla",
      value: "20 MHz - 18 GHz",
      description: "Monitoramento completo do espectro"
    },
    {
      icon: MapPin,
      title: "Geolocalização TDOA",
      value: "Alta Precisão",
      description: "Triangulação por diferença de tempo"
    },
    {
      icon: Clock,
      title: "Operação Autônoma",
      value: "24/7",
      description: "Scripts de monitoramento contínuo"
    },
    {
      icon: Shield,
      title: "Robustez",
      value: "Auto-monitoramento",
      description: "Condições climáticas severas"
    }
  ];

  const results = [
    { label: "Unidades Fornecidas", value: "~40", color: "text-blue-400" },
    { label: "Cobertura Nacional", value: "100%", color: "text-green-400" },
    { label: "Operação", value: "24/7", color: "text-purple-400" },
    { label: "Suporte", value: "Remoto", color: "text-orange-400" }
  ];

  return (
    <Slide>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full mb-4">
            <Award className="w-5 h-5" />
            <span className="text-sm font-bold">CASE DE SUCESSO</span>
          </div>
          
          <h2 className="text-4xl font-display font-bold mb-2">
            <span className="gradient-text">ANATEL & CelPlan</span>
          </h2>
          
          <p className="text-lg text-neutral-300">
            Modernizando a Monitoração de Espectro no Brasil com CellWireless SM
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mb-6">
          {/* Coluna 1 - Desafio e Solução */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Desafio */}
            <div className="glass-effect p-4 rounded-xl">
              <h3 className="text-base font-bold text-red-400 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                DESAFIO ANATEL
              </h3>
              <ul className="space-y-1 text-xs text-neutral-200">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Detectar transmissores não autorizados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Monitoramento contínuo nacional</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Fiscalização 24/7 remota</span>
                </li>
              </ul>
            </div>

            {/* Solução */}
            <div className="glass-effect p-4 rounded-xl">
              <h3 className="text-base font-bold text-green-400 mb-2 flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                SOLUÇÃO CelPlan
              </h3>
              <ul className="space-y-1 text-xs text-neutral-200">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>~40 unidades CellWireless SM</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Plataforma CST centralizada</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Treinamento de 8 especialistas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Suporte técnico remoto</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Coluna 2 - Features Compactas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h3 className="text-xs font-bold text-accent-400 mb-2 text-center">CARACTERÍSTICAS TÉCNICAS</h3>
            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="glass-effect p-2 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-accent-400 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white">{feature.value}</div>
                        <div className="text-xs text-neutral-400">{feature.title}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Coluna 3 - Grid 2x2 de Imagens */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <h3 className="text-xs font-bold text-accent-400 mb-2 text-center">SISTEMA EM OPERAÇÃO</h3>
            {/* Grid 2x2 de Imagens - Responsivo */}
            <div className="grid grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="glass-effect p-2 rounded-lg"
              >
                <ClickableImage
                  src="/cases-sucesso/CellWirelles/cellwirelles SM.png"
                  alt="Hardware CellWireless SM"
                  title="Hardware SM"
                  className="w-full h-24 object-cover rounded"
                  onClick={() => openModal(
                    "/cases-sucesso/CellWirelles/cellwirelles SM.png",
                    "CellWireless SM - Equipamento de monitoração de espectro",
                    "Hardware CellWireless SM"
                  )}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="glass-effect p-2 rounded-lg"
              >
                <ClickableImage
                  src="/cases-sucesso/CellWirelles/cellwirelles SM software.png"
                  alt="Software CellWireless"
                  title="Software CST"
                  className="w-full h-24 object-cover rounded"
                  onClick={() => openModal(
                    "/cases-sucesso/CellWirelles/cellwirelles SM software.png",
                    "Interface do software CellWireless para análise de espectro",
                    "Software CellWireless CST"
                  )}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="glass-effect p-2 rounded-lg"
              >
                <ClickableImage
                  src="/cases-sucesso/CellWirelles/cellwirelles SM geografico.png"
                  alt="Mapeamento Geográfico"
                  title="Geográfico"
                  className="w-full h-24 object-cover rounded"
                  onClick={() => openModal(
                    "/cases-sucesso/CellWirelles/cellwirelles SM geografico.png",
                    "Sistema de localização e mapeamento geográfico das estações CellWireless",
                    "Mapeamento Geográfico"
                  )}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="glass-effect p-2 rounded-lg"
              >
                <ClickableImage
                  src="/cases-sucesso/CellWirelles/cellwirelles SM modular.png"
                  alt="Arquitetura Modular"
                  title="Modular"
                  className="w-full h-24 object-cover rounded"
                  onClick={() => openModal(
                    "/cases-sucesso/CellWirelles/cellwirelles SM modular.png",
                    "Design modular e escalável do sistema CellWireless SM",
                    "Arquitetura Modular"
                  )}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Resultados */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="glass-effect p-4 rounded-xl"
        >
          <h3 className="text-base font-bold text-accent-400 mb-3 text-center">IMPACTO & RESULTADOS</h3>
          
          <div className="grid grid-cols-4 gap-3 mb-3">
            {results.map((result, index) => (
              <div key={index} className="text-center">
                <div className={`text-2xl font-bold ${result.color}`}>
                  {result.value}
                </div>
                <div className="text-xs text-neutral-400">
                  {result.label}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-3 border-t border-neutral-700">
            <p className="text-xs text-neutral-300 italic">
              "A ANATEL se posiciona como um dos órgãos reguladores mais modernos e tecnologicamente avançados do mundo"
            </p>
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