import { motion } from 'framer-motion';
import { Radio, MapPin, Wifi, Package, Gauge, Network } from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { Slide } from '../../Slide';

export const IoTSlideV3 = () => {
  const technologies = [
    {
      icon: Radio,
      title: 'LoRaWAN',
      subtitle: 'Long Range',
      description: 'Rede privada de longo alcance e baixo consumo',
      specs: ['Até 15km', 'Bateria 10+ anos', 'Milhares de devices'],
      gradient: 'from-brand-500 to-brand-700'
    },
    {
      icon: MapPin,
      title: 'RFID',
      subtitle: 'Radio Frequency ID',
      description: 'Rastreamento e inventário automático em tempo real',
      specs: ['Leitura simultânea', 'Sem linha de visão', 'Alta velocidade'],
      gradient: 'from-primary-500 to-primary-700'
    },
    {
      icon: Wifi,
      title: 'BLE / Zigbee',
      subtitle: 'Short Range',
      description: 'Sensoriamento de proximidade e ambiente',
      specs: ['Baixo consumo', 'Mesh network', 'Indoor tracking'],
      gradient: 'from-accent-500 to-accent-700'
    }
  ];

  const useCases = [
    {
      icon: Package,
      title: 'Asset Tracking',
      description: 'Rastreamento de ativos em tempo real'
    },
    {
      icon: Gauge,
      title: 'Inventário Inteligente',
      description: 'Controle automatizado de estoque'
    },
    {
      icon: Network,
      title: 'Sensoriamento',
      description: 'Monitoramento ambiental e industrial'
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
          <h2 className="text-5xl md:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-brand-400 via-accent-400 to-brand-400 bg-clip-text text-transparent">
            IoT Low Power
          </h2>

          <p className="text-xl text-slate-600 dark:text-neutral-300 max-w-3xl mx-auto mb-2">
            Ecossistemas IoT completos com plataformas privadas
          </p>

          <p className="text-sm text-slate-500 dark:text-neutral-500">
            Soluções para inventário, rastreabilidade e monitoramento industrial
          </p>
        </motion.div>

        {/* Technologies Grid */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <GlassCard className="h-full">
                  <div className={`p-6 h-full flex flex-col bg-gradient-to-br ${tech.gradient}/10 relative overflow-hidden`}>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full">
                      <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-neutral-400 font-semibold mb-1">
                        {tech.subtitle}
                      </span>

                      <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-2">
                        {tech.title}
                      </h3>

                      <p className="text-slate-600 dark:text-neutral-300 text-sm mb-4 leading-relaxed">
                        {tech.description}
                      </p>

                      {/* Specs */}
                      <div className="mt-auto space-y-2">
                        {tech.specs.map((spec, i) => (
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
                    <div className="p-5 text-center bg-gradient-to-br from-brand-500/10 to-transparent">
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
            <div className="p-6 bg-gradient-to-r from-brand-500/20 via-primary-500/20 to-accent-500/20">
              <p className="text-lg text-slate-700 dark:text-neutral-200">
                Plataformas <span className="text-brand-600 dark:text-brand-400 font-semibold">100% privadas</span> com{' '}
                <span className="text-primary-600 dark:text-primary-400 font-semibold">integração completa</span> aos seus sistemas
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </Slide>
  );
};
