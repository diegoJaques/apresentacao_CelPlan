import { motion } from 'framer-motion';
import { useState } from 'react';
import { Slide } from '../Slide';
import { Radio, Settings, Cloud, Users, Target, BarChart3, CheckCircle, Building2, Wifi } from 'lucide-react';
import { ImageModal, ClickableImage } from '../ImageModal';

export const MOESlide = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: '', alt: '', title: '' });

  const openModal = (src: string, alt: string, title: string) => {
    setSelectedImage({ src, alt, title });
    setModalOpen(true);
  };

  const pillars = [
    {
      icon: Wifi,
      title: "Redes & Infraestrutura",
      subtitle: "Nosso DNA",
      color: "text-blue-400",
      items: [
        "Engenharia de RF (Rádio Frequência)",
        "Especialistas em CORE de Rede",
        "Otimização e Performance",
        "Times de Campo (QUAD)"
      ]
    },
    {
      icon: Settings,
      title: "Gestão & Execução",
      subtitle: "Sua Garantia",
      color: "text-green-400",
      items: [
        "Gerentes de Projetos (PMO)",
        "Mapeamento de Processos",
        "Governança e Qualidade (QA)",
        "Execução Ágil"
      ]
    },
    {
      icon: Cloud,
      title: "TI, Dados & DevOps",
      subtitle: "O Futuro",
      color: "text-purple-400",
      items: [
        "Consultores de Dados (Data Science & BI)",
        "Engenheiros de DevOps",
        "Arquitetos de Soluções (Cloud/On-premise)",
        "Automação e CI/CD"
      ]
    }
  ];

  const clients = [
    { name: "Claro", color: "text-red-400" },
    { name: "TIM", color: "text-blue-400" },
    { name: "Nokia", color: "text-cyan-400" },
    { name: "Huawei", color: "text-red-400" },
    { name: "SBA", color: "text-green-400" },
    { name: "Unifique", color: "text-purple-400" }
  ];

  const differentials = [
    {
      icon: Target,
      title: "Expertise Comprovada",
      description: "Times especializados com experiência em grandes operadoras",
      color: "text-blue-400"
    },
    {
      icon: Users,
      title: "Equipes Gerenciadas",
      description: "Mais que alocação, entregamos gestão completa",
      color: "text-green-400"
    },
    {
      icon: BarChart3,
      title: "Resultados Mensuráveis",
      description: "KPIs claros e governança de qualidade",
      color: "text-purple-400"
    }
  ];

  return (
    <Slide>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded-full mb-2">
            <Building2 className="w-4 h-4" />
            <span className="text-xs font-bold">SERVIÇO ESTRATÉGICO ATIVO</span>
          </div>

          <h2 className="text-4xl font-display font-bold mb-2">
            <span className="gradient-text">Expertise Completa em MOE</span>
          </h2>

          <p className="text-lg text-neutral-300 mb-2">
            Do Core da Rede à Inteligência de Dados: O Parceiro Estratégico para sua Operação
          </p>

          {/* Clientes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <span className="text-xs text-neutral-400 font-medium">CLIENTES:</span>
            {clients.map((client, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className={`text-sm font-bold ${client.color}`}
              >
                {client.name}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-3 mb-3">
          {/* Os 3 Pilares */}
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="glass-effect p-4 rounded-xl"
              >
                <div className="flex items-start gap-2 mb-3">
                  <Icon className={`w-6 h-6 ${pillar.color} flex-shrink-0`} />
                  <div>
                    <h3 className="text-sm font-bold text-white">{pillar.title}</h3>
                    <p className={`text-xs ${pillar.color} font-medium`}>{pillar.subtitle}</p>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {pillar.items.map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 + idx * 0.05 }}
                      className="flex items-start gap-2 text-xs text-neutral-300"
                    >
                      <CheckCircle className={`w-3 h-3 ${pillar.color} flex-shrink-0 mt-0.5`} />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Diferenciais + Imagem */}
        <div className="grid lg:grid-cols-2 gap-3 mb-3">
          {/* Diferenciais */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-effect p-4 rounded-xl"
          >
            <h3 className="text-sm font-bold text-accent-400 mb-3 flex items-center gap-2">
              <Radio className="w-4 h-4" />
              DIFERENCIAIS COMPETITIVOS
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
                      <Icon className={`w-4 h-4 ${diff.color} flex-shrink-0 mt-0.5`} />
                      <div>
                        <h4 className="text-xs font-bold text-white mb-0.5">{diff.title}</h4>
                        <p className="text-xs text-neutral-400">{diff.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Imagem */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="glass-effect p-3 rounded-xl"
          >
            <h3 className="text-xs font-bold text-neutral-400 mb-2 text-center">NOSSAS ÁREAS DE ATUAÇÃO</h3>
            <ClickableImage
              src="/cases-sucesso/MOE/dashboard.png"
              alt="Hub de comando TIC - Redes, Dados e DevOps"
              title="Expertise em TIC"
              className="w-full h-48 object-cover rounded-lg"
              onClick={() => openModal(
                "/cases-sucesso/MOE/dashboard.png",
                "Centro de operações tecnológicas mostrando expertise em Redes, Análise de Dados, DevOps e Gestão de Projetos",
                "Hub de Comando TIC - MOE CelPlan"
              )}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-accent-500/20 text-accent-400 px-4 py-2 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-bold">
              CelPlan MOE: Mais do que alocação. Entregamos equipes gerenciadas, know-how e resultados comprovados
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
