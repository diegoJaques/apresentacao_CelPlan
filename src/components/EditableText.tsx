import React, { useState, useRef, useEffect } from 'react';
import { useInlineEdit } from '../contexts/InlineEditContext';
import { Edit3, Check, X } from 'lucide-react';

interface EditableTextProps {
  id: string; // ID único para identificar o texto
  defaultText: string; // Texto padrão/original
  className?: string; // Classes CSS para manter formatação
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'; // Tag HTML a usar
  multiline?: boolean; // Se permite múltiplas linhas
  maxLength?: number; // Limite de caracteres
}

export const EditableText: React.FC<EditableTextProps> = ({
  id,
  defaultText,
  className = '',
  tag: Tag = 'div',
  multiline = false,
  maxLength
}) => {
  const { isEditMode, content, updateContent } = useInlineEdit();
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Obtém o texto atual (editado ou padrão)
  const currentText = content[id] || defaultText;

  // Inicia edição
  const startEdit = () => {
    if (!isEditMode) return;
    setIsEditing(true);
    setLocalValue(currentText);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        // Seleciona todo o texto
        const range = document.createRange();
        range.selectNodeContents(inputRef.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }, 0);
  };

  // Salva edição
  const saveEdit = () => {
    const trimmedValue = localValue.trim();
    if (trimmedValue && trimmedValue !== currentText) {
      updateContent(id, trimmedValue);
    }
    setIsEditing(false);
  };

  // Cancela edição
  const cancelEdit = () => {
    setLocalValue(currentText);
    setIsEditing(false);
  };

  // Lida com teclas
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  // Lida com input
  const handleInput = () => {
    if (inputRef.current) {
      const text = inputRef.current.textContent || '';
      if (!maxLength || text.length <= maxLength) {
        setLocalValue(text);
      } else {
        // Limita o texto ao máximo
        inputRef.current.textContent = localValue;
      }
    }
  };

  // Mostra tooltip quando em modo edição
  useEffect(() => {
    if (isEditMode && !isEditing) {
      const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setShowTooltip(true);
      };
      const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
          setShowTooltip(false);
        }, 500);
      };

      return () => {
        clearTimeout(timeoutRef.current);
      };
    } else {
      setShowTooltip(false);
    }
  }, [isEditMode, isEditing]);

  // Renderização quando está editando
  if (isEditing) {
    const displayClass = Tag === 'span' ? 'inline-block' : 'block';
    return (
      <div className={`relative ${displayClass} ${className}`}>
        <Tag
          ref={inputRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          className={`${className} outline-none ring-2 ring-brand-500 ring-opacity-50 rounded px-1 bg-white/10 backdrop-blur-sm`}
          style={{ minWidth: '50px' }}
        >
          {localValue}
        </Tag>

        {/* Botões de ação */}
        <div className="absolute -top-10 left-0 flex gap-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 z-50">
          <button
            onClick={saveEdit}
            className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
            title="Salvar (Enter)"
          >
            <Check className="w-4 h-4 text-green-600" />
          </button>
          <button
            onClick={cancelEdit}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
            title="Cancelar (Esc)"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>

        {/* Contador de caracteres */}
        {maxLength && (
          <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
            {localValue.length}/{maxLength}
          </div>
        )}
      </div>
    );
  }

  // Renderização normal
  const displayClass = Tag === 'span' ? 'inline-block' : 'block';
  return (
    <div className={`relative ${displayClass} group`}>
      <Tag
        className={`${className} ${isEditMode ? 'cursor-pointer hover:ring-2 hover:ring-brand-500/30 hover:ring-opacity-50 rounded transition-all' : ''}`}
        onClick={startEdit}
        title={isEditMode ? 'Clique para editar' : ''}
      >
        {currentText}

        {/* Indicador de editável */}
        {isEditMode && (
          <span className="inline-flex items-center justify-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit3 className="w-3 h-3 text-brand-500" />
          </span>
        )}
      </Tag>

      {/* Tooltip */}
      {isEditMode && showTooltip && !isEditing && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
          Clique para editar
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      )}

      {/* Badge de texto editado */}
      {content[id] && content[id] !== defaultText && !isEditMode && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-500 rounded-full"></span>
      )}
    </div>
  );
};