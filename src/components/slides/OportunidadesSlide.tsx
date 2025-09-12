import { motion } from 'framer-motion';
import { useState } from 'react';
import { Slide } from '../Slide';
import { Bot, FileText, Brain, TrendingUp, Zap, BarChart3, Users, CheckCircle } from 'lucide-react';
import { ImageModal, ClickableImage } from '../ImageModal';

export const OportunidadesSlide = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: '', alt: '', title: '' });

  const openModal = (src: string, alt: string, title: string) => {
    setSelectedImage({ src, alt, title });
    setModalOpen(true);
  };
  const agents = [
    {
      icon: FileText,
      name: "Agente de Extração",
      role: "Processa documentos PDF, Word, ZIP, RAR",
      color: "text-blue-400"
    },
    {
      icon: Brain,
      name: "Agente de Análise",
      role: "Classifica e identifica critérios críticos",
      color: "text-purple-400"
    },
    {
      icon: CheckCircle,
      name: "Agente de Decisão",
      role: "Avalia GO/NO-GO com base em critérios",
      color: "text-green-400"
    }
  ];

  const features = [
    "Upload inteligente de múltiplos formatos",
    "Extração automática de dados estruturados",
    "Chat contextual com prompts personalizados",
    "Dashboard executivo com KPIs em tempo real",
    "Classificação automática por área de negócio",
    "Rastreabilidade completa do processo"
  ];

  return (
    <Slide>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full mb-4">
            <Bot className="w-5 h-5" />
            <span className="text-sm font-bold">SISTEMA MULTIAGENTES EM PRODUÇÃO</span>
          </div>
          
          <h2 className="text-5xl font-display font-bold mb-3">
            <span className="gradient-text">Sistema de Captação com IA</span>
          </h2>
          
          <p className="text-xl text-neutral-300">
            Em uso interno CelPlan e BlackBox - Análise inteligente de oportunidades
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Sistema Multiagentes */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass-effect p-6 rounded-xl h-full">
              <h3 className="text-lg font-bold text-accent-400 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                ARQUITETURA MULTIAGENTES
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {agents.map((agent, index) => {
                  const Icon = agent.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="glass-effect p-4 rounded-lg">
                        <Icon className={`w-10 h-10 ${agent.color} mx-auto mb-2`} />
                        <div className="text-sm font-bold text-white mb-1">{agent.name}</div>
                        <div className="text-xs text-neutral-400">{agent.role}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="border-t border-neutral-700 pt-4">
                <h4 className="text-sm font-bold text-neutral-400 mb-3">FUNCIONALIDADES PRINCIPAIS</h4>
                <div className="grid grid-cols-2 gap-2">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className="flex items-center gap-2 text-sm text-neutral-200"
                    >
                      <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.div>
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
            className="space-y-4"
          >
            {/* Problema vs Solução */}
            <div className="glass-effect p-4 rounded-xl">
              <h4 className="text-sm font-bold text-red-400 mb-2">PROBLEMA</h4>
              <p className="text-xs text-neutral-300 mb-3">
                Análise manual de editais consome tempo e recursos valiosos
              </p>
              
              <h4 className="text-sm font-bold text-green-400 mb-2">SOLUÇÃO</h4>
              <p className="text-xs text-neutral-300">
                Automação inteligente com decisões precisas em minutos
              </p>
            </div>

            {/* Métricas */}
            <div className="glass-effect p-4 rounded-xl">
              <h4 className="text-sm font-bold text-accent-400 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                RESULTADOS
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Velocidade de Análise</span>
                    <span className="text-green-400 font-bold">+85%</span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Precisão GO/NO-GO</span>
                    <span className="text-blue-400 font-bold">92%</span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Redução de Tempo</span>
                    <span className="text-purple-400 font-bold">-75%</span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div className="bg-purple-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Screenshots do Sistema */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-effect p-4 rounded-xl"
        >
          <h3 className="text-sm font-bold text-neutral-400 mb-3 text-center">SISTEMA EM OPERAÇÃO</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="glass-effect p-2 rounded-lg">
              <ClickableImage
                src="/cases-sucesso/oportunidades/Tela de Leads.png"
                alt="Dashboard de Leads"
                title="Dashboard"
                className="w-full h-24 object-cover rounded"
                onClick={() => openModal(
                  "/cases-sucesso/oportunidades/Tela de Leads.png",
                  "Dashboard executivo com visão geral das oportunidades e KPIs em tempo real",
                  "Dashboard de Leads e Oportunidades"
                )}
              />
            </div>
            <div className="glass-effect p-2 rounded-lg">
              <ClickableImage
                src="/cases-sucesso/oportunidades/configuração do agente .png"
                alt="Configuração de Agentes"
                title="Config. Agentes"
                className="w-full h-24 object-cover rounded"
                onClick={() => openModal(
                  "/cases-sucesso/oportunidades/configuração do agente .png",
                  "Interface de configuração dos agentes de IA para análise personalizada",
                  "Configuração de Agentes Inteligentes"
                )}
              />
            </div>
            <div className="glass-effect p-2 rounded-lg">
              <ClickableImage
                src="/cases-sucesso/oportunidades/informações extraidas peloa agente de IA.png"
                alt="Extração de Dados"
                title="Extração IA"
                className="w-full h-24 object-cover rounded"
                onClick={() => openModal(
                  "/cases-sucesso/oportunidades/informações extraidas peloa agente de IA.png",
                  "Dados estruturados extraídos automaticamente dos editais pela IA",
                  "Extração Inteligente de Dados"
                )}
              />
            </div>
            <div className="glass-effect p-2 rounded-lg">
              <ClickableImage
                src="/cases-sucesso/oportunidades/interação inteligencia com o edita, chat bot.png"
                alt="Chat Contextual"
                title="Chat Context"
                className="w-full h-24 object-cover rounded"
                onClick={() => openModal(
                  "/cases-sucesso/oportunidades/interação inteligencia com o edita, chat bot.png",
                  "Chat contextual para análise detalhada e perguntas específicas sobre editais",
                  "Chat Inteligente com Editais"
                )}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-bold">Acelerando decisões estratégicas com IA</span>
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