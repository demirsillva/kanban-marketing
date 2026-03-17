'use client';

import { useState, useEffect } from 'react';
import { ProjectsData, ProjectFolder, Project, ProjectTask } from '@/types/kanban';
import { INITIAL_PROJECTS_DATA } from '@/lib/mock-data';

const STORAGE_KEY = 'kanban-marketing-projects';

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useProjects() {
  const [data, setData] = useState<ProjectsData>(INITIAL_PROJECTS_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  // ── Folders ──────────────────────────────────────────────────────────
  const addFolder = (folder: Omit<ProjectFolder, 'id' | 'projectIds'>) => {
    const id = `folder-${generateId()}`;
    const newFolder: ProjectFolder = { ...folder, id, projectIds: [] };
    setData(prev => ({
      ...prev,
      folders: { ...prev.folders, [id]: newFolder },
      folderOrder: [...prev.folderOrder, id],
    }));
    return id;
  };

  const updateFolder = (folder: ProjectFolder) => {
    setData(prev => ({
      ...prev,
      folders: { ...prev.folders, [folder.id]: folder },
    }));
  };

  const deleteFolder = (folderId: string) => {
    setData(prev => {
      const folder = prev.folders[folderId];
      if (!folder) return prev;
      const newProjects = { ...prev.projects };
      folder.projectIds.forEach(pid => delete newProjects[pid]);
      const newFolders = { ...prev.folders };
      delete newFolders[folderId];
      return {
        ...prev,
        folders: newFolders,
        projects: newProjects,
        folderOrder: prev.folderOrder.filter(id => id !== folderId),
      };
    });
  };

  // ── Projects ──────────────────────────────────────────────────────────
  const addProject = (project: Omit<Project, 'id'>) => {
    const id = `proj-${generateId()}`;
    const newProject: Project = { ...project, id };
    setData(prev => ({
      ...prev,
      projects: { ...prev.projects, [id]: newProject },
      folders: {
        ...prev.folders,
        [project.folderId]: {
          ...prev.folders[project.folderId],
          projectIds: [...prev.folders[project.folderId].projectIds, id],
        },
      },
    }));
    return id;
  };

  const updateProject = (project: Project) => {
    setData(prev => ({
      ...prev,
      projects: { ...prev.projects, [project.id]: project },
    }));
  };

  const deleteProject = (projectId: string, folderId: string) => {
    setData(prev => {
      const newProjects = { ...prev.projects };
      delete newProjects[projectId];
      return {
        ...prev,
        projects: newProjects,
        folders: {
          ...prev.folders,
          [folderId]: {
            ...prev.folders[folderId],
            projectIds: prev.folders[folderId].projectIds.filter(id => id !== projectId),
          },
        },
      };
    });
  };

  // ── Tasks ─────────────────────────────────────────────────────────────
  const toggleTask = (projectId: string, taskId: string) => {
    setData(prev => {
      const project = prev.projects[projectId];
      if (!project) return prev;
      return {
        ...prev,
        projects: {
          ...prev.projects,
          [projectId]: {
            ...project,
            tasks: project.tasks.map(t =>
              t.id === taskId ? { ...t, completed: !t.completed } : t
            ),
          },
        },
      };
    });
  };

  const addTask = (projectId: string, title: string) => {
    setData(prev => {
      const project = prev.projects[projectId];
      if (!project) return prev;
      const task: ProjectTask = { id: `task-${generateId()}`, title, completed: false };
      return {
        ...prev,
        projects: {
          ...prev.projects,
          [projectId]: { ...project, tasks: [...project.tasks, task] },
        },
      };
    });
  };

  const deleteTask = (projectId: string, taskId: string) => {
    setData(prev => {
      const project = prev.projects[projectId];
      if (!project) return prev;
      return {
        ...prev,
        projects: {
          ...prev.projects,
          [projectId]: {
            ...project,
            tasks: project.tasks.filter(t => t.id !== taskId),
          },
        },
      };
    });
  };

  return {
    data,
    isLoaded,
    addFolder,
    updateFolder,
    deleteFolder,
    addProject,
    updateProject,
    deleteProject,
    toggleTask,
    addTask,
    deleteTask,
  };
}
