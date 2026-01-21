import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Slide } from '../Slide';
import {
  Building2, Users, Globe, Award, TrendingUp, Wifi, DollarSign, Cpu,
  Layers, Code, Radio, BarChart, Lightbulb, Brain, Bot, ChartBar,
  Building, Factory, Leaf, Zap, Shield, ShoppingBag, Car, Wrench,
  Compass, Headphones, Rocket, GraduationCap, Mail, Phone, MapPin,
  Star, AlertCircle, MessageCircle
} from 'lucide-react';

// Mapeamento de ícones
const iconMap: any = {
  Building2, Users, Globe, Award, TrendingUp, Wifi, DollarSign, Cpu,
  Layers, Code, Radio, BarChart, Lightbulb, Brain, Bot, ChartBar,
  Building, Factory, Leaf, Zap, Shield, ShoppingBag, Car, Wrench,
  Compass, Headphones, Rocket, GraduationCap, Mail, Phone, MapPin,
  Star, AlertCircle, MessageCircle,
  // Aliases para compatibilidade
  Tool: Wrench,
  HeadphonesIcon: Headphones
};

interface DynamicSlideProps {
  slideData: any;
}

export const DynamicSlideRenderer: React.FC<DynamicSlideProps> = ({ slideData }) => {
  const { content, template } = slideData;
  const { title, subtitle, description, items = [], image } = content;

  // Função helper para obter ícone
  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName];
    return Icon || Star; // Fallback para Star se não encontrar
  };

  // Renderiza diferente baseado no template e número de items
  const renderContent = () => {
    // Template de capa/intro
    if (template === 'cover') {
      return (
        <div className="text-center">
          {image && (
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              src={image}
              alt={title}
              className="w-32 h-32 mx-auto mb-8 object-contain"
            />
          )}
          {title && (
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-7xl font-display font-bold mb-6 bg-gradient-to-r from-brand-400 to-primary-400 bg-clip-text text-transparent"
            >
              {title}
            </motion.h1>
          )}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-slate-600 dark:text-neutral-300 mb-4"
            >
              {subtitle}
            </motion.p>
          )}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-slate-500 dark:text-neutral-400 max-w-2xl mx-auto"
            >
              {description}
            </motion.p>
          )}
        </div>
      );
    }

    // Template de contato
    if (template === 'contact' || (items.length > 0 && items[0].label && items[0].value)) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((contact: any, index: number) => {
            const Icon = getIcon(contact.icon);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
              >
                {contact.link ? (
                  <a
                    href={contact.link}
                    target={contact.link.startsWith('http') ? '_blank' : undefined}
                    rel={contact.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="block"
                  >
                    <GlassCard className="h-full" hover>
                      <div className={`p-6 text-center bg-gradient-to-br from-${contact.color || 'brand'}-500/10 to-transparent`}>
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 mb-4">
                          <Icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                        </div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
                          {contact.label}
                        </h3>
                        <p className="text-slate-800 dark:text-white font-medium text-base">
                          {contact.value}
                        </p>
                      </div>
                    </GlassCard>
                  </a>
                ) : (
                  <GlassCard className="h-full" hover={false}>
                    <div className={`p-6 text-center bg-gradient-to-br from-${contact.color || 'brand'}-500/10 to-transparent`}>
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 mb-4">
                        <Icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                      </div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
                        {contact.label}
                      </h3>
                      <p className="text-slate-800 dark:text-white font-medium text-base">
                        {contact.value}
                      </p>
                    </div>
                  </GlassCard>
                )}
              </motion.div>
            );
          })}
        </div>
      );
    }

    // Template de métricas/estatísticas
    if (template === 'stats' || (items.length > 0 && items[0].value && items[0].gradient)) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((metric: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <GlassCard hover>
                <div className="p-6 text-center">
                  <h3 className={`text-4xl font-bold mb-2 bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>
                    {metric.value}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">
                    {metric.label}
                  </p>
                  {metric.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {metric.description}
                    </p>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      );
    }

    // Template de grid/cards genérico
    if (template === 'grid' || template === 'cards' || items.length > 0) {
      const columns = items.length <= 3 ? items.length : items.length <= 4 ? 2 : 3;

      return (
        <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
          {items.map((item: any, index: number) => {
            const Icon = item.icon ? getIcon(item.icon) : null;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <GlassCard hover>
                  <div className="p-6">
                    {Icon && (
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${item.color || 'brand'}-500/20 mb-4`}>
                        <Icon className={`w-6 h-6 text-${item.color || 'brand'}-600 dark:text-${item.color || 'brand'}-400`} />
                      </div>
                    )}

                    {item.number && (
                      <span className="text-4xl font-bold text-brand-500 block mb-2">
                        {item.number}
                      </span>
                    )}

                    {item.title && (
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {item.title}
                      </h3>
                    )}

                    {item.name && (
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {item.name}
                      </h3>
                    )}

                    {item.category && !item.solutions && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {item.category}
                      </span>
                    )}

                    {item.description && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {item.description}
                      </p>
                    )}

                    {item.problem && item.solution && (
                      <>
                        <div className="mb-3">
                          <span className="text-xs font-semibold text-red-600 dark:text-red-400">PROBLEMA</span>
                          <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{item.problem}</p>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-green-600 dark:text-green-400">SOLUÇÃO</span>
                          <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{item.solution}</p>
                        </div>
                      </>
                    )}

                    {item.specs && Array.isArray(item.specs) && (
                      <ul className="mt-3 space-y-1">
                        {item.specs.map((spec: string, i: number) => (
                          <li key={i} className="text-xs text-gray-500 dark:text-gray-400">
                            • {spec}
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.services && Array.isArray(item.services) && (
                      <ul className="mt-3 space-y-1">
                        {item.services.map((service: string, i: number) => (
                          <li key={i} className="text-xs text-gray-600 dark:text-gray-400">
                            • {service}
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.solutions && Array.isArray(item.solutions) && (
                      <ul className="mt-3 space-y-1">
                        {item.solutions.map((solution: string, i: number) => (
                          <li key={i} className="text-xs text-gray-600 dark:text-gray-400">
                            • {solution}
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.features && Array.isArray(item.features) && (
                      <ul className="mt-3 space-y-1">
                        {item.features.map((feature: string, i: number) => (
                          <li key={i} className="text-xs text-gray-600 dark:text-gray-400">
                            • {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.metrics && Array.isArray(item.metrics) && (
                      <div className="mt-3 flex gap-2">
                        {item.metrics.map((metric: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-brand-100 dark:bg-brand-900/20 text-xs rounded">
                            {metric}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.status && (
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                        item.status === 'new' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                        item.status === 'trending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                        item.status === 'research' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      );
    }

    // Template padrão (sem items)
    return (
      <div className="text-center">
        {description && (
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {description}
          </p>
        )}
      </div>
    );
  };

  return (
    <Slide background="dark">
      <div className="h-screen bg-gradient-to-br from-white via-slate-50 to-brand-50 dark:from-slate-900 dark:via-brand-900/20 dark:to-slate-900 flex items-center justify-center transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-8">
          {/* Header */}
          {(title || subtitle) && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              {title && (
                <h1 className="text-5xl font-display font-bold mb-4 bg-gradient-to-r from-brand-400 to-primary-400 bg-clip-text text-transparent">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xl text-slate-600 dark:text-neutral-300 max-w-3xl mx-auto">
                  {subtitle}
                </p>
              )}
            </motion.div>
          )}

          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </Slide>
  );
};