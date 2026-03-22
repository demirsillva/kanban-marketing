'use client';

import { Dock } from '@/components/Dock';
import { TopBar } from '@/components/TopBar';
import { CalendarView } from '@/components/calendar/CalendarView';
import { motion } from 'motion/react';

export default function CalendarPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
            C
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Calendário</h1>
            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm">Visualize o cronograma das entregas de marketing pelo mês.</p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <CalendarView />
      </motion.div>
    </>
  );
}
