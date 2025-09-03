import { motion } from 'framer-motion';
import { useState } from 'react';
import { Slide } from '../Slide';
import { products } from '../../data/content';
import { ChevronDown, Database, Eye, Users } from 'lucide-react';

export const AIProductsSlide = () => {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  const getUniverseIcon = (universe: string) => {
    switch (universe) {
      case 'generative': return Database;
      case 'vision': return Eye;
      case 'automation': return Users;
      default: return Database;
    }
  };

  const getUniverseColor = (universe: string) => {
    switch (universe) {
      case 'generative': return 'text-blue-500';
      case 'vision': return 'text-green-500';
      case 'automation': return 'text-purple-500';
      default: return 'text-accent-500';
    }
  };

  const getUniverseLabel = (universe: string) => {
    switch (universe) {
      case 'generative': return '🧠 IA Generativa';
      case 'vision': return '👁️ Visão Computacional';
      case 'automation': return '🤖 Multiagentes';
      default: return 'IA';
    }
  };

  return (
    <Slide>
      <div>
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-display font-bold text-center mb-4"
        >
          <span className="gradient-text">Nossos 3 Universos de IA</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-neutral-300 text-center mb-12 max-w-3xl mx-auto"
        >
          Soluções que transformam dores operacionais em vantagens competitivas
        </motion.p>

        <div className="grid md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {products.ai.map((product, index) => {
            const IconComponent = getUniverseIcon(product.universe);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                onClick={() => setSelectedProduct(selectedProduct === index ? null : index)}
                className="cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`glass-effect p-6 rounded-xl transition-all duration-300 h-full
                    ${selectedProduct === index ? 'ring-2 ring-accent-500' : ''}`}
                >
                  {/* Header com universo */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-8 h-8 ${getUniverseColor(product.universe)}`} />
                      <div>
                        <div className="text-xs text-neutral-400 mb-1">
                          {getUniverseLabel(product.universe)}
                        </div>
                        <h3 className="text-lg font-bold">{product.name}</h3>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: selectedProduct === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-neutral-400" />
                    </motion.div>
                  </div>

                  {/* Dor */}
                  <div className="mb-4">
                    <div className="text-red-400 text-xs font-semibold mb-1">PROBLEMA:</div>
                    <p className="text-neutral-200 text-sm leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Solução */}
                  <div className="mb-4">
                    <div className="text-yellow-400 text-xs font-semibold mb-1">SOLUÇÃO:</div>
                    <p className="text-neutral-200 text-sm leading-relaxed">
                      {product.solution}
                    </p>
                  </div>

                  {/* Benefício */}
                  <div className="mb-4">
                    <div className="text-green-400 text-xs font-semibold mb-1">BENEFÍCIO:</div>
                    <p className="text-white font-medium text-sm">
                      {product.benefit}
                    </p>
                  </div>

                  {/* Detalhes expandidos */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: selectedProduct === index ? 'auto' : 0,
                      opacity: selectedProduct === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-neutral-700">
                      <h4 className="text-sm font-semibold text-neutral-400 mb-3">
                        Funcionalidades Principais:
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.features.map((feature, fIndex) => (
                          <span
                            key={fIndex}
                            className="px-3 py-1 bg-accent-500/20 text-accent-400 
                                     rounded-full text-xs font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      
                      <h4 className="text-sm font-semibold text-neutral-400 mb-2">
                        Stack Tecnológica:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {product.technologies.map((tech, tIndex) => (
                          <span
                            key={tIndex}
                            className="px-2 py-1 bg-primary-500/20 text-primary-400 
                                     rounded text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-neutral-400">
            Clique em cada solução para ver detalhes técnicos
          </p>
        </motion.div>
      </div>
    </Slide>
  );
};