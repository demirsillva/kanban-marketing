'use client';

import { useState } from 'react';
import { Dock } from '@/components/Dock';
import { TopBar } from '@/components/TopBar';
import {
  Users, TrendingUp, CheckCircle2, Clock, AlertCircle,
  MoreHorizontal, Search, Filter, ChevronDown,
  Zap, Star, Eye, MessageSquare, Calendar,
  BarChart3, ArrowUp, ArrowDown, Minus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

// ── Mock Data ─────────────────────────────────────────────────────────────────

interface Task {
  id: string;
  title: string;
  stage: 'todo' | 'doing' | 'review' | 'done';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  label: string;
  labelColor: string;
}

interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  tasksTotal: number;
  tasksDone: number;
  tasksLate: number;
  tasksInProgress: number;
  productivityTrend: 'up' | 'down' | 'stable';
  productivityDelta: number;
  lastActive: string;
  activeTasks: Task[];
  weekActivity: number[]; // 7 days
}

const MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Ana Silva',
    role: 'Designer',
    avatar: 'https://picsum.photos/seed/ana/100/100',
    status: 'online',
    tasksTotal: 14,
    tasksDone: 9,
    tasksLate: 1,
    tasksInProgress: 4,
    productivityTrend: 'up',
    productivityDelta: 12,
    lastActive: 'Agora',
    weekActivity: [3, 5, 4, 6, 5, 2, 4],
    activeTasks: [
      { id: 't1', title: 'Criação de banners Black Friday', stage: 'doing', priority: 'high', dueDate: '18/03', label: 'Design', labelColor: '#818cf8' },
      { id: 't2', title: 'Motion para Stories do Instagram', stage: 'review', priority: 'medium', dueDate: '20/03', label: 'Social', labelColor: '#34d399' },
      { id: 't3', title: 'Identidade visual campanha Verão', stage: 'todo', priority: 'low', dueDate: '25/03', label: 'Branding', labelColor: '#f59e0b' },
    ],
  },
  {
    id: '2',
    name: 'Bruno Costa',
    role: 'Copywriter',
    avatar: 'https://picsum.photos/seed/bruno/100/100',
    status: 'online',
    tasksTotal: 11,
    tasksDone: 6,
    tasksLate: 0,
    tasksInProgress: 5,
    productivityTrend: 'stable',
    productivityDelta: 0,
    lastActive: 'há 5 min',
    weekActivity: [4, 4, 3, 5, 4, 3, 5],
    activeTasks: [
      { id: 't4', title: 'Roteiro vídeo institucional', stage: 'doing', priority: 'high', dueDate: '19/03', label: 'Vídeo', labelColor: '#f87171' },
      { id: 't5', title: 'Copy campanha e-mail mkt', stage: 'review', priority: 'medium', dueDate: '21/03', label: 'E-mail', labelColor: '#60a5fa' },
    ],
  },
  {
    id: '3',
    name: 'Carla Souza',
    role: 'Gestora de Tráfego',
    avatar: 'https://picsum.photos/seed/carla/100/100',
    status: 'away',
    tasksTotal: 9,
    tasksDone: 3,
    tasksLate: 2,
    tasksInProgress: 4,
    productivityTrend: 'down',
    productivityDelta: -8,
    lastActive: 'há 2h',
    weekActivity: [5, 3, 2, 4, 2, 1, 3],
    activeTasks: [
      { id: 't6', title: 'Configurar campanha Meta Ads', stage: 'doing', priority: 'high', dueDate: '17/03', label: 'Tráfego', labelColor: '#a78bfa' },
      { id: 't7', title: 'Relatório ROAS semanal', stage: 'todo', priority: 'medium', dueDate: '22/03', label: 'Relatório', labelColor: '#6ee7b7' },
      { id: 't8', title: 'Otimizar público Google Ads', stage: 'doing', priority: 'high', dueDate: '17/03', label: 'Tráfego', labelColor: '#a78bfa' },
    ],
  },
  {
    id: '4',
    name: 'Diego Martins',
    role: 'Analista de Conteúdo',
    avatar: 'https://picsum.photos/seed/diego/100/100',
    status: 'online',
    tasksTotal: 16,
    tasksDone: 13,
    tasksLate: 0,
    tasksInProgress: 3,
    productivityTrend: 'up',
    productivityDelta: 22,
    lastActive: 'Agora',
    weekActivity: [6, 7, 6, 8, 7, 5, 7],
    activeTasks: [
      { id: 't9', title: 'Calendário editorial Abril', stage: 'review', priority: 'medium', dueDate: '23/03', label: 'Conteúdo', labelColor: '#fbbf24' },
      { id: 't10', title: 'Blog post: tendências 2025', stage: 'doing', priority: 'low', dueDate: '26/03', label: 'Blog', labelColor: '#34d399' },
    ],
  },
  {
    id: '5',
    name: 'Elena Ferreira',
    role: 'Social Media',
    avatar: 'https://picsum.photos/seed/elena/100/100',
    status: 'offline',
    tasksTotal: 12,
    tasksDone: 7,
    tasksLate: 1,
    tasksInProgress: 4,
    productivityTrend: 'up',
    productivityDelta: 5,
    lastActive: 'há 4h',
    weekActivity: [3, 4, 5, 4, 6, 2, 4],
    activeTasks: [
      { id: 't11', title: 'Posts feed Instagram (10 posts)', stage: 'doing', priority: 'high', dueDate: '19/03', label: 'Social', labelColor: '#34d399' },
      { id: 't12', title: 'Story quiz enquete', stage: 'todo', priority: 'medium', dueDate: '20/03', label: 'Social', labelColor: '#34d399' },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const STAGE_CONFIG = {
  todo:    { label: 'A fazer',     color: 'bg-slate-200 text-slate-700' },
  doing:   { label: 'Em andamento', color: 'bg-blue-100 text-blue-700' },
  review:  { label: 'Em revisão',  color: 'bg-amber-100 text-amber-700' },
  done:    { label: 'Concluído',   color: 'bg-emerald-100 text-emerald-700' },
};

const PRIORITY_CONFIG = {
  high:   { label: 'Alta',  dot: 'bg-red-500' },
  medium: { label: 'Média', dot: 'bg-amber-500' },
  low:    { label: 'Baixa', dot: 'bg-slate-400' },
};

const STATUS_CONFIG = {
  online:  { color: 'bg-emerald-500', label: 'Online' },
  away:    { color: 'bg-amber-400',   label: 'Ausente' },
  offline: { color: 'bg-slate-300',   label: 'Offline' },
};

function MiniBar({ value, max = 8 }: { value: number; max?: number }) {
  return (
    <div className="flex items-end gap-0.5 h-6">
      {[...Array(7)].map((_, i) => {
        const days = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
        return (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <div
              className="w-2 bg-indigo-400 rounded-sm"
              style={{ height: `${Math.max(2, (value / max) * 20)}px`, opacity: 0.5 + (value / max) * 0.5 }}
            />
          </div>
        );
      })}
    </div>
  );
}

function ActivityBars({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const days = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
  return (
    <div className="flex items-end gap-1 h-10">
      {data.map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full bg-indigo-500 rounded-sm transition-all"
            style={{ height: `${Math.max(3, (v / max) * 32)}px` }}
          />
          <span className="text-[9px] text-slate-400 font-medium">{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ── Member Card ───────────────────────────────────────────────────────────────

function MemberCard({ member, onClick, isSelected }: { member: Member; onClick: () => void; isSelected: boolean }) {
  const progress = Math.round((member.tasksDone / member.tasksTotal) * 100);
  const TrendIcon = member.productivityTrend === 'up' ? ArrowUp : member.productivityTrend === 'down' ? ArrowDown : Minus;
  const trendColor = member.productivityTrend === 'up' ? 'text-emerald-600' : member.productivityTrend === 'down' ? 'text-red-500' : 'text-slate-400';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border-2 shadow-sm cursor-pointer transition-all overflow-hidden',
        isSelected ? 'border-indigo-500 shadow-lg shadow-indigo-100' : 'border-slate-100 hover:border-indigo-200 hover:shadow-md'
      )}
    >
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={member.avatar} alt={member.name} className="w-11 h-11 rounded-xl object-cover border border-slate-100" />
              <span className={cn('absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white', STATUS_CONFIG[member.status].color)} />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm leading-tight">{member.name}</p>
              <p className="text-xs text-slate-500">{member.role}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{member.lastActive}</p>
            </div>
          </div>
          <div className={cn('flex items-center gap-0.5 text-xs font-bold', trendColor)}>
            <TrendIcon className="w-3 h-3" />
            {member.productivityTrend !== 'stable' && `${Math.abs(member.productivityDelta)}%`}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-slate-50 rounded-xl p-2.5 text-center">
            <p className="text-lg font-bold text-slate-900 leading-none">{member.tasksDone}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Concluídas</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-2.5 text-center">
            <p className="text-lg font-bold text-blue-700 leading-none">{member.tasksInProgress}</p>
            <p className="text-[10px] text-blue-600 mt-0.5">Em andamento</p>
          </div>
          <div className={cn('rounded-xl p-2.5 text-center', member.tasksLate > 0 ? 'bg-red-50' : 'bg-slate-50')}>
            <p className={cn('text-lg font-bold leading-none', member.tasksLate > 0 ? 'text-red-600' : 'text-slate-400')}>{member.tasksLate}</p>
            <p className={cn('text-[10px] mt-0.5', member.tasksLate > 0 ? 'text-red-500' : 'text-slate-400')}>Atrasadas</p>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Progresso</span>
            <span className="text-xs font-bold text-indigo-600">{progress}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
            />
          </div>
        </div>

        {/* Weekly activity */}
        <div className="mt-4">
          <ActivityBars data={member.weekActivity} />
        </div>
      </div>

      {isSelected && (
        <div className="bg-indigo-600 text-white text-[10px] font-bold text-center py-1.5 tracking-wider uppercase">
          Ver detalhes ↓
        </div>
      )}
    </motion.div>
  );
}

// ── Member Detail Panel ───────────────────────────────────────────────────────

function MemberDetail({ member }: { member: Member }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 flex items-center gap-5">
        <div className="relative">
          <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30" />
          <span className={cn('absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white', STATUS_CONFIG[member.status].color)} />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-xl">{member.name}</h3>
          <p className="text-white/70 text-sm">{member.role}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1.5 text-white/80 text-xs">
              <span className={cn('w-2 h-2 rounded-full', STATUS_CONFIG[member.status].color)} />
              {STATUS_CONFIG[member.status].label}
            </span>
            <span className="text-white/50 text-xs">• Última atividade: {member.lastActive}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-4xl font-black text-white">{Math.round((member.tasksDone / member.tasksTotal) * 100)}%</p>
          <p className="text-white/70 text-xs">produtividade</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total de tarefas', value: member.tasksTotal, color: 'text-slate-900', bg: 'bg-slate-50' },
            { label: 'Concluídas', value: member.tasksDone, color: 'text-emerald-700', bg: 'bg-emerald-50' },
            { label: 'Em andamento', value: member.tasksInProgress, color: 'text-blue-700', bg: 'bg-blue-50' },
            { label: 'Atrasadas', value: member.tasksLate, color: member.tasksLate > 0 ? 'text-red-600' : 'text-slate-400', bg: member.tasksLate > 0 ? 'bg-red-50' : 'bg-slate-50' },
          ].map(stat => (
            <div key={stat.label} className={cn('rounded-xl p-4 text-center', stat.bg)}>
              <p className={cn('text-2xl font-black', stat.color)}>{stat.value}</p>
              <p className="text-[11px] text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Active tasks */}
        <div>
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-3">Tarefas Ativas</h4>
          <div className="space-y-2">
            {member.activeTasks.map(task => {
              const stage = STAGE_CONFIG[task.stage];
              const priority = PRIORITY_CONFIG[task.priority];
              return (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <span className={cn('w-2 h-2 rounded-full flex-shrink-0', priority.dot)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: task.labelColor + '20', color: task.labelColor }}>{task.label}</span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-500"><Calendar className="w-3 h-3" />{task.dueDate}</span>
                    </div>
                  </div>
                  <span className={cn('text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0', stage.color)}>{stage.label}</span>
                </div>
              );
            })}
            {member.activeTasks.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">Nenhuma tarefa ativa no momento.</p>
            )}
          </div>
        </div>

        {/* Weekly activity chart */}
        <div>
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-3">Atividade — Últimos 7 dias</h4>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-end gap-2 h-16">
              {member.weekActivity.map((v, i) => {
                const max = Math.max(...member.weekActivity, 1);
                const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-[10px] font-bold text-indigo-600">{v}</span>
                    <div className="w-full bg-indigo-500/20 rounded-md overflow-hidden" style={{ height: 40 }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(v / max) * 100}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                        className="w-full bg-gradient-to-t from-indigo-500 to-violet-400 rounded-md mt-auto"
                        style={{ marginTop: 'auto' }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-400">{days[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'away' | 'offline'>('all');

  const filtered = MEMBERS.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalTasks = MEMBERS.reduce((acc, m) => acc + m.tasksTotal, 0);
  const doneTasks = MEMBERS.reduce((acc, m) => acc + m.tasksDone, 0);
  const lateTasks = MEMBERS.reduce((acc, m) => acc + m.tasksLate, 0);
  const onlineCount = MEMBERS.filter(m => m.status === 'online').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-28">
      <div className="flex flex-col min-w-0">
        <TopBar />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Equipe</h1>
                  <p className="text-slate-500 text-sm">Visão geral da produtividade e tarefas da equipe.</p>
                </div>
              </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Membros online', value: onlineCount, total: MEMBERS.length, icon: Users, color: 'from-indigo-500 to-violet-600' },
                { label: 'Tarefas totais', value: totalTasks, icon: BarChart3, color: 'from-blue-500 to-cyan-600' },
                { label: 'Concluídas', value: doneTasks, icon: CheckCircle2, color: 'from-emerald-500 to-teal-600' },
                { label: 'Atrasadas', value: lateTasks, icon: AlertCircle, color: 'from-red-500 to-rose-600' },
              ].map(kpi => {
                const Icon = kpi.icon;
                return (
                  <div key={kpi.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-900 leading-none">
                        {kpi.value}{kpi.total ? <span className="text-base font-semibold text-slate-400">/{kpi.total}</span> : ''}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{kpi.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar membro..."
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                />
              </div>
              <div className="flex gap-1.5 bg-white border border-slate-200 rounded-xl p-1">
                {[
                  { id: 'all',     label: 'Todos' },
                  { id: 'online',  label: 'Online' },
                  { id: 'away',    label: 'Ausente' },
                  { id: 'offline', label: 'Offline' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setStatusFilter(f.id as any)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                      statusFilter === f.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main content: cards + detail */}
            <div className="flex gap-6">
              {/* Member Cards Grid */}
              <div className={cn('grid gap-4 content-start', selectedMember ? 'grid-cols-1 lg:grid-cols-2 w-full lg:w-auto flex-shrink-0' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 w-full')}>
                {filtered.map(member => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    isSelected={selectedMember?.id === member.id}
                    onClick={() => setSelectedMember(prev => prev?.id === member.id ? null : member)}
                  />
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-full text-center py-12 text-slate-400 text-sm">
                    Nenhum membro encontrado.
                  </div>
                )}
              </div>

              {/* Detail Panel */}
              <AnimatePresence>
                {selectedMember && (
                  <div className="flex-1 min-w-0 hidden lg:block">
                    <MemberDetail member={selectedMember} />
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile detail panel */}
            <AnimatePresence>
              {selectedMember && (
                <div className="mt-6 lg:hidden">
                  <MemberDetail member={selectedMember} />
                </div>
              )}
            </AnimatePresence>

          </div>
        </main>
      </div>
      <Dock />
    </div>
  );
}
