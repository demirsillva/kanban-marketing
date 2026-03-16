'use client';

import { Card as CardType } from '@/types/kanban';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, User, Tag, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EditableText } from './EditableText';
import { QuickActions } from './QuickActions';

interface KanbanCardProps {
  card: CardType;
  index: number;
  onClick: () => void;
  onUpdateTitle: (newTitle: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
}

const priorityColors = {
  Baixa: 'bg-emerald-100 text-emerald-700',
  Média: 'bg-amber-100 text-amber-700',
  Alta: 'bg-orange-100 text-orange-700',
  Crítica: 'bg-red-100 text-red-700',
};

const funnelColors = {
  Topo: 'border-blue-200 text-blue-600',
  Meio: 'border-indigo-200 text-indigo-600',
  Fundo: 'border-purple-200 text-purple-600',
};

export function KanbanCard({ card, index, onClick, onUpdateTitle, onDelete, onDuplicate, onArchive }: KanbanCardProps) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`
            bg-white rounded-xl p-4 mb-3 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group
            ${snapshot.isDragging ? 'shadow-xl ring-2 ring-indigo-500/50 rotate-2' : ''}
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
              className="text-sm font-semibold text-slate-900 leading-tight"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
              {card.channel}
            </span>
            <span className={`text-[10px] border px-2 py-0.5 rounded-md font-medium ${funnelColors[card.funnelStage]}`}>
              {card.funnelStage}
            </span>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">
                {format(new Date(card.dueDate), "dd 'de' MMM", { locale: ptBR })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white shadow-sm">
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
