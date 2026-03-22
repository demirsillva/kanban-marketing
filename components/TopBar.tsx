'use client';

import { Search, Bell, HelpCircle, Settings2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/Button';

export function TopBar() {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 sticky top-0 z-10 transition-colors">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Buscar tarefas, campanhas..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800/80 rounded-full text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:focus:ring-indigo-500/40"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>
        <Link
          href="/configuracoes"
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full transition-colors"
          title="Configurações"
        >
          <Settings2 className="w-5 h-5" />
        </Link>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2 transition-colors"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 transition-colors">Demir Silva</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Marketing Manager</p>
          </div>
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-800 transition-colors">
            <Image
              src="https://picsum.photos/seed/user-main/100/100"
              alt="User"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
