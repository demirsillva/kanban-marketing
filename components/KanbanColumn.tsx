'use client';

import { useState, useRef, useEffect } from 'react';
import { Column, Card } from '@/types/kanban';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { KanbanCard } from './KanbanCard';
import { Plus, MoreVertical, Trash2, Palette } from 'lucide-react';
import { EditableText } from './EditableText';
import { Button } from './ui/Button';

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
  availableTags: import('@/types/kanban').Tag[];
  index: number;
  onAddCard: (colId: string) => void;
  onCardClick: (card: Card) => void;
  onUpdateCard: (card: Card) => void;
  onDeleteCard: (cardId: string, colId: string) => void;
  onDuplicateCard: (cardId: string, colId: string) => void;
  onArchiveCard: (cardId: string, colId: string) => void;
  onUpdateColumn: (colId: string, updates: Partial<Omit<Column, 'id' | 'cardIds'>>) => void;
  onDeleteColumn: (colId: string) => void;
}

export function KanbanColumn({ 
  column, 
  cards, 
  availableTags,
  index, 
  onAddCard, 
  onCardClick, 
  onUpdateCard, 
  onDeleteCard,
  onDuplicateCard,
  onArchiveCard,
  onUpdateColumn,
  onDeleteColumn
}: KanbanColumnProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const columnColor = column.color || 'indigo';

  const COLOR_VARIANTS: Record<string, { bg: string; border: string; dot: string; text: string }> = {
    none:    { bg: 'bg-white/40 dark:bg-slate-900/40',       border: 'border-slate-100 dark:border-slate-800',  dot: 'bg-slate-200 dark:bg-slate-700',    text: 'text-slate-700 dark:text-slate-300' },
    slate:   { bg: 'bg-slate-100/50 dark:bg-slate-800/50',   border: 'border-slate-200 dark:border-slate-700',  dot: 'bg-slate-400 dark:bg-slate-500',    text: 'text-slate-800 dark:text-slate-200' },
    indigo:  { bg: 'bg-indigo-50/50 dark:bg-indigo-500/10',  border: 'border-indigo-100 dark:border-indigo-500/20', dot: 'bg-indigo-500 dark:bg-indigo-400',  text: 'text-indigo-900 dark:text-indigo-100' },
    violet:  { bg: 'bg-violet-50/50 dark:bg-violet-500/10',  border: 'border-violet-100 dark:border-violet-500/20', dot: 'bg-violet-500 dark:bg-violet-400',  text: 'text-violet-900 dark:text-violet-100' },
    rose:    { bg: 'bg-rose-50/50 dark:bg-rose-500/10',      border: 'border-rose-100 dark:border-rose-500/20',   dot: 'bg-rose-500 dark:bg-rose-400',    text: 'text-rose-900 dark:text-rose-100' },
    amber:   { bg: 'bg-amber-50/50 dark:bg-amber-500/10',    border: 'border-amber-100 dark:border-amber-500/20',  dot: 'bg-amber-500 dark:bg-amber-400',   text: 'text-amber-900 dark:text-amber-100' },
    emerald: { bg: 'bg-emerald-50/50 dark:bg-emerald-500/10',border: 'border-emerald-100 dark:border-emerald-500/20',dot: 'bg-emerald-500 dark:bg-emerald-400', text: 'text-emerald-900 dark:text-emerald-100' },
    sky:     { bg: 'bg-sky-50/50 dark:bg-sky-500/10',        border: 'border-sky-100 dark:border-sky-500/20',    dot: 'bg-sky-500 dark:bg-sky-400',     text: 'text-sky-900 dark:text-sky-100' },
    orange:  { bg: 'bg-orange-50/50 dark:bg-orange-500/10',  border: 'border-orange-100 dark:border-orange-500/20', dot: 'bg-orange-500 dark:bg-orange-400',  text: 'text-orange-900 dark:text-orange-100' },
    teal:    { bg: 'bg-teal-50/50 dark:bg-teal-500/10',      border: 'border-teal-100 dark:border-teal-500/20',   dot: 'bg-teal-500 dark:bg-teal-400',    text: 'text-teal-900 dark:text-teal-100' },
  };

  const currentVariant = COLOR_VARIANTS[columnColor] || COLOR_VARIANTS.indigo;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className={`flex flex-col w-80 min-w-[320px] rounded-2xl border transition-all h-full ${currentVariant.bg} ${currentVariant.border}`}
        >
          <div 
            {...provided.dragHandleProps}
            className="p-4 flex items-center justify-between group/col"
          >
            <div className="flex items-center gap-2 flex-1">
              <div className={`w-2 h-2 rounded-full ${currentVariant.dot}`} />
              <EditableText
                value={column.title}
                onSave={(newTitle) => onUpdateColumn(column.id, { title: newTitle })}
                className={`font-bold text-sm tracking-tight ${currentVariant.text}`}
              />
              <span className="bg-white/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/50 dark:border-slate-700/50">
                {cards.length}
              </span>
            </div>
            
            <div className="relative" ref={menuRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hover:bg-white/50 dark:hover:bg-slate-800/50"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-50 dark:border-slate-800/50 mb-1">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Mudar Cor</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                       {Object.keys(COLOR_VARIANTS).map(c => (
                         <button
                           key={c}
                           onClick={() => {
                             onUpdateColumn(column.id, { color: c });
                             setIsMenuOpen(false);
                           }}
                           className={`w-5 h-5 rounded-full transition-transform hover:scale-110 ${COLOR_VARIANTS[c].dot} ${columnColor === c ? 'ring-2 ring-slate-300 dark:ring-slate-600 ring-offset-1 dark:ring-offset-slate-900' : ''}`}
                         />
                       ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onDeleteColumn(column.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir Coluna
                  </button>
                </div>
              )}
            </div>
          </div>

          <Droppable droppableId={column.id} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`flex-1 p-3 transition-colors min-h-[150px] rounded-b-2xl ${
                  snapshot.isDraggingOver ? 'bg-white/20 dark:bg-slate-800/30' : ''
                }`}
              >
                {cards.map((card, idx) => (
                  <KanbanCard 
                    key={card.id} 
                    card={card} 
                    availableTags={availableTags}
                    index={idx} 
                    onClick={() => onCardClick(card)}
                    onUpdateTitle={(newTitle) => onUpdateCard({ ...card, title: newTitle })}
                    onDelete={() => onDeleteCard(card.id, column.id)}
                    onDuplicate={() => onDuplicateCard(card.id, column.id)}
                    onArchive={() => onArchiveCard(card.id, column.id)}
                  />
                ))}
                {provided.placeholder}
                
                <Button
                  variant="secondary"
                  className="w-full mt-2 border-dashed border-slate-200/50 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-white dark:hover:bg-slate-800"
                  onClick={() => onAddCard(column.id)}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Nova tarefa
                </Button>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
