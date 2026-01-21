import { motion } from 'framer-motion';
import { Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Slide } from '../../Slide';
import type { Swiper as SwiperType } from 'swiper';
import { useRef } from 'react';

// Import Swiper styles
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/effect-coverflow';
// @ts-ignore
import 'swiper/css/pagination';
// @ts-ignore
import 'swiper/css/navigation';

export const PillarsSlideV3 = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  const pillars = [
    {
      title: 'Integração Turnkey',
      subtitle: 'Redes Completas',
      description: 'Projetamos e implementamos infraestruturas robustas end-to-end, incluindo redes privadas LTE/5G, IoT, IIoT e sistemas completos de networking.',
      icon: '🔗',
      gradient: 'from-brand-500 to-brand-700',
      glowColor: '#7c3aed'
    },
    {
      title: 'Inteligência Artificial',
      subtitle: 'IA Aplicada',
      description: 'Soluções de IA para redução de custos e riscos: LLMs/SLMs privados, automatização de fluxos, agentes de IA dedicados e integração com sistemas corporativos.',
      icon: '🤖',
      gradient: 'from-primary-500 to-primary-700',
      glowColor: '#3b82f6'
    },
    {
      title: 'IoT Low Power',
      subtitle: 'Redes Privadas',
      description: 'Ecossistemas IoT completos com plataformas privadas LoRaWAN, RFID, BLE, Zigbee para inventário, rastreabilidade e monitoramento industrial.',
      icon: '📡',
      gradient: 'from-accent-500 to-accent-700',
      glowColor: '#f97316'
    },
    {
      title: 'Video Analytics',
      subtitle: 'Visão Inteligente',
      description: 'Transformamos vídeo em dados acionáveis: detecção de EPI, intrusão, OCR/LPR industrial, processamento em Edge AI com alta precisão.',
      icon: '👁️',
      gradient: 'from-brand-600 to-primary-600',
      glowColor: '#6b21d6'
    },
    {
      title: 'Video Monitoramento',
      subtitle: 'Segurança 24/7',
      description: 'Sistemas completos de CFTV com analytics integrados, armazenamento inteligente e integração com sistemas de segurança corporativa.',
      icon: '🎥',
      gradient: 'from-primary-600 to-accent-600',
      glowColor: '#2563eb'
    },
    {
      title: 'Data Center Modular',
      subtitle: 'Infraestrutura Ágil',
      description: 'Soluções modulares e escaláveis de data center, edge computing e infraestrutura híbrida para máxima flexibilidade operacional.',
      icon: '🏢',
      gradient: 'from-accent-600 to-brand-600',
      glowColor: '#ea580c'
    },
    {
      title: 'Softwares & Equipamentos',
      subtitle: 'Ferramentas Pro',
      description: 'CellDesign Suite, analisadores de espectro (8 kHz a 27 GHz), scanners RF e serviços especializados de campo com manpower qualificado.',
      icon: '🛠️',
      gradient: 'from-brand-500 to-accent-500',
      glowColor: '#7c3aed'
    }
  ];

  return (
    <Slide background="dark">
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-primary-50 dark:from-slate-900 dark:via-primary-900/20 dark:to-slate-900 py-20 px-8 overflow-hidden transition-colors duration-300">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-brand-400 via-primary-400 to-brand-400 bg-clip-text text-transparent">
            Portfólio — Os 7 Pilares Tecnológicos
          </h2>

          <p className="text-xl text-slate-600 dark:text-neutral-300 max-w-3xl mx-auto mb-4">
            Soluções integradas para transformação digital completa
          </p>

          <p className="text-sm text-slate-500 dark:text-neutral-500">
            Use as setas ou arraste para navegar
          </p>
        </motion.div>

        {/* 3D Carousel */}
        <div className="relative max-w-7xl mx-auto">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={{
              clickable: true,
              bulletActiveClass: 'swiper-pagination-bullet-active',
            }}
            autoplay={{
              delay: 30000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            className="mySwiper py-12"
          >
            {pillars.map((pillar, index) => (
              <SwiperSlide key={index} className="!w-[450px] !h-[550px]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative h-full rounded-3xl overflow-hidden group cursor-grab active:cursor-grabbing"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient}`} />

                  {/* Glass overlay */}
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

                  {/* Border */}
                  <div className="absolute inset-0 border-2 border-white/10 rounded-3xl" />

                  {/* Glow effect */}
                  <div
                    className="absolute -inset-1 opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500 rounded-3xl"
                    style={{ backgroundColor: pillar.glowColor }}
                  />

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-10 z-10">
                    {/* Top section */}
                    <div>
                      <span className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-white/70 mb-2 block">
                        {pillar.subtitle}
                      </span>

                      <h3 className="text-4xl font-display font-bold text-slate-800 dark:text-white mb-6 leading-tight">
                        {pillar.title}
                      </h3>

                      <p className="text-slate-700 dark:text-white/90 text-lg leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>

                    {/* Bottom accent */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1 h-1 bg-white/20 rounded-full">
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full bg-white/50 rounded-full origin-left"
                        />
                      </div>
                      <div className="ml-4 text-slate-500 dark:text-white/50 font-semibold text-lg">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                  </div>

                  {/* Decorative corner elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-tr-full" />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-brand-500/20 hover:bg-brand-500/40 border border-brand-300 dark:border-brand-500/30 backdrop-blur-sm text-slate-800 dark:text-white transition-all hover:scale-110 group text-2xl"
          >
            ←
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-brand-500/20 hover:bg-brand-500/40 border border-brand-300 dark:border-brand-500/30 backdrop-blur-sm text-slate-800 dark:text-white transition-all hover:scale-110 group text-2xl"
          >
            →
          </button>
        </div>

        {/* Custom Swiper Pagination Styles */}
        <style>{`
          .swiper-pagination-bullet {
            width: 12px;
            height: 12px;
            background: rgba(124, 58, 237, 0.3);
            opacity: 1;
            transition: all 0.3s;
          }
          .swiper-pagination-bullet-active {
            background: #7c3aed;
            width: 32px;
            border-radius: 6px;
          }
          .swiper-3d .swiper-slide-shadow-left,
          .swiper-3d .swiper-slide-shadow-right {
            background-image: linear-gradient(to right, rgba(124, 58, 237, 0.5), rgba(0, 0, 0, 0));
          }

          /* Transparência nos cards laterais */
          .mySwiper .swiper-slide {
            transition: transform 0.4s ease, opacity 0.4s ease;
            opacity: 0.3;
            transform: scale(0.85);
          }

          .mySwiper .swiper-slide-active {
            z-index: 10;
            opacity: 1;
            transform: scale(1);
          }

          /* Cards laterais ficam desfocados */
          .mySwiper .swiper-slide:not(.swiper-slide-active) {
            filter: blur(2px);
          }
        `}</style>
      </div>
    </Slide>
  );
};
