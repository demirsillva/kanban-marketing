'use client';

import { useState, useEffect } from 'react';
import { Board, Card, Column } from '@/types/kanban';
import { INITIAL_DATA } from '@/lib/mock-data';

export function useKanban() {
  const [board, setBoard] = useState<Board>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('marketflow_board');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to load board from localStorage', e);
        }
      }
    }
    return INITIAL_DATA;
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Mark as loaded after mount to avoid hydration issues
    const handle = requestAnimationFrame(() => setIsLoaded(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('marketflow_board', JSON.stringify(board));
    }
  }, [board, isLoaded]);

  const moveCard = (
    cardId: string,
    sourceColId: string,
    destColId: string,
    sourceIndex: number,
    destIndex: number
  ) => {
    const newBoard = { ...board };
    const sourceCol = newBoard.columns[sourceColId];
    const destCol = newBoard.columns[destColId];

    const newSourceCardIds = Array.from(sourceCol.cardIds);
    newSourceCardIds.splice(sourceIndex, 1);

    if (sourceColId === destColId) {
      newSourceCardIds.splice(destIndex, 0, cardId);
      newBoard.columns[sourceColId] = {
        ...sourceCol,
        cardIds: newSourceCardIds,
      };
    } else {
      const newDestCardIds = Array.from(destCol.cardIds);
      newDestCardIds.splice(destIndex, 0, cardId);

      newBoard.columns[sourceColId] = {
        ...sourceCol,
        cardIds: newSourceCardIds,
      };
      newBoard.columns[destColId] = {
        ...destCol,
        cardIds: newDestCardIds,
      };
      
      // Update card status
      newBoard.cards[cardId] = {
        ...newBoard.cards[cardId],
        status: destColId,
      };
    }

    setBoard(newBoard);
  };

  const moveColumn = (columnId: string, sourceIndex: number, destIndex: number) => {
    const newColumnOrder = Array.from(board.columnOrder);
    newColumnOrder.splice(sourceIndex, 1);
    newColumnOrder.splice(destIndex, 0, columnId);

    setBoard({
      ...board,
      columnOrder: newColumnOrder,
    });
  };

  const addCard = (columnId: string, card: Omit<Card, 'id' | 'status'>) => {
    const id = `card-${Date.now()}`;
    const newCard: Card = { ...card, id, status: columnId };
    
    setBoard(prev => ({
      ...prev,
      cards: { ...prev.cards, [id]: newCard },
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          cardIds: [...prev.columns[columnId].cardIds, id],
        },
      },
    }));
  };

  const updateCard = (card: Card) => {
    setBoard(prev => ({
      ...prev,
      cards: { ...prev.cards, [card.id]: card },
    }));
  };

  const deleteCard = (cardId: string, columnId: string) => {
    setBoard(prev => {
      const newCards = { ...prev.cards };
      delete newCards[cardId];

      const newColumn = {
        ...prev.columns[columnId],
        cardIds: prev.columns[columnId].cardIds.filter(id => id !== cardId),
      };

      return {
        ...prev,
        cards: newCards,
        columns: { ...prev.columns, [columnId]: newColumn },
      };
    });
  };

  const duplicateCard = (cardId: string, columnId: string) => {
    const cardToDuplicate = board.cards[cardId];
    if (!cardToDuplicate) return;

    const newId = `card-${Date.now()}`;
    const newCard: Card = { 
      ...cardToDuplicate, 
      id: newId, 
      title: `${cardToDuplicate.title} (Cópia)` 
    };

    setBoard(prev => ({
      ...prev,
      cards: { ...prev.cards, [newId]: newCard },
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          cardIds: [...prev.columns[columnId].cardIds, newId],
        },
      },
    }));
  };

  const addColumn = (title: string) => {
    const id = `col-${Date.now()}`;
    const newColumn: Column = { id, title, cardIds: [] };

    setBoard(prev => ({
      ...prev,
      columns: { ...prev.columns, [id]: newColumn },
      columnOrder: [...prev.columnOrder, id],
    }));
  };

  const deleteColumn = (columnId: string) => {
    setBoard(prev => {
      const newColumns = { ...prev.columns };
      const cardIdsToRemove = newColumns[columnId].cardIds;
      delete newColumns[columnId];

      const newCards = { ...prev.cards };
      cardIdsToRemove.forEach(id => delete newCards[id]);

      return {
        ...prev,
        cards: newCards,
        columns: newColumns,
        columnOrder: prev.columnOrder.filter(id => id !== columnId),
      };
    });
  };

  const updateColumn = (columnId: string, title: string) => {
    setBoard(prev => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: { ...prev.columns[columnId], title },
      },
    }));
  };

  return {
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
    isLoaded
  };
}
