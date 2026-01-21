import React, { useState, useEffect } from 'react';
import {
  Settings, Layout, Image, Type, Palette, Save, Upload, Download,
  Eye, EyeOff, Plus, Trash2, Copy, Move, ChevronUp, ChevronDown,
  Edit3, X, Check, RefreshCw, Database, FileJson, RotateCcw, Trophy
} from 'lucide-react';
import { presentationStore, type Slide, type PresentationData, type PresentationTheme } from '../../lib/presentationStore';
import { getCurrentPresentationData } from '../../lib/presentationDataMigration';
import { ItemsEditor } from './ItemsEditor';
import { CasesManager } from './CasesManager';

export const AdminPanel: React.FC = () => {
  const [presentation, setPresentation] = useState<PresentationData | null>(null);
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
  const [activeTab, setActiveTab] = useState<'slides' | 'theme' | 'settings' | 'media' | 'cases'>('slides');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [editingSlide, setEditingSlide] = useState<string | null>(null);

  // Carrega dados da apresentação
  useEffect(() => {
    loadPresentation();
  }, []);

  const loadPresentation = async () => {
    setIsLoading(true);
    let data = await presentationStore.getPresentation();

    // Se não houver dados salvos, carrega os dados atuais migrados
    if (!data || data.slides.length === 0 || data.id === 'default') {
      console.log('Carregando dados migrados dos slides atuais...');
      data = getCurrentPresentationData();
      // Salva os dados migrados
      await presentationStore.savePresentation(data);
    }

    if (data) {
      setPresentation(data);
      if (data.slides.length > 0 && !selectedSlide) {
        setSelectedSlide(data.slides[0]);
      }
    }
    setIsLoading(false);
  };

  // Salva alterações
  const handleSave = async () => {
    if (!presentation) return;

    setSaveStatus('saving');
    const success = await presentationStore.savePresentation(presentation);
    setSaveStatus(success ? 'saved' : 'error');

    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  // Auto-save
  useEffect(() => {
    if (presentation && saveStatus === 'idle') {
      const timer = setTimeout(() => {
        handleSave();
      }, 3000); // Auto-save após 3 segundos de inatividade

      return () => clearTimeout(timer);
    }
  }, [presentation]);

  // Manipulação de Slides
  const handleSlideUpdate = (slideId: string, field: string, value: any) => {
    if (!presentation) return;

    const updatedSlides = presentation.slides.map(slide => {
      if (slide.id === slideId) {
        if (field.includes('.')) {
          // Nested field update (e.g., 'content.title')
          const fields = field.split('.');
          const updated = { ...slide };
          let obj: any = updated;

          for (let i = 0; i < fields.length - 1; i++) {
            obj = obj[fields[i]];
          }
          obj[fields[fields.length - 1]] = value;

          return updated;
        }
        return { ...slide, [field]: value };
      }
      return slide;
    });

    setPresentation({ ...presentation, slides: updatedSlides });

    // Update selected slide if it's the one being edited
    if (selectedSlide?.id === slideId) {
      const updated = updatedSlides.find(s => s.id === slideId);
      if (updated) setSelectedSlide(updated);
    }
  };

  const handleAddSlide = () => {
    if (!presentation) return;

    const newSlide: Slide = {
      id: `slide_${Date.now()}`,
      name: 'Novo Slide',
      template: 'default',
      isVisible: true,
      order: presentation.slides.length,
      content: {
        id: `content_${Date.now()}`,
        type: 'standard',
        title: 'Título do Slide',
        subtitle: 'Subtítulo',
        description: 'Descrição do conteúdo',
        items: [],
        backgroundColor: '',
        textColor: '',
        customCSS: '',
        components: []
      },
      animations: {
        entry: 'fadeIn',
        exit: 'fadeOut',
        duration: 500
      }
    };

    setPresentation({
      ...presentation,
      slides: [...presentation.slides, newSlide]
    });
    setSelectedSlide(newSlide);
  };

  const handleDeleteSlide = (slideId: string) => {
    if (!presentation) return;
    if (presentation.slides.length <= 1) {
      alert('Você precisa ter pelo menos um slide na apresentação.');
      return;
    }

    const updatedSlides = presentation.slides.filter(s => s.id !== slideId);
    updatedSlides.forEach((slide, index) => {
      slide.order = index;
    });

    setPresentation({ ...presentation, slides: updatedSlides });

    if (selectedSlide?.id === slideId) {
      setSelectedSlide(updatedSlides[0] || null);
    }
  };

  const handleDuplicateSlide = (slideId: string) => {
    if (!presentation) return;

    const slideToDuplicate = presentation.slides.find(s => s.id === slideId);
    if (!slideToDuplicate) return;

    const newSlide: Slide = {
      ...slideToDuplicate,
      id: `slide_${Date.now()}`,
      name: `${slideToDuplicate.name} (Cópia)`,
      order: presentation.slides.length,
      content: {
        ...slideToDuplicate.content,
        id: `content_${Date.now()}`
      }
    };

    setPresentation({
      ...presentation,
      slides: [...presentation.slides, newSlide]
    });
  };

  const handleMoveSlide = (slideId: string, direction: 'up' | 'down') => {
    if (!presentation) return;

    const currentIndex = presentation.slides.findIndex(s => s.id === slideId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= presentation.slides.length) return;

    const updatedSlides = [...presentation.slides];
    [updatedSlides[currentIndex], updatedSlides[newIndex]] =
    [updatedSlides[newIndex], updatedSlides[currentIndex]];

    updatedSlides.forEach((slide, index) => {
      slide.order = index;
    });

    setPresentation({ ...presentation, slides: updatedSlides });
  };

  // Manipulação de Tema
  const handleThemeUpdate = (field: keyof PresentationTheme, value: any) => {
    if (!presentation) return;

    setPresentation({
      ...presentation,
      theme: {
        ...presentation.theme,
        [field]: value
      }
    });
  };

  // Exportar/Importar
  const handleExport = async () => {
    const json = await presentationStore.exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `celplan_presentation_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const json = e.target?.result as string;
      const success = await presentationStore.importFromJSON(json);
      if (success) {
        loadPresentation();
        alert('Apresentação importada com sucesso!');
      } else {
        alert('Erro ao importar apresentação.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    if (confirm('Tem certeza que deseja resetar para as configurações padrão? Isso irá apagar todas as suas alterações.')) {
      await presentationStore.resetToDefault();
      loadPresentation();
    }
  };

  const handleImportCurrentData = async () => {
    if (confirm('Isso irá importar todos os dados atuais dos slides (hardcoded). Suas alterações serão substituídas. Continuar?')) {
      const currentData = getCurrentPresentationData();
      await presentationStore.savePresentation(currentData);
      loadPresentation();
      alert('Dados atuais importados com sucesso!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-brand-500" />
          <p className="text-gray-600 dark:text-gray-300">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  if (!presentation) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Painel Administrativo - CelPlan V3
              </h1>
              {saveStatus === 'saving' && (
                <span className="ml-4 text-sm text-gray-500">Salvando...</span>
              )}
              {saveStatus === 'saved' && (
                <span className="ml-4 text-sm text-green-600">✓ Salvo</span>
              )}
              {saveStatus === 'error' && (
                <span className="ml-4 text-sm text-red-600">Erro ao salvar</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>

              <button
                onClick={handleImportCurrentData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                title="Importar dados atuais dos slides (hardcoded)"
              >
                <Database className="w-4 h-4" />
                Importar Dados Atuais
              </button>

              <button
                onClick={handleExport}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar JSON
              </button>

              <label className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                Importar JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>

              <a
                href="/v3"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('slides')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'slides'
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Layout className="w-5 h-5 inline-block mr-2" />
              Slides
            </button>

            <button
              onClick={() => setActiveTab('theme')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'theme'
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Palette className="w-5 h-5 inline-block mr-2" />
              Tema
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'media'
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Image className="w-5 h-5 inline-block mr-2" />
              Mídia
            </button>

            <button
              onClick={() => setActiveTab('cases')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cases'
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Trophy className="w-5 h-5 inline-block mr-2" />
              Cases
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="w-5 h-5 inline-block mr-2" />
              Configurações
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'slides' && (
          <div className="grid grid-cols-12 gap-6">
            {/* Lista de Slides */}
            <div className="col-span-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Slides ({presentation.slides.length})
                  </h2>
                  <button
                    onClick={handleAddSlide}
                    className="p-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                {presentation.slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedSlide?.id === slide.id
                        ? 'bg-brand-50 border-brand-500 dark:bg-brand-900/20'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600'
                    }`}
                    onClick={() => setSelectedSlide(slide)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">
                          #{index + 1}
                        </span>
                        {editingSlide === slide.id ? (
                          <input
                            type="text"
                            value={slide.name}
                            onChange={(e) => handleSlideUpdate(slide.id, 'name', e.target.value)}
                            onBlur={() => setEditingSlide(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') setEditingSlide(null);
                            }}
                            className="px-2 py-1 text-sm border rounded"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {slide.name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSlideUpdate(slide.id, 'isVisible', !slide.isVisible);
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          title={slide.isVisible ? 'Ocultar' : 'Mostrar'}
                        >
                          {slide.isVisible ? (
                            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSlide(slide.id);
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          title="Editar nome"
                        >
                          <Edit3 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateSlide(slide.id);
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          title="Duplicar"
                        >
                          <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveSlide(slide.id, 'up');
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          disabled={index === 0}
                          title="Mover para cima"
                        >
                          <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveSlide(slide.id, 'down');
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          disabled={index === presentation.slides.length - 1}
                          title="Mover para baixo"
                        >
                          <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Tem certeza que deseja excluir o slide "${slide.name}"?`)) {
                              handleDeleteSlide(slide.id);
                            }
                          }}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editor de Slide */}
            <div className="col-span-8 bg-white dark:bg-gray-800 rounded-lg shadow">
              {selectedSlide ? (
                <>
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Editar Slide: {selectedSlide.name}
                    </h2>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Título */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Título
                      </label>
                      <input
                        type="text"
                        value={selectedSlide.content.title || ''}
                        onChange={(e) => handleSlideUpdate(selectedSlide.id, 'content.title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    {/* Subtítulo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subtítulo
                      </label>
                      <input
                        type="text"
                        value={selectedSlide.content.subtitle || ''}
                        onChange={(e) => handleSlideUpdate(selectedSlide.id, 'content.subtitle', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    {/* Descrição */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Descrição
                      </label>
                      <textarea
                        value={selectedSlide.content.description || ''}
                        onChange={(e) => handleSlideUpdate(selectedSlide.id, 'content.description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    {/* Template */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Template
                      </label>
                      <select
                        value={selectedSlide.template}
                        onChange={(e) => handleSlideUpdate(selectedSlide.id, 'template', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="default">Padrão</option>
                        <option value="cover">Capa</option>
                        <option value="content">Conteúdo</option>
                        <option value="image">Imagem</option>
                        <option value="grid">Grade</option>
                        <option value="comparison">Comparação</option>
                      </select>
                    </div>

                    {/* Animações */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Animação de Entrada
                        </label>
                        <select
                          value={selectedSlide.animations?.entry || 'fadeIn'}
                          onChange={(e) => handleSlideUpdate(selectedSlide.id, 'animations.entry', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="none">Nenhuma</option>
                          <option value="fadeIn">Fade In</option>
                          <option value="slideLeft">Slide da Esquerda</option>
                          <option value="slideRight">Slide da Direita</option>
                          <option value="slideUp">Slide de Baixo</option>
                          <option value="slideDown">Slide de Cima</option>
                          <option value="zoom">Zoom</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Animação de Saída
                        </label>
                        <select
                          value={selectedSlide.animations?.exit || 'fadeOut'}
                          onChange={(e) => handleSlideUpdate(selectedSlide.id, 'animations.exit', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="none">Nenhuma</option>
                          <option value="fadeOut">Fade Out</option>
                          <option value="slideLeft">Slide para Esquerda</option>
                          <option value="slideRight">Slide para Direita</option>
                          <option value="slideUp">Slide para Cima</option>
                          <option value="slideDown">Slide para Baixo</option>
                          <option value="zoom">Zoom</option>
                        </select>
                      </div>
                    </div>

                    {/* Editor de Items do Slide */}
                    <div>
                      <ItemsEditor
                        items={selectedSlide.content.items || []}
                        onUpdate={(newItems) => {
                          handleSlideUpdate(selectedSlide.id, 'content.items', newItems);
                        }}
                        slideType={selectedSlide.template}
                      />
                    </div>

                    {/* CSS Customizado */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CSS Customizado
                      </label>
                      <textarea
                        value={selectedSlide.content.customCSS || ''}
                        onChange={(e) => handleSlideUpdate(selectedSlide.id, 'content.customCSS', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder=".slide-title { color: #333; }"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  Selecione um slide para editar
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Configurações de Tema
            </h2>

            <div className="grid grid-cols-2 gap-6">
              {/* Cores */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cor Primária
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={presentation.theme.primaryColor}
                    onChange={(e) => handleThemeUpdate('primaryColor', e.target.value)}
                    className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={presentation.theme.primaryColor}
                    onChange={(e) => handleThemeUpdate('primaryColor', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cor Secundária
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={presentation.theme.secondaryColor}
                    onChange={(e) => handleThemeUpdate('secondaryColor', e.target.value)}
                    className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={presentation.theme.secondaryColor}
                    onChange={(e) => handleThemeUpdate('secondaryColor', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cor de Destaque
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={presentation.theme.accentColor}
                    onChange={(e) => handleThemeUpdate('accentColor', e.target.value)}
                    className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={presentation.theme.accentColor}
                    onChange={(e) => handleThemeUpdate('accentColor', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cor de Fundo
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={presentation.theme.backgroundColor}
                    onChange={(e) => handleThemeUpdate('backgroundColor', e.target.value)}
                    className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={presentation.theme.backgroundColor}
                    onChange={(e) => handleThemeUpdate('backgroundColor', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Tipografia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fonte Principal
                </label>
                <input
                  type="text"
                  value={presentation.theme.fontFamily}
                  onChange={(e) => handleThemeUpdate('fontFamily', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cor do Texto
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={presentation.theme.textColor}
                    onChange={(e) => handleThemeUpdate('textColor', e.target.value)}
                    className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={presentation.theme.textColor}
                    onChange={(e) => handleThemeUpdate('textColor', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Gerenciador de Mídia
            </h2>
            <div className="text-center py-12 text-gray-500">
              <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Funcionalidade de upload de imagens em desenvolvimento</p>
              <p className="text-sm mt-2">Em breve você poderá fazer upload e gerenciar suas imagens aqui</p>
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <CasesManager />
        )}

        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Configurações da Apresentação
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Auto Play
                  </label>
                  <p className="text-sm text-gray-500">Avançar slides automaticamente</p>
                </div>
                <input
                  type="checkbox"
                  checked={presentation.settings.autoPlay || false}
                  onChange={(e) => setPresentation({
                    ...presentation,
                    settings: { ...presentation.settings, autoPlay: e.target.checked }
                  })}
                  className="w-5 h-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
              </div>

              {presentation.settings.autoPlay && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Intervalo do Auto Play (segundos)
                  </label>
                  <input
                    type="number"
                    value={(presentation.settings.autoPlayInterval || 5000) / 1000}
                    onChange={(e) => setPresentation({
                      ...presentation,
                      settings: {
                        ...presentation.settings,
                        autoPlayInterval: parseInt(e.target.value) * 1000
                      }
                    })}
                    min="1"
                    max="60"
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Navegação por Teclado
                  </label>
                  <p className="text-sm text-gray-500">Permitir navegar com setas do teclado</p>
                </div>
                <input
                  type="checkbox"
                  checked={presentation.settings.enableKeyboardNav !== false}
                  onChange={(e) => setPresentation({
                    ...presentation,
                    settings: { ...presentation.settings, enableKeyboardNav: e.target.checked }
                  })}
                  className="w-5 h-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Navegação por Swipe
                  </label>
                  <p className="text-sm text-gray-500">Permitir navegar com gestos de toque</p>
                </div>
                <input
                  type="checkbox"
                  checked={presentation.settings.enableSwipeNav !== false}
                  onChange={(e) => setPresentation({
                    ...presentation,
                    settings: { ...presentation.settings, enableSwipeNav: e.target.checked }
                  })}
                  className="w-5 h-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mostrar Navegação
                  </label>
                  <p className="text-sm text-gray-500">Exibir dots e setas de navegação</p>
                </div>
                <input
                  type="checkbox"
                  checked={presentation.settings.showNavigation !== false}
                  onChange={(e) => setPresentation({
                    ...presentation,
                    settings: { ...presentation.settings, showNavigation: e.target.checked }
                  })}
                  className="w-5 h-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mostrar Progresso
                  </label>
                  <p className="text-sm text-gray-500">Exibir barra de progresso</p>
                </div>
                <input
                  type="checkbox"
                  checked={presentation.settings.showProgress !== false}
                  onChange={(e) => setPresentation({
                    ...presentation,
                    settings: { ...presentation.settings, showProgress: e.target.checked }
                  })}
                  className="w-5 h-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};