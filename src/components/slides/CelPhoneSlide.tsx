import { motion } from 'framer-motion';
import { useState } from 'react';
import { Slide } from '../Slide';
import { Smartphone, MapPin, BarChart3, Users, CheckCircle, Target, TrendingUp, Wifi } from 'lucide-react';
import { ImageModal, ClickableImage } from '../ImageModal';

export const CelPhoneSlide = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: '', alt: '', title: '' });

  const openModal = (src: string, alt: string, title: string) => {
    setSelectedImage({ src, alt, title });
    setModalOpen(true);
  };

  const features = [
    {
      icon: Smartphone,
      title: "Aplicativo no Dispositivo",
      description: "Instalado no celular do usuário para medição em campo",
      color: "text-blue-400"
    },
    {
      icon: MapPin,
      title: "Georreferenciamento",
      description: "Localização precisa de cada medição realizada",
      color: "text-green-400"
    },
    {
      icon: BarChart3,
      title: "Heatmap de Satisfação",
      description: "Visualização geográfica da qualidade percebida",
      color: "text-purple-400"
    },
    {
      icon: Users,
      title: "QoE Real",
      description: "Avaliação direta da experiência do usuário",
      color: "text-yellow-400"
    }
  ];

  const differentials = [
    {
      title: "Medição Direta",
      description: "Diferente de métodos via core da rede, captura a real experiência do usuário final",
      icon: Target
    },
    {
      title: "Visibilidade Completa",
      description: "Informações disponíveis para usuário, regulador e operador",
      icon: Users
    },
    {
      title: "Analytics em Tempo Real",
      description: "Servidor recebe e processa dados georreferenciados continuamente",
      icon: TrendingUp
    }
  ];

  const technologies = [
    "Android/iOS App",
    "AWS Cloud",
    "Geolocalização",
    "Analytics Real-time",
    "Heatmap Visualization",
    "REST API"
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
            <Smartphone className="w-4 h-4" />
            <span className="text-xs font-bold">SOLUÇÃO EM PRODUÇÃO</span>
          </div>

          <h2 className="text-4xl font-display font-bold mb-2">
            <span className="gradient-text">CelPhone™ - QoE em Campo</span>
          </h2>

          <p className="text-lg text-neutral-300">
            Medição Direta da Satisfação do Usuário com Georreferenciamento
          </p>
        </motion.div>

        {/* Descrição Principal e Imagem Google Play */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-3 mb-3"
        >
          {/* O que é */}
          <div className="glass-effect p-4 rounded-xl">
            <h3 className="text-sm font-bold text-accent-400 mb-3 flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              O QUE É CELPHONE™
            </h3>
            <div className="space-y-2 text-sm text-neutral-300">
              <p>
                <span className="font-bold text-white">CelPhone™</span> é um aplicativo instalado no celular
                que avalia <span className="text-blue-400 font-semibold">direta e indiretamente a satisfação do usuário</span>
                e indica ao usuário, ao regulador e ao operador a distribuição de qualidade ao longo da rede sem fio.
              </p>
              <p>
                Diferente de outros métodos (ex: via core da rede) que <span className="text-red-400">não conseguem avaliar
                a satisfação do usuário</span>, o CelPhone mede o desempenho da rede <span className="text-green-400 font-semibold">
                exatamente no ponto onde o usuário está</span>.
              </p>
              <p>
                O aplicativo fica medindo conforme configurado e <span className="text-purple-400 font-semibold">envia
                via servidor todas as informações georreferenciadas</span>, permitindo criar um
                <span className="text-yellow-400 font-semibold"> heatmap de satisfação</span> do usuário em cada local.
              </p>
            </div>
          </div>

          {/* Imagem Google Play */}
          <div className="glass-effect p-3 rounded-xl">
            <h3 className="text-xs font-bold text-neutral-400 mb-2 text-center">DISPONÍVEL NA LOJA</h3>
            <ClickableImage
              src="/cases-sucesso/CelPhone/Foto do CelPlhone no google play.png"
              alt="CelPhone disponível no Google Play"
              title="CelPhone no Google Play"
              className="w-full h-64 object-contain rounded-lg"
              onClick={() => openModal(
                "/cases-sucesso/CelPhone/Foto do CelPlhone no google play.png",
                "Aplicativo CelPhone disponível para download no Google Play Store",
                "CelPhone - Google Play Store"
              )}
            />
          </div>
        </motion.div>

        {/* Features Principais */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-4 gap-2 mb-3"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="glass-effect p-3 rounded-xl text-center"
              >
                <Icon className={`w-6 h-6 ${feature.color} mx-auto mb-2`} />
                <h4 className="text-xs font-bold text-white mb-1">{feature.title}</h4>
                <p className="text-xs text-neutral-400">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-3 mb-3">
          {/* Diferenciais */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-effect p-4 rounded-xl"
          >
            <h3 className="text-sm font-bold text-accent-400 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              DIFERENCIAIS
            </h3>
            <div className="space-y-2">
              {differentials.map((diff, index) => {
                const Icon = diff.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="glass-effect p-2 rounded-lg"
                  >
                    <div className="flex items-start gap-2">
                      <Icon className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-white mb-0.5">{diff.title}</h4>
                        <p className="text-xs text-neutral-400">{diff.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Tecnologias */}
            <div className="border-t border-neutral-700 pt-3 mt-3">
              <h4 className="text-xs font-bold text-neutral-400 mb-2">STACK TECNOLÓGICA</h4>
              <div className="flex flex-wrap gap-1.5">
                {technologies.map((tech, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.05 }}
                    className="px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded-full text-xs font-medium"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Imagens do Sistema */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="lg:col-span-2 grid md:grid-cols-2 gap-3"
          >
            {/* Coleta */}
            <div className="glass-effect p-3 rounded-xl">
              <h3 className="text-xs font-bold text-neutral-400 mb-2 text-center">COLETA EM CAMPO</h3>
              <ClickableImage
                src="/cases-sucesso/CelPhone/Coleta CelPhone.jpg"
                alt="Processo de coleta de dados CelPhone"
                title="Coleta de Dados"
                className="w-full h-48 object-cover rounded-lg"
                onClick={() => openModal(
                  "/cases-sucesso/CelPhone/Coleta CelPhone.jpg",
                  "Processo de coleta de dados de qualidade de rede via aplicativo CelPhone instalado nos dispositivos dos usuários",
                  "CelPhone - Coleta em Campo"
                )}
              />
            </div>

            {/* Servidor AWS */}
            <div className="glass-effect p-3 rounded-xl">
              <h3 className="text-xs font-bold text-neutral-400 mb-2 text-center">INFRAESTRUTURA CLOUD</h3>
              <ClickableImage
                src="/cases-sucesso/CelPhone/Servidor AWS CellPhone.jpg"
                alt="Servidor AWS processando dados CelPhone"
                title="Infraestrutura AWS"
                className="w-full h-48 object-cover rounded-lg"
                onClick={() => openModal(
                  "/cases-sucesso/CelPhone/Servidor AWS CellPhone.jpg",
                  "Infraestrutura em nuvem AWS que recebe, processa e analisa todas as informações georreferenciadas dos dispositivos",
                  "CelPhone - Servidor AWS"
                )}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-bold">
              Medição real de QoE: do dispositivo do usuário ao heatmap de satisfação
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
