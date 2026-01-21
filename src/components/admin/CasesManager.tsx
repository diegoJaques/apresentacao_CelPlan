import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Check,
  Upload,
  Link2,
  RefreshCw
} from 'lucide-react';
import { casesStore, type CaseItem } from '../../lib/casesStore';

interface EditingCase extends Partial<CaseItem> {
  results: string[];
  technologies: string[];
}

export const CasesManager = () => {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCase, setEditingCase] = useState<EditingCase | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      setLoading(true);
      const data = await casesStore.getCases();
      setCases(data.cases);
      setSelectedCases(data.selectedCases);
    } catch (error) {
      console.error('Erro ao carregar cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCase = async (caseId: string) => {
    const newSelected = selectedCases.includes(caseId)
      ? selectedCases.filter(id => id !== caseId)
      : [...selectedCases, caseId];

    setSelectedCases(newSelected);
    await casesStore.selectCasesForPresentation(newSelected);
  };

  const handleStartEdit = (caseItem: CaseItem) => {
    setEditingId(caseItem.id);
    setEditingCase({
      ...caseItem,
      results: [...caseItem.results],
      technologies: [...caseItem.technologies]
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingCase(null);
    setIsCreating(false);
  };

  const handleSaveEdit = async () => {
    if (!editingCase) return;

    if (isCreating) {
      // Creating new case
      const newCase = await casesStore.addCase({
        client: editingCase.client || 'Novo Cliente',
        segment: editingCase.segment || 'Telecom',
        title: editingCase.title || 'Novo Case',
        description: editingCase.description || 'Descrição do case',
        results: editingCase.results || [],
        imageUrl: editingCase.imageUrl,
        logoUrl: editingCase.logoUrl,
        year: editingCase.year || new Date().getFullYear(),
        technologies: editingCase.technologies || [],
        isActive: editingCase.isActive !== false
      });

      setCases([...cases, newCase]);

      // Auto-select the new case
      const newSelected = [...selectedCases, newCase.id];
      setSelectedCases(newSelected);
      await casesStore.selectCasesForPresentation(newSelected);
    } else if (editingId) {
      // Updating existing case
      await casesStore.updateCase(editingId, editingCase);
      setCases(cases.map(c => c.id === editingId ? { ...c, ...editingCase } : c));
    }

    handleCancelEdit();
  };

  const handleDeleteCase = async (caseId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este case?')) {
      await casesStore.deleteCase(caseId);
      setCases(cases.filter(c => c.id !== caseId));
      setSelectedCases(selectedCases.filter(id => id !== caseId));
    }
  };

  const handleMoveCase = async (caseId: string, direction: 'up' | 'down') => {
    const index = cases.findIndex(c => c.id === caseId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === cases.length - 1)
    ) {
      return;
    }

    const newCases = [...cases];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newCases[index], newCases[swapIndex]] = [newCases[swapIndex], newCases[index]];

    // Update order
    newCases.forEach((c, i) => c.order = i + 1);
    setCases(newCases);

    await casesStore.reorderCases(newCases.map(c => c.id));
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingCase({
      client: '',
      segment: 'Telecom',
      title: '',
      description: '',
      results: [''],
      imageUrl: '',
      logoUrl: '',
      year: new Date().getFullYear(),
      technologies: [''],
      isActive: true
    });
  };

  const handleResetToDefault = async () => {
    if (window.confirm('Isso irá restaurar todos os cases para os valores padrão. Continuar?')) {
      await casesStore.resetToDefault();
      await loadCases();
    }
  };

  const segments = ['Telecom', 'Energia', 'Governo', 'Mineração', 'Logística', 'Saúde', 'Educação', 'Varejo'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-500">Carregando cases...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
          Gerenciador de Cases de Sucesso
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie os cases que aparecem na apresentação
        </p>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Dica:</strong> Selecione até 6 cases para melhor visualização no carrossel.
            Casos selecionados: <span className="font-bold">{selectedCases.length}</span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleStartCreate}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Case
        </button>

        <button
          onClick={handleResetToDefault}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Restaurar Padrões
        </button>
      </div>

      {/* Create New Case Form */}
      <AnimatePresence>
        {isCreating && editingCase && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg border-2 border-brand-500"
          >
            <h3 className="text-xl font-bold mb-4 text-brand-600 dark:text-brand-400">
              Criar Novo Case
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cliente</label>
                <input
                  type="text"
                  value={editingCase.client || ''}
                  onChange={(e) => setEditingCase({ ...editingCase, client: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-gray-600"
                  placeholder="Nome do cliente"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Segmento</label>
                <select
                  value={editingCase.segment || 'Telecom'}
                  onChange={(e) => setEditingCase({ ...editingCase, segment: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-gray-600"
                >
                  {segments.map(seg => (
                    <option key={seg} value={seg}>{seg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Título do Case</label>
                <input
                  type="text"
                  value={editingCase.title || ''}
                  onChange={(e) => setEditingCase({ ...editingCase, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-gray-600"
                  placeholder="Ex: Otimização de Rede 5G"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ano</label>
                <input
                  type="number"
                  value={editingCase.year || new Date().getFullYear()}
                  onChange={(e) => setEditingCase({ ...editingCase, year: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-gray-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  value={editingCase.description || ''}
                  onChange={(e) => setEditingCase({ ...editingCase, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-gray-600"
                  rows={3}
                  placeholder="Descreva o case..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">URL da Imagem</label>
                <input
                  type="text"
                  value={editingCase.imageUrl || ''}
                  onChange={(e) => setEditingCase({ ...editingCase, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-gray-600"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Resultados (um por linha)</label>
                <textarea
                  value={editingCase.results?.join('\n') || ''}
                  onChange={(e) => setEditingCase({ ...editingCase, results: e.target.value.split('\n').filter(r => r.trim()) })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-gray-600"
                  rows={4}
                  placeholder="40% de melhoria em cobertura&#10;Redução de 25% em interferências&#10;ROI em 8 meses"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Tecnologias (separadas por vírgula)</label>
                <input
                  type="text"
                  value={editingCase.technologies?.join(', ') || ''}
                  onChange={(e) => setEditingCase({ ...editingCase, technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-gray-600"
                  placeholder="5G NR, AI/ML, Cloud RAN"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Criar Case
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cases List */}
      <div className="space-y-4">
        {cases.map((caseItem, index) => (
          <motion.div
            key={caseItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md border-2 transition-all ${
              selectedCases.includes(caseItem.id)
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            {editingId === caseItem.id && editingCase ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Cliente</label>
                    <input
                      type="text"
                      value={editingCase.client || ''}
                      onChange={(e) => setEditingCase({ ...editingCase, client: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Segmento</label>
                    <select
                      value={editingCase.segment || ''}
                      onChange={(e) => setEditingCase({ ...editingCase, segment: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-gray-600"
                    >
                      {segments.map(seg => (
                        <option key={seg} value={seg}>{seg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Título</label>
                    <input
                      type="text"
                      value={editingCase.title || ''}
                      onChange={(e) => setEditingCase({ ...editingCase, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Ano</label>
                    <input
                      type="number"
                      value={editingCase.year || ''}
                      onChange={(e) => setEditingCase({ ...editingCase, year: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" />
                    Salvar
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Selection Checkbox */}
                  <button
                    onClick={() => handleSelectCase(caseItem.id)}
                    className={`mt-1 w-6 h-6 rounded flex items-center justify-center transition-all ${
                      selectedCases.includes(caseItem.id)
                        ? 'bg-brand-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {selectedCases.includes(caseItem.id) && <Check className="w-4 h-4" />}
                  </button>

                  {/* Case Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                          {caseItem.client}
                        </h3>
                        <p className="text-sm text-brand-600 dark:text-brand-400 font-medium">
                          {caseItem.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {caseItem.description}
                        </p>
                        <div className="flex gap-4 mt-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                            {caseItem.segment}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                            {caseItem.year}
                          </span>
                          <span className="text-xs text-gray-500">
                            {caseItem.technologies.length} tecnologias
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleMoveCase(caseItem.id, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveCase(caseItem.id, 'down')}
                    disabled={index === cases.length - 1}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleStartEdit(caseItem)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCase(caseItem.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {cases.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Nenhum case cadastrado ainda.
          </p>
          <button
            onClick={handleStartCreate}
            className="px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
          >
            Criar Primeiro Case
          </button>
        </div>
      )}
    </div>
  );
};