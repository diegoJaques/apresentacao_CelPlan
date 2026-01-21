import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-full transition-all duration-300
        ${isDark
          ? 'bg-white/10 hover:bg-white/20 text-white'
          : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
        }
        backdrop-blur-sm
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 0 : 360,
          scale: isDark ? 1 : 0.8
        }}
        transition={{ duration: 0.3 }}
        className="relative w-5 h-5"
      >
        {isDark ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </motion.div>
    </motion.button>
  );
};
