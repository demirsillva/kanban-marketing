'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useKanban } from '@/hooks/use-kanban';
import { KanbanColumn } from './KanbanColumn';
import { Filter, Plus, Search as SearchIcon, Users, Tag as TagIcon, LayoutGrid } from 'lucide-react';
import { Card, Priority, FunnelStage, TaskType, Channel } from '@/types/kanban';
import { MOCK_USERS } from '@/lib/mock-data';
import { CardEditPanel } from './CardEditPanel';
import { ConfirmationModal } from './ConfirmationModal';
import { NewColumnModal } from './NewColumnModal';
import { triggerSingleConfetti } from '@/lib/confetti';
import { cn } from '@/lib/utils';

export function KanbanBoard() {
  const { 
    board, 
    moveCard, 
    moveColumn, 
    addCard, 
    updateCard, 
    deleteCard, 
    duplicateCard,
    addColumn,
    deleteColumn,
    updateColumn,
    addAvailableTag,
    updateAvailableTag,
    deleteAvailableTag,
    isLoaded 
  } = useKanban();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('Todos');
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isNewTask, setIsNewTask] = useState(false);
  const [isNewColumnModalOpen, setIsNewColumnModalOpen] = useState(false);
  
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });
  
  if (!isLoaded) return <div className="p-8 text-slate-500 font-medium">Carregando quadro...</div>;

  const handleCardClick = (card: Card) => {
    setEditingCard(card);
    setIsPanelOpen(true);
  };

  const handleAddCard = (colId: string) => {
    const draftCard: Card = {
      id: `draft-${Date.now()}`,
      status: colId,
      title: '',
      type: 'Post para Instagram',
      channel: 'Instagram',
      owner: MOCK_USERS[0],
      priority: 'Média',
      dueDate: new Date().toISOString().split('T')[0],
      tags: ['Novo'],
      funnelStage: 'Topo',
      effort: 'M',
      description: ''
    };
    setEditingCard(draftCard);
    setIsNewTask(true);
    setIsPanelOpen(true);
  };

  const handleAddColumn = () => {
    setIsNewColumnModalOpen(true);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (type === 'column') {
      moveColumn(draggableId, source.index, destination.index);
      return;
    }

    // Check if moving to "Concluído" column
    const destColumn = board.columns[destination.droppableId];
    if (destColumn.title === 'Concluído' && source.droppableId !== destination.droppableId) {
      triggerSingleConfetti();
    }

    moveCard(
      draggableId,
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
  };

  const filteredCards = Object.values(board.cards).filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         card.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'Todos' || card.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getColumnCards = (colId: string) => {
    const colCardIds = board.columns[colId].cardIds;
    return colCardIds
      .map(id => board.cards[id])
      .filter(card => filteredCards.some(fc => fc.id === card.id));
  };

  const activeTasksCount = Object.values(board.cards).filter(c => c.status !== 'col-5').length;
  const completedTasksCount = Object.values(board.cards).filter(c => c.status === 'col-5').length;
  const reviewTasksCount = Object.values(board.cards).filter(c => c.status === 'col-4').length;

  return (
    <div className="flex flex-col h-full">
      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Tarefas Ativas</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-slate-900">{activeTasksCount}</h3>
            <span className="text-indigo-600 text-xs font-semibold bg-indigo-50 px-2 py-1 rounded-md">Em andamento</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Em Revisão</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-slate-900">{reviewTasksCount}</h3>
            <span className="text-amber-600 text-xs font-semibold bg-amber-50 px-2 py-1 rounded-md">Aguardando feedback</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Concluídas (Mês)</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-slate-900">{completedTasksCount}</h3>
            <span className="text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-md">Meta: 85%</span>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-64"
            />
          </div>
          <select 
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600"
          >
            <option value="Todos">Todas Prioridades</option>
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
            <option value="Crítica">Crítica</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleAddColumn}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <LayoutGrid className="w-4 h-4" />
            Nova Coluna
          </button>
          <button 
            onClick={() => {
              const firstColId = board.columnOrder[0];
              if (firstColId) {
                handleAddCard(firstColId);
              } else {
                alert('Crie uma coluna primeiro!');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-columns" direction="horizontal" type="column">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex gap-6 h-full min-h-[500px]"
              >
                {board.columnOrder.map((colId, index) => {
                  const column = board.columns[colId];
                  const cards = getColumnCards(colId);
                  return (
                    <KanbanColumn
                      key={column.id}
                      column={column}
                      cards={cards}
                      availableTags={board.availableTags || []}
                      index={index}
                      onAddCard={handleAddCard}
                      onCardClick={handleCardClick}
                      onUpdateCard={updateCard}
                      onDeleteCard={(id, colId) => {
                        setConfirmModal({
                          isOpen: true,
                          title: 'Excluir Tarefa',
                          message: 'Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.',
                          onConfirm: () => deleteCard(id, colId)
                        });
                      }}
                      onDuplicateCard={duplicateCard}
                      onArchiveCard={(id, colId) => {
                        setConfirmModal({
                          isOpen: true,
                          title: 'Arquivar Tarefa',
                          message: 'Deseja arquivar esta tarefa? Ela será removida do quadro atual.',
                          onConfirm: () => deleteCard(id, colId)
                        });
                      }}
                      onUpdateColumn={updateColumn}
                      onDeleteColumn={(colId) => {
                        const col = board.columns[colId];
                        setConfirmModal({
                          isOpen: true,
                          title: 'Excluir Coluna',
                          message: `Deseja excluir a coluna "${col.title}" e todas as suas tarefas? Esta ação é irreversível.`,
                          onConfirm: () => deleteColumn(colId)
                        });
                      }}
                    />
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <CardEditPanel
        card={editingCard}
        board={board}
        isOpen={isPanelOpen}
        isNew={isNewTask}
        onClose={() => {
          setIsPanelOpen(false);
          setIsNewTask(false);
        }}
        onUpdate={(card) => {
          if (isNewTask) {
            const { id, status, ...cardData } = card;
            addCard(status, cardData);
            setIsNewTask(false);
          } else {
            updateCard(card);
          }
          setEditingCard(card);
        }}
        onDelete={(id, colId) => {
          setConfirmModal({
            isOpen: true,
            title: 'Excluir Tarefa',
            message: 'Tem certeza que deseja excluir esta tarefa?',
            onConfirm: () => deleteCard(id, colId)
          });
        }}
        onMove={(cardId, sourceColId, destColId) => {
          if (isNewTask) {
            if (editingCard) {
              setEditingCard({ ...editingCard, status: destColId });
            }
          } else {
            moveCard(cardId, sourceColId, destColId, board.columns[sourceColId].cardIds.indexOf(cardId), board.columns[destColId].cardIds.length);
            if (editingCard) {
              setEditingCard({ ...editingCard, status: destColId });
            }
          }
        }}
        onAddAvailableTag={addAvailableTag}
        onUpdateAvailableTag={updateAvailableTag}
        onDeleteAvailableTag={deleteAvailableTag}
      />
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
      <NewColumnModal
        isOpen={isNewColumnModalOpen}
        onClose={() => setIsNewColumnModalOpen(false)}
        onConfirm={(title) => addColumn(title)}
      />
    </div>
  );
}
