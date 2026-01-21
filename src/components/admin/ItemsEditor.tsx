import React, { useState } from 'react';
import {
  Plus, Trash2, Edit3, Save, X, ChevronUp, ChevronDown,
  GripVertical, Copy, Eye, EyeOff
} from 'lucide-react';

interface ItemsEditorProps {
  items: any[];
  onUpdate: (items: any[]) => void;
  slideType?: string;
}

export const ItemsEditor: React.FC<ItemsEditorProps> = ({
  items = [],
  onUpdate,
  slideType = 'default'
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState<any>({});
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Detecta o tipo de item baseado nos campos presentes
  const detectItemType = (item: any) => {
    if (item.icon && item.label && item.value) return 'contact';
    if (item.value && item.label && item.gradient) return 'metric';
    if (item.title && item.description && item.icon) return 'feature';
    if (item.problem && item.solution) return 'comparison';
    if (item.phase && item.services) return 'service';
    if (item.number && item.title && item.specs) return 'pillar';
    if (item.name && item.category) return 'technology';
    if (item.category && item.solutions) return 'iot';
    return 'generic';
  };

  // Obtém template para novo item baseado no tipo
  const getNewItemTemplate = () => {
    if (items.length > 0) {
      const firstItem = items[0];
      const itemType = detectItemType(firstItem);

      switch (itemType) {
        case 'contact':
          return {
            icon: 'Mail',
            label: 'Novo Contato',
            value: 'valor@exemplo.com',
            link: 'mailto:valor@exemplo.com',
            color: 'brand'
          };
        case 'metric':
          return {
            value: '0',
            label: 'Nova Métrica',
            description: 'Descrição da métrica',
            gradient: 'from-brand-400 to-brand-600'
          };
        case 'feature':
          return {
            title: 'Nova Funcionalidade',
            description: 'Descrição da funcionalidade',
            icon: 'Star',
            color: 'brand'
          };
        case 'comparison':
          return {
            problem: 'Novo Problema',
            solution: 'Nova Solução',
            icon: 'AlertCircle'
          };
        case 'service':
          return {
            phase: 'Nova Fase',
            title: 'Novo Serviço',
            services: ['Serviço 1', 'Serviço 2'],
            icon: 'Wrench',
            color: 'blue'
          };
        case 'pillar':
          return {
            number: String(items.length + 1).padStart(2, '0'),
            title: 'Novo Pilar',
            description: 'Descrição do pilar',
            icon: 'Star',
            gradient: 'from-purple-500 to-indigo-600',
            specs: ['Spec 1', 'Spec 2']
          };
        case 'technology':
          return {
            name: 'Nova Tecnologia',
            category: 'Categoria',
            status: 'active'
          };
        case 'iot':
          return {
            category: 'Nova Categoria',
            solutions: ['Solução 1', 'Solução 2'],
            icon: 'Cpu',
            color: 'blue'
          };
        default:
          return { title: 'Novo Item', description: 'Descrição' };
      }
    }
    return { title: 'Novo Item', description: 'Descrição' };
  };

  // Adiciona novo item
  const handleAddItem = () => {
    const template = getNewItemTemplate();
    setNewItem(template);
    setIsAddingNew(true);
    setEditingIndex(null);
  };

  // Salva novo item
  const handleSaveNewItem = () => {
    const updatedItems = [...items, newItem];
    onUpdate(updatedItems);
    setIsAddingNew(false);
    setNewItem({});
  };

  // Cancela adição de novo item
  const handleCancelNewItem = () => {
    setIsAddingNew(false);
    setNewItem({});
  };

  // Inicia edição de item
  const handleEditItem = (index: number) => {
    setEditingIndex(index);
    setEditingItem({ ...items[index] });
    setIsAddingNew(false);
  };

  // Salva item editado
  const handleSaveEditItem = () => {
    if (editingIndex !== null) {
      const updatedItems = [...items];
      updatedItems[editingIndex] = editingItem;
      onUpdate(updatedItems);
      setEditingIndex(null);
      setEditingItem(null);
    }
  };

  // Cancela edição
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingItem(null);
  };

  // Remove item
  const handleRemoveItem = (index: number) => {
    if (confirm('Tem certeza que deseja remover este item?')) {
      const updatedItems = items.filter((_, i) => i !== index);
      onUpdate(updatedItems);
    }
  };

  // Duplica item
  const handleDuplicateItem = (index: number) => {
    const itemToDuplicate = { ...items[index] };
    const updatedItems = [...items];
    updatedItems.splice(index + 1, 0, itemToDuplicate);
    onUpdate(updatedItems);
  };

  // Move item para cima
  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const updatedItems = [...items];
      [updatedItems[index - 1], updatedItems[index]] = [updatedItems[index], updatedItems[index - 1]];
      onUpdate(updatedItems);
    }
  };

  // Move item para baixo
  const handleMoveDown = (index: number) => {
    if (index < items.length - 1) {
      const updatedItems = [...items];
      [updatedItems[index], updatedItems[index + 1]] = [updatedItems[index + 1], updatedItems[index]];
      onUpdate(updatedItems);
    }
  };

  // Toggle expandir/colapsar item
  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  // Renderiza campo de edição baseado no tipo
  const renderField = (key: string, value: any, onChange: (key: string, value: any) => void) => {
    // Arrays (como services, specs, solutions)
    if (Array.isArray(value)) {
      return (
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            {key}
          </label>
          <textarea
            value={value.join('\n')}
            onChange={(e) => onChange(key, e.target.value.split('\n').filter(Boolean))}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={3}
            placeholder="Um item por linha"
          />
        </div>
      );
    }

    // Campos especiais
    if (key === 'color' || key === 'gradient') {
      return (
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            {key}
          </label>
          <select
            value={value}
            onChange={(e) => onChange(key, e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {key === 'color' ? (
              <>
                <option value="brand">Brand (Roxo)</option>
                <option value="primary">Primary (Azul)</option>
                <option value="accent">Accent (Laranja)</option>
                <option value="green">Verde</option>
                <option value="red">Vermelho</option>
                <option value="yellow">Amarelo</option>
                <option value="indigo">Índigo</option>
              </>
            ) : (
              <>
                <option value="from-purple-500 to-indigo-600">Roxo → Índigo</option>
                <option value="from-blue-500 to-cyan-600">Azul → Ciano</option>
                <option value="from-green-500 to-emerald-600">Verde → Esmeralda</option>
                <option value="from-orange-500 to-red-600">Laranja → Vermelho</option>
                <option value="from-pink-500 to-rose-600">Rosa → Rose</option>
                <option value="from-brand-400 to-brand-600">Brand Gradient</option>
                <option value="from-primary-400 to-primary-600">Primary Gradient</option>
              </>
            )}
          </select>
        </div>
      );
    }

    if (key === 'status') {
      return (
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            {key}
          </label>
          <select
            value={value}
            onChange={(e) => onChange(key, e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="active">Ativo</option>
            <option value="new">Novo</option>
            <option value="trending">Trending</option>
            <option value="research">Pesquisa</option>
          </select>
        </div>
      );
    }

    // Campos de texto padrão
    return (
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          {key}
        </label>
        {key === 'description' ? (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(key, e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={2}
          />
        ) : (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(key, e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        )}
      </div>
    );
  };

  // Renderiza formulário de edição
  const renderEditForm = (item: any, onChange: (key: string, value: any) => void) => {
    return (
      <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        {Object.keys(item).map(key => (
          <div key={key} className={key === 'description' ? 'col-span-2' : ''}>
            {renderField(key, item[key], onChange)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Items do Slide ({items.length})
        </h3>
        <button
          onClick={handleAddItem}
          className="px-3 py-1.5 bg-brand-500 text-white text-sm rounded-lg hover:bg-brand-600 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Adicionar Item
        </button>
      </div>

      {/* Lista de Items */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {items.map((item, index) => {
          const isExpanded = expandedItems.has(index);
          const isEditing = editingIndex === index;

          return (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden"
            >
              {/* Header do Item */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    #{index + 1}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {item.title || item.label || item.name || item.category || `Item ${index + 1}`}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {!isEditing && (
                    <>
                      <button
                        onClick={() => toggleExpand(index)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        title={isExpanded ? 'Colapsar' : 'Expandir'}
                      >
                        {isExpanded ? (
                          <EyeOff className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-500" />
                        )}
                      </button>

                      <button
                        onClick={() => handleEditItem(index)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4 text-blue-600" />
                      </button>

                      <button
                        onClick={() => handleDuplicateItem(index)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        title="Duplicar"
                      >
                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>

                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50"
                        title="Mover para cima"
                      >
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      </button>

                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === items.length - 1}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50"
                        title="Mover para baixo"
                      >
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </button>

                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                        title="Remover"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </>
                  )}

                  {isEditing && (
                    <>
                      <button
                        onClick={handleSaveEditItem}
                        className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                        title="Salvar"
                      >
                        <Save className="w-4 h-4 text-green-600" />
                      </button>

                      <button
                        onClick={handleCancelEdit}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                        title="Cancelar"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Conteúdo Expandido ou Formulário de Edição */}
              {(isExpanded || isEditing) && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  {isEditing ? (
                    renderEditForm(editingItem, (key, value) => {
                      setEditingItem({ ...editingItem, [key]: value });
                    })
                  ) : (
                    <div className="p-4 bg-gray-50/50 dark:bg-gray-900/50">
                      <pre className="text-xs font-mono text-gray-600 dark:text-gray-400">
                        {JSON.stringify(item, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Formulário de Novo Item */}
        {isAddingNew && (
          <div className="border-2 border-brand-500 rounded-lg bg-brand-50 dark:bg-brand-900/20">
            <div className="p-3 bg-brand-100 dark:bg-brand-900/30 border-b border-brand-200 dark:border-brand-800">
              <h4 className="text-sm font-semibold text-brand-700 dark:text-brand-300">
                Novo Item
              </h4>
            </div>

            {renderEditForm(newItem, (key, value) => {
              setNewItem({ ...newItem, [key]: value });
            })}

            <div className="p-3 bg-brand-50 dark:bg-brand-900/10 border-t border-brand-200 dark:border-brand-800 flex justify-end gap-2">
              <button
                onClick={handleCancelNewItem}
                className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
              >
                <X className="w-4 h-4 inline mr-1" />
                Cancelar
              </button>
              <button
                onClick={handleSaveNewItem}
                className="px-3 py-1.5 bg-brand-500 text-white text-sm rounded hover:bg-brand-600"
              >
                <Save className="w-4 h-4 inline mr-1" />
                Adicionar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dica */}
      {items.length === 0 && !isAddingNew && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Nenhum item ainda.</p>
          <p className="text-xs mt-1">Clique em "Adicionar Item" para começar.</p>
        </div>
      )}

      {/* Info sobre auto-ajuste */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <strong>💡 Dica:</strong> O slide se ajusta automaticamente ao número de items.
          Adicione quantos precisar - o layout será otimizado para melhor visualização!
        </p>
      </div>
    </div>
  );
};