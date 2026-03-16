import { Dock } from '@/components/Dock';
import { TopBar } from '@/components/TopBar';
import { Briefcase } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      <div className="flex flex-col min-w-0">
        <TopBar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Projetos</h1>
                <p className="text-slate-500 text-sm">Visão geral e gestão de projetos de marketing.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder for projects */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Lançamento</span>
                    <span className="text-xs text-slate-400">Mar 2026</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Projeto de Marketing #{i}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">Descrição curta do projeto de marketing para exemplificar a listagem de projetos.</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex -space-x-2">
                      {[1, 2].map((u) => (
                        <div key={u} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                          <img src={`https://picsum.photos/seed/p${i}u${u}/50/50`} alt="User" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">65% Concluído</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      
      <Dock />
    </div>
  );
}
