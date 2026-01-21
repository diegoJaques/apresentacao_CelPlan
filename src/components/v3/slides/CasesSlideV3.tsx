import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Building2, Calendar, Cpu } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Slide } from '../../Slide';
import { EditableText } from '../../EditableText';
import { EditableImage } from '../../EditableImage';
import { casesStore, type CaseItem } from '../../../lib/casesStore';

// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/effect-coverflow';
// @ts-ignore
import 'swiper/css/navigation';
// @ts-ignore
import 'swiper/css/pagination';

export const CasesSlideV3 = () => {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const selectedCases = await casesStore.getSelectedCases();
      setCases(selectedCases);
    } catch (error) {
      console.error('Erro ao carregar cases:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Slide background="dark">
        <div className="h-screen flex items-center justify-center">
          <div className="text-2xl text-gray-500">Carregando cases...</div>
        </div>
      </Slide>
    );
  }

  if (cases.length === 0) {
    return (
      <Slide background="dark">
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl text-gray-600 dark:text-gray-400 mb-2">
              Nenhum case selecionado
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Configure os cases no painel administrativo
            </p>
          </div>
        </div>
      </Slide>
    );
  }

  const getSegmentColor = (segment: string) => {
    const colors: { [key: string]: string } = {
      'Telecom': 'from-blue-600 to-blue-800',
      'Energia': 'from-green-600 to-green-800',
      'Governo': 'from-purple-600 to-purple-800',
      'Mineração': 'from-orange-600 to-orange-800',
      'Logística': 'from-red-600 to-red-800',
      'Default': 'from-gray-600 to-gray-800'
    };
    return colors[segment] || colors['Default'];
  };

  return (
    <Slide background="dark">
      <div className="h-screen bg-gradient-to-br from-white via-slate-50 to-brand-50 dark:from-slate-900 dark:via-brand-900/20 dark:to-slate-900 py-12 px-8 flex flex-col transition-colors duration-300">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <EditableText
            id="cases-title"
            defaultText="Cases de Sucesso"
            className="text-5xl md:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-brand-400 via-primary-400 to-brand-400 bg-clip-text text-transparent"
            tag="h2"
          />

          <EditableText
            id="cases-subtitle"
            defaultText="Transformando desafios em resultados excepcionais"
            className="text-xl text-slate-600 dark:text-neutral-300 max-w-3xl mx-auto mb-2"
            tag="p"
          />

          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-brand-100 dark:bg-brand-900/30 rounded-full">
              <Trophy className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                {cases.length} Cases Selecionados
              </span>
            </div>
          </div>
        </motion.div>

        {/* Swiper Container */}
        <div className="flex-1 flex items-center justify-center max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full h-full"
          >
            <Swiper
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView="auto"
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
              className="w-full h-full cases-swiper"
            >
              {cases.map((caseItem, index) => (
                <SwiperSlide key={caseItem.id} className="w-[400px] h-[500px]">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full"
                  >
                    <div className={`h-full rounded-2xl bg-gradient-to-br ${getSegmentColor(caseItem.segment)} p-[2px]`}>
                      <div className="h-full bg-white dark:bg-slate-800 rounded-2xl p-6 flex flex-col">
                        {/* Header do Card */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-3 py-1 bg-gradient-to-r from-brand-100 to-primary-100 dark:from-brand-900/30 dark:to-primary-900/30 rounded-full text-xs font-semibold text-brand-700 dark:text-brand-300">
                              {caseItem.segment}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {caseItem.year}
                            </span>
                          </div>

                          <EditableText
                            id={`case-client-${caseItem.id}`}
                            defaultText={caseItem.client}
                            className="text-2xl font-bold text-slate-800 dark:text-white mb-2"
                            tag="h3"
                          />

                          <EditableText
                            id={`case-title-${caseItem.id}`}
                            defaultText={caseItem.title}
                            className="text-lg font-semibold text-brand-600 dark:text-brand-400"
                            tag="h4"
                          />
                        </div>

                        {/* Descrição */}
                        <EditableText
                          id={`case-description-${caseItem.id}`}
                          defaultText={caseItem.description}
                          className="text-sm text-slate-600 dark:text-gray-300 mb-4 flex-grow"
                          tag="p"
                          multiline={true}
                        />

                        {/* Imagem do Case */}
                        {caseItem.imageUrl && (
                          <div className="mb-4 rounded-lg overflow-hidden h-32 bg-gray-100 dark:bg-gray-700">
                            <EditableImage
                              id={`case-image-${caseItem.id}`}
                              defaultSrc={caseItem.imageUrl}
                              alt={`${caseItem.client} - ${caseItem.title}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Resultados */}
                        <div className="mb-4">
                          <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Resultados Alcançados
                          </h5>
                          <ul className="space-y-1">
                            {caseItem.results.map((result, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                                <EditableText
                                  id={`case-result-${caseItem.id}-${idx}`}
                                  defaultText={result}
                                  className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed"
                                  tag="span"
                                />
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tecnologias */}
                        <div className="mt-auto">
                          <div className="flex items-center gap-1 mb-2">
                            <Cpu className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                              Tecnologias
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {caseItem.technologies.map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Arraste ou navegue para explorar nossos cases • Mais de 1000+ projetos realizados
          </p>
        </motion.div>
      </div>

      <style jsx global>{`
        .cases-swiper {
          padding: 20px 0 60px 0;
        }

        .cases-swiper .swiper-slide {
          background-position: center;
          background-size: cover;
          width: 400px;
          height: 500px;
        }

        .cases-swiper .swiper-pagination-bullet {
          background: rgba(124, 58, 237, 0.3);
          width: 10px;
          height: 10px;
        }

        .cases-swiper .swiper-pagination-bullet-active {
          background: rgb(124, 58, 237);
          width: 30px;
          border-radius: 5px;
        }

        .cases-swiper .swiper-button-next,
        .cases-swiper .swiper-button-prev {
          color: rgb(124, 58, 237);
          background: rgba(255, 255, 255, 0.9);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .cases-swiper .swiper-button-next:after,
        .cases-swiper .swiper-button-prev:after {
          font-size: 20px;
        }

        .dark .cases-swiper .swiper-button-next,
        .dark .cases-swiper .swiper-button-prev {
          background: rgba(31, 41, 55, 0.9);
        }
      `}</style>
    </Slide>
  );
};