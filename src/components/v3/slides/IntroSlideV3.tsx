import { motion } from 'framer-motion';
import { ParticleBackground } from '../ParticleBackground';
import { Slide } from '../../Slide';
import { useTheme } from '../../../contexts/ThemeContext';
import { EditableText } from '../../EditableText';
import { EditableImage } from '../../EditableImage';

export const IntroSlideV3 = () => {
  const { theme } = useTheme();
  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Use theme-specific logo
  const logoSrc = theme === 'light'
    ? '/images/celplan-logo-light.png'
    : '/images/celplan-logo-dark.png';

  return (
    <Slide background="dark">
      <div className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-brand-50 to-slate-50 dark:from-slate-900 dark:via-brand-900/50 dark:to-slate-900 transition-colors duration-300">
        {/* Particle Background */}
        <ParticleBackground density={100} color="#7c3aed" />

        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl px-8">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              type: 'spring',
              stiffness: 100
            }}
            className="mb-12"
          >
            <EditableImage
              id="intro-logo"
              defaultSrc={logoSrc}
              alt="CelPlan Logo"
              className="w-96 h-auto mx-auto drop-shadow-2xl"
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-2xl md:text-3xl font-light text-slate-700 dark:text-neutral-200 mb-4 max-w-4xl mx-auto leading-relaxed"
          >
            Soluções Tecnológicas Integradas para{' '}
            <span className="text-brand-400 font-semibold">Redes TIC</span>,{' '}
            <span className="text-primary-400 font-semibold">IA</span>,{' '}
            <span className="text-brand-400 font-semibold">IoT</span> e{' '}
            <span className="text-primary-400 font-semibold">Video Analytics</span>
          </motion.p>

          {/* Tagline */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-500/20 border border-brand-500/30 backdrop-blur-sm"
          >
            <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            <EditableText
              id="intro-tagline"
              defaultText="Global Technology Solutions"
              className="text-sm font-medium text-brand-600 dark:text-brand-300"
              tag="span"
            />
          </motion.div>

          {/* Date */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-16 text-slate-500 dark:text-neutral-400 text-sm"
          >
            {today}
          </motion.p>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-900 to-transparent" />
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </Slide>
  );
};
