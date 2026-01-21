import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit3, Save, X, Download, Upload, RotateCcw, RotateCw,
  History, Settings, FileJson, Trash2, Info, Check
} from 'lucide-react';
import { useInlineEdit } from '../contexts/InlineEditContext';

export const EditModeControls: React.FC = () => {
  const {
    isEditMode,
    toggleEditMode,
    content,
    undo,
    redo,
    canUndo,
    canRedo,
    exportContent,
    importContent,
    resetContent,
    getEditCount,
    getLastEditTime,
    saveContent
  } = useInlineEdit();

  const [showPanel, setShowPanel] = useState(false);
  const [showSuccess, setShowSuccess] = useState('');
  const [importError, setImportError] = useState('');

  // Conta quantos textos foram editados
  const editedCount = Object.keys(content).length;
  const totalEdits = getEditCount();
  const lastEdit = getLastEditTime();

  // Exportar JSON
  const handleExport = () => {
    const jsonContent = exportContent();
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `celplan-edits-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowSuccess('Edições exportadas com sucesso!');
    setTimeout(() => setShowSuccess(''), 3000);
  };

  // Importar JSON
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        const success = importContent(text);

        if (success) {
          setShowSuccess('Edições importadas com sucesso!');
          setTimeout(() => setShowSuccess(''), 3000);
        } else {
          setImportError('Erro ao importar arquivo. Verifique o formato.');
          setTimeout(() => setImportError(''), 3000);
        }
      }
    };
    input.click();
  };

  // Formatar tempo da última edição
  const formatLastEditTime = () => {
    if (!lastEdit) return 'Nenhuma edição ainda';

    const now = new Date();
    const diff = now.getTime() - lastEdit.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
    if (hours < 24) return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
    return `${days} dia${days > 1 ? 's' : ''} atrás`;
  };

  return (
    <>
      {/* Botão Principal */}
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

      {/* Botão de Configurações */}
      {isEditMode && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPanel(!showPanel)}
          className="fixed bottom-36 right-8 z-50 w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-800 shadow-lg flex items-center justify-center"
          title="Controles avançados"
        >
          <Settings className="w-5 h-5 text-white" />
        </motion.button>
      )}

      {/* Botões de Undo/Redo */}
      {isEditMode && (
        <>
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: canUndo ? 1.1 : 1 }}
            whileTap={{ scale: canUndo ? 0.95 : 1 }}
            onClick={undo}
            disabled={!canUndo}
            className={`fixed bottom-20 right-28 z-50 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all ${
              canUndo
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-600 opacity-50 cursor-not-allowed'
            }`}
            title="Desfazer (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4 text-white" />
          </motion.button>

          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: canRedo ? 1.1 : 1 }}
            whileTap={{ scale: canRedo ? 0.95 : 1 }}
            onClick={redo}
            disabled={!canRedo}
            className={`fixed bottom-20 right-40 z-50 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all ${
              canRedo
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-600 opacity-50 cursor-not-allowed'
            }`}
            title="Refazer (Ctrl+Y)"
          >
            <RotateCw className="w-4 h-4 text-white" />
          </motion.button>
        </>
      )}

      {/* Painel de Controles Avançados */}
      <AnimatePresence>
        {showPanel && isEditMode && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-52 right-8 z-50 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Controles de Edição
              </h3>
              <button
                onClick={() => setShowPanel(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Estatísticas */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                <Info className="w-4 h-4" />
                <span>Estatísticas</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Textos editados:</span>
                  <span className="font-medium">{editedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total de edições:</span>
                  <span className="font-medium">{totalEdits}</span>
                </div>
                <div className="flex justify-between">
                  <span>Última edição:</span>
                  <span className="font-medium">{formatLastEditTime()}</span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="space-y-2">
              <button
                onClick={handleExport}
                className="w-full flex items-center gap-3 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Exportar Edições</span>
              </button>

              <button
                onClick={handleImport}
                className="w-full flex items-center gap-3 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Importar Edições</span>
              </button>

              <button
                onClick={saveContent}
                className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span className="text-sm font-medium">Salvar Agora</span>
              </button>

              <button
                onClick={resetContent}
                className="w-full flex items-center gap-3 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Resetar Tudo</span>
              </button>
            </div>

            {/* Atalhos */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <div className="font-medium mb-1">Atalhos:</div>
                <div>• <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-600 rounded">Ctrl+E</kbd> - Toggle edição</div>
                <div>• <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-600 rounded">Ctrl+Z</kbd> - Desfazer</div>
                <div>• <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-600 rounded">Ctrl+Y</kbd> - Refazer</div>
                <div>• <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-600 rounded">Ctrl+S</kbd> - Salvar</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notificações de Sucesso */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            <span>{showSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notificações de Erro */}
      <AnimatePresence>
        {importError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            <span>{importError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador de Modo de Edição */}
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