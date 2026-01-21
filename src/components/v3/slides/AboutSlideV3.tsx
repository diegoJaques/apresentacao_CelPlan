import { motion } from 'framer-motion';
import { Globe, Users, Building2, MapPin } from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { AnimatedSection } from '../AnimatedSection';
import { Slide } from '../../Slide';
import { EditableText } from '../../EditableText';
import { WorldMapWithD3 } from '../WorldMapWithD3';

export const AboutSlideV3 = () => {
  const metrics = [
    {
      icon: Building2,
      year: '1992',
      title: 'Fundada no Brasil',
      description: 'Hoje uma corporação de Delaware (EUA)',
      color: 'brand'
    },
    {
      icon: Users,
      value: '100%',
      title: 'Propriedade dos Funcionários',
      description: 'Empresa autofinanciada e independente',
      color: 'primary'
    },
    {
      icon: Globe,
      value: '6',
      title: 'Continentes',
      description: 'Presença global em projetos de média e alta complexidade',
      color: 'accent'
    }
  ];

  const regions = [
    // América do Norte
    { name: 'América do Norte', projects: '80+', coordinates: [-100, 40] as [number, number] },
    // América do Sul - Países Específicos
    { name: 'Brasil', projects: '45+', coordinates: [-47, -15] as [number, number] },
    { name: 'Chile', projects: '12+', coordinates: [-70, -33] as [number, number] },
    { name: 'Argentina', projects: '15+', coordinates: [-64, -34] as [number, number] },
    { name: 'Peru', projects: '8+', coordinates: [-75, -9] as [number, number] },
    // Outros Continentes
    { name: 'Europa', projects: '45+', coordinates: [10, 50] as [number, number] },
    { name: 'África', projects: '30+', coordinates: [20, 0] as [number, number] },
    { name: 'Ásia', projects: '25+', coordinates: [100, 35] as [number, number] },
    { name: 'Oriente Médio', projects: '20+', coordinates: [50, 25] as [number, number] },
    { name: 'Oceania', projects: '10+', coordinates: [135, -25] as [number, number] }
  ];

  return (
    <Slide background="dark">
      <div className="h-screen bg-gradient-to-br from-white via-slate-50 to-brand-50 dark:from-slate-900 dark:via-brand-900/30 dark:to-slate-900 py-10 px-8 flex flex-col transition-colors duration-300">
        {/* Header */}
        <AnimatedSection direction="fade" className="text-center mb-8">
          <EditableText
            id="about-title"
            defaultText="Quem Somos"
            className="text-4xl md:text-5xl font-display font-bold mb-3 bg-gradient-to-r from-brand-500 to-primary-500 bg-clip-text text-transparent"
            tag="h2"
          />

          <EditableText
            id="about-subtitle"
            defaultText="Presença Global e Experiência Comprovada"
            className="text-lg text-slate-600 dark:text-neutral-300 max-w-3xl mx-auto"
            tag="p"
          />
        </AnimatedSection>

        {/* Metrics Grid */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="grid grid-cols-3 gap-6">
            {metrics.map((metric, index) => (
              <GlassCard key={index} delay={index * 0.1} hover>
                <div className="p-5 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                  >
                    <EditableText
                      id={`about-metric-value-${index}`}
                      defaultText={metric.year || metric.value || ''}
                      className="text-4xl font-bold text-slate-800 dark:text-white mb-2"
                      tag="h3"
                    />
                  </motion.div>

                  <EditableText
                    id={`about-metric-title-${index}`}
                    defaultText={metric.title}
                    className="text-lg font-semibold text-brand-600 dark:text-brand-300 mb-2"
                    tag="h4"
                  />

                  <EditableText
                    id={`about-metric-desc-${index}`}
                    defaultText={metric.description}
                    className="text-slate-600 dark:text-neutral-400 text-sm leading-relaxed"
                    tag="p"
                  />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Global Presence - World Map */}
        <div className="flex-1 flex items-center max-w-7xl mx-auto w-full">
          <AnimatedSection direction="up" delay={0.6} className="w-full">
            <GlassCard className="w-full h-[500px]" hover={false}>
              <div className="p-6 h-full flex flex-col">
                <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-2">
                  Atuação Global
                </h3>

                <p className="text-slate-600 dark:text-neutral-300 mb-4 text-base">
                  Projetos de média e alta complexidade em todos os continentes
                </p>

                {/* World Map with D3 */}
                <div className="flex-1">
                  <WorldMapWithD3 regions={regions} />
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </div>
    </Slide>
  );
};
