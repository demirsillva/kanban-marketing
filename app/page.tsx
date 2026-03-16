import { Dock } from '@/components/Dock';
import { TopBar } from '@/components/TopBar';
import { KanbanBoard } from '@/components/KanbanBoard';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      <div className="flex flex-col min-w-0">
        <TopBar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
                  M
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Kanban</h1>
                  <p className="text-slate-500 text-sm">Gerencie o fluxo de trabalho e as entregas da sua equipe de marketing.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-200 relative">
                      <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="Team" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    +12
                  </div>
                </div>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Convidar Equipe</button>
              </div>
            </div>

            <KanbanBoard />
          </div>
        </main>
      </div>
      
      <Dock />
    </div>
  );
}
