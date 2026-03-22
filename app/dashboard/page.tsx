'use client';

import { OverviewCards } from '@/components/dashboard/OverviewCards';
import { ChartsGroup } from '@/components/dashboard/ChartsGroup';
import { INITIAL_DATA } from '@/lib/mock-data';
import { motion } from 'motion/react';

export default function DashboardPage() {
  const { cards, columns, columnOrder } = INITIAL_DATA;

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-colors">
            D
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight transition-colors">Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">Resumo de desempenho e métricas da equipe de marketing.</p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <OverviewCards cards={cards} />
        <ChartsGroup cards={cards} columns={columns} columnOrder={columnOrder} />
      </motion.div>
    </>
  );
}
