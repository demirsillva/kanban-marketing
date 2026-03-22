'use client';

import { useState, useEffect, useRef } from 'react';
import {
  BarChart3, CheckCircle2, Clock, AlertCircle, TrendingUp,
  Sparkles, PenLine, Save, Copy, Trash2, ChevronDown,
  Calendar, ArrowUp, ArrowDown, FileText, RefreshCw,
  CheckCheck, X, Plus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

type Period = 'today' | 'week' | 'month' | 'custom';
type ReportMode = 'manual' | 'ai';

interface SavedReport {
  id: string;
  title: string;
  period: string;
  content: string;
  createdAt: string;
  mode: ReportMode;
}

// ── Mock Data per Period ──────────────────────────────────────────────────────

const PERIOD_DATA: Record<string, {
  done: number; inProgress: number; late: number; total: number;
  productivity: number; trendDir: 'up' | 'down'; trendPct: number;
  barData: { label: string; value: number }[];
  stageData: { stage: string; count: number; color: string }[];
  recentTasks: { title: string; label: string; labelColor: string; completedAt: string; done: boolean }[];
}> = {
  today: {
    done: 4, inProgress: 3, late: 1, total: 8,
    productivity: 50, trendDir: 'up', trendPct: 8,
    barData: [
      { label: '8h', value: 1 }, { label: '10h', value: 2 }, { label: '12h', value: 0 },
      { label: '14h', value: 3 }, { label: '16h', value: 2 }, { label: '18h', value: 1 },
    ],
    stageData: [
      { stage: 'Concluído', count: 4, color: '#10b981' },
      { stage: 'Em andamento', count: 3, color: '#3b82f6' },
      { stage: 'A fazer', count: 0, color: '#94a3b8' },
      { stage: 'Em revisão', count: 1, color: '#f59e0b' },
    ],
    recentTasks: [
      { title: 'Banners Black Friday', label: 'Design', labelColor: '#818cf8', completedAt: '09:15', done: true },
      { title: 'Copy anúncio Meta', label: 'Copy', labelColor: '#34d399', completedAt: '11:30', done: true },
      { title: 'Configurar UTMs campanha', label: 'Tráfego', labelColor: '#f87171', completedAt: '', done: false },
      { title: 'Roteiro vídeo tutorial', label: 'Vídeo', labelColor: '#fbbf24', completedAt: '14:00', done: true },
      { title: 'Relatório ROAS', label: 'Dados', labelColor: '#60a5fa', completedAt: '16:45', done: true },
    ],
  },
  week: {
    done: 22, inProgress: 8, late: 3, total: 33,
    productivity: 67, trendDir: 'up', trendPct: 12,
    barData: [
      { label: 'Seg', value: 5 }, { label: 'Ter', value: 7 }, { label: 'Qua', value: 4 },
      { label: 'Qui', value: 6 }, { label: 'Sex', value: 4 }, { label: 'Sáb', value: 1 },
    ],
    stageData: [
      { stage: 'Concluído', count: 22, color: '#10b981' },
      { stage: 'Em andamento', count: 8, color: '#3b82f6' },
      { stage: 'A fazer', count: 0, color: '#94a3b8' },
      { stage: 'Em revisão', count: 3, color: '#f59e0b' },
    ],
    recentTasks: [
      { title: 'Calendário editorial Abril', label: 'Conteúdo', labelColor: '#a78bfa', completedAt: 'Seg', done: true },
      { title: 'Campanha Google Ads', label: 'Tráfego', labelColor: '#f87171', completedAt: 'Ter', done: true },
      { title: 'Blog post tendências 2025', label: 'Blog', labelColor: '#34d399', completedAt: 'Qua', done: true },
      { title: 'Relatório mensal cliente', label: 'Dados', labelColor: '#60a5fa', completedAt: '', done: false },
      { title: 'Motion Stories Instagram', label: 'Social', labelColor: '#fbbf24', completedAt: 'Qui', done: true },
      { title: 'Otimização landing page', label: 'Web', labelColor: '#818cf8', completedAt: 'Sex', done: true },
    ],
  },
  month: {
    done: 87, inProgress: 14, late: 5, total: 106,
    productivity: 82, trendDir: 'up', trendPct: 18,
    barData: [
      { label: 'S1', value: 18 }, { label: 'S2', value: 24 }, { label: 'S3', value: 21 },
      { label: 'S4', value: 24 },
    ],
    stageData: [
      { stage: 'Concluído', count: 87, color: '#10b981' },
      { stage: 'Em andamento', count: 14, color: '#3b82f6' },
      { stage: 'A fazer', count: 0, color: '#94a3b8' },
      { stage: 'Em revisão', count: 5, color: '#f59e0b' },
    ],
    recentTasks: [
      { title: 'Lançamento produto XYZ', label: 'Campanha', labelColor: '#818cf8', completedAt: 'S1', done: true },
      { title: 'Rebranding identidade gráfica', label: 'Design', labelColor: '#f87171', completedAt: 'S2', done: true },
      { title: 'Estratégia conteúdo Q2', label: 'Estratégia', labelColor: '#34d399', completedAt: 'S3', done: true },
      { title: 'Integração CRM-Marketing', label: 'Tech', labelColor: '#60a5fa', completedAt: '', done: false },
      { title: 'Campanha influenciadores', label: 'Social', labelColor: '#fbbf24', completedAt: 'S3', done: true },
    ],
  },
};

// ── AI Report Templates ────────────────────────────────────────────────────────

function generateAIReport(period: Period, data: typeof PERIOD_DATA['today'], customTitle?: string): string {
  const periodLabel = period === 'today' ? 'de hoje' : period === 'week' ? 'desta semana' : period === 'month' ? 'deste mês' : 'do período selecionado';
  const doneTasks = data.recentTasks.filter(t => t.done).map(t => `- **${t.title}** (${t.label})`).join('\n');
  const pendingTasks = data.recentTasks.filter(t => !t.done).map(t => `- **${t.title}** (${t.label})`).join('\n');

  return `## Relatório ${periodLabel.charAt(0).toUpperCase() + periodLabel.slice(1)}
*Gerado por IA em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}*

---

### 📊 Resumo Executivo

${period === 'today' ? `Ao longo do dia de hoje, a equipe manteve um ritmo produtivo com **${data.done} tarefas concluídas** de um total de **${data.total} tarefas**. O índice de produtividade ficou em **${data.productivity}%**, representando uma melhora de **${data.trendPct}%** em relação ao dia anterior.` : period === 'week' ? `Esta semana foi marcada por alta entrega e colaboração entre as áreas. Com **${data.done} tarefas concluídas**, o time manteve um ritmo consistente ao longo dos dias úteis. O índice de produtividade semanal atingiu **${data.productivity}%**, **${data.trendPct}% acima** da semana anterior.` : `O mês apresentou resultados sólidos, com **${data.done} entregas realizadas** de um total de **${data.total} tarefas planejadas**. A produtividade mensal chegou a **${data.productivity}%**, superando em **${data.trendPct}%** o mês anterior — o melhor resultado do trimestre.`}

---

### ✅ Atividades Concluídas${doneTasks ? `\n\n${doneTasks}` : '\n\nNenhuma atividade concluída neste período.'}

---

### ⏳ Pendências e Próximos Passos${pendingTasks ? `\n\n${pendingTasks}\n\nEssas atividades devem ter atenção prioritária no próximo período para evitar atrasos no planejamento geral.` : '\n\nNenhuma pendência crítica identificada.'}

---

### 🎯 Pontos de Atenção

${data.late > 0 ? `- ⚠️ **${data.late} tarefa(s) atrasada(s)** foram identificadas — recomenda-se revisão de prazos e redistribuição de carga.` : '- ✅ Nenhuma tarefa atrasada no período — excelente controle de prazos!'}
- 🔄 **${data.inProgress} tarefa(s) em andamento** seguem para o próximo período.
- 📈 Tendência de produtividade: **${data.trendDir === 'up' ? `alta de ${data.trendPct}%` : `queda de ${data.trendPct}%`}** vs. período anterior.

---

### 💡 Recomendação IA

${data.productivity >= 80 ? 'O desempenho está acima da média esperada. Mantenha o ritmo e considere documentar os processos que estão funcionando para replicar nas próximas semanas.' : data.productivity >= 60 ? 'Desempenho satisfatório, mas há espaço para melhorias. Identifique gargalos nas tarefas em andamento e priorize as que estão próximas do prazo.' : 'Atenção redobrada necessária. Recomenda-se uma reunião de alinhamento para redistribuir tarefas e reavaliar prazos das atividades em atraso.'}
`;
}

// ── Bar Chart (SVG) ───────────────────────────────────────────────────────────

function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-32 pt-2">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
          <span className="text-[10px] font-bold text-indigo-600">{d.value}</span>
          <div className="w-full bg-indigo-100 dark:bg-slate-800 rounded-lg overflow-hidden flex flex-col justify-end transition-colors" style={{ height: 90 }}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: 'easeOut' }}
              className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-lg"
            />
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Donut Chart ───────────────────────────────────────────────────────────────

function DonutChart({ data }: { data: { stage: string; count: number; color: string }[] }) {
  const total = data.reduce((a, d) => a + d.count, 0) || 1;
  let offset = 0;
  const r = 40;
  const circ = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-6">
      <svg width={100} height={100} viewBox="0 0 100 100">
        <circle cx={50} cy={50} r={r} fill="none" stroke="#f1f5f9" strokeWidth={16} />
        {data.map((d, i) => {
          const pct = d.count / total;
          const dash = pct * circ;
          const gap = circ - dash;
          const rotation = offset * 360 - 90;
          offset += pct;
          return (
            <circle
              key={i}
              cx={50} cy={50} r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={16}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={0}
              transform={`rotate(${rotation} 50 50)`}
              className="transition-all duration-700"
            />
          );
        })}
        <text x={50} y={54} textAnchor="middle" fontSize={14} fontWeight="bold" fill="currentColor" className="text-slate-900 dark:text-slate-100">{total}</text>
      </svg>
      <div className="space-y-1.5">
        {data.map((d) => (
          <div key={d.stage} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-slate-600 dark:text-slate-400 dark:text-slate-500">{d.stage}</span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 ml-auto pl-2">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'kanban-reports';

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>('week');
  const [reportMode, setReportMode] = useState<ReportMode>('manual');
  const [manualText, setManualText] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) setSavedReports(JSON.parse(s));
    } catch { /* ignore */ }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(savedReports));
  }, [savedReports, isLoaded]);

  const data = PERIOD_DATA[period === 'custom' ? 'month' : period];
  const periodLabel = { today: 'Hoje', week: 'Semana', month: 'Mês', custom: 'Personalizado' }[period];

  const handleGenerateAI = async () => {
    setAiLoading(true);
    setAiOutput('');
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    setAiOutput(generateAIReport(period, data));
    setAiLoading(false);
  };

  const currentContent = reportMode === 'manual' ? manualText : aiOutput;

  const handleSave = () => {
    if (!currentContent.trim()) return;
    const report: SavedReport = {
      id: Date.now().toString(),
      title: reportTitle.trim() || `Relatório — ${periodLabel} (${new Date().toLocaleDateString('pt-BR')})`,
      period: periodLabel,
      content: currentContent,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      mode: reportMode,
    };
    setSavedReports(prev => [report, ...prev]);
    setManualText('');
    setAiOutput('');
    setReportTitle('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setSavedReports(prev => prev.filter(r => r.id !== id));
    if (expandedReport === id) setExpandedReport(null);
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-colors">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Relatórios</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm">Acompanhe desempenho, métricas e gerencie seus reports de atividade.</p>
        </div>
      </div>

      {/* Period Tabs */}
      <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 w-fit shadow-sm transition-colors">
        {(['today', 'week', 'month', 'custom'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all',
              period === p ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-800/50'
            )}
          >
            <Calendar className="w-3.5 h-3.5" />
            {{ today: 'Hoje', week: 'Semana', month: 'Mês', custom: 'Personalizado' }[p]}
          </button>
        ))}
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Tarefas concluídas', value: data.done, icon: CheckCircle2, color: 'from-emerald-500 to-teal-600', bg: 'emerald' },
          { label: 'Em andamento', value: data.inProgress, icon: Clock, color: 'from-blue-500 to-cyan-600', bg: 'blue' },
          { label: 'Atrasadas', value: data.late, icon: AlertCircle, color: 'from-red-500 to-rose-600', bg: 'red' },
          { label: 'Total no período', value: data.total, icon: FileText, color: 'from-slate-500 to-slate-600', bg: 'slate' },
          {
            label: 'Produtividade',
            value: `${data.productivity}%`,
            icon: TrendingUp,
            color: 'from-indigo-500 to-violet-600',
            bg: 'indigo',
            trend: data.trendDir,
            trendPct: data.trendPct,
          },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                {'trend' in kpi && (
                  <div className={cn('flex items-center gap-0.5 text-xs font-bold', kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-500')}>
                    {kpi.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {kpi.trendPct}%
                  </div>
                )}
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-slate-100 leading-none">{kpi.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 transition-colors">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Atividade no Período</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-4">Tarefas concluídas por {period === 'today' ? 'hora' : period === 'week' ? 'dia' : 'semana'}</p>
          <BarChart data={data.barData} />
        </div>

        {/* Donut */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 transition-colors">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Por Estágio</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-4">Distribuição das tarefas</p>
          <DonutChart data={data.stageData} />
        </div>
      </div>

      {/* Recent tasks timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Atividades Recentes</h3>
        <div className="space-y-2">
          {data.recentTasks.map((task, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:bg-slate-800/50 transition-colors">
              <div className={cn('w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0', task.done ? 'bg-emerald-100 dark:bg-emerald-500/10' : 'bg-slate-100 dark:bg-slate-800')}>
                {task.done
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  : <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-semibold truncate', task.done ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400 dark:text-slate-500 line-through')}>{task.title}</p>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: task.labelColor + '20', color: task.labelColor }}>
                {task.label}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0 w-12 text-right">{task.completedAt || '—'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Report Generator ─────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Gerar Report</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">Escreva manualmente ou deixe a IA resumir suas atividades do período.</p>
            </div>
            {/* Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex-shrink-0">
              <button
                onClick={() => setReportMode('manual')}
                className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all', reportMode === 'manual' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:text-slate-300')}
              >
                <PenLine className="w-3.5 h-3.5" /> Manual
              </button>
              <button
                onClick={() => setReportMode('ai')}
                className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all', reportMode === 'ai' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:text-slate-300')}
              >
                <Sparkles className="w-3.5 h-3.5" /> IA
              </button>
            </div>
          </div>

          {/* Title input */}
          <input
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            placeholder={`Título do report — ex: Relatório ${periodLabel} ${new Date().toLocaleDateString('pt-BR')}`}
            className="mt-4 w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
          />
        </div>

        <div className="p-6 space-y-4">
          <AnimatePresence mode="wait">
            {/* Manual Mode */}
            {reportMode === 'manual' && (
              <motion.div key="manual" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                <textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder={`Descreva o que foi feito ${period === 'today' ? 'hoje' : period === 'week' ? 'esta semana' : 'este mês'}...\n\nEx:\n- Finalizei os banners da campanha Black Friday\n- Revisei e aprovei roteiro do vídeo institucional\n- Configurei públicos no Meta Ads para o novo produto\n\nPrioridades para amanhã:\n- ...`}
                  rows={10}
                  className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none leading-relaxed transition-colors"
                />
              </motion.div>
            )}

            {/* AI Mode */}
            {reportMode === 'ai' && (
              <motion.div key="ai" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-4">
                <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-4 transition-colors">
                  <p className="text-sm text-indigo-700 dark:text-indigo-400 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    A IA vai analisar as tarefas concluídas e pendentes do período selecionado (<strong>{periodLabel}</strong>) e gerar um relatório narrativo completo.
                  </p>
                </div>

                <button
                  onClick={handleGenerateAI}
                  disabled={aiLoading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {aiLoading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Gerando relatório...</> : <><Sparkles className="w-4 h-4" /> Gerar com IA</>}
                </button>

                <AnimatePresence>
                  {aiOutput && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 p-5 max-h-80 overflow-y-auto transition-colors">
                      <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{aiOutput}</pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          {currentContent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 transition-colors">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 dark:shadow-indigo-900/20"
              >
                {saved ? <><CheckCheck className="w-4 h-4" /> Salvo!</> : <><Save className="w-4 h-4" /> Salvar report</>}
              </button>
              <button
                onClick={() => handleCopy(currentContent, 'current')}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl hover:bg-slate-200 dark:bg-slate-700 transition-all"
              >
                {copiedId === 'current' ? <><CheckCheck className="w-4 h-4 text-emerald-600" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar</>}
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Saved Reports ──────────────────────────────────────────────────── */}
      {savedReports.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest">Reports Salvos</h3>
          {savedReports.map(report => (
            <div key={report.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
              <div className="flex items-center gap-4 p-4">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', report.mode === 'ai' ? 'bg-gradient-to-br from-indigo-500 to-violet-600' : 'bg-slate-100 dark:bg-slate-800')}>
                  {report.mode === 'ai' ? <Sparkles className="w-4 h-4 text-white" /> : <PenLine className="w-4 h-4 text-slate-500 dark:text-slate-400 dark:text-slate-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{report.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded-full transition-colors">{report.period}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{report.createdAt}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">• {report.mode === 'ai' ? 'Gerado por IA' : 'Escrito manualmente'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleCopy(report.content, report.id)} className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all">
                    {copiedId === report.id ? <CheckCheck className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleDelete(report.id)} className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)} className={cn('p-2 rounded-lg transition-all', expandedReport === report.id ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:bg-slate-800/50')}>
                    <ChevronDown className={cn('w-4 h-4 transition-transform', expandedReport === report.id && 'rotate-180')} />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedReport === report.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0 border-t border-slate-100 dark:border-slate-800 transition-colors">
                      <pre className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500 whitespace-pre-wrap font-sans leading-relaxed max-h-60 overflow-y-auto bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mt-3">
                        {report.content}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
