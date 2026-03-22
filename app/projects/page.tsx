'use client';

import { useState } from 'react';

import { FolderCard, FOLDER_COLORS } from '@/components/projects/FolderCard';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { CreateFolderModal } from '@/components/projects/CreateFolderModal';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { useProjects } from '@/hooks/use-projects';
import { ProjectFolder, Project } from '@/types/kanban';
import { Plus, ChevronRight, Briefcase, CheckSquare, Square, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ProjectsPage() {
  const {
    data, isLoaded,
    addFolder, updateFolder, deleteFolder,
    addProject, updateProject, deleteProject,
    toggleTask, addTask, deleteTask,
  } = useProjects();

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<ProjectFolder | null>(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [newTaskInput, setNewTaskInput] = useState('');

  const selectedFolder = selectedFolderId ? data.folders[selectedFolderId] : null;
  const selectedProject = selectedProjectId ? data.projects[selectedProjectId] : null;

  const handleSaveFolder = (folderData: Omit<ProjectFolder, 'id' | 'projectIds'>) => {
    if (editingFolder) {
      updateFolder({ ...editingFolder, ...folderData });
    } else {
      addFolder(folderData);
    }
    setEditingFolder(null);
  };

  const handleSaveProject = (projectData: Omit<Project, 'id'>) => {
    if (editingProject) {
      updateProject({ ...editingProject, ...projectData });
      if (selectedProjectId === editingProject.id) {
        // Refresh selected project
        setSelectedProjectId(editingProject.id);
      }
    } else {
      addProject(projectData);
    }
    setEditingProject(null);
  };

  const handleAddTask = () => {
    if (!selectedProjectId || !newTaskInput.trim()) return;
    addTask(selectedProjectId, newTaskInput.trim());
    setNewTaskInput('');
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* ── Breadcrumb Header ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-8">
              <button
                onClick={() => { setSelectedFolderId(null); setSelectedProjectId(null); }}
                className={`flex items-center gap-2 transition-colors ${selectedFolder ? 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300' : 'text-slate-900 dark:text-slate-100 '}`}
              >
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-colors">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold">Projetos</span>
              </button>

              {selectedFolder && (
                <>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                  <button
                    onClick={() => setSelectedProjectId(null)}
                    className={`text-xl font-bold transition-colors ${selectedProject ? 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300' : 'text-slate-900 dark:text-slate-100'}`}
                  >
                    {selectedFolder.name}
                  </button>
                </>
              )}

              {selectedProject && (
                <>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedProject.name}</span>
                </>
              )}
            </div>

            {/* ── Project Detail View ────────────────────────────────────────── */}
            {selectedProject && (
              <div className="max-w-2xl">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 transition-colors">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          selectedProject.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                          selectedProject.status === 'Pausado' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                          'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}>{selectedProject.status}</span>
                        {selectedProject.dueDate && (
                          <span className="text-xs text-slate-400">
                            até {format(new Date(selectedProject.dueDate), "dd 'de' MMM yyyy", { locale: ptBR })}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-sm">{selectedProject.description}</p>
                    </div>
                    <button
                      onClick={() => { setEditingProject(selectedProject); setIsProjectModalOpen(true); }}
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      Editar
                    </button>
                  </div>

                  {/* Progress */}
                  {selectedProject.tasks.length > 0 && (() => {
                    const done = selectedProject.tasks.filter(t => t.completed).length;
                    const pct = Math.round((done / selectedProject.tasks.length) * 100);
                    return (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-slate-500">{done} / {selectedProject.tasks.length} tarefas concluídas</span>
                          <span className="text-xs font-bold text-slate-700">{pct}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                          <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })()}

                  {/* Tasks */}
                  <div>
                    <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-3">Tarefas</h3>
                    <div className="space-y-2 mb-4">
                      {selectedProject.tasks.map(task => (
                        <div key={task.id} className="flex items-center gap-3 group/task">
                          <button
                            onClick={() => toggleTask(selectedProject.id, task.id)}
                            className={`flex-shrink-0 transition-colors ${task.completed ? 'text-indigo-500' : 'text-slate-300 hover:text-slate-400'}`}
                          >
                            {task.completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                          </button>
                           <span className={`text-sm flex-1 transition-colors ${task.completed ? 'line-through text-slate-400 dark:text-slate-600' : 'text-slate-800 dark:text-slate-200'}`}>
                            {task.title}
                          </span>
                          <button
                            onClick={() => deleteTask(selectedProject.id, task.id)}
                            className="opacity-0 group-hover/task:opacity-100 p-1 text-slate-300 hover:text-red-500 rounded transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                        <input
                        type="text"
                        value={newTaskInput}
                        onChange={(e) => setNewTaskInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                        placeholder="Adicionar tarefa..."
                        className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 dark:focus:border-indigo-500/50 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all"
                      />
                      <button
                        onClick={handleAddTask}
                        disabled={!newTaskInput.trim()}
                        className="px-3 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Folder's Projects Grid ─────────────────────────────────────── */}
            {selectedFolder && !selectedProject && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-slate-500 text-sm">{selectedFolder.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedFolder.projectIds.length} {selectedFolder.projectIds.length === 1 ? 'projeto' : 'projetos'}
                    </p>
                  </div>
                  <button
                    onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20"
                  >
                    <Plus className="w-4 h-4" /> Novo Projeto
                  </button>
                </div>

                {selectedFolder.projectIds.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                      <Briefcase className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Nenhum projeto ainda</p>
                    <p className="text-slate-400 dark:text-slate-600 text-sm">Crie o primeiro projeto desta pasta.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {selectedFolder.projectIds.map(pid => {
                      const project = data.projects[pid];
                      if (!project) return null;
                      return (
                        <ProjectCard
                          key={pid}
                          project={project}
                          onClick={() => setSelectedProjectId(pid)}
                          onEdit={() => { setEditingProject(project); setIsProjectModalOpen(true); }}
                          onDelete={() => {
                            if (confirm('Excluir este projeto?')) {
                              deleteProject(pid, selectedFolderId!);
                            }
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* ── Folders Grid ───────────────────────────────────────────────── */}
            {!selectedFolder && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-slate-500 text-sm">Organize seus projetos de marketing em pastas temáticas.</p>
                  <button
                    onClick={() => { setEditingFolder(null); setIsFolderModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20"
                  >
                    <Plus className="w-4 h-4" /> Nova Pasta
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {data.folderOrder.map(fid => {
                    const folder = data.folders[fid];
                    if (!folder) return null;
                    return (
                      <FolderCard
                        key={fid}
                        folder={folder}
                        projectCount={folder.projectIds.length}
                        onClick={() => { setSelectedFolderId(fid); setSelectedProjectId(null); }}
                        onEdit={() => { setEditingFolder(folder); setIsFolderModalOpen(true); }}
                        onDelete={() => {
                          if (confirm(`Excluir a pasta "${folder.name}" e todos os seus projetos?`)) {
                            deleteFolder(fid);
                          }
                        }}
                      />
                    );
                  })}
                </div>
              </>
            )}
      <CreateFolderModal
        isOpen={isFolderModalOpen}
        existing={editingFolder}
        onClose={() => { setIsFolderModalOpen(false); setEditingFolder(null); }}
        onSave={handleSaveFolder}
      />

      <CreateProjectModal
        isOpen={isProjectModalOpen}
        folderId={selectedFolderId || ''}
        existing={editingProject}
        onClose={() => { setIsProjectModalOpen(false); setEditingProject(null); }}
        onSave={handleSaveProject}
      />
    </>
  );
}
