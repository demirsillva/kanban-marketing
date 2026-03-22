'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, X } from 'lucide-react';
import { Button } from './ui/Button';

interface NewColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (title: string, color: string) => void;
}

export function NewColumnModal({ isOpen, onClose, onConfirm }: NewColumnModalProps) {
  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState('none');
  const inputRef = useRef<HTMLInputElement>(null);

  const COLORS = [
    { id: 'none',    dot: 'bg-slate-200' },
    { id: 'slate',   dot: 'bg-slate-400' },
    { id: 'indigo',  dot: 'bg-indigo-500' },
    { id: 'violet',  dot: 'bg-violet-500' },
    { id: 'rose',    dot: 'bg-rose-500' },
    { id: 'amber',   dot: 'bg-amber-500' },
    { id: 'emerald', dot: 'bg-emerald-500' },
    { id: 'sky',     dot: 'bg-sky-500' },
    { id: 'orange',  dot: 'bg-orange-500' },
    { id: 'teal',    dot: 'bg-teal-500' },
  ];

  useEffect(() => {
    if (isOpen) {
      const handle = requestAnimationFrame(() => {
        setTitle('');
        setSelectedColor('none');
        inputRef.current?.focus();
      });
      return () => cancelAnimationFrame(handle);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onConfirm(title.trim(), selectedColor);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-[100] transition-colors"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors"
            >
              <form onSubmit={handleSubmit}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors">
                        <LayoutGrid className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 transition-colors">Nova Coluna</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-2 block transition-colors">
                        Nome da Coluna
                      </label>
                      <input
                        ref={inputRef}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Em Revisão, Backlog..."
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-3 block transition-colors">
                        Cor da Coluna
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {COLORS.map((color) => (
                          <button
                            key={color.id}
                            type="button"
                            onClick={() => setSelectedColor(color.id)}
                            className={`w-8 h-8 rounded-full transition-all border-2 ${
                              selectedColor === color.id
                                ? 'border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/20 dark:ring-indigo-500/40 scale-110'
                                : 'border-transparent hover:scale-105'
                            } ${color.dot} shadow-sm`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 transition-colors">
                  <Button
                    variant="secondary"
                    onClick={onClose}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={!title.trim()}
                    className="px-6"
                  >
                    Criar Coluna
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
