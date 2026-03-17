'use client';

import { Column, Card } from '@/types/kanban';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { KanbanCard } from './KanbanCard';
import { Plus, MoreVertical, Trash2 } from 'lucide-react';
import { EditableText } from './EditableText';

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
  onUpdateColumn: (colId: string, title: string) => void;
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
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="flex flex-col w-80 min-w-[320px] bg-slate-50/50 rounded-2xl border border-slate-100 h-full"
        >
          <div 
            {...provided.dragHandleProps}
            className="p-4 flex items-center justify-between group/col"
          >
            <div className="flex items-center gap-2 flex-1">
              <EditableText
                value={column.title}
                onSave={(newTitle) => onUpdateColumn(column.id, newTitle)}
                className="font-bold text-slate-800 text-sm"
              />
              <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {cards.length}
              </span>
            </div>
            <button 
              onClick={() => {
                onDeleteColumn(column.id);
              }}
              className="text-slate-400 hover:text-red-600 opacity-0 group-hover/col:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <Droppable droppableId={column.id} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`flex-1 p-3 transition-colors min-h-[150px] ${
                  snapshot.isDraggingOver ? 'bg-indigo-50/50' : ''
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
                
                <button
                  onClick={() => onAddCard(column.id)}
                  className="w-full py-2 flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl border border-dashed border-slate-200 hover:border-indigo-200 transition-all text-sm font-medium mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Nova tarefa
                </button>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
