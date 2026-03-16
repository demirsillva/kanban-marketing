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
      color: 'text-blue-600',
      bgColor: 'bg-blue-100/50',
      trend: '+12% este mês',
      trendUp: true
    },
    {
      label: 'Taxa de Conclusão',
      value: `${completionRate}%`,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100/50',
      trend: '+5% vs mês passado',
      trendUp: true
    },
    {
      label: 'Prioridade Alta/Crítica',
      value: highPriorityTasks,
      icon: AlertCircle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100/50',
      trend: '-2 desde ontem',
      trendUp: false
    },
    {
      label: 'Esforço Estimado (pts)',
      value: totalEffort,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100/50',
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
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={cn("p-3 rounded-xl", metric.bgColor)}>
              <metric.icon className={cn("w-6 h-6", metric.color)} />
            </div>
            {/* Optional mini graph could go here */}
          </div>
          
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">{metric.label}</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{metric.value}</h3>
          </div>
          
          <div className="mt-4 flex items-center gap-1.5">
            <TrendingUp className={cn("w-4 h-4", metric.trendUp ? "text-emerald-500" : "text-rose-500")} />
            <span className="text-xs text-slate-500 font-medium">{metric.trend}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
