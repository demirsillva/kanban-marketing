export type Priority = 'Baixa' | 'Média' | 'Alta' | 'Crítica';
export type FunnelStage = 'Topo' | 'Meio' | 'Fundo';
export type TaskType = 'Campanha de Tráfego' | 'Post para Instagram' | 'Landing Page' | 'E-mail Marketing' | 'Conteúdo Blog' | 'Vídeo YouTube';
export type Channel = 'Facebook Ads' | 'Google Ads' | 'Instagram' | 'YouTube' | 'WhatsApp' | 'E-mail' | 'LinkedIn' | 'TikTok';

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Card {
  id: string;
  title: string;
  type: TaskType;
  channel: Channel;
  owner: User;
  priority: Priority;
  dueDate: string;
  tags: string[];
  funnelStage: FunnelStage;
  effort: 'P' | 'M' | 'G';
  description: string;
  status: string; // columnId
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface Board {
  cards: Record<string, Card>;
  columns: Record<string, Column>;
  columnOrder: string[];
}
