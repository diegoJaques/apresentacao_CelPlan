import React, { useState, useRef } from 'react';
import { useInlineEdit } from '../contexts/InlineEditContext';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface EditableImageProps {
  id: string;
  defaultSrc: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  id,
  defaultSrc,
  alt,
  className = '',
  width,
  height
}) => {
  const { isEditMode, content, updateContent } = useInlineEdit();
  const [isHovering, setIsHovering] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Obtém a URL da imagem atual (editada ou padrão)
  const currentSrc = content[`image-${id}`] || defaultSrc;

  // Handle file upload
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verifica o tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      // Verifica o tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }

      // Cria URL de preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle URL input
  const handleUrlInput = () => {
    const url = prompt('Digite a URL da imagem:');
    if (url) {
      // Validação básica de URL
      try {
        new URL(url);
        setPreviewUrl(url);
      } catch {
        alert('URL inválida. Por favor, insira uma URL válida.');
      }
    }
  };

  // Salvar imagem
  const saveImage = () => {
    if (previewUrl) {
      updateContent(`image-${id}`, previewUrl);
      setShowUploader(false);
      setPreviewUrl(null);
    }
  };

  // Cancelar edição
  const cancelEdit = () => {
    setShowUploader(false);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Resetar para imagem original
  const resetToDefault = () => {
    updateContent(`image-${id}`, defaultSrc);
    setShowUploader(false);
  };

  if (!isEditMode) {
    return (
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
      />
    );
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img
        src={previewUrl || currentSrc}
        alt={alt}
        className={`${className} ${isEditMode ? 'cursor-pointer' : ''}`}
        width={width}
        height={height}
        onClick={() => isEditMode && setShowUploader(true)}
      />

      {/* Indicador de editável */}
      {isEditMode && isHovering && !showUploader && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Clique para editar
            </span>
          </div>
        </div>
      )}

      {/* Badge de imagem editada */}
      {content[`image-${id}`] && content[`image-${id}`] !== defaultSrc && !isEditMode && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 rounded-full"></span>
      )}

      {/* Modal de Upload */}
      {showUploader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Editar Imagem
            </h3>

            {/* Preview */}
            {previewUrl && (
              <div className="mb-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-700 rounded-lg"
                />
              </div>
            )}

            {/* Opções de Upload */}
            <div className="space-y-3 mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id={`file-input-${id}`}
              />

              <label
                htmlFor={`file-input-${id}`}
                className="w-full flex items-center gap-3 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer transition-colors"
              >
                <Upload className="w-5 h-5" />
                <span className="font-medium">Fazer Upload de Imagem</span>
              </label>

              <button
                onClick={handleUrlInput}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <ImageIcon className="w-5 h-5" />
                <span className="font-medium">Usar URL Externa</span>
              </button>

              {currentSrc !== defaultSrc && (
                <button
                  onClick={resetToDefault}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                  <span className="font-medium">Restaurar Original</span>
                </button>
              )}
            </div>

            {/* Informações */}
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              <p>• Formatos aceitos: JPG, PNG, GIF, WebP</p>
              <p>• Tamanho máximo: 5MB</p>
              <p>• Recomendado: Imagens otimizadas para web</p>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3">
              <button
                onClick={cancelEdit}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>

              {previewUrl && (
                <button
                  onClick={saveImage}
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  Salvar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};