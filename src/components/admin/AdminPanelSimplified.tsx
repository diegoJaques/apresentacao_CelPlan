import React, { useState, useEffect } from 'react';
import {
  Eye, EyeOff, Save, RefreshCw, ChevronUp, ChevronDown,
  AlertCircle, Check, X, Trophy
} from 'lucide-react';
import { presentationStore, type PresentationData } from '../../lib/presentationStore';
import { getCurrentPresentationData } from '../../lib/presentationDataMigration';
import { CasesManagerV2 as CasesManager } from './CasesManagerV2';

export const AdminPanelSimplified: React.FC = () => {
  const [presentation, setPresentation] = useState<PresentationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeSection, setActiveSection] = useState<'slides' | 'cases'>('slides');

  // Carrega dados da apresentação
  useEffect(() => {
    loadPresentation();
  }, []);

  const loadPresentation = async () => {
    setIsLoading(true);
    let data = await presentationStore.getPresentation();

    // Se não houver dados salvos, carrega os dados padrão
    if (!data || data.slides.length === 0 || data.id === 'default') {
      console.log('Carregando dados padrão...');
      data = getCurrentPresentationData();
      await presentationStore.savePresentation(data);
    }

    if (data) {
      setPresentation(data);
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

  // Toggle visibilidade do slide
  const toggleSlideVisibility = (slideId: string) => {
    if (!presentation) return;

    const updatedSlides = presentation.slides.map(slide => {
      if (slide.id === slideId) {
        return { ...slide, isVisible: !slide.isVisible };
      }
      return slide;
    });

    setPresentation({ ...presentation, slides: updatedSlides });
  };

  // Move slide para cima
  const moveSlideUp = (index: number) => {
    if (!presentation || index === 0) return;

    const updatedSlides = [...presentation.slides];
    [updatedSlides[index - 1], updatedSlides[index]] = [updatedSlides[index], updatedSlides[index - 1]];

    updatedSlides.forEach((slide, idx) => {
      slide.order = idx;
    });

    setPresentation({ ...presentation, slides: updatedSlides });
  };

  // Move slide para baixo
  const moveSlideDown = (index: number) => {
    if (!presentation || index >= presentation.slides.length - 1) return;

    const updatedSlides = [...presentation.slides];
    [updatedSlides[index], updatedSlides[index + 1]] = [updatedSlides[index + 1], updatedSlides[index]];

    updatedSlides.forEach((slide, idx) => {
      slide.order = idx;
    });

    setPresentation({ ...presentation, slides: updatedSlides });
  };

  // Reset para dados originais
  const handleReset = async () => {
    if (confirm('Isso irá restaurar todos os slides para o estado original. Continuar?')) {
      const originalData = getCurrentPresentationData();
      await presentationStore.savePresentation(originalData);
      loadPresentation();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-brand-500" />
          <p className="text-gray-600 dark:text-gray-300">Carregando...</p>
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
                Controle de Slides - CelPlan V3
              </h1>
              {saveStatus === 'saving' && (
                <span className="ml-4 text-sm text-gray-500">Salvando...</span>
              )}
              {saveStatus === 'saved' && (
                <span className="ml-4 text-sm text-green-600 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Salvo
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="ml-4 text-sm text-red-600 flex items-center gap-1">
                  <X className="w-4 h-4" /> Erro ao salvar
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar Alterações
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Restaurar Original
              </button>

              <a
                href="/v3"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Ver Apresentação
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Aviso Importante */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Sistema Simplificado de Controle
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Este painel permite controlar a <strong>visibilidade</strong> e <strong>ordem</strong> dos slides.
                Os conteúdos e layouts são preservados exatamente como foram desenhados originalmente.
                Para manter a qualidade visual da apresentação, a edição de conteúdo está limitada.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seletor de Seção */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveSection('slides')}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeSection === 'slides'
                ? 'bg-brand-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Eye className="w-5 h-5" />
            Gerenciar Slides
          </button>
          <button
            onClick={() => setActiveSection('cases')}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeSection === 'cases'
                ? 'bg-brand-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Trophy className="w-5 h-5" />
            Gerenciar Cases de Sucesso
          </button>
        </div>
      </div>

      {/* Lista de Slides */}
      {activeSection === 'slides' && (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Gerenciar Slides
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Use os controles para mostrar/ocultar slides ou reordenar a sequência
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {presentation.slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`border rounded-lg p-4 transition-all ${
                    slide.isVisible
                      ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-gray-300 dark:text-gray-600">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {slide.name}
                        </h3>
                        {slide.content.subtitle && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {slide.content.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Indicador de slide especial */}
                      {['slide_pillars', 'slide_services'].includes(slide.id) && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded">
                          Slide Especial
                        </span>
                      )}

                      {/* Botão de visibilidade */}
                      <button
                        onClick={() => toggleSlideVisibility(slide.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          slide.isVisible
                            ? 'bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50'
                            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                        }`}
                        title={slide.isVisible ? 'Ocultar slide' : 'Mostrar slide'}
                      >
                        {slide.isVisible ? (
                          <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        )}
                      </button>

                      {/* Botões de reordenação */}
                      <button
                        onClick={() => moveSlideUp(index)}
                        disabled={index === 0}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Mover para cima"
                      >
                        <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>

                      <button
                        onClick={() => moveSlideDown(index)}
                        disabled={index === presentation.slides.length - 1}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Mover para baixo"
                      >
                        <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Preview do conteúdo */}
                  {slide.content.items && slide.content.items.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {slide.content.items.length} items • Template: {slide.template || 'default'}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Resumo */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total de Slides: {presentation.slides.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Visíveis: {presentation.slides.filter(s => s.isVisible).length} •
                    Ocultos: {presentation.slides.filter(s => !s.isVisible).length}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Última atualização: {new Date(presentation.metadata.updatedAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dicas */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              ✅ O que você PODE fazer
            </h4>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• Ocultar ou mostrar slides específicos</li>
              <li>• Reordenar a sequência dos slides</li>
              <li>• Restaurar para configuração original</li>
              <li>• Ver preview em tempo real</li>
            </ul>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
              ℹ️ Slides Preservados
            </h4>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              Os slides mantêm suas animações, layouts e estilos originais.
              "7 Pilares" e "Serviços" são slides especiais com animações 3D complexas
              que foram preservadas integralmente.
            </p>
          </div>
        </div>
      </div>
      )}

      {/* Gerenciador de Cases */}
      {activeSection === 'cases' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CasesManager />
        </div>
      )}
    </div>
  );
};