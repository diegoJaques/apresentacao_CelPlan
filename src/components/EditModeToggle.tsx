import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Save, X, AlertCircle } from 'lucide-react';
import { useInlineEdit } from '../contexts/InlineEditContext';

export const EditModeToggle: React.FC = () => {
  const { isEditMode, toggleEditMode, content } = useInlineEdit();

  // Conta quantos textos foram editados
  const editedCount = Object.keys(content).length;

  return (
    <>
      {/* Botão de Toggle */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleEditMode}
        className={`fixed bottom-20 right-8 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
          isEditMode
            ? 'bg-brand-500 hover:bg-brand-600'
            : 'bg-gray-700 hover:bg-gray-800'
        }`}
        title={isEditMode ? 'Sair do modo de edição' : 'Entrar no modo de edição'}
      >
        {isEditMode ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Edit3 className="w-6 h-6 text-white" />
        )}

        {/* Badge com número de edições */}
        {editedCount > 0 && !isEditMode && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {editedCount}
          </span>
        )}
      </motion.button>

      {/* Painel de Informações quando em modo edição */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 max-w-md"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Modo de Edição Ativo
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Clique em qualquer texto destacado para editar diretamente.
                </p>

                <div className="mt-3 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Atalhos:</span>
                  </div>
                  <div>• <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Ctrl+E</kbd> - Toggle modo edição</div>
                  <div>• <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Enter</kbd> - Salvar edição</div>
                  <div>• <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Esc</kbd> - Cancelar/Sair</div>
                </div>

                {editedCount > 0 && (
                  <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs text-blue-700 dark:text-blue-300">
                        {editedCount} texto{editedCount > 1 ? 's' : ''} editado{editedCount > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={toggleEditMode}
                    className="flex-1 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm rounded-lg transition-colors"
                  >
                    Concluir Edição
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador Visual de Modo de Edição */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 border-4 border-brand-500/20 pointer-events-none z-40"
          >
            <div className="absolute top-4 left-4 bg-brand-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Modo Edição
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};