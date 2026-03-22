export type Priority = 'Baixa' | 'Média' | 'Alta' | 'Urgente';
export type FunnelStage = 'Topo' | 'Meio' | 'Fundo';
export type TaskType = 'Campanha de Tráfego' | 'Post para Instagram' | 'Landing Page' | 'E-mail Marketing' | 'Conteúdo Blog' | 'Vídeo YouTube';
export type Channel = 'Facebook Ads' | 'Google Ads' | 'Instagram' | 'YouTube' | 'WhatsApp' | 'E-mail' | 'LinkedIn' | 'TikTok';

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Tag {
  id: string;
  text: string;
  colorBg: string;
  colorText: string;
}

export interface Card {
  id: string;
  title: string;
  type: TaskType;
  channel: Channel;
  owner: User;
  priority: Priority;
  dueDate: string;
  tags: string[]; // array of tag IDs
  funnelStage: FunnelStage;
  effort: 'P' | 'M' | 'G';
  description: string;
  status: string; // columnId
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
  color?: string;
}

export interface Board {
  cards: Record<string, Card>;
  columns: Record<string, Column>;
  columnOrder: string[];
  availableTags: Tag[];
}

// ---- Projects Feature ----

export type FolderColor = 'indigo' | 'violet' | 'rose' | 'amber' | 'emerald' | 'sky' | 'orange' | 'teal';

export interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Ativo' | 'Pausado' | 'Concluído';
  dueDate: string;
  folderId: string;
  tasks: ProjectTask[];
}

export interface ProjectFolder {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  color: FolderColor;
  projectIds: string[];
}

export interface ProjectsData {
  folders: Record<string, ProjectFolder>;
  projects: Record<string, Project>;
  folderOrder: string[];
}

