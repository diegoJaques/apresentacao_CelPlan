import React, { useState } from 'react';
import { useInlineEdit } from '../contexts/InlineEditContext';
import { Palette, Check, X } from 'lucide-react';

interface EditableColorProps {
  id: string;
  defaultColor: string;
  className?: string;
  children: React.ReactNode;
  applyAs?: 'background' | 'text' | 'border';
}

export const EditableColor: React.FC<EditableColorProps> = ({
  id,
  defaultColor,
  className = '',
  children,
  applyAs = 'background'
}) => {
  const { isEditMode, content, updateContent } = useInlineEdit();
  const [showPicker, setShowPicker] = useState(false);
  const [tempColor, setTempColor] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  // Obtém a cor atual (editada ou padrão)
  const currentColor = content[`color-${id}`] || defaultColor;

  // Paleta de cores predefinidas
  const colorPalette = [
    // Cores da marca
    '#7c3aed', // brand-500
    '#6d28d9', // brand-600
    '#a78bfa', // brand-400

    // Cores primárias
    '#8b5cf6', // primary-500
    '#7c3aed', // primary-600
    '#a78bfa', // primary-400

    // Cores de acento
    '#f59e0b', // accent-500
    '#d97706', // accent-600
    '#fbbf24', // accent-400

    // Cores neutras
    '#1f2937', // gray-800
    '#374151', // gray-700
    '#6b7280', // gray-500
    '#9ca3af', // gray-400

    // Cores adicionais
    '#ef4444', // red-500
    '#10b981', // green-500
    '#3b82f6', // blue-500
    '#f97316', // orange-500
    '#ec4899', // pink-500
    '#14b8a6', // teal-500
  ];

  // Aplicar cor baseado no tipo
  const getColorStyle = () => {
    switch (applyAs) {
      case 'text':
        return { color: currentColor };
      case 'border':
        return { borderColor: currentColor };
      case 'background':
      default:
        return { backgroundColor: currentColor };
    }
  };

  // Salvar cor
  const saveColor = () => {
    if (tempColor) {
      updateContent(`color-${id}`, tempColor);
    }
    setShowPicker(false);
    setTempColor('');
  };

  // Cancelar edição
  const cancelEdit = () => {
    setShowPicker(false);
    setTempColor('');
  };

  // Resetar para cor original
  const resetToDefault = () => {
    updateContent(`color-${id}`, defaultColor);
    setShowPicker(false);
  };

  // Validar cor hex
  const isValidHex = (color: string) => {
    return /^#[0-9A-F]{6}$/i.test(color);
  };

  if (!isEditMode) {
    return (
      <div className={className} style={getColorStyle()}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`relative ${className}`}
      style={tempColor ? { ...getColorStyle(), ...{ [applyAs === 'text' ? 'color' : applyAs === 'border' ? 'borderColor' : 'backgroundColor']: tempColor } } : getColorStyle()}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}

      {/* Botão de edição de cor */}
      {isEditMode && !showPicker && (
        <button
          onClick={() => setShowPicker(true)}
          className={`absolute ${isHovering ? 'opacity-100' : 'opacity-0'} transition-opacity top-2 right-2 z-30 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:scale-110 transition-transform`}
          title="Editar cor"
        >
          <Palette className="w-4 h-4 text-brand-500" />
        </button>
      )}

      {/* Badge de cor editada */}
      {content[`color-${id}`] && content[`color-${id}`] !== defaultColor && !isEditMode && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
      )}

      {/* Modal do Color Picker */}
      {showPicker && (
        <div className="absolute top-full right-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 w-72">
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Escolher Cor
            </h4>

            {/* Preview da cor */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: tempColor || currentColor }}
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={tempColor || currentColor}
                  onChange={(e) => setTempColor(e.target.value)}
                  placeholder="#000000"
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {tempColor && !isValidHex(tempColor) && (
                  <p className="text-xs text-red-500 mt-1">Formato inválido</p>
                )}
              </div>
            </div>

            {/* Paleta de cores */}
            <div className="grid grid-cols-6 gap-2 mb-3">
              {colorPalette.map((color) => (
                <button
                  key={color}
                  onClick={() => setTempColor(color)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                    (tempColor || currentColor) === color
                      ? 'border-brand-500 scale-110'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>

            {/* Input de cor nativo */}
            <div className="flex items-center gap-2 mb-3">
              <input
                type="color"
                value={tempColor || currentColor}
                onChange={(e) => setTempColor(e.target.value)}
                className="w-full h-10 cursor-pointer"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Seletor avançado
              </span>
            </div>

            {/* Botão de reset */}
            {currentColor !== defaultColor && (
              <button
                onClick={resetToDefault}
                className="w-full text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 mb-3"
              >
                Restaurar cor original ({defaultColor})
              </button>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2">
            <button
              onClick={cancelEdit}
              className="flex-1 px-3 py-1.5 text-sm bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4 inline mr-1" />
              Cancelar
            </button>
            <button
              onClick={saveColor}
              disabled={tempColor && !isValidHex(tempColor)}
              className={`flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                tempColor && !isValidHex(tempColor)
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              <Check className="w-4 h-4 inline mr-1" />
              Salvar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};