'use client';

import { ProjectFolder, FolderColor } from '@/types/kanban';
import { Megaphone, CalendarDays, Share2, BookOpen, Rocket, Target, Music, Camera, MoreVertical, Trash2, Pencil, FolderOpen } from 'lucide-react';

export const FOLDER_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Megaphone,
  CalendarDays,
  Share2,
  BookOpen,
  Rocket,
  Target,
  Music,
  Camera,
};

export const FOLDER_COLORS: Record<FolderColor, { bg: string; text: string; border: string; light: string }> = {
  indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-200', light: 'bg-indigo-50' },
  violet: { bg: 'bg-violet-600', text: 'text-violet-600', border: 'border-violet-200', light: 'bg-violet-50' },
  rose: { bg: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-200', light: 'bg-rose-50' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200', light: 'bg-amber-50' },
  emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-200', light: 'bg-emerald-50' },
  sky: { bg: 'bg-sky-500', text: 'text-sky-600', border: 'border-sky-200', light: 'bg-sky-50' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-200', light: 'bg-orange-50' },
  teal: { bg: 'bg-teal-600', text: 'text-teal-600', border: 'border-teal-200', light: 'bg-teal-50' },
};

interface FolderCardProps {
  folder: ProjectFolder;
  projectCount: number;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function FolderCard({ folder, projectCount, onClick, onEdit, onDelete }: FolderCardProps) {
  const IconComp = FOLDER_ICONS[folder.icon] || FolderOpen;
  const colors = FOLDER_COLORS[folder.color];

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white dark:bg-slate-900 rounded-2xl border-2 ${colors.border} shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden`}
    >
      {/* Color accent strip */}
      <div className={`h-1.5 w-full ${colors.bg}`} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 ${colors.light} rounded-xl flex items-center justify-center`}>
            <IconComp className={`w-6 h-6 ${colors.text}`} />
          </div>

          {/* Actions menu */}
          <div
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative group/menu">
              <button className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:bg-slate-800 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-8 bg-white dark:bg-slate-900 border border-slate-100 shadow-xl rounded-xl py-1.5 z-10 w-40 hidden group-hover/menu:block">
                <button
                  onClick={onEdit}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:bg-slate-800/50 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" /> Renomear
                </button>
                <button
                  onClick={onDelete}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Excluir pasta
                </button>
              </div>
            </div>
          </div>
        </div>

        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1 leading-tight">{folder.name}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 line-clamp-2 mb-4">{folder.description}</p>

        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-bold uppercase tracking-wider ${colors.text}`}>
            {projectCount} {projectCount === 1 ? 'projeto' : 'projetos'}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <FolderOpen className="w-3 h-3" /> Abrir
          </span>
        </div>
      </div>
    </div>
  );
}
