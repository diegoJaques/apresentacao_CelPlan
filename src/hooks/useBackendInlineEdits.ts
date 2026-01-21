import { useState, useEffect, useCallback } from 'react';
import { presentationsApi } from '../lib/api';

export interface InlineEdit {
  id?: string;
  presentation_id?: string;
  element_id: string;
  content: string;
  element_type: 'text' | 'image' | 'color' | 'html';
  metadata?: any;
}

export interface EditableContent {
  [key: string]: string | any;
}

interface UseInlineEditsOptions {
  presentationId?: string;
  autoLoad?: boolean;
  fallbackToLocal?: boolean;
}

export function useBackendInlineEdits(options: UseInlineEditsOptions = {}) {
  const { presentationId, autoLoad = true, fallbackToLocal = true } = options;

  const [edits, setEdits] = useState<EditableContent>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // History for undo/redo
  const [history, setHistory] = useState<EditableContent[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Load edits from backend or localStorage
  const loadEdits = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (presentationId) {
        // Try to load from backend
        const response = await presentationsApi.get(presentationId);

        if (response.success && response.presentation.edits) {
          const editsMap: EditableContent = {};
          response.presentation.edits.forEach((edit: InlineEdit) => {
            editsMap[edit.element_id] = edit.content;
          });
          setEdits(editsMap);
          setHistory([editsMap]);
          setHistoryIndex(0);
        }
      } else if (fallbackToLocal) {
        // Load from localStorage if no presentationId
        const stored = localStorage.getItem('inline_edits_v3');
        if (stored) {
          const localEdits = JSON.parse(stored);
          setEdits(localEdits);
          setHistory([localEdits]);
          setHistoryIndex(0);
        }
      }
    } catch (err) {
      console.error('Error loading inline edits:', err);
      setError(err instanceof Error ? err.message : 'Failed to load edits');

      // Fallback to localStorage if backend fails
      if (fallbackToLocal) {
        try {
          const stored = localStorage.getItem('inline_edits_v3');
          if (stored) {
            const localEdits = JSON.parse(stored);
            setEdits(localEdits);
            setHistory([localEdits]);
            setHistoryIndex(0);
            console.log('Loaded edits from localStorage as fallback');
          }
        } catch (localErr) {
          console.error('Failed to load from localStorage:', localErr);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [presentationId, fallbackToLocal]);

  // Save a single edit to backend
  const saveEdit = async (elementId: string, content: string, type: string = 'text') => {
    if (!presentationId) {
      // Save to localStorage if no presentationId
      const newEdits = { ...edits, [elementId]: content };
      setEdits(newEdits);
      localStorage.setItem('inline_edits_v3', JSON.stringify(newEdits));

      // Update history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newEdits);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      return;
    }

    setIsSaving(true);
    try {
      const response = await presentationsApi.saveInlineEdit(presentationId, {
        element_id: elementId,
        content,
        element_type: type as any,
        metadata: {}
      });

      if (response.success) {
        const newEdits = { ...edits, [elementId]: content };
        setEdits(newEdits);

        // Also save to localStorage as backup
        if (fallbackToLocal) {
          localStorage.setItem('inline_edits_v3', JSON.stringify(newEdits));
        }

        // Update history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newEdits);
        if (newHistory.length > 50) {
          newHistory.shift(); // Keep max 50 entries
        }
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    } catch (err) {
      console.error('Error saving edit:', err);
      setError(err instanceof Error ? err.message : 'Failed to save edit');

      // Save to localStorage as fallback
      if (fallbackToLocal) {
        const newEdits = { ...edits, [elementId]: content };
        setEdits(newEdits);
        localStorage.setItem('inline_edits_v3', JSON.stringify(newEdits));
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Batch save all edits
  const saveAllEdits = async () => {
    if (!presentationId) {
      // Save to localStorage if no presentationId
      localStorage.setItem('inline_edits_v3', JSON.stringify(edits));
      return;
    }

    setIsSaving(true);
    const promises = Object.entries(edits).map(([elementId, content]) =>
      presentationsApi.saveInlineEdit(presentationId, {
        element_id: elementId,
        content: String(content),
        element_type: 'text',
        metadata: {}
      }).catch(err => {
        console.error(`Failed to save edit for ${elementId}:`, err);
      })
    );

    try {
      await Promise.all(promises);

      // Also save to localStorage as backup
      if (fallbackToLocal) {
        localStorage.setItem('inline_edits_v3', JSON.stringify(edits));
      }
    } catch (err) {
      console.error('Error saving edits:', err);
      setError(err instanceof Error ? err.message : 'Failed to save some edits');
    } finally {
      setIsSaving(false);
    }
  };

  // Undo/Redo functionality
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setEdits(history[newIndex]);

      if (fallbackToLocal) {
        localStorage.setItem('inline_edits_v3', JSON.stringify(history[newIndex]));
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setEdits(history[newIndex]);

      if (fallbackToLocal) {
        localStorage.setItem('inline_edits_v3', JSON.stringify(history[newIndex]));
      }
    }
  };

  // Reset all edits
  const resetEdits = () => {
    setEdits({});
    setHistory([{}]);
    setHistoryIndex(0);

    if (fallbackToLocal) {
      localStorage.removeItem('inline_edits_v3');
    }
  };

  // Export edits as JSON
  const exportEdits = () => {
    const dataStr = JSON.stringify(edits, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `inline-edits-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import edits from JSON
  const importEdits = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setEdits(imported);

        // Save imported edits
        if (presentationId) {
          await saveAllEdits();
        } else if (fallbackToLocal) {
          localStorage.setItem('inline_edits_v3', JSON.stringify(imported));
        }

        // Update history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(imported);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      } catch (err) {
        console.error('Error importing edits:', err);
        setError('Failed to import edits');
      }
    };
    reader.readAsText(file);
  };

  // Get a specific edit value
  const getEdit = (elementId: string, defaultValue: string = '') => {
    return edits[elementId] || defaultValue;
  };

  // Auto-load on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      loadEdits();
    }
  }, [autoLoad, loadEdits]);

  return {
    edits,
    loading,
    error,
    isSaving,
    loadEdits,
    saveEdit,
    saveAllEdits,
    getEdit,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    resetEdits,
    exportEdits,
    importEdits,
  };
}

// Hook for migrating existing localStorage edits to backend
export function useMigrateInlineEdits(presentationId?: string) {
  const [migrating, setMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);

  const migrate = async () => {
    if (!presentationId) {
      setMigrationStatus('No presentation ID provided');
      return false;
    }

    setMigrating(true);
    setMigrationStatus('Starting migration...');

    try {
      // Load from localStorage
      const stored = localStorage.getItem('inline_edits_v3');
      if (!stored) {
        setMigrationStatus('No local edits to migrate');
        return false;
      }

      const localEdits = JSON.parse(stored);
      const entries = Object.entries(localEdits);

      if (entries.length === 0) {
        setMigrationStatus('No edits to migrate');
        return false;
      }

      setMigrationStatus(`Migrating ${entries.length} edits...`);

      // Save each edit to backend
      let migrated = 0;
      for (const [elementId, content] of entries) {
        try {
          await presentationsApi.saveInlineEdit(presentationId, {
            element_id: elementId,
            content: String(content),
            element_type: 'text',
            metadata: {}
          });
          migrated++;
        } catch (err) {
          console.error(`Failed to migrate edit ${elementId}:`, err);
        }
      }

      setMigrationStatus(`✅ Successfully migrated ${migrated}/${entries.length} edits`);

      // Optionally clear localStorage after successful migration
      // localStorage.removeItem('inline_edits_v3');

      return migrated === entries.length;
    } catch (err) {
      console.error('Migration failed:', err);
      setMigrationStatus('❌ Migration failed');
      return false;
    } finally {
      setMigrating(false);
    }
  };

  return {
    migrate,
    migrating,
    migrationStatus
  };
}