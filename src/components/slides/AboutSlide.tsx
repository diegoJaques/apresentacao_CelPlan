import { motion } from 'framer-motion';
import { Slide } from '../Slide';
import { MapPin, Award, Building } from 'lucide-react';
import { companyInfo } from '../../data/content';

export const AboutSlide = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Slide>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Título */}
        <motion.h2 
          variants={itemVariants}
          className="text-5xl font-display font-bold text-center mb-8"
        >
          <span className="gradient-text">Sobre a CelPlan</span>
        </motion.h2>

        {/* Cards de métricas - layout horizontal */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { number: `${companyInfo.founded}`, label: "Fundação" },
            { number: companyInfo.employees, label: "Funcionários" },
            { number: "6", label: "Continentes" },
            { number: "32", label: "Anos de Inovação" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="glass-effect px-4 py-3 rounded-xl text-center"
            >
              <div className="text-2xl font-bold text-brand-500">{stat.number}</div>
              <div className="text-xs text-neutral-300 mt-1 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Seção meio - 2 colunas */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Imagem da sede */}
          <motion.div
            variants={itemVariants}
            className="glass-effect p-6 rounded-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Building className="w-6 h-6 text-primary-500" />
              <h3 className="text-xl font-semibold">Nossa Sede</h3>
            </div>
            <motion.img
              src="/images/sede-celplan.png"
              alt="Sede CelPlan - Delaware, EUA"
              className="w-full h-48 md:h-64 object-cover rounded-lg mb-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
            <p className="text-sm text-neutral-300 text-center">
              Sede CelPlan - Delaware, EUA
            </p>
          </motion.div>

          {/* Subsidiárias */}
          <motion.div 
            variants={itemVariants} 
            className="glass-effect p-6 rounded-xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <MapPin className="w-8 h-8 text-brand-600" />
              <h3 className="text-xl font-semibold">Subsidiárias</h3>
            </div>
            <ul className="text-neutral-200 space-y-3">
              {companyInfo.subsidiaries.map((sub, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-brand-500 mt-1">•</span>
                  <span>{sub}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Investimento em P&D - linha completa */}
        <motion.div
          variants={itemVariants}
          className="glass-effect p-6 rounded-xl text-center"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
            <Award className="w-6 h-6 text-primary-500" />
            Investimento em Inovação
          </h3>
          <p className="text-3xl font-bold text-primary-500 mb-2">{companyInfo.investment}</p>
          <p className="text-sm text-neutral-300">
            Desenvolvimento contínuo de soluções tecnológicas avançadas
          </p>
        </motion.div>
      </motion.div>
    </Slide>
  );
};