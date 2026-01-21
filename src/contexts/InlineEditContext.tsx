import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

interface EditableContent {
  [key: string]: string;
}

interface HistoryEntry {
  content: EditableContent;
  timestamp: number;
}

interface InlineEditContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  content: EditableContent;
  updateContent: (key: string, value: string) => void;
  saveContent: () => void;
  // Novos recursos de histórico
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  // Exportação/Importação
  exportContent: () => string;
  importContent: (jsonContent: string) => boolean;
  resetContent: () => void;
  // Estatísticas
  getEditCount: () => number;
  getLastEditTime: () => Date | null;
}

const InlineEditContext = createContext<InlineEditContextType | undefined>(undefined);

const STORAGE_KEY = 'celplan_editable_content';
const HISTORY_KEY = 'celplan_edit_history';
const MAX_HISTORY = 50;

export const InlineEditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [content, setContent] = useState<EditableContent>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Sistema de histórico
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Estatísticas
  const [editCount, setEditCount] = useState(0);
  const [lastEditTime, setLastEditTime] = useState<Date | null>(null);

  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Carrega conteúdo salvo
  useEffect(() => {
    const savedContent = localStorage.getItem(STORAGE_KEY);
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent);
        setContent(parsed);
        // Inicializa histórico com o estado atual
        const initialHistory = [{ content: parsed, timestamp: Date.now() }];
        setHistory(initialHistory);
        setHistoryIndex(0);
      } catch (error) {
        console.error('Erro ao carregar conteúdo editável:', error);
      }
    }

    // Carrega estatísticas
    const stats = localStorage.getItem('celplan_edit_stats');
    if (stats) {
      try {
        const parsedStats = JSON.parse(stats);
        setEditCount(parsedStats.editCount || 0);
        if (parsedStats.lastEditTime) {
          setLastEditTime(new Date(parsedStats.lastEditTime));
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    }
  }, []);

  // Atualiza flags de undo/redo
  useEffect(() => {
    setCanUndo(historyIndex > 0);
    setCanRedo(historyIndex < history.length - 1);
  }, [historyIndex, history]);

  // Auto-save quando há mudanças
  useEffect(() => {
    if (hasChanges) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveContent();
        setHasChanges(false);
      }, 1000);

      return () => clearTimeout(saveTimeoutRef.current);
    }
  }, [content, hasChanges]);

  // Atalhos de teclado aprimorados
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+E ou Cmd+E para toggle edit mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        toggleEditMode();
      }

      // Ctrl+Z para undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }

      // Ctrl+Y ou Ctrl+Shift+Z para redo
      if (((e.ctrlKey || e.metaKey) && e.key === 'y') ||
          ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        if (canRedo) redo();
      }

      // Escape para sair do modo edição
      if (e.key === 'Escape' && isEditMode) {
        setIsEditMode(false);
      }

      // Ctrl+S para salvar explicitamente
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveContent();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isEditMode, canUndo, canRedo]);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode && hasChanges) {
      saveContent();
    }
  };

  const updateContent = (key: string, value: string) => {
    const newContent = { ...content, [key]: value };
    setContent(newContent);
    setHasChanges(true);

    // Adiciona ao histórico
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ content: newContent, timestamp: Date.now() });

    // Limita o histórico
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }

    setHistory(newHistory);

    // Atualiza estatísticas
    setEditCount(editCount + 1);
    setLastEditTime(new Date());
  };

  const saveContent = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    localStorage.setItem('celplan_edit_stats', JSON.stringify({
      editCount,
      lastEditTime: lastEditTime?.toISOString()
    }));
    console.log('Conteúdo salvo:', content);
  };

  // Função de Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];
      setContent(previousState.content);
      setHistoryIndex(newIndex);
      setHasChanges(true);
    }
  }, [historyIndex, history]);

  // Função de Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      setContent(nextState.content);
      setHistoryIndex(newIndex);
      setHasChanges(true);
    }
  }, [historyIndex, history]);

  // Exportar conteúdo
  const exportContent = (): string => {
    const exportData = {
      content,
      exportDate: new Date().toISOString(),
      editCount,
      version: '1.0'
    };
    return JSON.stringify(exportData, null, 2);
  };

  // Importar conteúdo
  const importContent = (jsonContent: string): boolean => {
    try {
      const imported = JSON.parse(jsonContent);

      if (imported.content) {
        setContent(imported.content);
        // Adiciona ao histórico
        const newHistory = [...history, { content: imported.content, timestamp: Date.now() }];
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setHasChanges(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao importar conteúdo:', error);
      return false;
    }
  };

  // Resetar conteúdo
  const resetContent = () => {
    if (confirm('Tem certeza que deseja resetar todas as edições? Esta ação não pode ser desfeita.')) {
      setContent({});
      setHistory([{ content: {}, timestamp: Date.now() }]);
      setHistoryIndex(0);
      setEditCount(0);
      setLastEditTime(null);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('celplan_edit_stats');
    }
  };

  // Funções de estatísticas
  const getEditCount = () => editCount;
  const getLastEditTime = () => lastEditTime;

  return (
    <InlineEditContext.Provider value={{
      isEditMode,
      toggleEditMode,
      content,
      updateContent,
      saveContent,
      undo,
      redo,
      canUndo,
      canRedo,
      exportContent,
      importContent,
      resetContent,
      getEditCount,
      getLastEditTime
    }}>
      {children}
    </InlineEditContext.Provider>
  );
};

export const useInlineEdit = () => {
  const context = useContext(InlineEditContext);
  if (context === undefined) {
    throw new Error('useInlineEdit must be used within an InlineEditProvider');
  }
  return context;
};