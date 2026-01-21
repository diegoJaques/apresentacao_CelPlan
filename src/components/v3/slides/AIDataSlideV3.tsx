import { motion } from 'framer-motion';
import { Brain, Zap, Database } from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { Slide } from '../../Slide';

export const AIDataSlideV3 = () => {
  const features = [
    {
      title: 'LLMs/SLMs Privados',
      subtitle: 'AI Training',
      description: 'Modelos de linguagem treinados com seus dados corporativos',
      specs: ['RAG implementation', 'Fine-tuning', 'On-premise', 'Alta acurácia'],
      gradient: 'from-brand-500 to-brand-700'
    },
    {
      title: 'Automação de Fluxos',
      subtitle: 'Intelligent Workflows',
      description: 'Agentes de IA dedicados para automatização de processos',
      specs: ['Chatbots corporativos', 'Análise preditiva', 'Detecção anomalias', 'Auto-documentação'],
      gradient: 'from-primary-500 to-primary-700'
    },
    {
      title: 'Gêmeos Digitais',
      subtitle: 'Digital Twins',
      description: 'Simulação e otimização de processos industriais complexos',
      specs: ['Simulação real-time', 'Otimização contínua', 'Integração IoT', 'Previsão de falhas'],
      gradient: 'from-accent-500 to-accent-700'
    }
  ];

  const integrations = [
    {
      title: 'Integração Corporativa',
      description: 'APIs com ERP, CRM, SCADA e sistemas industriais'
    },
    {
      title: 'Redução de Custos',
      description: 'Até 75% de redução em processos manuais'
    },
    {
      title: 'Segurança e Privacidade',
      description: 'Dados permanecem em ambiente controlado'
    }
  ];

  return (
    <Slide background="dark">
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-brand-50 dark:from-slate-900 dark:via-brand-900/20 dark:to-slate-900 py-20 px-8 transition-colors duration-300">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-brand-400 via-primary-400 to-brand-400 bg-clip-text text-transparent">
            Inteligência Artificial e Dados
          </h2>

          <p className="text-xl text-slate-600 dark:text-neutral-300 max-w-3xl mx-auto mb-2">
            IA aplicada de forma prática para redução de custos e riscos
          </p>

          <p className="text-sm text-slate-500 dark:text-neutral-500">
            LLMs/SLMs privados, automatização e gêmeos digitais
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <GlassCard className="h-full">
                  <div className={`p-6 h-full flex flex-col bg-gradient-to-br ${feature.gradient}/10 relative overflow-hidden`}>
                    {/* Background decoration */}
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full">
                      <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-neutral-400 font-semibold mb-1">
                        {feature.subtitle}
                      </span>

                      <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-2">
                        {feature.title}
                      </h3>

                      <p className="text-slate-600 dark:text-neutral-300 text-sm mb-4 leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Specs */}
                      <div className="mt-auto space-y-2">
                        {feature.specs.map((spec, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                            <span className="text-xs text-slate-600 dark:text-neutral-400">{spec}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div className="max-w-6xl mx-auto mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-white text-center mb-6">
              Diferenciais Competitivos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {integrations.map((integration, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <GlassCard>
                    <div className="p-5 text-center bg-gradient-to-br from-brand-500/10 to-transparent">
                      <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                        {integration.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-neutral-400">
                        {integration.description}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <GlassCard className="max-w-4xl mx-auto" hover={false}>
            <div className="p-6 bg-gradient-to-r from-brand-500/20 via-primary-500/20 to-accent-500/20">
              <p className="text-lg text-slate-700 dark:text-neutral-200">
                IA <span className="text-brand-600 dark:text-brand-400 font-semibold">privada e segura</span> com{' '}
                <span className="text-primary-600 dark:text-primary-400 font-semibold">integração total</span> aos seus{' '}
                <span className="text-accent-600 dark:text-accent-400 font-semibold">sistemas corporativos</span>
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </Slide>
  );
};
