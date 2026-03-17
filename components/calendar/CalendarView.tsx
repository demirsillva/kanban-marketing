'use client';

import { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  parseISO,
  addWeeks,
  subWeeks,
  addDays,
  subDays
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, LayoutGrid, List } from 'lucide-react';
import { useKanban } from '@/hooks/use-kanban';
import { Card } from '@/types/kanban';
import { cn } from '@/lib/utils';
import { CardEditPanel } from '../CardEditPanel';

type ViewMode = 'diaria' | 'semanal' | 'mensal';

export function CalendarView() {
  const { 
    board, 
    updateCard, 
    deleteCard, 
    addAvailableTag,
    updateAvailableTag,
    deleteAvailableTag,
    isLoaded 
  } = useKanban();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('mensal');
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  if (!isLoaded) return <div className="p-8 text-slate-500 font-medium">Carregando calendário...</div>;

  const cardsList = Object.values(board.cards);

  const nextPeriod = () => {
    if (viewMode === 'mensal') setCurrentDate(addMonths(currentDate, 1));
    if (viewMode === 'semanal') setCurrentDate(addWeeks(currentDate, 1));
    if (viewMode === 'diaria') setCurrentDate(addDays(currentDate, 1));
  };

  const prevPeriod = () => {
    if (viewMode === 'mensal') setCurrentDate(subMonths(currentDate, 1));
    if (viewMode === 'semanal') setCurrentDate(subWeeks(currentDate, 1));
    if (viewMode === 'diaria') setCurrentDate(subDays(currentDate, 1));
  };
  
  const today = () => setCurrentDate(new Date());

  // Determine grid bounds based on view mode
  let startDate = currentDate;
  let endDate = currentDate;

  if (viewMode === 'mensal') {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  } else if (viewMode === 'semanal') {
    startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
    endDate = endOfWeek(currentDate, { weekStartsOn: 0 });
  } // daily uses currentDate for both

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Map priorities to colors
  const priorityColors = {
    'Baixa': 'bg-slate-100 text-slate-700 border-slate-200',
    'Média': 'bg-blue-100 text-blue-700 border-blue-200',
    'Alta': 'bg-amber-100 text-amber-700 border-amber-200',
    'Crítica': 'bg-rose-100 text-rose-700 border-rose-200',
  };

  const renderHeaderTitle = () => {
    if (viewMode === 'mensal') return format(currentDate, "MMMM yyyy", { locale: ptBR });
    if (viewMode === 'semanal') {
      const start = format(startDate, "d 'de' MMMM", { locale: ptBR });
      const end = format(endDate, "d 'de' MMMM", { locale: ptBR });
      return `${start} — ${end}`;
    }
    return format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[750px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 capitalize">
            {renderHeaderTitle()}
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          {/* View Toggles */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['diaria', 'semanal', 'mensal'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 capitalize",
                  viewMode === mode 
                    ? "bg-white text-indigo-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                )}
              >
                {mode === 'diaria' && <Clock className="w-3.5 h-3.5" />}
                {mode === 'semanal' && <List className="w-3.5 h-3.5" />}
                {mode === 'mensal' && <LayoutGrid className="w-3.5 h-3.5" />}
                {mode === 'diaria' ? 'Dia' : mode === 'semanal' ? 'Semana' : 'Mês'}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-slate-200" />

          {/* Navigation Controls */}
          <button 
            onClick={today}
            className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
          >
            Hoje
          </button>
          <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1">
            <button 
              onClick={prevPeriod}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded-md transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextPeriod}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded-md transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'diaria' ? (
        // ***************** DAILY VIEW *****************
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Tarefas Planejadas para Hoje
            </h3>
            
            <div className="flex flex-col gap-3">
              {(() => {
                const dayCards = cardsList.filter(card => card.dueDate && isSameDay(parseISO(card.dueDate), currentDate));
                
                if (dayCards.length === 0) {
                  return (
                    <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-300 bg-white">
                      <p className="text-slate-500">Nenhuma tarefa agendada para este dia.</p>
                    </div>
                  );
                }

                return dayCards.map(card => (
                  <button
                    key={card.id}
                    onClick={() => {
                      setEditingCard(card);
                      setIsPanelOpen(true);
                    }}
                    className={cn(
                      "text-left p-4 rounded-xl border transition-all hover:shadow-md flex flex-col gap-2 relative bg-white",
                      priorityColors[card.priority]
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-slate-800 text-lg">{card.title}</h4>
                      {card.status === 'col-5' && (
                        <span className="px-2 py-1 text-xs font-bold bg-emerald-100 text-emerald-700 rounded flex items-center gap-1">
                           ✓ Concluído
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {card.description || "Nenhuma descrição fornecida."}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-600">
                        {card.type}
                      </span>
                      <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-600">
                        {card.channel}
                      </span>
                    </div>
                  </button>
                ));
              })()}
            </div>
          </div>
        </div>
      ) : (
        // ***************** WEEKLY & MONTHLY VIEW *****************
        <>
          {/* Weekdays Header */}
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
            {weekDays.map(day => (
              <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className={cn(
            "flex-1 grid grid-cols-7 overflow-y-auto",
            viewMode === 'mensal' ? "grid-rows-5" : "grid-rows-1"
          )}>
            {days.map((day, i) => {
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());
              
              // Find cards for this day
              const dayCards = cardsList.filter(card => {
                if (!card.dueDate) return false;
                return isSameDay(parseISO(card.dueDate), day);
              });

              return (
                <div 
                  key={day.toString()} 
                  className={cn(
                    "p-2 border-b border-r border-slate-100 relative group transition-colors flex flex-col",
                    viewMode === 'mensal' ? "min-h-[120px]" : "min-h-[500px]",
                    !isCurrentMonth && viewMode === 'mensal' && "bg-slate-50/50",
                    isToday && "bg-indigo-50/30",
                    "hover:bg-slate-50/80"
                  )}
                >
                  <div className="flex justify-between items-start mb-2 shrink-0">
                    <span className={cn(
                      "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                      isToday ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200" : 
                      isCurrentMonth ? "text-slate-700" : "text-slate-400"
                    )}>
                      {format(day, 'd')}
                    </span>
                    
                    {dayCards.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                        {dayCards.length}
                      </span>
                    )}
                  </div>

                  {/* Cards for the day */}
                  <div className={cn(
                    "flex flex-col gap-1.5 overflow-y-auto w-full pr-1",
                    // For monthly view we limit space to 3-4 cards visually, weekly we let them stack
                    viewMode === 'mensal' ? "max-h-[85px] no-scrollbar" : "flex-1"
                  )}>
                    {dayCards.map(card => (
                      <button
                        key={card.id}
                        onClick={() => {
                          setEditingCard(card);
                          setIsPanelOpen(true);
                        }}
                        className={cn(
                          "text-left p-2 text-xs font-medium rounded-md border w-full transition-all hover:shadow-md hover:-translate-y-0.5 group/card",
                          priorityColors[card.priority]
                        )}
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className={cn(
                            "font-bold truncate group-hover/card:whitespace-normal group-hover/card:break-words",
                            viewMode === 'semanal' && "whitespace-normal break-words"
                          )}>
                            {card.title}
                          </span>
                          {card.status === 'col-5' && <span className="text-emerald-600 shrink-0">✓</span>}
                        </div>
                        {viewMode === 'semanal' && (
                          <div className="text-[10px] opacity-80 mt-1 line-clamp-2">
                             {card.description}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Reused Edit Panel */}
      <CardEditPanel
        card={editingCard}
        board={board}
        isOpen={isPanelOpen}
        isNew={false}
        onClose={() => setIsPanelOpen(false)}
        onUpdate={(card) => {
          updateCard(card);
        }}
        onDelete={(id, colId) => {
          if(confirm('Tem certeza que deseja excluir esta tarefa?')) {
            deleteCard(id, colId);
            setIsPanelOpen(false);
          }
        }}
        onMove={(cardId, sourceColId, destColId) => {
          // Calendar view doesn't handle drag and drop between columns,
          // but CardEditPanel can change the status. We just need to update it.
          const card = board.cards[cardId];
          if (card) {
            updateCard({ ...card, status: destColId });
          }
        }}
        onAddAvailableTag={addAvailableTag}
        onUpdateAvailableTag={updateAvailableTag}
        onDeleteAvailableTag={deleteAvailableTag}
      />
    </div>
  );
}
