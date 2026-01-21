import { motion } from 'framer-motion';
import { Radio, Cable, Shield } from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { Slide } from '../../Slide';

export const ConnectivitySlideV3 = () => {
  const technologies = [
    {
      title: 'Redes Privadas',
      subtitle: 'LTE / 5G Networks',
      description: 'Redes corporativas privadas para máxima segurança e performance',
      specs: ['LTE Private', '5G Standalone', 'Licensed/Unlicensed', 'Core próprio'],
      gradient: 'from-brand-500 to-brand-700'
    },
    {
      title: 'Transmissão Óptica',
      subtitle: 'Fiber Infrastructure',
      description: 'Infraestrutura óptica de alta capacidade para backbone crítico',
      specs: ['DWDM', 'IP/MPLS', 'G-PON Corporativo', '100G/400G ready'],
      gradient: 'from-primary-500 to-primary-700'
    },
    {
      title: 'WiFi Enterprise',
      subtitle: 'Wireless Connectivity',
      description: 'Cobertura sem fio corporativa com WiFi 6/6E/7',
      specs: ['WiFi 6E/7', 'High-density', 'Industrial grade', 'Seamless roaming'],
      gradient: 'from-accent-500 to-accent-700'
    }
  ];

  const infrastructure = [
    {
      title: 'Networking Completo',
      description: 'Switches, roteadores, firewalls e load balancers'
    },
    {
      title: 'Segurança Zero Trust',
      description: 'Network segmentation, DDoS e VPN/SD-WAN'
    },
    {
      title: 'Gestão Unificada',
      description: 'NOC/SOC integrado com monitoramento 24/7'
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
          <h2 className="text-5xl md:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-brand-400 via-primary-400 to-brand-400 bg-clip-text text-transparent">
            Conectividade Crítica e Turnkey
          </h2>

          <p className="text-xl text-slate-600 dark:text-neutral-300 max-w-3xl mx-auto mb-2">
            Infraestruturas robustas para ambientes de missão crítica
          </p>

          <p className="text-sm text-slate-500 dark:text-neutral-500">
            Redes privadas LTE/5G, transmissão óptica e WiFi enterprise
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

        {/* Infrastructure */}
        <div className="max-w-6xl mx-auto mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-white text-center mb-6">
              Infraestrutura Completa
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {infrastructure.map((infra, index) => (
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
                        {infra.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-neutral-400">
                        {infra.description}
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
                Infraestrutura <span className="text-brand-600 dark:text-brand-400 font-semibold">turnkey completa</span> com{' '}
                <span className="text-primary-600 dark:text-primary-400 font-semibold">disponibilidade 99.99%</span> e{' '}
                <span className="text-accent-600 dark:text-accent-400 font-semibold">suporte 24/7</span>
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </Slide>
  );
};
