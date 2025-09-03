import { motion } from 'framer-motion';
import { Slide } from '../Slide';
import { methodology } from '../../data/content';
import { GraduationCap, Handshake, Target, RefreshCw, Calendar } from 'lucide-react';

export const MethodologySlide = () => {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'graduation': return GraduationCap;
      case 'handshake': return Handshake;
      case 'target': return Target;
      case 'refresh': return RefreshCw;
      default: return Target;
    }
  };

  const getStepColor = (index: number) => {
    const colors = ['text-blue-500', 'text-green-500', 'text-yellow-500', 'text-purple-500'];
    return colors[index] || 'text-accent-500';
  };

  const getStepBg = (index: number) => {
    const colors = ['bg-blue-500/20', 'bg-green-500/20', 'bg-yellow-500/20', 'bg-purple-500/20'];
    return colors[index] || 'bg-accent-500/20';
  };

  return (
    <Slide background="dark">
      <div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-display font-bold mb-4">
            <span className="gradient-text">{methodology.title}</span>
          </h2>
          <p className="text-xl text-neutral-300 mb-6 max-w-3xl mx-auto">
            {methodology.subtitle}
          </p>
        </motion.div>

        {/* Hero Section - Treinamento Recente */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="glass-effect rounded-2xl p-8 mb-12 max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-accent-500" />
                <span className="text-accent-500 font-semibold text-lg">
                  {methodology.recentCase.title}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                {methodology.recentCase.date}
              </h3>
              <p className="text-neutral-200 text-lg leading-relaxed">
                {methodology.recentCase.description}
              </p>
            </div>
            <div className="relative">
              <motion.img
                src={methodology.recentCase.image}
                alt="Treinamento SENDI 2025"
                className="w-full rounded-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl" />
            </div>
          </div>
        </motion.div>

        {/* Metodologia Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {methodology.pillars.map((pillar, index) => {
              const Icon = getIcon(pillar.icon);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.15 }}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-effect p-6 rounded-xl h-full"
                  >
                    {/* Step Number */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`${getStepBg(index)} p-3 rounded-full flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${getStepColor(index)}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-sm font-bold ${getStepColor(index)} bg-white/10 px-2 py-1 rounded`}>
                            ETAPA {index + 1}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">
                          {pillar.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-neutral-200 leading-relaxed">
                      {pillar.description}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-12"
        >
          <div className="glass-effect p-6 rounded-xl max-w-4xl mx-auto">
            <p className="text-xl font-medium text-white leading-relaxed">
              "{methodology.valueProposition}"
            </p>
          </div>
        </motion.div>
      </div>
    </Slide>
  );
};