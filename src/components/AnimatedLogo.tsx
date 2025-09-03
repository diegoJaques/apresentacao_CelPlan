import { motion } from 'framer-motion';

export const AnimatedLogo = () => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        duration: 1.2,
        type: "spring",
        stiffness: 100
      }}
      className="relative flex flex-col items-center"
    >
      <motion.img
        src="/images/celplan-logo.png"
        alt="CelPlan International"
        className="h-48 md:h-56 w-auto mb-6 logo-enhanced"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{
          imageRendering: 'auto',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
        }}
      />
      
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="h-1 bg-gradient-to-r from-primary-500 to-accent-500 mt-4 max-w-md"
      />
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="text-2xl font-display font-semibold text-neutral-300 mt-6 text-center"
      >
        International
      </motion.p>
    </motion.div>
  );
};