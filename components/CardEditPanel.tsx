'use client';

import { Card, Priority, TaskType, Channel, User, Board, Tag } from '@/types/kanban';
import { X, Trash2, Calendar, User as UserIcon, Tag as TagIcon, AlignLeft, BarChart, LayoutGrid } from 'lucide-react';
import { MOCK_USERS } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'motion/react';
import { EditableText } from './EditableText';
import { RichTextEditor } from './RichTextEditor';
import { TagSelector } from './TagSelector';
import { triggerSingleConfetti } from '@/lib/confetti';

interface CardEditPanelProps {
  card: Card | null;
  board: Board;
  isOpen: boolean;
  isNew?: boolean;
  onClose: () => void;
  onUpdate: (card: Card) => void;
  onDelete: (cardId: string, colId: string) => void;
  onMove: (cardId: string, sourceColId: string, destColId: string) => void;
  onAddAvailableTag: (tag: Omit<Tag, 'id'>) => void;
  onUpdateAvailableTag: (tag: Tag) => void;
  onDeleteAvailableTag: (tagId: string) => void;
}

export function CardEditPanel({ 
  card, 
  board, 
  isOpen, 
  isNew = false, 
  onClose, 
  onUpdate, 
  onDelete, 
  onMove,
  onAddAvailableTag,
  onUpdateAvailableTag,
  onDeleteAvailableTag
}: CardEditPanelProps) {
  if (!card) return null;

  const handleChange = (field: keyof Card, value: any) => {
    if (field === 'status') {
      const destCol = board.columns[value];
      if (destCol.title === 'Concluído' && card.status !== value) {
        triggerSingleConfetti();
      }
      onMove(card.id, card.status, value);
    } else {
      onUpdate({ ...card, [field]: value });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] pointer-events-auto overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <h2 className="text-lg font-bold text-slate-900">
                  {isNew ? 'Nova Tarefa de Marketing' : 'Detalhes da Tarefa'}
                </h2>
                <div className="flex items-center gap-2">
                  {!isNew && (
                    <button
                      onClick={() => {
                        onDelete(card.id, card.status);
                        onClose();
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir tarefa"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Title & Description */}
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 block">Título</label>
                    <EditableText
                      value={card.title}
                      onSave={(val) => handleChange('title', val)}
                      className="text-2xl font-bold text-slate-900 leading-tight"
                      inputClassName="text-2xl font-bold text-slate-900"
                      autoFocus={isNew}
                    />
                  </div>

                  {/* Properties Grid */}
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6 pt-6 pb-6 border-y border-slate-100">
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 block flex items-center gap-2">
                        <TagIcon className="w-3 h-3" /> Etiquetas
                      </label>
                      <TagSelector
                        availableTags={board.availableTags || []}
                        selectedTagIds={card.tags || []}
                        onChange={(tags) => handleChange('tags', tags)}
                        onAddAvailableTag={onAddAvailableTag}
                        onUpdateAvailableTag={onUpdateAvailableTag}
                        onDeleteAvailableTag={onDeleteAvailableTag}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <UserIcon className="w-3 h-3" /> Responsável
                      </div>
                      <select
                        value={card.owner.id}
                        onChange={(e) => handleChange('owner', MOCK_USERS.find(u => u.id === e.target.value))}
                        className="text-sm font-medium text-slate-700 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500/20 py-1.5 px-3"
                      >
                        {MOCK_USERS.map(u => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <Calendar className="w-3 h-3" /> Entrega
                      </div>
                      <input
                        type="date"
                        value={card.dueDate}
                        onChange={(e) => handleChange('dueDate', e.target.value)}
                        className="text-sm font-medium text-slate-700 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500/20 py-1.5 px-3"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <BarChart className="w-3 h-3" /> Prioridade
                      </div>
                      <select
                        value={card.priority}
                        onChange={(e) => handleChange('priority', e.target.value as Priority)}
                        className="text-sm font-medium text-slate-700 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500/20 py-1.5 px-3"
                      >
                        <option value="Baixa">Baixa</option>
                        <option value="Média">Média</option>
                        <option value="Alta">Alta</option>
                        <option value="Crítica">Crítica</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <LayoutGrid className="w-3 h-3" /> Coluna
                      </div>
                      <select
                        value={card.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="text-sm font-medium text-slate-700 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500/20 py-1.5 px-3"
                      >
                        {board.columnOrder.map(colId => (
                          <option key={colId} value={colId}>{board.columns[colId].title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 block flex items-center gap-2">
                      <AlignLeft className="w-3 h-3" /> Descrição e Checklists
                    </label>
                    <RichTextEditor
                      description={card.description}
                      onChange={(val) => handleChange('description', val)}
                    />
                  </div>
                </div>


              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={onClose}
                  className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isNew && !card.title.trim()}
                >
                  {isNew ? 'Criar Tarefa' : 'Salvar'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
