import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Users, Lightbulb, BookOpen, Youtube, GraduationCap } from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { Slide } from '../../Slide';
import { useEffect, useRef } from 'react';
import Tilt from 'react-parallax-tilt';
import { EditableText } from '../../EditableText';
import { useInlineEdit } from '../../../contexts/InlineEditContext';

const AnimatedCounter = ({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000 });
  const displayValue = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      if (displayValue.current) {
        displayValue.current.textContent = Math.floor(latest).toString();
      }
    });
  }, [springValue]);

  return (
    <span ref={ref}>
      <span ref={displayValue}>0</span>
      {suffix}
    </span>
  );
};

export const IntellectualCapitalSlideV3 = () => {
  const { isEditMode } = useInlineEdit();
  const stats = [
    {
      icon: Users,
      value: 100,
      suffix: '+',
      title: 'Colaboradores',
      description: 'Equipe especializada e multidisciplinar',
      size: 'large',
      gradient: 'from-brand-500/20 to-primary-500/20'
    },
    {
      icon: Lightbulb,
      value: 30,
      suffix: '+',
      title: 'Engenheiros Seniores',
      description: 'Core team com 10+ anos de experiência',
      size: 'medium',
      gradient: 'from-primary-500/20 to-accent-500/20'
    },
    {
      icon: BookOpen,
      value: 2,
      suffix: 'M',
      title: 'P&D Anual',
      description: 'Investimento em pesquisa e desenvolvimento',
      size: 'medium',
      gradient: 'from-accent-500/20 to-brand-500/20'
    },
    {
      icon: GraduationCap,
      value: 4,
      suffix: '',
      title: 'Livros Publicados',
      description: 'Editora Wiley: cdma2000, LTE, WiMAX, WLAN',
      size: 'small',
      gradient: 'from-brand-500/20 to-brand-600/20'
    },
    {
      icon: Youtube,
      value: 50,
      suffix: 'k+',
      title: 'Visualizações',
      description: 'CelPlan Academy + Webinars no YouTube',
      size: 'small',
      gradient: 'from-primary-500/20 to-primary-600/20'
    }
  ];

  return (
    <Slide background="dark">
      <div className="h-screen bg-gradient-to-br from-white via-slate-50 to-primary-50 dark:from-slate-900 dark:via-primary-900/30 dark:to-slate-900 py-10 px-8 flex flex-col transition-colors duration-300">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <EditableText
            id="intellectual-title"
            defaultText="Capital Intelectual e Autoridade"
            className="text-4xl md:text-5xl font-display font-bold mb-3 bg-gradient-to-r from-primary-500 via-brand-500 to-primary-500 bg-clip-text text-transparent"
            tag="h2"
          />

          <EditableText
            id="intellectual-subtitle"
            defaultText="Expertise reconhecida mundialmente em telecomunicações e tecnologia"
            className="text-lg text-slate-600 dark:text-neutral-300 max-w-3xl mx-auto"
            tag="p"
          />
        </motion.div>

        {/* Grid Simétrico 3x2 */}
        <div className="max-w-7xl mx-auto flex-1 flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {/* Todos os cards com tamanho uniforme */}
            {stats.map((stat, index) => (
              <Tilt
                key={index}
                tiltMaxAngleX={5}
                tiltMaxAngleY={5}
                glareEnable={true}
                glareMaxOpacity={0.1}
                glareColor={stat.gradient.includes('brand') ? '#7c3aed' : stat.gradient.includes('primary') ? '#3b82f6' : '#f97316'}
                scale={1.02}
              >
                <GlassCard className="h-full">
                  <div className={`p-5 h-full flex flex-col justify-center bg-gradient-to-br ${stat.gradient}`}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.05, type: 'spring', stiffness: 100 }}
                      className="text-5xl font-bold text-slate-800 dark:text-white mb-2"
                    >
                      {isEditMode ? (
                        <EditableText
                          id={`intellectual-stat-value-${index}`}
                          defaultText={`${stat.value}${stat.suffix}`}
                          className="text-5xl font-bold text-slate-800 dark:text-white"
                          tag="div"
                        />
                      ) : (
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      )}
                    </motion.div>

                    <EditableText
                      id={`intellectual-stat-title-${index}`}
                      defaultText={stat.title}
                      className="text-lg font-semibold text-slate-800 dark:text-white mb-1"
                      tag="h3"
                    />

                    <EditableText
                      id={`intellectual-stat-desc-${index}`}
                      defaultText={stat.description}
                      className="text-slate-600 dark:text-neutral-400 text-sm"
                      tag="p"
                    />
                  </div>
                </GlassCard>
              </Tilt>
            ))}
          </div>
        </div>
      </div>
    </Slide>
  );
};
