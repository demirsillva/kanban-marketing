'use client';

import { motion } from 'motion/react';
import { Card } from '@/types/kanban';
import { CheckCircle2, AlertCircle, TrendingUp, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OverviewCardsProps {
  cards: Record<string, Card>;
}

export function OverviewCards({ cards }: OverviewCardsProps) {
  const cardsList = Object.values(cards);
  
  // Calculate metrics
  const totalTasks = cardsList.length;
  const completedTasks = cardsList.filter(c => c.status === 'col-5').length; // Assuming 'col-5' is Done based on mock-data
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const highPriorityTasks = cardsList.filter(c => c.priority === 'Alta' || c.priority === 'Crítica').length;
  
  const effortMap = { 'P': 1, 'M': 3, 'G': 5 };
  const totalEffort = cardsList.reduce((acc, card) => acc + (effortMap[card.effort] || 0), 0);
  
  const metrics = [
    {
      label: 'Tarefas Totales',
      value: totalTasks,
      icon: Target,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100/50 dark:bg-blue-500/10',
      trend: '+12% este mês',
      trendUp: true
    },
    {
      label: 'Taxa de Conclusão',
      value: `${completionRate}%`,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100/50 dark:bg-emerald-500/10',
      trend: '+5% vs mês passado',
      trendUp: true
    },
    {
      label: 'Prioridade Alta/Crítica',
      value: highPriorityTasks,
      icon: AlertCircle,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-100/50 dark:bg-rose-500/10',
      trend: '-2 desde ontem',
      trendUp: false
    },
    {
      label: 'Esforço Estimado (pts)',
      value: totalEffort,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100/50 dark:bg-amber-500/10',
      trend: 'Capacidade: 85%',
      trendUp: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={cn("p-3 rounded-xl transition-colors", metric.bgColor)}>
              <metric.icon className={cn("w-6 h-6 transition-colors", metric.color)} />
            </div>
            {/* Optional mini graph could go here */}
          </div>
          
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1 transition-colors">{metric.label}</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight transition-colors">{metric.value}</h3>
          </div>
          
          <div className="mt-4 flex items-center gap-1.5">
            <TrendingUp className={cn("w-4 h-4 transition-colors", metric.trendUp ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400")} />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">{metric.trend}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
