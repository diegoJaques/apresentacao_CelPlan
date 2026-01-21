import { motion } from 'framer-motion';
import { AlertTriangle, Lightbulb, Target } from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { Slide } from '../../Slide';
import { EditableText } from '../../EditableText';

export const ChallengesSlideV3 = () => {
  const challenges = [
    {
      title: 'Infraestrutura Fragmentada',
      subtitle: 'Desafio Operacional',
      description: 'Sistemas isolados e desintegrados que impedem visão holística',
      solution: 'Ecossistemas inteligentes e resilientes',
      specs: ['Integração total', 'Visão unificada', 'Gestão centralizada'],
      gradient: 'from-accent-500 to-accent-700'
    },
    {
      title: 'Falta de Visibilidade',
      subtitle: 'Desafio de Controle',
      description: 'Ausência de monitoramento e dados em tempo real',
      solution: 'Monitoramento completo em tempo real',
      specs: ['Dashboards unificados', 'Alertas proativos', 'KPIs em tempo real'],
      gradient: 'from-primary-500 to-primary-700'
    },
    {
      title: 'Processos Manuais',
      subtitle: 'Desafio de Eficiência',
      description: 'Operações manuais que geram ineficiência e erros',
      solution: 'Automação inteligente de ponta a ponta',
      specs: ['Workflows automáticos', 'IA aplicada', 'Redução de erros'],
      gradient: 'from-brand-500 to-brand-700'
    }
  ];

  const benefits = [
    {
      title: 'Dados Integrados',
      description: 'Integração total e interoperabilidade entre sistemas'
    },
    {
      title: 'Previsibilidade',
      description: 'Previsibilidade e escalabilidade garantidas'
    },
    {
      title: 'Redução de Custos',
      description: 'Otimização de recursos e redução de desperdícios'
    }
  ];

  return (
    <Slide background="dark">
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-accent-50 dark:from-slate-900 dark:via-accent-900/20 dark:to-slate-900 py-20 px-8 transition-colors duration-300">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <EditableText
            id="challenges-title"
            defaultText="Desafios que Resolvemos"
            className="text-5xl md:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-accent-400 via-brand-400 to-accent-400 bg-clip-text text-transparent"
            tag="h2"
          />

          <EditableText
            id="challenges-subtitle"
            defaultText="Transformamos problemas complexos em soluções inovadoras"
            className="text-xl text-slate-600 dark:text-neutral-300 max-w-3xl mx-auto mb-2"
            tag="p"
          />

          <EditableText
            id="challenges-description"
            defaultText="Do diagnóstico à implementação completa"
            className="text-sm text-slate-500 dark:text-neutral-500"
            tag="p"
          />
        </motion.div>

        {/* Challenges Grid */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <GlassCard className="h-full">
                  <div className={`p-6 h-full flex flex-col bg-gradient-to-br ${challenge.gradient}/10 relative overflow-hidden`}>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full">
                      <EditableText
                        id={`challenge-subtitle-${index}`}
                        defaultText={challenge.subtitle}
                        className="text-xs uppercase tracking-wider text-slate-600 dark:text-neutral-400 font-semibold mb-1"
                        tag="span"
                      />

                      <EditableText
                        id={`challenge-title-${index}`}
                        defaultText={challenge.title}
                        className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-2"
                        tag="h3"
                      />

                      <EditableText
                        id={`challenge-description-${index}`}
                        defaultText={challenge.description}
                        className="text-slate-600 dark:text-neutral-300 text-sm mb-3 leading-relaxed"
                        tag="p"
                      />

                      {/* Divider */}
                      <div className="h-px bg-gradient-to-r from-transparent via-accent-500/30 to-transparent my-3" />

                      {/* Solution */}
                      <div className="mb-3">
                        <span className="text-xs uppercase tracking-wider text-accent-600 dark:text-accent-400 font-semibold block mb-2">
                          Nossa Solução
                        </span>
                        <EditableText
                          id={`challenge-solution-${index}`}
                          defaultText={challenge.solution}
                          className="text-slate-700 dark:text-white font-semibold text-sm"
                          tag="p"
                        />
                      </div>

                      {/* Specs */}
                      <div className="mt-auto space-y-2">
                        {challenge.specs.map((spec, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                            <EditableText
                              id={`challenge-spec-${index}-${i}`}
                              defaultText={spec}
                              className="text-xs text-slate-600 dark:text-neutral-400"
                              tag="span"
                            />
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

        {/* Benefits */}
        <div className="max-w-6xl mx-auto mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <EditableText
              id="challenges-benefits-title"
              defaultText="Benefícios Imediatos"
              className="text-2xl font-display font-bold text-slate-800 dark:text-white text-center mb-6"
              tag="h3"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <GlassCard>
                    <div className="p-5 text-center bg-gradient-to-br from-accent-500/10 to-transparent">
                      <EditableText
                        id={`benefit-title-${index}`}
                        defaultText={benefit.title}
                        className="text-lg font-semibold text-slate-800 dark:text-white mb-2"
                        tag="h4"
                      />
                      <EditableText
                        id={`benefit-description-${index}`}
                        defaultText={benefit.description}
                        className="text-sm text-slate-600 dark:text-neutral-400"
                        tag="p"
                      />
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
            <div className="p-6 bg-gradient-to-r from-accent-500/20 via-brand-500/20 to-accent-500/20">
              <p className="text-lg text-slate-700 dark:text-neutral-200">
                De <span className="text-slate-800 dark:text-white font-semibold">problemas complexos</span> a{' '}
                <span className="text-brand-600 dark:text-brand-400 font-semibold">soluções eficientes</span> e{' '}
                <span className="text-accent-600 dark:text-accent-400 font-semibold">resultados mensuráveis</span>
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </Slide>
  );
};
