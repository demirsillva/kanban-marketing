'use client';

import { useState, useRef, useEffect } from 'react';
import { Tag } from '@/types/kanban';
import { Plus, X, Edit2, Check, Trash2 } from 'lucide-react';

interface TagSelectorProps {
  availableTags: Tag[];
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  onAddAvailableTag: (tag: Omit<Tag, 'id'>) => void;
  onUpdateAvailableTag: (tag: Tag) => void;
  onDeleteAvailableTag: (tagId: string) => void;
}

const PASTEL_COLORS = [
  { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { bg: 'bg-amber-100', text: 'text-amber-700' },
  { bg: 'bg-sky-100', text: 'text-sky-700' },
  { bg: 'bg-rose-100', text: 'text-rose-700' },
  { bg: 'bg-purple-100', text: 'text-purple-700' },
  { bg: 'bg-orange-100', text: 'text-orange-700' },
  { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700' },
  { bg: 'bg-slate-100', text: 'text-slate-700' },
];

export function TagSelector({
  availableTags = [],
  selectedTagIds = [],
  onChange,
  onAddAvailableTag,
  onUpdateAvailableTag,
  onDeleteAvailableTag
}: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(PASTEL_COLORS[0]);
  
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCreating(false);
        setEditingTagId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  const handleCreateOrUpdate = () => {
    if (!newTagName.trim()) return;

    if (editingTagId) {
      onUpdateAvailableTag({
        id: editingTagId,
        text: newTagName.trim(),
        colorBg: newTagColor.bg,
        colorText: newTagColor.text
      });
      setEditingTagId(null);
    } else {
      onAddAvailableTag({
        text: newTagName.trim(),
        colorBg: newTagColor.bg,
        colorText: newTagColor.text
      });
      setIsCreating(false);
    }
    
    setNewTagName('');
  };

  const startEditing = (e: React.MouseEvent, tag: Tag) => {
    e.stopPropagation();
    setEditingTagId(tag.id);
    setNewTagName(tag.text);
    setNewTagColor({ bg: tag.colorBg, text: tag.colorText });
    setIsCreating(false);
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingTagId(null);
    setNewTagName('');
    setNewTagColor(PASTEL_COLORS[0]);
  };

  const handleDelete = (tagId: string) => {
    onDeleteAvailableTag(tagId);
    setEditingTagId(null);
  };

  const selectedTags = availableTags.filter(t => selectedTagIds.includes(t.id));

  return (
    <div className="relative" ref={popoverRef}>
      {/* Selected Tags Display */}
      <div className="flex flex-wrap gap-2 items-center">
        {selectedTags.map(tag => (
          <span 
            key={tag.id}
            className={`text-xs px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 ${tag.colorBg} ${tag.colorText}`}
          >
            {tag.text}
            <button 
              onClick={(e) => {
                e.preventDefault();
                toggleTag(tag.id);
              }}
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
        >
          <Plus className="w-3 h-3" />
          Adicionar Etiqueta
        </button>
      </div>

      {/* Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden transform origin-top-left transition-all">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {isCreating ? 'Nova Etiqueta' : editingTagId ? 'Editar Etiqueta' : 'Etiquetas'}
            </h4>
            {(isCreating || editingTagId) && (
              <button 
                onClick={() => {
                  setIsCreating(false);
                  setEditingTagId(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="p-3">
            {isCreating || editingTagId ? (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">Nome</label>
                  <input
                    autoFocus
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Ex: Urgente"
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateOrUpdate();
                    }}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2">Cor</label>
                  <div className="flex flex-wrap gap-2">
                    {PASTEL_COLORS.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setNewTagColor(color)}
                        className={`w-6 h-6 rounded-full ${color.bg} ${newTagColor.bg === color.bg ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleCreateOrUpdate}
                    disabled={!newTagName.trim()}
                    className="flex-1 bg-indigo-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    Salvar
                  </button>
                  {editingTagId && (
                    <button
                      onClick={() => handleDelete(editingTagId)}
                      className="px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {availableTags.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">Nenhuma etiqueta disponível</p>
                  ) : (
                    availableTags.map(tag => (
                      <div 
                        key={tag.id}
                        className="flex items-center group cursor-pointer"
                        onClick={() => toggleTag(tag.id)}
                      >
                        <div className="flex-1 flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
                          <div className={`w-4 h-4 rounded flex items-center justify-center border ${selectedTagIds.includes(tag.id) ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`}>
                            {selectedTagIds.includes(tag.id) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded font-medium ${tag.colorBg} ${tag.colorText}`}>
                            {tag.text}
                          </span>
                        </div>
                        <button
                          onClick={(e) => startEditing(e, tag)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-slate-700 transition-all rounded-md hover:bg-slate-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <button
                  onClick={startCreating}
                  className="w-full mt-2 py-2 border-t border-slate-100 text-indigo-600 text-xs font-bold hover:bg-slate-50 rounded-b-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Criar Nova Etiqueta
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
