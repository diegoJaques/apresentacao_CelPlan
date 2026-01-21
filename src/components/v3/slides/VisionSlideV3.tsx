import { motion } from 'framer-motion';
import { Shield, Scan, Cpu, Eye, Camera, AlertTriangle } from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { Slide } from '../../Slide';

export const VisionSlideV3 = () => {
  const capabilities = [
    {
      icon: Shield,
      title: 'Detecção de EPI',
      subtitle: 'Safety Compliance',
      description: 'Verificação automática de equipamentos de segurança',
      specs: ['Capacetes', 'Uniformes', 'Luvas', 'Óculos'],
      gradient: 'from-primary-500 to-primary-700'
    },
    {
      icon: Scan,
      title: 'OCR / LPR',
      subtitle: 'Character Recognition',
      description: 'Reconhecimento ótico industrial de caracteres e placas',
      specs: ['Placas veiculares', 'Documentos', 'Etiquetas', 'Serial numbers'],
      gradient: 'from-accent-500 to-accent-700'
    },
    {
      icon: Cpu,
      title: 'Edge AI',
      subtitle: 'Real-time Processing',
      description: 'Processamento em borda com alta precisão e baixa latência',
      specs: ['Tempo real', 'Offline capable', 'Alta precisão', 'Privacidade'],
      gradient: 'from-brand-500 to-brand-700'
    }
  ];

  const useCases = [
    {
      icon: AlertTriangle,
      title: 'Detecção de Intrusão',
      description: 'Alertas em tempo real de acessos não autorizados'
    },
    {
      icon: Eye,
      title: 'Análise Comportamental',
      description: 'Identificação de padrões e anomalias'
    },
    {
      icon: Camera,
      title: 'Contagem de Pessoas',
      description: 'Monitoramento de fluxo e ocupação'
    }
  ];

  return (
    <Slide background="dark">
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-primary-50 dark:from-slate-900 dark:via-primary-900/20 dark:to-slate-900 py-20 px-8 transition-colors duration-300">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent">
            Video Analytics
          </h2>

          <p className="text-xl text-slate-600 dark:text-neutral-300 max-w-3xl mx-auto mb-2">
            Transformamos vídeo em dados acionáveis
          </p>

          <p className="text-sm text-slate-500 dark:text-neutral-500">
            Detecção de EPI, intrusão, OCR/LPR industrial e processamento em Edge AI
          </p>
        </motion.div>

        {/* Capabilities Grid */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {capabilities.map((cap, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <GlassCard className="h-full">
                  <div className={`p-6 h-full flex flex-col bg-gradient-to-br ${cap.gradient}/10 relative overflow-hidden`}>
                    {/* Background decoration */}
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full">
                      <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-neutral-400 font-semibold mb-1">
                        {cap.subtitle}
                      </span>

                      <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-2">
                        {cap.title}
                      </h3>

                      <p className="text-slate-600 dark:text-neutral-300 text-sm mb-4 leading-relaxed">
                        {cap.description}
                      </p>

                      {/* Specs */}
                      <div className="mt-auto space-y-2">
                        {cap.specs.map((spec, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
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

        {/* Use Cases */}
        <div className="max-w-6xl mx-auto mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-white text-center mb-6">
              Principais Aplicações
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <GlassCard>
                    <div className="p-5 text-center bg-gradient-to-br from-primary-500/10 to-transparent">
                      <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                        {useCase.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-neutral-400">
                        {useCase.description}
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
            <div className="p-6 bg-gradient-to-r from-primary-500/20 via-brand-500/20 to-accent-500/20">
              <p className="text-lg text-slate-700 dark:text-neutral-200">
                Processamento <span className="text-primary-600 dark:text-primary-400 font-semibold">em Edge AI</span> com{' '}
                <span className="text-brand-600 dark:text-brand-400 font-semibold">alta precisão</span> e{' '}
                <span className="text-accent-600 dark:text-accent-400 font-semibold">baixa latência</span>
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </Slide>
  );
};
