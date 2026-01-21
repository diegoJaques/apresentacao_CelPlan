import { motion } from 'framer-motion';
import { Wrench, Code, Activity, Radio, FileText, Users } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Pagination, Autoplay } from 'swiper/modules';
import { GlassCard } from '../GlassCard';
import { Slide } from '../../Slide';
import { EditableText } from '../../EditableText';

// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/effect-cards';
// @ts-ignore
import 'swiper/css/pagination';

export const ServicesSlideV3 = () => {
  const services = [
    {
      icon: Code,
      title: 'CellDesign Suite',
      category: 'Software',
      items: [
        'CelPlanner - RF Planning',
        'CelNetwork - Network Design',
        'CelPerformance - Optimization',
        'CelCoverage - Coverage Analysis'
      ],
      color: 'brand',
      gradient: 'from-brand-500 to-brand-700'
    },
    {
      icon: Activity,
      title: 'Equipamentos RF',
      category: 'Hardware',
      items: [
        'Analisadores de Espectro',
        '8 kHz até 27 GHz',
        'Scanners RF Profissionais',
        'Equipamentos Homologados'
      ],
      color: 'primary',
      gradient: 'from-primary-500 to-primary-700'
    },
    {
      icon: Radio,
      title: 'Site Surveys',
      category: 'Serviços de Campo',
      items: [
        'RF Site Survey',
        'Drive Tests / Walk Tests',
        'Medições de QoE',
        'Análise de Interferência'
      ],
      color: 'accent',
      gradient: 'from-accent-500 to-accent-700'
    },
    {
      icon: FileText,
      title: 'Calibração de Modelos',
      category: 'Engenharia',
      items: [
        'Tuning de Propagação',
        'Otimização de Coverage',
        'Análise de Capacidade',
        'Quality Assurance'
      ],
      color: 'brand',
      gradient: 'from-brand-600 to-primary-600'
    },
    {
      icon: Users,
      title: 'Manpower Especializado',
      category: 'Recursos Humanos',
      items: [
        'Engenheiros RF Seniores',
        'Especialistas em IA/ML',
        'Técnicos de Campo',
        'Gestores de Projeto'
      ],
      color: 'primary',
      gradient: 'from-primary-600 to-accent-600'
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
            id="services-title"
            defaultText="Softwares, Equipamentos e Serviços"
            className="text-5xl md:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-accent-400 via-brand-400 to-accent-400 bg-clip-text text-transparent"
            tag="h2"
          />

          <EditableText
            id="services-subtitle"
            defaultText="Ferramentas profissionais e expertise especializado"
            className="text-xl text-slate-600 dark:text-neutral-300 max-w-3xl mx-auto mb-4"
            tag="p"
          />

          <p className="text-sm text-slate-500 dark:text-neutral-500">
            Arraste os cards para explorar
          </p>
        </motion.div>

        {/* Cards Carousel */}
        <div className="max-w-6xl mx-auto mb-12">
          <Swiper
            effect={'cards'}
            grabCursor={true}
            modules={[EffectCards, Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            className="mySwiper !pb-16"
            style={{ width: '400px', height: '500px' }}
          >
            {services.map((service, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative h-full rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient}`} />

                  {/* Glass overlay */}
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

                  {/* Border */}
                  <div className="absolute inset-0 border-2 border-white/20 rounded-3xl" />

                  {/* Content */}
                  <div className="relative h-full flex flex-col p-10 z-10">
                    {/* Category */}
                    <div className="mb-auto">
                      <EditableText
                        id={`service-category-${index}`}
                        defaultText={service.category}
                        className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-white/70 mb-2 block"
                        tag="span"
                      />

                      <EditableText
                        id={`service-title-${index}`}
                        defaultText={service.title}
                        className="text-3xl font-display font-bold text-slate-800 dark:text-white mb-8 leading-tight"
                        tag="h3"
                      />

                      {/* Items List */}
                      <ul className="space-y-3">
                        {service.items.map((item, itemIndex) => (
                          <motion.li
                            key={itemIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + itemIndex * 0.1 }}
                            className="flex items-center gap-3 text-slate-700 dark:text-white/90"
                          >
                            <div className="w-2 h-2 rounded-full bg-slate-600 dark:bg-white/70" />
                            <EditableText
                              id={`service-item-${index}-${itemIndex}`}
                              defaultText={item}
                              className="text-base"
                              tag="span"
                            />
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom accent */}
                    <div className="mt-auto pt-6">
                      <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className="h-full bg-white/50 origin-left"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard className="h-full">
                <div className="p-6 text-center bg-gradient-to-br from-brand-500/10 to-transparent">
                  <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                    Precisão Profissional
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-neutral-400">
                    Ferramentas homologadas e calibradas
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <GlassCard className="h-full">
                <div className="p-6 text-center bg-gradient-to-br from-primary-500/10 to-transparent">
                  <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                    Entrega Rápida
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-neutral-400">
                    Metodologia ágil e eficiente
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <GlassCard className="h-full">
                <div className="p-6 text-center bg-gradient-to-br from-accent-500/10 to-transparent">
                  <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                    Suporte Dedicado
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-neutral-400">
                    Time especializado 24/7
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-12"
        >
          <GlassCard className="max-w-5xl mx-auto" hover={false}>
            <div className="p-8 bg-gradient-to-r from-brand-500/20 via-primary-500/20 to-accent-500/20 relative overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute inset-0 bg-brand-500/20 blur-3xl"
              />

              <p className="relative z-10 text-2xl text-slate-700 dark:text-neutral-200 leading-relaxed">
                Do <span className="text-brand-600 dark:text-brand-400 font-semibold">planejamento</span> à{' '}
                <span className="text-primary-600 dark:text-primary-400 font-semibold">operação</span>, oferecemos{' '}
                <span className="text-accent-600 dark:text-accent-400 font-semibold">soluções completas</span> e integradas
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Custom Swiper Pagination Styles */}
        <style>{`
          .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            background: rgba(249, 115, 22, 0.3);
            opacity: 1;
            transition: all 0.3s;
          }
          .swiper-pagination-bullet-active {
            background: #f97316;
            width: 24px;
            border-radius: 5px;
          }
        `}</style>
      </div>
    </Slide>
  );
};
