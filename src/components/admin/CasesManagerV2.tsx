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
  RefreshCw,
  Loader2,
  AlertCircle,
  CloudUpload
} from 'lucide-react';
import { useBackendCases, type CaseItem } from '../../hooks/useBackendCases';
import { mediaApi } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { ImageCropModal } from './ImageCropModal';

interface EditingCase extends Partial<CaseItem> {
  results: string[];
  technologies: string[];
}

export const CasesManagerV2 = () => {
  const { isAuthenticated } = useAuth();
  const {
    cases,
    loading,
    error,
    loadCases,
    createCase,
    updateCase,
    deleteCase,
    toggleCaseStatus,
    reorderCases,
    migrateLocalCases
  } = useBackendCases({ autoLoad: true });

  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCase, setEditingCase] = useState<EditingCase | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);

  // Crop modal states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropType, setCropType] = useState<'image' | 'logo'>('image');

  // Load selected cases from localStorage (temporary until we have presentation API)
  useEffect(() => {
    const stored = localStorage.getItem('selected_cases_v2');
    if (stored) {
      setSelectedCases(JSON.parse(stored));
    }
  }, []);

  // Save selected cases to localStorage
  const saveSelectedCases = (caseIds: string[]) => {
    setSelectedCases(caseIds);
    localStorage.setItem('selected_cases_v2', JSON.stringify(caseIds));
  };

  const handleSelectCase = (caseId: string) => {
    const newSelected = selectedCases.includes(caseId)
      ? selectedCases.filter(id => id !== caseId)
      : [...selectedCases, caseId];
    saveSelectedCases(newSelected);
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

    try {
      if (isCreating) {
        // Creating new case
        const newCase = await createCase({
          client: editingCase.client || 'Novo Cliente',
          segment: editingCase.segment || 'Telecom',
          title: editingCase.title || 'Novo Case',
          description: editingCase.description,
          results: editingCase.results || [],
          technologies: editingCase.technologies || [],
          image_url: editingCase.image_url,
          logo_url: editingCase.logo_url,
          year: editingCase.year || new Date().getFullYear(),
          is_active: editingCase.is_active !== false,
          metrics: editingCase.metrics,
          tags: editingCase.tags || []
        });

        // Auto-select the new case
        if (newCase?.id) {
          const newSelected = [...selectedCases, newCase.id];
          saveSelectedCases(newSelected);
        }
      } else if (editingId) {
        // Updating existing case
        await updateCase(editingId, editingCase);
      }

      handleCancelEdit();
    } catch (err) {
      console.error('Error saving case:', err);
      alert('Erro ao salvar case. Verifique a conexão com o servidor.');
    }
  };

  const handleDeleteCase = async (caseId: string) => {
    if (!confirm('Tem certeza que deseja deletar este case?')) return;

    try {
      await deleteCase(caseId);
      // Remove from selected if it was selected
      if (selectedCases.includes(caseId)) {
        saveSelectedCases(selectedCases.filter(id => id !== caseId));
      }
    } catch (err) {
      console.error('Error deleting case:', err);
      alert('Erro ao deletar case.');
    }
  };

  const handleToggleStatus = async (caseId: string) => {
    try {
      await toggleCaseStatus(caseId);
    } catch (err) {
      console.error('Error toggling status:', err);
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

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...cases];
    const [removed] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, removed);

    // Update order_index for all affected cases
    const updates = reordered.map((c, i) => ({
      id: c.id,
      order_index: i
    }));

    try {
      await reorderCases(updates);
    } catch (err) {
      console.error('Error reordering cases:', err);
    }
  };

  // Handle file selection - opens crop modal
  const handleFileSelect = (file: File, type: 'image' | 'logo') => {
    if (!isAuthenticated) {
      alert('Você precisa estar autenticado para fazer upload de imagens.');
      return;
    }

    // Create temporary URL for cropping
    const imageUrl = URL.createObjectURL(file);
    setImageToCrop(imageUrl);
    setCropType(type);
    setCropModalOpen(true);
  };

  // Handle cropped image upload
  const handleCroppedImage = async (croppedBlob: Blob) => {
    const type = cropType;
    const setUploading = type === 'image' ? setUploadingImage : setUploadingLogo;
    setUploading(true);

    try {
      // Convert blob to file
      const file = new File([croppedBlob], `${type}-${Date.now()}.jpg`, {
        type: 'image/jpeg'
      });

      const response = await mediaApi.uploadImage(file, {
        folder: 'cases',
        max_width: type === 'logo' ? 400 : 1200,
        max_height: type === 'logo' ? 400 : 800,
        quality: 85
      });

      if (response.success && response.media) {
        setEditingCase(prev => prev ? {
          ...prev,
          [type === 'image' ? 'image_url' : 'logo_url']: response.media.url
        } : null);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setUploading(false);
      // Clean up temporary URL
      if (imageToCrop) {
        URL.revokeObjectURL(imageToCrop);
      }
      setImageToCrop(null);
    }
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingCase({
      client: '',
      segment: 'Telecom',
      title: '',
      description: '',
      results: [],
      technologies: [],
      year: new Date().getFullYear(),
      is_active: true
    });
  };

  const handleMigrateFromLocal = async () => {
    setMigrationStatus('Migrando cases locais...');
    try {
      const migrated = await migrateLocalCases();
      if (migrated > 0) {
        setMigrationStatus(`✅ ${migrated} cases migrados com sucesso!`);
        await loadCases();
      } else {
        setMigrationStatus('Nenhum case novo para migrar.');
      }
      setTimeout(() => setMigrationStatus(null), 3000);
    } catch (err) {
      setMigrationStatus('❌ Erro na migração.');
      setTimeout(() => setMigrationStatus(null), 3000);
    }
  };

  if (loading && cases.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-3 text-gray-600">Carregando cases...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Gerenciar Cases de Sucesso
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {cases.length} cases • {selectedCases.length} selecionados
            {isAuthenticated ? ' • 🟢 Conectado ao backend' : ' • 🔴 Modo offline'}
          </p>
        </div>
        <div className="flex gap-2">
          {error && (
            <button
              onClick={handleMigrateFromLocal}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
              title="Migrar cases do localStorage para o backend"
            >
              <CloudUpload className="w-4 h-4" />
              Migrar Local
            </button>
          )}
          <button
            onClick={loadCases}
            className="p-2 text-gray-600 hover:text-gray-900"
            title="Recarregar cases"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleStartCreate}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Case
          </button>
        </div>
      </div>

      {/* Migration Status */}
      {migrationStatus && (
        <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
          {migrationStatus}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Modo offline: {error}
        </div>
      )}

      {/* Cases List */}
      <div className="space-y-4">
        {/* Creating New Case */}
        {isCreating && editingCase && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Cliente"
                  value={editingCase.client || ''}
                  onChange={(e) => setEditingCase({ ...editingCase, client: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
                <select
                  value={editingCase.segment || 'Telecom'}
                  onChange={(e) => setEditingCase({ ...editingCase, segment: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                >
                  <option value="Telecom">Telecom</option>
                  <option value="Energia">Energia</option>
                  <option value="Petróleo e Gás">Petróleo e Gás</option>
                  <option value="Governo">Governo</option>
                  <option value="Mineração">Mineração</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Indústria e Manufatura">Indústria e Manufatura</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Logística">Logística</option>
                  <option value="Outro">Outro</option>
                </select>
                <select
                  value={editingCase.year || new Date().getFullYear()}
                  onChange={(e) => setEditingCase({ ...editingCase, year: parseInt(e.target.value) })}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Título do Case"
                value={editingCase.title || ''}
                onChange={(e) => setEditingCase({ ...editingCase, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />

              <textarea
                placeholder="Descrição"
                value={editingCase.description || ''}
                onChange={(e) => setEditingCase({ ...editingCase, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                rows={3}
              />

              {/* Results Array */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resultados Alcançados
                </label>
                <div className="space-y-2">
                  {(editingCase.results || []).map((result, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={result}
                        onChange={(e) => {
                          const newResults = [...(editingCase.results || [])];
                          newResults[index] = e.target.value;
                          setEditingCase({ ...editingCase, results: newResults });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                        placeholder={`Resultado ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newResults = (editingCase.results || []).filter((_, i) => i !== index);
                          setEditingCase({ ...editingCase, results: newResults });
                        }}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCase({
                        ...editingCase,
                        results: [...(editingCase.results || []), '']
                      });
                    }}
                    className="px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Resultado
                  </button>
                </div>
              </div>

              {/* Technologies Array */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tecnologias Utilizadas
                </label>
                <div className="space-y-2">
                  {(editingCase.technologies || []).map((tech, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) => {
                          const newTechs = [...(editingCase.technologies || [])];
                          newTechs[index] = e.target.value;
                          setEditingCase({ ...editingCase, technologies: newTechs });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                        placeholder={`Tecnologia ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newTechs = (editingCase.technologies || []).filter((_, i) => i !== index);
                          setEditingCase({ ...editingCase, technologies: newTechs });
                        }}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCase({
                        ...editingCase,
                        technologies: [...(editingCase.technologies || []), '']
                      });
                    }}
                    className="px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Tecnologia
                  </button>
                </div>
              </div>

              {/* Image Upload */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem do Case
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file, 'image');
                      e.target.value = ''; // Reset input
                    }}
                    className="hidden"
                    id="image-upload"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`cursor-pointer px-4 py-2 border rounded-lg flex items-center gap-2 ${
                      uploadingImage ? 'opacity-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    {uploadingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {editingCase.image_url ? 'Trocar Imagem' : 'Upload Imagem'}
                  </label>
                  {editingCase.image_url && (
                    <img
                      src={editingCase.image_url}
                      alt="Preview"
                      className="mt-2 h-20 object-cover rounded"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo do Cliente
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file, 'logo');
                      e.target.value = ''; // Reset input
                    }}
                    className="hidden"
                    id="logo-upload"
                    disabled={uploadingLogo}
                  />
                  <label
                    htmlFor="logo-upload"
                    className={`cursor-pointer px-4 py-2 border rounded-lg flex items-center gap-2 ${
                      uploadingLogo ? 'opacity-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    {uploadingLogo ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {editingCase.logo_url ? 'Trocar Logo' : 'Upload Logo'}
                  </label>
                  {editingCase.logo_url && (
                    <img
                      src={editingCase.logo_url}
                      alt="Logo"
                      className="mt-2 h-20 object-contain"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Criar Case
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Cases List */}
        <AnimatePresence>
          {cases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`
                relative p-4 rounded-lg border-2 transition-all
                ${selectedCases.includes(caseItem.id)
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
                ${!caseItem.is_active ? 'opacity-50' : ''}
              `}
            >
              {editingId === caseItem.id && editingCase ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={editingCase.client || ''}
                      onChange={(e) => setEditingCase({ ...editingCase, client: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    />
                    <select
                      value={editingCase.segment || 'Telecom'}
                      onChange={(e) => setEditingCase({ ...editingCase, segment: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    >
                      <option value="Telecom">Telecom</option>
                      <option value="Energia">Energia</option>
                      <option value="Petróleo e Gás">Petróleo e Gás</option>
                      <option value="Governo">Governo</option>
                      <option value="Mineração">Mineração</option>
                      <option value="Financeiro">Financeiro</option>
                      <option value="Indústria e Manufatura">Indústria e Manufatura</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Logística">Logística</option>
                      <option value="Outro">Outro</option>
                    </select>
                    <select
                      value={editingCase.year || new Date().getFullYear()}
                      onChange={(e) => setEditingCase({ ...editingCase, year: parseInt(e.target.value) })}
                      className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    >
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                      <option value="2020">2020</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    value={editingCase.title || ''}
                    onChange={(e) => setEditingCase({ ...editingCase, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  />

                  <textarea
                    value={editingCase.description || ''}
                    onChange={(e) => setEditingCase({ ...editingCase, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    rows={3}
                  />

                  {/* Results Array */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resultados Alcançados
                    </label>
                    <div className="space-y-2">
                      {(editingCase.results || []).map((result, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={result}
                            onChange={(e) => {
                              const newResults = [...(editingCase.results || [])];
                              newResults[index] = e.target.value;
                              setEditingCase({ ...editingCase, results: newResults });
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                            placeholder={`Resultado ${index + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newResults = (editingCase.results || []).filter((_, i) => i !== index);
                              setEditingCase({ ...editingCase, results: newResults });
                            }}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCase({
                            ...editingCase,
                            results: [...(editingCase.results || []), '']
                          });
                        }}
                        className="px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg text-sm flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar Resultado
                      </button>
                    </div>
                  </div>

                  {/* Technologies Array */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tecnologias Utilizadas
                    </label>
                    <div className="space-y-2">
                      {(editingCase.technologies || []).map((tech, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={tech}
                            onChange={(e) => {
                              const newTechs = [...(editingCase.technologies || [])];
                              newTechs[index] = e.target.value;
                              setEditingCase({ ...editingCase, technologies: newTechs });
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                            placeholder={`Tecnologia ${index + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newTechs = (editingCase.technologies || []).filter((_, i) => i !== index);
                              setEditingCase({ ...editingCase, technologies: newTechs });
                            }}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCase({
                            ...editingCase,
                            technologies: [...(editingCase.technologies || []), '']
                          });
                        }}
                        className="px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg text-sm flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar Tecnologia
                      </button>
                    </div>
                  </div>

                  {/* Image Uploads */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Imagem do Case
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileSelect(file, 'image');
                            e.target.value = ''; // Reset input
                          }}
                          className="hidden"
                          id="edit-image-upload"
                          disabled={uploadingImage}
                        />
                        <label
                          htmlFor="edit-image-upload"
                          className={`cursor-pointer px-4 py-2 border rounded-lg flex items-center gap-2 ${
                            uploadingImage ? 'opacity-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          {uploadingImage ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          {editingCase.image_url ? 'Trocar' : 'Upload'}
                        </label>
                        {editingCase.image_url && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCase({ ...editingCase, image_url: null });
                            }}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remover
                          </button>
                        )}
                      </div>
                      {editingCase.image_url && (
                        <div className="relative mt-2">
                          <img
                            src={editingCase.image_url}
                            alt="Case"
                            className="h-32 w-full object-cover rounded"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo do Cliente
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileSelect(file, 'logo');
                            e.target.value = ''; // Reset input
                          }}
                          className="hidden"
                          id="edit-logo-upload"
                          disabled={uploadingLogo}
                        />
                        <label
                          htmlFor="edit-logo-upload"
                          className={`cursor-pointer px-4 py-2 border rounded-lg flex items-center gap-2 ${
                            uploadingLogo ? 'opacity-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          {uploadingLogo ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          {editingCase.logo_url ? 'Trocar' : 'Upload'}
                        </label>
                        {editingCase.logo_url && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCase({ ...editingCase, logo_url: null });
                            }}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remover
                          </button>
                        )}
                      </div>
                      {editingCase.logo_url && (
                        <div className="relative mt-2">
                          <img
                            src={editingCase.logo_url}
                            alt="Logo"
                            className="h-20 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 text-gray-600 hover:text-gray-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <button
                        onClick={() => handleSelectCase(caseItem.id)}
                        className={`
                          w-6 h-6 rounded border-2 flex items-center justify-center
                          ${selectedCases.includes(caseItem.id)
                            ? 'bg-purple-600 border-purple-600'
                            : 'border-gray-300 hover:border-purple-400'
                          }
                        `}
                      >
                        {selectedCases.includes(caseItem.id) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </button>
                      <h4 className="font-semibold text-gray-900">
                        {caseItem.client}
                      </h4>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {caseItem.segment}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {caseItem.year}
                      </span>
                      {!caseItem.is_active && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">
                          Inativo
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 font-medium mb-1">
                      {caseItem.title}
                    </p>
                    {caseItem.description && (
                      <p className="text-gray-600 text-sm">
                        {caseItem.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => handleMoveCase(caseItem.id, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveCase(caseItem.id, 'down')}
                      disabled={index === cases.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(caseItem.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {caseItem.is_active ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleStartEdit(caseItem)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCase(caseItem.id)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {cases.length === 0 && !isCreating && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum case cadastrado ainda.</p>
          <button
            onClick={handleStartCreate}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Criar Primeiro Case
          </button>
        </div>
      )}

      {/* Image Crop Modal */}
      {imageToCrop && (
        <ImageCropModal
          imageUrl={imageToCrop}
          isOpen={cropModalOpen}
          onClose={() => {
            setCropModalOpen(false);
            if (imageToCrop) {
              URL.revokeObjectURL(imageToCrop);
            }
            setImageToCrop(null);
          }}
          onCropComplete={handleCroppedImage}
          aspectRatio={cropType === 'logo' ? 1 : 520 / 256}
          title={cropType === 'logo' ? 'Ajustar Logo do Cliente' : 'Ajustar Imagem do Case'}
        />
      )}
    </div>
  );
};