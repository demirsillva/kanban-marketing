'use client';

import { Project } from '@/types/kanban';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, CheckSquare, MoreVertical, Trash2, Pencil } from 'lucide-react';

const STATUS_STYLES: Record<Project['status'], string> = {
  Ativo: 'bg-emerald-100 text-emerald-700',
  Pausado: 'bg-amber-100 text-amber-700',
  Concluído: 'bg-slate-100 text-slate-500',
};

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectCard({ project, onClick, onEdit, onDelete }: ProjectCardProps) {
  const completedTasks = project.tasks.filter(t => t.completed).length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer p-6"
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_STYLES[project.status]}`}>
          {project.status}
        </span>

        <div
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative group/menu">
            <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-7 bg-white border border-slate-100 shadow-xl rounded-xl py-1.5 z-10 w-36 hidden group-hover/menu:block">
              <button
                onClick={onEdit}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" /> Editar
              </button>
              <button
                onClick={onDelete}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Excluir
              </button>
            </div>
          </div>
        </div>
      </div>

      <h3 className="font-bold text-slate-900 text-base mb-1 leading-tight">{project.name}</h3>
      <p className="text-sm text-slate-500 line-clamp-2 mb-4">{project.description}</p>

      {/* Progress bar */}
      {totalTasks > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{completedTasks} / {totalTasks} tarefas</span>
            </div>
            <span className="text-xs font-bold text-slate-700">{progress}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {project.dueDate && (
        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
          <Calendar className="w-3.5 h-3.5" />
          <span>{format(new Date(project.dueDate), "dd 'de' MMM yyyy", { locale: ptBR })}</span>
        </div>
      )}
    </div>
  );
}
