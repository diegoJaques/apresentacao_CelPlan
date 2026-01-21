import { useState, useEffect, useCallback } from 'react';
import { casesApi } from '../lib/api';

export interface CaseItem {
  id: string;
  client: string;
  segment: string;
  title: string;
  description?: string;
  results: string[];
  technologies: string[];
  image_url?: string;
  logo_url?: string;
  year: number;
  is_active: boolean;
  order_index: number;
  metrics?: any;
  tags: string[];
}

export interface UseCasesOptions {
  autoLoad?: boolean;
  segment?: string;
  isActive?: boolean;
  limit?: number;
}

export function useBackendCases(options: UseCasesOptions = {}) {
  const { autoLoad = true, segment, isActive = true, limit = 100 } = options;

  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // Load cases from backend
  const loadCases = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await casesApi.list({
        segment,
        is_active: isActive,
        limit,
      });

      if (response.success) {
        setCases(response.cases);
        setTotal(response.total);
      }
    } catch (err) {
      console.error('Error loading cases:', err);
      setError(err instanceof Error ? err.message : 'Failed to load cases');

      // Fallback to localStorage if backend fails
      try {
        const stored = localStorage.getItem('celplan_cases');
        if (stored) {
          const localCases = JSON.parse(stored);
          setCases(localCases);
          setTotal(localCases.length);
          console.log('Loaded cases from localStorage as fallback');
        }
      } catch (localErr) {
        console.error('Failed to load from localStorage:', localErr);
      }
    } finally {
      setLoading(false);
    }
  }, [segment, isActive, limit]);

  // Create case
  const createCase = async (caseData: Omit<CaseItem, 'id' | 'order_index'>) => {
    try {
      const response = await casesApi.create({
        ...caseData,
        is_active: caseData.is_active ?? true,
      });

      if (response.success && response.case) {
        await loadCases();
        return response.case;
      }
      throw new Error('Failed to create case');
    } catch (err) {
      console.error('Error creating case:', err);
      throw err;
    }
  };

  // Update case
  const updateCase = async (id: string, updates: Partial<CaseItem>) => {
    try {
      const response = await casesApi.update(id, updates);

      if (response.success && response.case) {
        await loadCases();
        return response.case;
      }
      throw new Error('Failed to update case');
    } catch (err) {
      console.error('Error updating case:', err);
      throw err;
    }
  };

  // Delete case
  const deleteCase = async (id: string) => {
    try {
      const response = await casesApi.delete(id);

      if (response.success) {
        await loadCases();
        return true;
      }
      throw new Error('Failed to delete case');
    } catch (err) {
      console.error('Error deleting case:', err);
      throw err;
    }
  };

  // Toggle case active status
  const toggleCaseStatus = async (id: string) => {
    const caseItem = cases.find(c => c.id === id);
    if (caseItem) {
      await updateCase(id, { is_active: !caseItem.is_active });
    }
  };

  // Reorder cases
  const reorderCases = async (reorderedCases: Array<{ id: string; order_index: number }>) => {
    try {
      const response = await casesApi.reorder(reorderedCases);

      if (response.success) {
        await loadCases();
        return true;
      }
      throw new Error('Failed to reorder cases');
    } catch (err) {
      console.error('Error reordering cases:', err);
      throw err;
    }
  };

  // Get segments
  const getSegments = async () => {
    try {
      const response = await casesApi.getSegments();
      if (response.success) {
        return response.segments;
      }
      return [];
    } catch (err) {
      console.error('Error loading segments:', err);
      return [];
    }
  };

  // Migrate local cases to backend (one-time migration)
  const migrateLocalCases = async () => {
    try {
      const stored = localStorage.getItem('celplan_cases');
      if (!stored) return false;

      const localCases = JSON.parse(stored);
      let migrated = 0;

      for (const localCase of localCases) {
        try {
          // Check if case already exists by client and title
          const existingCases = await casesApi.list({ search: localCase.client });
          const exists = existingCases.cases.some(
            c => c.client === localCase.client && c.title === localCase.title
          );

          if (!exists) {
            await casesApi.create({
              client: localCase.client,
              segment: localCase.segment,
              title: localCase.title,
              description: localCase.description,
              results: localCase.results || [],
              technologies: localCase.technologies || [],
              image_url: localCase.imageUrl,
              logo_url: localCase.logoUrl,
              year: localCase.year || new Date().getFullYear(),
              is_active: localCase.isActive ?? true,
              metrics: localCase.metrics || {},
              tags: localCase.tags || [],
            });
            migrated++;
          }
        } catch (err) {
          console.error(`Failed to migrate case ${localCase.client}:`, err);
        }
      }

      if (migrated > 0) {
        console.log(`Successfully migrated ${migrated} cases to backend`);
        // Optionally clear localStorage after successful migration
        // localStorage.removeItem('celplan_cases');
      }

      return migrated;
    } catch (err) {
      console.error('Migration failed:', err);
      return 0;
    }
  };

  // Auto-load cases on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      loadCases();
    }
  }, [autoLoad, loadCases]);

  return {
    cases,
    loading,
    error,
    total,
    loadCases,
    createCase,
    updateCase,
    deleteCase,
    toggleCaseStatus,
    reorderCases,
    getSegments,
    migrateLocalCases,
  };
}

// Hook for managing selected cases in presentations
export function usePresentationCases(presentationId?: string) {
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load selected cases for a presentation
  const loadSelectedCases = useCallback(async () => {
    if (!presentationId) return;

    setLoading(true);
    try {
      const response = await casesApi.list();
      // For now, we'll just return all active cases
      // In the future, we'll load the specific cases for this presentation
      if (response.success) {
        const activeCases = response.cases.filter(c => c.is_active);
        setSelectedCaseIds(activeCases.map(c => c.id));
      }
    } catch (err) {
      console.error('Error loading presentation cases:', err);
    } finally {
      setLoading(false);
    }
  }, [presentationId]);

  // Update selected cases for a presentation
  const updateSelectedCases = async (caseIds: string[]) => {
    if (!presentationId) return;

    try {
      // This will be implemented when we have presentation API ready
      setSelectedCaseIds(caseIds);
      localStorage.setItem(`presentation_cases_${presentationId}`, JSON.stringify(caseIds));
    } catch (err) {
      console.error('Error updating selected cases:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadSelectedCases();
  }, [loadSelectedCases]);

  return {
    selectedCaseIds,
    loading,
    loadSelectedCases,
    updateSelectedCases,
  };
}