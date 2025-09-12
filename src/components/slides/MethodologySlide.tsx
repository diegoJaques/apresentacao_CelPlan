import { motion } from 'framer-motion';
import { Slide } from '../Slide';
import { methodology } from '../../data/content';
import { GraduationCap, Handshake, Target, RefreshCw } from 'lucide-react';

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
          className="text-center mb-4"
        >
          <h2 className="text-3xl font-display font-bold mb-2">
            <span className="gradient-text">{methodology.title}</span>
          </h2>
          <p className="text-sm text-neutral-300 mb-2 max-w-3xl mx-auto">
            {methodology.subtitle}
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-4 mb-4">
          {/* Metodologia Steps */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-3">
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
                    className="glass-effect p-3 rounded-xl h-full"
                  >
                    {/* Step Number */}
                    <div className="flex items-start gap-2 mb-2">
                      <div className={`${getStepBg(index)} p-2 rounded-full flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${getStepColor(index)}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold ${getStepColor(index)} bg-white/10 px-1 py-0.5 rounded`}>
                            ETAPA {index + 1}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white mb-1">
                          {pillar.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-neutral-200 text-xs leading-relaxed">
                      {pillar.description}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
            </div>
          </div>

          {/* Training Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-effect p-3 rounded-xl"
          >
            <h3 className="text-xs font-bold text-neutral-400 mb-2 text-center">TREINAMENTO CELPLAN</h3>
            <div className="relative">
              <img 
                src="/logo/treinamento celplan.png"
                alt="Treinamento CelPlan - Metodologia aplicada"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </motion.div>
        </div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <div className="glass-effect p-3 rounded-xl max-w-4xl mx-auto">
            <p className="text-sm font-medium text-white leading-relaxed">
              "{methodology.valueProposition}"
            </p>
          </div>
        </motion.div>
      </div>
    </Slide>
  );
};