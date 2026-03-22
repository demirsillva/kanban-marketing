'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Trash2, Edit2, Copy, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/Button';

interface QuickActionsProps {
  onDelete: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
}

export function QuickActions({ onDelete, onEdit, onDuplicate, onArchive }: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="opacity-0 group-hover:opacity-100"
      >
        <MoreHorizontal className="w-4 h-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 overflow-hidden"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:bg-slate-800/50 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Editar detalhes
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:bg-slate-800/50 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Duplicar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchive();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:bg-slate-800/50 transition-colors"
            >
              <Archive className="w-4 h-4" />
              Arquivar
            </button>
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1.5" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Excluir tarefa
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
