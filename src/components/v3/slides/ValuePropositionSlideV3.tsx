import { motion } from 'framer-motion';
import { Rocket, Shield, Zap } from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { Slide } from '../../Slide';
import { EditableText } from '../../EditableText';

export const ValuePropositionSlideV3 = () => {
  const values = [
    {
      title: 'Integração End-to-End',
      subtitle: 'Turnkey Solutions',
      description: 'Atuamos desde o projeto inicial até a operação final',
      specs: ['Projeto completo', 'Implementação', 'Operação', 'Suporte contínuo'],
      gradient: 'from-brand-500 to-brand-700'
    },
    {
      title: 'Domínio Multitecnologia',
      subtitle: 'Engenharia Própria',
      description: 'Equipe especializada em ambientes críticos e complexos',
      specs: ['Engenheiros seniores', 'Tecnologias avançadas', 'Ambientes críticos', 'Alta complexidade'],
      gradient: 'from-primary-500 to-primary-700'
    },
    {
      title: 'Visão Unificada',
      subtitle: 'Rede + Dados + IA',
      description: 'Integração total entre infraestrutura, dados e inteligência',
      specs: ['Infraestrutura integrada', 'Dados centralizados', 'IA aplicada', 'Máxima eficiência'],
      gradient: 'from-accent-500 to-accent-700'
    }
  ];

  const differentials = [
    {
      title: 'Parceria Estratégica',
      description: 'Atuamos como parceiro de longo prazo'
    },
    {
      title: 'ROI Acelerado',
      description: 'Resultados mensuráveis em até 12 meses'
    },
    {
      title: 'Experiência Global',
      description: '30+ anos de expertise em 6 continentes'
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
          <EditableText
            id="value-prop-title"
            defaultText="Nossa Proposta de Valor"
            className="text-5xl md:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-brand-400 via-primary-400 to-brand-400 bg-clip-text text-transparent"
            tag="h2"
          />

          <EditableText
            id="value-prop-subtitle"
            defaultText="O que nos diferencia no mercado"
            className="text-xl text-slate-600 dark:text-neutral-300 max-w-3xl mx-auto mb-2"
            tag="p"
          />

          <EditableText
            id="value-prop-description"
            defaultText="Impulsionamos seu negócio com tecnologia e expertise"
            className="text-sm text-slate-500 dark:text-neutral-500"
            tag="p"
          />
        </motion.div>

        {/* Values Grid */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <GlassCard className="h-full">
                  <div className={`p-6 h-full flex flex-col bg-gradient-to-br ${value.gradient}/10 relative overflow-hidden`}>
                    {/* Background decoration */}
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full">
                      <EditableText
                        id={`value-card-subtitle-${index}`}
                        defaultText={value.subtitle}
                        className="text-xs uppercase tracking-wider text-slate-500 dark:text-neutral-400 font-semibold mb-1"
                        tag="span"
                      />

                      <EditableText
                        id={`value-card-title-${index}`}
                        defaultText={value.title}
                        className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-2"
                        tag="h3"
                      />

                      <EditableText
                        id={`value-card-desc-${index}`}
                        defaultText={value.description}
                        className="text-slate-600 dark:text-neutral-300 text-sm mb-4 leading-relaxed"
                        tag="p"
                      />

                      {/* Specs */}
                      <div className="mt-auto space-y-2">
                        {value.specs.map((spec, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                            <EditableText
                              id={`value-card-spec-${index}-${i}`}
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

        {/* Differentials */}
        <div className="max-w-6xl mx-auto mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-white text-center mb-6">
              Nossos Diferenciais
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {differentials.map((diff, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <GlassCard>
                    <div className="p-5 text-center bg-gradient-to-br from-brand-500/10 to-transparent">
                      <EditableText
                        id={`diff-card-title-${index}`}
                        defaultText={diff.title}
                        className="text-lg font-semibold text-slate-800 dark:text-white mb-2"
                        tag="h4"
                      />
                      <EditableText
                        id={`diff-card-desc-${index}`}
                        defaultText={diff.description}
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
            <div className="p-6 bg-gradient-to-r from-brand-500/20 via-primary-500/20 to-accent-500/20">
              <p className="text-lg text-slate-700 dark:text-neutral-200">
                Combinamos <span className="text-brand-600 dark:text-brand-400 font-semibold">inovação tecnológica</span> com{' '}
                <span className="text-primary-600 dark:text-primary-400 font-semibold">expertise comprovada</span> para{' '}
                <span className="text-accent-600 dark:text-accent-400 font-semibold">impulsionar resultados</span>
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </Slide>
  );
};
