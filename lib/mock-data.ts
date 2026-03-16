import { Board, User } from '@/types/kanban';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Ana Silva', avatar: 'https://picsum.photos/seed/ana/100/100' },
  { id: 'u2', name: 'Bruno Costa', avatar: 'https://picsum.photos/seed/bruno/100/100' },
  { id: 'u3', name: 'Carla Souza', avatar: 'https://picsum.photos/seed/carla/100/100' },
];

export const INITIAL_DATA: Board = {
  cards: {
    'card-1': {
      id: 'card-1',
      title: 'Campanha Black Friday - Facebook',
      type: 'Campanha de Tráfego',
      channel: 'Facebook Ads',
      owner: MOCK_USERS[0],
      priority: 'Crítica',
      dueDate: new Date().toISOString().split('T')[0], // Hoje
      tags: ['Lançamento', 'Pago'],
      funnelStage: 'Fundo',
      effort: 'G',
      description: 'Configurar conjuntos de anúncios para o público de remarketing.',
      status: 'col-2',
    },
    'card-2': {
      id: 'card-2',
      title: 'Post Carrossel: Dicas de SEO',
      type: 'Post para Instagram',
      channel: 'Instagram',
      owner: MOCK_USERS[1],
      priority: 'Média',
      dueDate: '2026-03-25',
      tags: ['Orgânico', 'Always On'],
      funnelStage: 'Topo',
      effort: 'M',
      description: 'Criar artes no Canva e legenda focada em engajamento.',
      status: 'col-1',
    },
    'card-3': {
      id: 'card-3',
      title: 'Landing Page - Webinar Março',
      type: 'Landing Page',
      channel: 'Google Ads',
      owner: MOCK_USERS[2],
      priority: 'Alta',
      dueDate: '2026-03-20',
      tags: ['Lançamento'],
      funnelStage: 'Meio',
      effort: 'G',
      description: 'Desenvolver a LP de captura para o evento ao vivo.',
      status: 'col-3',
    },
    'card-4': {
      id: 'card-4',
      title: 'Newsletter Semanal - Novidades',
      type: 'E-mail Marketing',
      channel: 'E-mail',
      owner: MOCK_USERS[0],
      priority: 'Baixa',
      dueDate: '2026-03-18',
      tags: ['Always On'],
      funnelStage: 'Meio',
      effort: 'P',
      description: 'Redigir o conteúdo da news e programar o envio.',
      status: 'col-5',
    },
  },
  columns: {
    'col-1': {
      id: 'col-1',
      title: 'Backlog',
      cardIds: ['card-2'],
    },
    'col-2': {
      id: 'col-2',
      title: 'A Fazer',
      cardIds: ['card-1'],
    },
    'col-3': {
      id: 'col-3',
      title: 'Em Progresso',
      cardIds: ['card-3'],
    },
    'col-4': {
      id: 'col-4',
      title: 'Em Revisão',
      cardIds: [],
    },
    'col-5': {
      id: 'col-5',
      title: 'Concluído',
      cardIds: ['card-4'],
    },
  },
  columnOrder: ['col-1', 'col-2', 'col-3', 'col-4', 'col-5'],
};
