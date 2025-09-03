import { motion } from 'framer-motion';
import { Slide } from '../Slide';
import { AnimatedLogo } from '../AnimatedLogo';
import { companyInfo } from '../../data/content';

export const IntroSlide = () => {
  return (
    <Slide background="dark">
      <div className="text-center">
        <AnimatedLogo />
        
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-2xl md:text-3xl font-display font-medium mt-8 mb-4 text-neutral-300"
        >
          {companyInfo.tagline}
        </motion.h2>

        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.8 }}
          className="text-xl md:text-2xl font-semibold mb-8 gradient-text text-shadow"
        >
          {companyInfo.subtitle}
        </motion.h3>


        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="text-lg text-neutral-200 mt-12 max-w-4xl mx-auto leading-relaxed"
        >
          {companyInfo.valueProposition}
        </motion.p>
      </div>
    </Slide>
  );
};