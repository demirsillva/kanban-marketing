'use client';

import { Card as CardType, Tag as TagType } from '@/types/kanban';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, User, Tag, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EditableText } from './EditableText';
import { QuickActions } from './QuickActions';

interface KanbanCardProps {
  card: CardType;
  availableTags: TagType[];
  index: number;
  onClick: () => void;
  onUpdateTitle: (newTitle: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
}

const priorityColors = {
  Baixa: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  Média: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
  Alta: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400',
  Urgente: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
};

const funnelColors = {
  Topo: 'border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400',
  Meio: 'border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
  Fundo: 'border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400',
};

export function KanbanCard({ card, availableTags, index, onClick, onUpdateTitle, onDelete, onDuplicate, onArchive }: KanbanCardProps) {
  const cardTags = (card.tags || []).map(tagId => availableTags.find(t => t.id === tagId)).filter(Boolean) as TagType[];

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`
            bg-white dark:bg-slate-900 rounded-xl p-4 mb-3 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md dark:shadow-none dark:hover:bg-slate-800/80 transition-all cursor-pointer group
            ${snapshot.isDragging ? 'shadow-xl dark:shadow-black/40 ring-2 ring-indigo-500/50 dark:ring-indigo-500/30 rotate-2 dark:bg-slate-800' : ''}
          `}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${priorityColors[card.priority]}`}>
              {card.priority}
            </span>
            <QuickActions 
              onEdit={onClick}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onArchive={onArchive}
            />
          </div>

          <div className="mb-2">
            <EditableText
              value={card.title}
              onSave={onUpdateTitle}
              className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {cardTags.map(tag => (
              <span key={tag.id} className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${tag.colorBg} ${tag.colorText}`}>
                {tag.text}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 dark:border-slate-800/50">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">
                {format(new Date(card.dueDate), "dd 'de' MMM", { locale: ptBR })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white dark:border-slate-900 shadow-sm">
                <Image
                  src={card.owner.avatar}
                  alt={card.owner.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
