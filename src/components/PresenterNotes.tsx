import { motion } from 'framer-motion';
import { FileText, X } from 'lucide-react';
import { useState } from 'react';

interface PresenterNotesProps {
  slideNotes: { [key: string]: string };
  currentSlide: string;
}

export const PresenterNotes = ({ slideNotes, currentSlide }: PresenterNotesProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentNotes = slideNotes[currentSlide] || 'Sem notas para este slide.';

  return (
    <>
      {/* Notes Toggle Button */}
      <motion.button
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-8 z-50 glass-effect p-3 rounded-full 
                 hover:bg-white/10 transition-colors"
      >
        <FileText className="w-6 h-6 text-accent-500" />
      </motion.button>

      {/* Notes Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 h-full w-96 glass-effect z-40 p-8 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold gradient-text">Notas do Apresentador</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white/5 rounded-xl p-6">
          <h4 className="text-sm font-semibold text-accent-500 mb-3">
            Slide Atual
          </h4>
          <div className="text-gray-300 whitespace-pre-wrap">
            {currentNotes}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="glass-effect p-4 rounded-lg">
            <h5 className="text-sm font-semibold text-gray-400 mb-2">Dicas:</h5>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Use ← → para navegar</li>
              <li>• Space para próximo slide</li>
              <li>• 1-9 para ir direto ao slide</li>
              <li>• F para tela cheia</li>
              <li>• P para mudar perfil</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </>
  );
};