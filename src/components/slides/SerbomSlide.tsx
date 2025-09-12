import { motion } from 'framer-motion';
import { useState } from 'react';
import { Slide } from '../Slide';
import { Antenna, Network, CheckCircle, Clock, Users, Zap, Building2, Layers } from 'lucide-react';
import { ImageModal, ClickableImage } from '../ImageModal';

export const SerbomSlide = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: '', alt: '', title: '' });

  const openModal = (src: string, alt: string, title: string) => {
    setSelectedImage({ src, alt, title });
    setModalOpen(true);
  };
  const fases = [
    {
      numero: 1,
      nome: "Fase Inicial",
      status: "Executado",
      descricao: "1 eNB para validação técnica",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      numero: 2,
      nome: "Galpões Atuais",
      status: "Planejado",
      descricao: "6 eNBs nos galpões existentes",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20"
    },
    {
      numero: 3,
      nome: "Ampliação",
      status: "Futuro",
      descricao: "Expansão conforme plano diretor",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20"
    }
  ];

  const tecnologias = [
    {
      icon: Antenna,
      title: "pLTE 700MHz",
      description: "Rede privada de alta performance"
    },
    {
      icon: Network,
      title: "Core HaloB",
      description: "Sistema embarcado Telesys"
    },
    {
      icon: Zap,
      title: "Sistema Irradiante",
      description: "Antenas, rabichos, splitters completos"
    },
    {
      icon: Building2,
      title: "CPEs",
      description: "Equipamentos de acesso do cliente"
    }
  ];

  const servicos = [
    "Gerenciamento fim a fim do projeto",
    "Interface com fornecedor Telesys",
    "Drive Test e Fine Tuning",
    "Integração completa da solução",
    "Suporte técnico especializado",
    "Estudo de viabilidade RF completo"
  ];

  return (
    <Slide>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full mb-4">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-bold">PROJETO ENTREGUE AO CLIENTE</span>
          </div>
          
          <h2 className="text-4xl font-display font-bold mb-2">
            <span className="gradient-text">SERBOM - Rede pLTE</span>
          </h2>
          
          <p className="text-lg text-neutral-300">
            Fornecimento de Serviços fim a fim para rede pLTE em 700MHz
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          {/* Escopo do Projeto */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass-effect p-4 rounded-xl">
              <h3 className="text-base font-bold text-accent-400 mb-3 flex items-center gap-2">
                <Layers className="w-5 h-5" />
                ESCOPO E TECNOLOGIAS
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Tecnologias */}
                <div>
                  <h4 className="text-sm font-bold text-white mb-2">STACK TECNOLÓGICA</h4>
                  <div className="space-y-2">
                    {tecnologias.map((tech, index) => {
                      const Icon = tech.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="glass-effect p-2 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-5 h-5 text-accent-400 flex-shrink-0" />
                            <div>
                              <div className="text-xs font-bold text-white">{tech.title}</div>
                              <div className="text-xs text-neutral-400">{tech.description}</div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Serviços CelPlan */}
                <div>
                  <h4 className="text-sm font-bold text-green-400 mb-2">SERVIÇOS CELPLAN</h4>
                  <ul className="space-y-1 text-xs text-neutral-300">
                    {servicos.map((servico, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>{servico}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Resultados Alcançados */}
              <div className="border-t border-neutral-700 pt-3">
                <h4 className="text-sm font-bold text-green-400 mb-2">RESULTADOS</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="glass-effect p-2 rounded-lg">
                    <div className="text-xs font-bold text-white mb-1">Cobertura</div>
                    <div className="text-xs text-neutral-400">Otimizada para toda a área industrial</div>
                  </div>
                  <div className="glass-effect p-2 rounded-lg">
                    <div className="text-xs font-bold text-white mb-1">Performance</div>
                    <div className="text-xs text-neutral-400">KPIs excedendo expectativas</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Screenshots do Projeto */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h3 className="text-xs font-bold text-accent-400 mb-2 text-center">PROJETO EM OPERAÇÃO</h3>
            
            {/* Grid 2x2 de Imagens */}
            <div className="grid grid-cols-2 gap-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-effect p-2 rounded-lg"
              >
                <ClickableImage
                  src="/Cases_sucesso/Serbon/teste em campo cobertura .png"
                  alt="Teste de Cobertura em Campo"
                  title="Cobertura"
                  className="w-full h-20 object-cover rounded"
                  onClick={() => openModal(
                    "/Cases_sucesso/Serbon/teste em campo cobertura .png",
                    "Teste de cobertura em campo - Validação da rede pLTE SERBOM",
                    "Teste de Cobertura em Campo"
                  )}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="glass-effect p-2 rounded-lg"
              >
                <ClickableImage
                  src="/Cases_sucesso/Serbon/teste em campo Kps.png"
                  alt="KPIs de Performance"
                  title="KPIs"
                  className="w-full h-20 object-cover rounded"
                  onClick={() => openModal(
                    "/Cases_sucesso/Serbon/teste em campo Kps.png",
                    "Indicadores de performance (KPIs) da rede pLTE SERBOM",
                    "KPIs de Performance"
                  )}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="glass-effect p-2 rounded-lg"
              >
                <ClickableImage
                  src="/Cases_sucesso/Serbon/prediçao-plano diretor cobertura.png"
                  alt="Predição de Cobertura"
                  title="Predição"
                  className="w-full h-20 object-cover rounded"
                  onClick={() => openModal(
                    "/Cases_sucesso/Serbon/prediçao-plano diretor cobertura.png",
                    "Predição de cobertura conforme plano diretor SERBOM",
                    "Predição de Cobertura - Plano Diretor"
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
                  src="/Cases_sucesso/Serbon/RRU.jpg"
                  alt="Equipamento RRU"
                  title="RRU"
                  className="w-full h-20 object-cover rounded"
                  onClick={() => openModal(
                    "/Cases_sucesso/Serbon/RRU.jpg",
                    "Equipamento RRU (Remote Radio Unit) instalado no projeto SERBOM",
                    "Equipamento RRU"
                  )}
                />
              </motion.div>
            </div>
            
            {/* Fases Compactas */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-neutral-400 text-center">3 FASES DE EXECUÇÃO</h4>
              {fases.map((fase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  className="glass-effect p-2 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`${fase.bgColor} px-2 py-1 rounded-full`}>
                        <span className={`text-xs font-bold ${fase.color}`}>F{fase.numero}</span>
                      </div>
                      <span className="text-xs font-bold text-white">{fase.nome}</span>
                    </div>
                    <span className={`text-xs font-bold ${fase.color}`}>
                      {fase.status}
                    </span>
                  </div>
                </motion.div>
              ))}
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
          <h3 className="text-base font-bold text-accent-400 mb-3 text-center">CONFIGURAÇÃO DO PROJETO</h3>
          
          <div className="grid grid-cols-4 gap-4 mb-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">1+6</div>
              <div className="text-xs text-neutral-400">eNBs Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">700MHz</div>
              <div className="text-xs text-neutral-400">Frequência</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">pLTE</div>
              <div className="text-xs text-neutral-400">Tecnologia</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">Telesys</div>
              <div className="text-xs text-neutral-400">Parceiro</div>
            </div>
          </div>

          <div className="text-center pt-3 border-t border-neutral-700">
            <p className="text-xs text-neutral-300 italic">
              "CelPlan como integradora fim a fim, garantindo o sucesso completo do projeto pLTE da SERBOM"
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