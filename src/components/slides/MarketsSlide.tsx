import { motion } from 'framer-motion';
import { Slide } from '../Slide';
import { markets } from '../../data/content';

export const MarketsSlide = () => {
  return (
    <Slide background="dark">
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-display font-bold mb-12"
        >
          <span className="gradient-text">Mercados de Atuação</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {markets.map((market, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(255, 215, 0, 0.3)'
              }}
              className="glass-effect p-8 rounded-2xl cursor-pointer group"
            >
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-4"
              >
                {market.icon}
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-3 group-hover:text-accent-500 transition-colors">
                {market.title}
              </h3>
              
              <p className="text-neutral-200 mb-4">
                {market.description}
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {market.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 bg-primary-500/20 text-accent-500 
                             rounded-full text-xs font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Slide>
  );
};