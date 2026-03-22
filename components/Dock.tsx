'use client';

import { LayoutDashboard, FolderKanban, Calendar, Users, BarChart3, Sliders, Kanban, Wrench, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring, useTransform, Reorder, AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DockSettings {
  baseSize: number;
  magnification: number;
  showLabels: boolean;
}

interface NavItem {
  id: string;
  icon: any;
  label: string;
  href: string;
}

const initialNavItems: NavItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { id: 'kanban', icon: Kanban, label: 'Kanban', href: '/' },
  { id: 'projects', icon: FolderKanban, label: 'Projetos', href: '/projects' },
  { id: 'calendar', icon: Calendar, label: 'Calendário', href: '/calendar' },
  { id: 'ferramentas', icon: Wrench, label: 'Ferramentas', href: '/ferramentas' },
  { id: 'team', icon: Users, label: 'Equipe', href: '/team' },
  { id: 'reports', icon: BarChart3, label: 'Relatórios', href: '/reports' },
  { id: 'configuracoes', icon: Settings2, label: 'Configurações', href: '/configuracoes' },
];

function DockIcon({ 
  icon: Icon, 
  label, 
  active, 
  mouseX, 
  settings 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  mouseX: any,
  settings: DockSettings
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distance, 
    [-150, 0, 150], 
    [settings.baseSize, settings.baseSize * settings.magnification, settings.baseSize]
  );
  const width = useSpring(widthSync, { 
    mass: 0.1, 
    stiffness: 150, 
    damping: 12 
  });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className={cn(
        "aspect-square rounded-2xl flex items-center justify-center relative group transition-colors cursor-grab active:cursor-grabbing",
        active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20" : "bg-white/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 border border-white/20 dark:border-slate-800/50 shadow-sm"
      )}
    >
      <Icon className="w-1/2 h-1/2" />
      
      {settings.showLabels && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {label}
        </div>
      )}
      
      {/* Active Dot */}
      {active && (
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full" />
      )}
    </motion.div>
  );
}

export function Dock() {
  const pathname = usePathname();
  const [items, setItems] = useState<NavItem[]>(initialNavItems);
  const [settings, setSettings] = useState<DockSettings>({
    baseSize: 48,
    magnification: 1.5,
    showLabels: true,
  });
  const [mounted, setMounted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const mouseX = useMotionValue(Infinity);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('dock-settings');
    const savedItems = localStorage.getItem('dock-items');
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings)); // eslint-disable-line react-hooks/set-state-in-effect
    }
    
    if (savedItems) {
      const parsedIds = JSON.parse(savedItems);
      const reordered = parsedIds
        .map((id: string) => initialNavItems.find(item => item.id === id))
        .filter((item: NavItem | undefined): item is NavItem => !!item);
      if (reordered.length > 0) {
        setItems(reordered);
      }
    }
    
    setMounted(true);
  }, []);

  // Save settings when they change, but only after mounting to avoid overwriting with defaults
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('dock-settings', JSON.stringify(settings));
    localStorage.setItem('dock-items', JSON.stringify(items.map((i: NavItem) => i.id)));
  }, [settings, items, mounted]);

  // Prevent hydration mismatch by not rendering the interactive dock until mounted
  // We return a placeholder with the same structure but static values for SSR
  if (!mounted) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-end gap-4 opacity-0 transition-colors">
        <div className="flex items-end gap-3 px-4 py-3 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 dark:border-slate-800/40 rounded-[32px] shadow-2xl">
          {initialNavItems.map((item) => (
            <div key={item.id} style={{ width: 48 }} className="aspect-square rounded-2xl bg-white/80 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/30" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-colors">
      <div 
        className="flex items-center gap-3 px-4 py-3 bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/60 rounded-[32px] shadow-2xl"
      >
        <div 
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="flex items-center gap-3"
        >
          <Reorder.Group axis="x" values={items} onReorder={setItems} className="flex items-center gap-3">
          {items.map((item: NavItem) => (
            <Reorder.Item key={item.id} value={item}>
              <Link href={item.href}>
                <DockIcon 
                  {...item} 
                  active={pathname === item.href} 
                  mouseX={mouseX} 
                  settings={settings} 
                />
              </Link>
            </Reorder.Item>
          ))}
          </Reorder.Group>
        </div>

        {/* Separator */}
        <div className="w-px h-8 bg-white/20 dark:bg-slate-700/50 mx-1" />

        {/* Settings Toggle */}
        <div className="relative">
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-sm border",
              isSettingsOpen ? "bg-indigo-600 text-white border-indigo-500 rotate-90" : "bg-white/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-white/20 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
            )}
          >
            <Sliders className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {isSettingsOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute bottom-16 right-0 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-4 transition-colors"
              >
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Ajustes da Dock</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tamanho Base</label>
                      <span className="text-[10px] font-bold text-indigo-600">{settings.baseSize}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="32" 
                      max="64" 
                      value={settings.baseSize}
                      onChange={(e) => setSettings({ ...settings, baseSize: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Zoom (Magnificação)</label>
                      <span className="text-[10px] font-bold text-indigo-600">{settings.magnification}x</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="2.5" 
                      step="0.1"
                      value={settings.magnification}
                      onChange={(e) => setSettings({ ...settings, magnification: parseFloat(e.target.value) })}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mostrar Nomes</label>
                    <button 
                      onClick={() => setSettings({ ...settings, showLabels: !settings.showLabels })}
                      className={cn(
                        "w-8 h-4 rounded-full transition-colors relative",
                        settings.showLabels ? "bg-indigo-600" : "bg-slate-200"
                      )}
                    >
                      <motion.div 
                        animate={{ x: settings.showLabels ? 16 : 2 }}
                        className="absolute top-1 w-3 h-2 bg-white rounded-full"
                      />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-50">
                    <p className="text-[9px] text-slate-400 italic">Dica: Arraste os ícones para reordenar.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
