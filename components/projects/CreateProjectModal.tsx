'use client';

import { useState, useEffect } from 'react';
import { Project, ProjectTask } from '@/types/kanban';
import { X, Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ProjectDraft = Omit<Project, 'id'>;

interface CreateProjectModalProps {
  isOpen: boolean;
  folderId: string;
  existing?: Project | null;
  onClose: () => void;
  onSave: (project: ProjectDraft) => void;
}

function generateId() {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function CreateProjectModal({ isOpen, folderId, existing, onClose, onSave }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Project['status']>('Ativo');
  const [dueDate, setDueDate] = useState('');
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setDescription(existing.description);
      setStatus(existing.status);
      setDueDate(existing.dueDate);
      setTasks(existing.tasks);
    } else {
      setName('');
      setDescription('');
      setStatus('Ativo');
      setDueDate('');
      setTasks([]);
    }
    setNewTaskTitle('');
  }, [existing, isOpen]);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks(prev => [...prev, { id: generateId(), title: newTaskTitle.trim(), completed: false }]);
    setNewTaskTitle('');
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), description: description.trim(), status, dueDate, folderId, tasks });
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
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  {existing ? 'Editar Projeto' : 'Novo Projeto'}
                </h2>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto flex-1">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5 block">Nome do Projeto</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Black Friday 2026"
                    className="w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5 block">Descrição</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o objetivo deste projeto..."
                    rows={2}
                    className="w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5 block">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as Project['status'])}
                      className="w-full px-3 py-2.5 text-sm text-slate-700 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Pausado">Pausado</option>
                      <option value="Concluído">Concluído</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5 block">Data de Entrega</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm text-slate-700 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                </div>

                {/* Tasks */}
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 block">Tarefas</label>
                  <div className="space-y-1.5 mb-2">
                    {tasks.map(task => (
                      <div key={task.id} className="flex items-center gap-2 group/task">
                        <button onClick={() => toggleTask(task.id)} className="text-indigo-500 hover:text-indigo-600 flex-shrink-0">
                          {task.completed
                            ? <CheckSquare className="w-4 h-4" />
                            : <Square className="w-4 h-4 text-slate-300" />
                          }
                        </button>
                        <span className={`text-sm flex-1 ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                          {task.title}
                        </span>
                        <button
                          onClick={() => removeTask(task.id)}
                          className="opacity-0 group-hover/task:opacity-100 p-0.5 text-slate-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTask()}
                      placeholder="Adicionar tarefa..."
                      className="flex-1 px-3 py-2 text-sm text-slate-800 bg-slate-50 rounded-xl border border-dashed border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300"
                    />
                    <button
                      onClick={addTask}
                      disabled={!newTaskTitle.trim()}
                      className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={onClose} className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={!name.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {existing ? 'Salvar' : 'Criar Projeto'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
