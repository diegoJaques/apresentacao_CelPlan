import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Building2, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Slide } from '../../Slide';
import { EditableText } from '../../EditableText';
import { EditableImage } from '../../EditableImage';
import { useBackendCases, type CaseItem } from '../../../hooks/useBackendCases';

// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/effect-coverflow';
// @ts-ignore
import 'swiper/css/navigation';
// @ts-ignore
import 'swiper/css/pagination';

export const CasesSlideV3Backend = () => {
  const { cases: allCases, loading, error, loadCases } = useBackendCases({
    autoLoad: true,
    isActive: true
  });

  const [selectedCases, setSelectedCases] = useState<CaseItem[]>([]);
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => {
    // Load selected cases from localStorage
    const storedSelected = localStorage.getItem('selected_cases_v2');
    if (storedSelected) {
      try {
        const selectedIds = JSON.parse(storedSelected);
        const filtered = allCases.filter(c => selectedIds.includes(c.id));
        setSelectedCases(filtered.length > 0 ? filtered : allCases);
      } catch {
        setSelectedCases(allCases);
      }
    } else {
      // If no selection, show all active cases
      setSelectedCases(allCases);
    }
  }, [allCases]);

  // Try to load from localStorage if backend fails
  useEffect(() => {
    if (error && !loading) {
      console.log('Backend failed, trying localStorage fallback...');
      try {
        const stored = localStorage.getItem('celplan_cases');
        if (stored) {
          const localCases = JSON.parse(stored);
          const activeCases = localCases.filter((c: any) => c.isActive !== false);
          setSelectedCases(activeCases);
          setFallbackMode(true);
        }
      } catch (err) {
        console.error('Fallback also failed:', err);
      }
    }
  }, [error, loading]);

  if (loading && selectedCases.length === 0) {
    return (
      <Slide background="dark">
        <div className="h-screen flex items-center justify-center">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 text-gray-500 animate-spin" />
            <div className="text-2xl text-gray-500">Carregando cases...</div>
          </div>
        </div>
      </Slide>
    );
  }

  if (!loading && selectedCases.length === 0) {
    return (
      <Slide background="dark">
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl text-gray-600 dark:text-gray-400 mb-2">
              Nenhum case disponível
            </h3>
            {error ? (
              <>
                <p className="text-gray-500 dark:text-gray-500 mb-4">
                  Erro ao carregar cases do servidor
                </p>
                <button
                  onClick={() => loadCases()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Tentar Novamente
                </button>
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-500">
                Configure os cases no painel administrativo
              </p>
            )}
          </div>
        </div>
      </Slide>
    );
  }

  const getSegmentColor = (segment: string) => {
    const colors: { [key: string]: string } = {
      'Telecom': 'from-blue-600 to-blue-800',
      'Energia': 'from-green-600 to-green-800',
      'Petróleo e Gás': 'from-yellow-600 to-amber-700',
      'Governo': 'from-purple-600 to-purple-800',
      'Mineração': 'from-orange-600 to-orange-800',
      'Financeiro': 'from-indigo-600 to-indigo-800',
      'Indústria e Manufatura': 'from-slate-600 to-slate-800',
      'Logística': 'from-red-600 to-red-800',
      'Utilities': 'from-cyan-600 to-cyan-800',
      'Default': 'from-gray-600 to-gray-800'
    };
    return colors[segment] || colors['Default'];
  };

  return (
    <Slide background="dark">
      <div className="h-screen bg-gradient-to-br from-white via-slate-50 to-brand-50 dark:from-slate-900 dark:via-brand-900/20 dark:to-slate-900 py-4 px-8 flex flex-col transition-colors duration-300">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <EditableText
            id="cases-title"
            defaultText="Cases de Sucesso"
            className="text-5xl md:text-6xl font-display font-bold bg-gradient-to-r from-brand-400 via-primary-400 to-brand-400 bg-clip-text text-transparent block"
            tag="h2"
          />

          {/* Status Indicator */}
          {(error || fallbackMode) && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm mt-2">
              <AlertCircle className="w-4 h-4" />
              {fallbackMode ? 'Modo Offline' : 'Erro de Conexão'}
            </div>
          )}
        </motion.div>

        {/* Cases Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex items-center justify-center px-4 overflow-hidden"
        >
          <div className="w-full max-w-6xl">
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 300,
                modifier: 1.5,
                slideShadows: false,
              }}
              pagination={{
                clickable: true,
                bulletActiveClass: 'swiper-pagination-bullet-active',
              }}
              navigation={true}
              autoplay={{
                delay: 30000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={selectedCases.length > 1}
              modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
              className="cases-swiper"
            >
              {selectedCases.map((caseItem, index) => (
                <SwiperSlide key={`case-slide-${index}`} className="!w-[520px] !h-[600px]">
                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden h-full w-full"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Compact Header with Badges */}
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                            {caseItem.segment}
                          </span>
                          <span className="text-white/90 text-xs font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {caseItem.year}
                          </span>
                        </div>
                        <Trophy className="w-5 h-5 text-yellow-300" />
                      </div>
                    </div>

                    {/* Main Image Section - DESTAQUE */}
                    <div className="relative h-64 bg-gray-100 dark:bg-gray-900 overflow-hidden group">
                      {caseItem.image_url ? (
                        <>
                          <img
                            src={caseItem.image_url}
                            alt={caseItem.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        </>
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${getSegmentColor(caseItem.segment)} flex items-center justify-center`}>
                          <div className="text-center text-white">
                            <Building2 className="w-16 h-16 mx-auto mb-2 opacity-40" />
                            <p className="text-sm opacity-60">Sem imagem</p>
                          </div>
                        </div>
                      )}

                      {/* Logo do Cliente sobreposto na imagem */}
                      {caseItem.logo_url && (
                        <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                          <img
                            src={caseItem.logo_url}
                            alt={caseItem.client}
                            className="h-12 w-24 object-contain"
                          />
                        </div>
                      )}

                      {/* Nome do Cliente na parte inferior da imagem */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-white font-bold text-xl tracking-tight flex items-center gap-2">
                          <Building2 className="w-5 h-5" />
                          {caseItem.client}
                        </h3>
                      </div>
                    </div>

                    {/* Case Content */}
                    <div className="p-5 space-y-4">
                      {/* Título e Descrição */}
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                          {caseItem.title}
                        </h4>
                        {caseItem.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                            {caseItem.description}
                          </p>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-200 dark:border-gray-700"></div>

                      {/* Results - DESTAQUE */}
                      {caseItem.results && caseItem.results.length > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                          <h5 className="text-sm font-bold text-green-700 dark:text-green-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                            <Trophy className="w-4 h-4" />
                            Resultados Alcançados
                          </h5>
                          <ul className="space-y-1.5">
                            {caseItem.results.slice(0, 3).map((result, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <span className="text-green-500 font-bold mt-0.5">✓</span>
                                <span className="line-clamp-1 font-medium">{result}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-2 text-center"
        >
          <div className="inline-flex items-center gap-8 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-bold text-2xl text-purple-600">{selectedCases.length}</span>
              <span className="ml-2">Cases de Sucesso</span>
            </div>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
            <div>
              <span className="font-bold text-2xl text-purple-600">
                {Array.from(new Set(selectedCases.map(c => c.segment))).length}
              </span>
              <span className="ml-2">Segmentos Atendidos</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom Swiper Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .cases-swiper {
          padding: 3rem 0;
          max-width: 1400px;
          margin: 0 auto;
        }

        .cases-swiper .swiper-pagination {
          bottom: -40px !important;
        }

        .cases-swiper .swiper-pagination-bullet {
          background: #9333ea;
          opacity: 0.4;
          width: 10px;
          height: 10px;
          transition: all 0.3s ease;
        }

        .cases-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #9333ea;
          width: 32px;
          height: 10px;
          border-radius: 5px;
          transform: scale(1.1);
        }

        .cases-swiper .swiper-button-next,
        .cases-swiper .swiper-button-prev {
          color: white;
          background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
          width: 54px;
          height: 54px;
          border-radius: 50%;
          box-shadow: 0 4px 20px rgba(147, 51, 234, 0.4);
          transition: all 0.3s ease;
          z-index: 20 !important;
          pointer-events: auto !important;
        }

        .cases-swiper .swiper-button-next:hover,
        .cases-swiper .swiper-button-prev:hover {
          transform: scale(1.15);
          box-shadow: 0 8px 30px rgba(147, 51, 234, 0.6);
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
        }

        .cases-swiper .swiper-button-next:after,
        .cases-swiper .swiper-button-prev:after {
          font-size: 22px;
          font-weight: bold;
        }

        .dark .cases-swiper .swiper-button-next,
        .dark .cases-swiper .swiper-button-prev {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          box-shadow: 0 4px 20px rgba(124, 58, 237, 0.5);
        }

        .dark .cases-swiper .swiper-button-next:hover,
        .dark .cases-swiper .swiper-button-prev:hover {
          background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
          box-shadow: 0 8px 30px rgba(124, 58, 237, 0.7);
        }

        /* Smooth transitions for slides */
        .cases-swiper .swiper-slide {
          transition: transform 0.4s ease, opacity 0.4s ease;
          opacity: 0.3;
          transform: scale(0.85);
        }

        .cases-swiper .swiper-slide-active {
          z-index: 10;
          opacity: 1;
          transform: scale(1);
        }

        /* Cards laterais ficam desfocados */
        .cases-swiper .swiper-slide:not(.swiper-slide-active) {
          filter: blur(2px);
        }
      `}} />
    </Slide>
  );
};