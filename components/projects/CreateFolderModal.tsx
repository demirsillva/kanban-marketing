'use client';

import { useState, useEffect } from 'react';
import { ProjectFolder, FolderColor } from '@/types/kanban';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FOLDER_ICONS, FOLDER_COLORS } from './FolderCard';

const ICON_NAMES = Object.keys(FOLDER_ICONS) as string[];
const COLOR_NAMES = Object.keys(FOLDER_COLORS) as FolderColor[];

interface CreateFolderModalProps {
  isOpen: boolean;
  existing?: ProjectFolder | null;
  onClose: () => void;
  onSave: (folder: Omit<ProjectFolder, 'id' | 'projectIds'>) => void;
}

export function CreateFolderModal({ isOpen, existing, onClose, onSave }: CreateFolderModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState<string>('Megaphone');
  const [color, setColor] = useState<FolderColor>('indigo');

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setDescription(existing.description);
      setIcon(existing.icon);
      setColor(existing.color);
    } else {
      setName('');
      setDescription('');
      setIcon('Megaphone');
      setColor('indigo');
    }
  }, [existing, isOpen]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), description: description.trim(), icon, color });
    onClose();
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {existing ? 'Editar Pasta' : 'Nova Pasta'}
                </h2>
                <button onClick={onClose} className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:bg-slate-800/50 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1.5 block">Nome da Pasta</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Campanhas de Marketing"
                    className="w-full px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1.5 block">Descrição</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Sobre o que é esta pasta?"
                    className="w-full px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-2 block">Ícone</label>
                  <div className="flex flex-wrap gap-2">
                    {ICON_NAMES.map((iconName) => {
                      const IconComp = FOLDER_ICONS[iconName];
                      const isSelected = icon === iconName;
                      return (
                        <button
                          key={iconName}
                          onClick={() => setIcon(iconName)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            isSelected ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:bg-slate-800'
                          }`}
                        >
                          <IconComp className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-2 block">Cor</label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_NAMES.map((colorName) => {
                      const colors = FOLDER_COLORS[colorName];
                      return (
                        <button
                          key={colorName}
                          onClick={() => setColor(colorName)}
                          className={`w-8 h-8 rounded-full ${colors.bg} transition-all ${
                            color === colorName ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-800/50/50 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={onClose} className="px-5 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:bg-slate-800 rounded-xl transition-all">
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={!name.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {existing ? 'Salvar' : 'Criar Pasta'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
