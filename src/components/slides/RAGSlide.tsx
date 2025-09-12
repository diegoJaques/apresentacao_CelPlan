import { motion } from 'framer-motion';
import { useState } from 'react';
import { Slide } from '../Slide';
import { Database, Search, Shield, Clock, MessageSquare, FileText, Lock, Rocket } from 'lucide-react';
import { ImageModal, ClickableImage } from '../ImageModal';

export const RAGSlide = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: '', alt: '', title: '' });

  const openModal = (src: string, alt: string, title: string) => {
    setSelectedImage({ src, alt, title });
    setModalOpen(true);
  };
  const benefits = [
    {
      icon: Shield,
      title: "Confiança Absoluta",
      description: "Respostas 100% baseadas nos seus documentos",
      highlight: "100%",
      color: "text-blue-400"
    },
    {
      icon: Clock,
      title: "Eficiência Operacional",
      description: "Redução no tempo de busca por informações",
      highlight: "90%",
      color: "text-green-400"
    },
    {
      icon: Lock,
      title: "Segurança Garantida",
      description: "Dados sob controle total da empresa",
      highlight: "LGPD",
      color: "text-purple-400"
    }
  ];

  const techStack = ["Python", "React", "Docker", "PostgreSQL", "LangChain", "OpenAI"];

  const workflow = [
    { step: 1, title: "Upload", description: "Documentos PDF, Word", icon: FileText },
    { step: 2, title: "Processamento", description: "IA organiza informações", icon: Database },
    { step: 3, title: "Consulta", description: "Perguntas naturais", icon: MessageSquare },
    { step: 4, title: "Resposta", description: "Com fonte exata", icon: Search }
  ];

  return (
    <Slide>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full mb-4">
            <Database className="w-5 h-5" />
            <span className="text-sm font-bold">SISTEMA EM PRODUÇÃO</span>
          </div>
          
          <h2 className="text-5xl font-display font-bold mb-3">
            <span className="gradient-text">Plataforma RAG Inteligente</span>
          </h2>
          
          <p className="text-xl text-neutral-300">
            Transformando documentos em conhecimento acessível instantaneamente
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
                    Como garantir acesso rápido e preciso a informações espalhadas em centenas de documentos, manuais e relatórios?
                  </p>
                  <ul className="space-y-2 text-sm text-neutral-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>Perda de tempo procurando informações</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>Conhecimento descentralizado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>Dificuldade de onboarding</span>
                    </li>
                  </ul>
                </div>

                {/* Nossa Solução */}
                <div>
                  <h3 className="text-lg font-bold text-green-400 mb-3">NOSSA SOLUÇÃO</h3>
                  <p className="text-sm text-neutral-200 mb-3">
                    Chat inteligente treinado exclusivamente com documentos da empresa
                  </p>
                  <ul className="space-y-2 text-sm text-neutral-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Respostas instantâneas e precisas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Base de conhecimento centralizada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Fonte exata da informação</span>
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
              transition={{ delay: 0.8 }}
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

        {/* Screenshots */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-effect p-4 rounded-xl"
        >
          <h3 className="text-sm font-bold text-neutral-400 mb-3 text-center">PLATAFORMA EM OPERAÇÃO</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-effect p-2 rounded-lg">
              <ClickableImage
                src="/Cases_sucesso/RAG/coleções.png"
                alt="Coleções de Documentos"
                title="Gestão de Coleções"
                className="w-full h-24 object-cover rounded"
                onClick={() => openModal(
                  "/Cases_sucesso/RAG/coleções.png",
                  "Interface de gestão de coleções de documentos da plataforma RAG",
                  "Gestão de Coleções de Documentos"
                )}
              />
            </div>
            <div className="glass-effect p-2 rounded-lg">
              <ClickableImage
                src="/Cases_sucesso/RAG/chatbot modular.png"
                alt="Chat Modular"
                title="Interface de Chat"
                className="w-full h-24 object-cover rounded"
                onClick={() => openModal(
                  "/Cases_sucesso/RAG/chatbot modular.png",
                  "Interface de chat inteligente para interação com documentos",
                  "Chat Inteligente RAG"
                )}
              />
            </div>
            <div className="glass-effect p-2 rounded-lg">
              <ClickableImage
                src="/Cases_sucesso/RAG/preview da conversão - estaticas do documento.png"
                alt="Preview e Estatísticas"
                title="Análise de Documentos"
                className="w-full h-24 object-cover rounded"
                onClick={() => openModal(
                  "/Cases_sucesso/RAG/preview da conversão - estaticas do documento.png",
                  "Preview do processamento e estatísticas detalhadas dos documentos",
                  "Análise e Estatísticas de Documentos"
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
          <p className="text-sm text-neutral-300 italic">
            "Transforme seus documentos estáticos em uma base de conhecimento viva e interativa"
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