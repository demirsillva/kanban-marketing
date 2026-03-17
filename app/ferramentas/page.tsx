'use client';

import { useState, useRef } from 'react';
import { Dock } from '@/components/Dock';
import { TopBar } from '@/components/TopBar';
import {
  PenLine, Film, Instagram, Lightbulb, Search,
  Sparkles, RefreshCw, Copy, CheckCheck, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Tool {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  description: string;
  color: string;
  bgGradient: string;
  fields: ToolField[];
  generate: (inputs: Record<string, string>) => string;
}

interface ToolField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder?: string;
  options?: string[];
}

const COPY_TEMPLATES = [
  (p: Record<string, string>) =>
    `🔥 ${p.produto ? `Apresentando: **${p.produto}**` : 'Você não vai acreditar no que preparamos...'}\n\n${p.beneficio || 'A solução que vai transformar o seu negócio'} — sem complicação, sem enrolação.\n\n✅ Resultados reais\n✅ Implementação rápida\n✅ Suporte completo\n\n👉 ${p.cta || 'Clique aqui e saiba mais'}`,
  (p: Record<string, string>) =>
    `Você sabia que ${p.beneficio || '90% dos negócios poderiam crescer mais'}?\n\n${p.produto || 'Nossa solução'} foi criada para quem quer resultados de verdade. Chega de promessas vazias — aqui você tem **estratégia + execução**.\n\n💬 "${p.cta || 'Quero começar agora'}" — é só clicar.`,
];

const ROTEIRO_TEMPLATE = (p: Record<string, string>) => `🎬 **ROTEIRO: ${p.tema || 'Conteúdo Incrível'}**
Formato: ${p.formato || 'Reels / TikTok'} | Duração estimada: ${p.duracao || '60s'}

---
**[GANCHO — 0 a 3s]**
"${p.gancho || 'Você está cometendo um erro que está te custando clientes...'}"
*[Apareça na tela com expressão de surpresa ou curiosidade]*

**[PROBLEMA — 3 a 15s]**
A maioria das pessoas ${p.tema ? `que quer ${p.tema}` : ''} comete o mesmo erro: tentar fazer tudo de uma vez sem estratégia. O resultado? Zero engajamento, zero vendas.

**[SOLUÇÃO — 15 a 45s]**
A virada é simples:
1️⃣ Defina seu público antes de criar qualquer conteúdo
2️⃣ Fale a língua do seu cliente, não a sua
3️⃣ Tenha um único CTA por vídeo

**[CTA — 45 a 60s]**
"Se esse conteúdo te ajudou, salva esse vídeo e me segue para mais dicas assim. Link na bio para ${p.cta || 'acessar o material completo'}!"
*[Sorria para câmera, acene]*`;

const LEGENDA_TEMPLATE = (p: Record<string, string>) =>
  `${p.emoji || '✨'} ${p.titulo || 'Você merece crescer de verdade.'}\n\n${p.contexto ? `${p.contexto}\n\n` : ''}Não existe fórmula mágica — mas existe método. E é exatamente isso que a gente entrega: **estratégia que funciona** para o seu negócio.\n\nSalva esse post 📌 para não esquecer e compartilha com alguém que precisa ver isso!\n\n👇 Me conta nos comentários: qual é o maior desafio do seu negócio hoje?\n\n—\n${p.hashtags || '#marketing #crescimento #empreendedorismo #marketingdigital #negócios #conteúdo #estratégia #socialmedia #brasil'}`;

const IDEIAS_TEMPLATE = (p: Record<string, string>) =>
  `💡 **10 Ideias de Conteúdo para ${p.nicho || 'o seu negócio'}**\n\n1. 🎯 "Os 3 erros que ${p.publico || 'empreendedores'} cometem ao ${p.assunto || 'criar conteúdo'}"\n2. 📖 Bastidores: como é uma semana de trabalho real aqui na empresa\n3. 🔢 "5 ferramentas gratuitas que uso todo dia (e você deveria usar também)"\n4. 💬 Depoimento em vídeo de um cliente satisfeito + resultado alcançado\n5. 🤔 Post de opinião controversa do seu nicho com CTA para debate\n6. 📊 Infográfico com estatísticas relevantes para seu público\n7. 🎓 Mini-aula: explique um conceito complexo em menos de 60 segundos\n8. 🔁 Transformação antes & depois de um projeto/cliente\n9. 📅 "O que eu faria diferente se começasse hoje"\n10. 🚀 Antevisão de algo novo que está por vir (gera antecipação)\n\n—\n💬 **Bônus:** Adapte cada ideia para 3 formatos — feed estático, Reels e Stories — e você tem 30 posts planejados!`;

const REFERENCIAS_TEMPLATE = (p: Record<string, string>) =>
  `🔍 **Referências de Criativos — ${p.segmento || 'Marketing Digital'}**\n\n**Estética recomendada:** ${p.estilo || 'Clean, minimalista com tipografia bold'}\n\n---\n📸 **Referências de Imagem / Design:**\n- Contas para monitorar: @visualsoflife, @designspiration, @awwwards\n- Paleta de cores dominante: tons de ${p.cor || 'indigo + branco + cinza off-white'}\n- Tipografia em destaque: Sans-serif geométrica (Outfit, Inter, Plus Jakarta Sans)\n\n---\n🎬 **Referências de Vídeo:**\n- Creators do nicho ${p.segmento || 'marketing'}: analisar os 10 vídeos mais virais dos últimos 30 dias\n- Bancos de referência: Pinterest (busca "${p.assunto || p.segmento || 'marketing digital'} ads creative"), Behance, Dribbble\n- Formatos que estão em alta: Talking head + B-roll, Screenflow, Slideshow com música\n\n---\n🛠️ **Onde buscar inspiração:**\n1. **Swipe File**: salve anúncios que chamam atenção no Facebook Ads Library\n2. **TikTok Creative Center** → filtrar por seu segmento e região\n3. **Motion Array / Envato** para animações e templates\n4. **Unsplash / Pexels** para imagens de alta qualidade sem royalties\n\n---\n✅ **Checklist do Criativo Perfeito:**\n☐ Gancho visual nos primeiros 2 segundos\n☐ Identidade visual consistente com a marca\n☐ Texto legível em mobile (fonte ≥ 14px)\n☐ CTA visível e claro\n☐ Formato adaptado para cada plataforma`;

const TOOLS: Tool[] = [
  {
    id: 'copy', icon: PenLine, name: 'Criador de Copys',
    description: 'Gere textos persuasivos para anúncios, posts e e-mails em segundos.',
    color: 'indigo', bgGradient: 'from-indigo-500 to-violet-600',
    fields: [
      { id: 'produto', label: 'Produto / Serviço', type: 'text', placeholder: 'Ex: Curso de Marketing Digital' },
      { id: 'beneficio', label: 'Principal Benefício', type: 'text', placeholder: 'Ex: Dobrar o faturamento em 90 dias' },
      { id: 'publico', label: 'Público-alvo', type: 'text', placeholder: 'Ex: Empreendedores iniciantes' },
      { id: 'cta', label: 'CTA (Chamada para Ação)', type: 'text', placeholder: 'Ex: Acesse o link na bio' },
    ],
    generate: (p) => COPY_TEMPLATES[Math.floor(Math.random() * COPY_TEMPLATES.length)](p),
  },
  {
    id: 'roteiro', icon: Film, name: 'Roteiro para Vídeo',
    description: 'Crie roteiros de Reels, TikToks e YouTube com estrutura de alta retenção.',
    color: 'rose', bgGradient: 'from-rose-500 to-pink-600',
    fields: [
      { id: 'tema', label: 'Tema / Assunto', type: 'text', placeholder: 'Ex: Como criar conteúdo que vende' },
      { id: 'formato', label: 'Formato', type: 'select', options: ['Reels / TikTok (60s)', 'YouTube Shorts (60s)', 'YouTube (7-10min)', 'Stories (15s)'] },
      { id: 'duracao', label: 'Duração', type: 'select', options: ['30s', '60s', '3 minutos', '5 minutos', '10 minutos'] },
      { id: 'gancho', label: 'Gancho de abertura (opcional)', type: 'text', placeholder: 'Ex: "Ninguém te conta isso sobre..."' },
      { id: 'cta', label: 'CTA Final', type: 'text', placeholder: 'Ex: acessar meu grupo gratuito' },
    ],
    generate: ROTEIRO_TEMPLATE,
  },
  {
    id: 'legenda', icon: Instagram, name: 'Legenda para Instagram',
    description: 'Legendas cativantes com emojis e hashtags para maximizar alcance.',
    color: 'violet', bgGradient: 'from-violet-500 to-purple-600',
    fields: [
      { id: 'titulo', label: 'Título / Frase de Abertura', type: 'text', placeholder: 'Ex: Você merece crescer de verdade' },
      { id: 'contexto', label: 'Contexto do post', type: 'textarea', placeholder: 'Ex: Estou lançando um novo produto de skincare...' },
      { id: 'emoji', label: 'Emoji principal', type: 'text', placeholder: 'Ex: ✨ 🚀 💡' },
      { id: 'hashtags', label: 'Hashtags personalizadas (opcional)', type: 'text', placeholder: 'Ex: #suamarca #seuproduto' },
    ],
    generate: LEGENDA_TEMPLATE,
  },
  {
    id: 'ideias', icon: Lightbulb, name: 'Gerador de Ideias',
    description: 'Gere dezenas de ideias de conteúdo para o seu nicho e público.',
    color: 'amber', bgGradient: 'from-amber-500 to-orange-500',
    fields: [
      { id: 'nicho', label: 'Nicho / Segmento', type: 'text', placeholder: 'Ex: Fitness para mulheres acima de 40' },
      { id: 'publico', label: 'Público-alvo', type: 'text', placeholder: 'Ex: Mães que querem emagrecer' },
      { id: 'assunto', label: 'Assunto foco (opcional)', type: 'text', placeholder: 'Ex: alimentação saudável' },
    ],
    generate: IDEIAS_TEMPLATE,
  },
  {
    id: 'referencias', icon: Search, name: 'Buscador de Referências',
    description: 'Encontre referências de criativos e tendências para o seu segmento.',
    color: 'emerald', bgGradient: 'from-emerald-500 to-teal-500',
    fields: [
      { id: 'segmento', label: 'Segmento / Mercado', type: 'text', placeholder: 'Ex: Consultoria financeira' },
      { id: 'assunto', label: 'Assunto do Criativo', type: 'text', placeholder: 'Ex: Anúncio de tráfego pago' },
      { id: 'estilo', label: 'Estética desejada', type: 'text', placeholder: 'Ex: Moderno, dark mode, clean' },
      { id: 'cor', label: 'Paleta de cores', type: 'text', placeholder: 'Ex: Azul escuro + dourado' },
    ],
    generate: REFERENCIAS_TEMPLATE,
  },
];

const COLORS: Record<string, { ring: string; bg: string; btn: string; text: string }> = {
  indigo: { ring: 'ring-indigo-500/30', bg: 'bg-indigo-50', btn: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200', text: 'text-indigo-600' },
  rose:   { ring: 'ring-rose-500/30',   bg: 'bg-rose-50',   btn: 'bg-rose-500 hover:bg-rose-600 shadow-rose-200',     text: 'text-rose-600' },
  violet: { ring: 'ring-violet-500/30', bg: 'bg-violet-50', btn: 'bg-violet-600 hover:bg-violet-700 shadow-violet-200', text: 'text-violet-600' },
  amber:  { ring: 'ring-amber-500/30',  bg: 'bg-amber-50',  btn: 'bg-amber-500 hover:bg-amber-600 shadow-amber-200',  text: 'text-amber-600' },
  emerald:{ ring: 'ring-emerald-500/30',bg: 'bg-emerald-50',btn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200', text: 'text-emerald-600' },
};

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^---$/gm, '<hr class="border-slate-200 my-3" />')
    .replace(/\n/g, '<br />');
}

function ToolPanel({ tool, onBack }: { tool: Tool; onBack: () => void }) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const colorSet = COLORS[tool.color];

  const handleGenerate = async () => {
    setLoading(true);
    setOutput('');
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    setOutput(tool.generate(inputs));
    setLoading(false);
    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        ← Ferramentas
      </button>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className={`bg-gradient-to-r ${tool.bgGradient} p-6 flex items-center gap-4`}>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <tool.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">{tool.name}</h2>
            <p className="text-white/70 text-sm">{tool.description}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {tool.fields.map(field => (
              <div key={field.id}>
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1 block">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    placeholder={field.placeholder}
                    value={inputs[field.id] || ''}
                    onChange={(e) => setInputs(prev => ({ ...prev, [field.id]: e.target.value }))}
                    className={`w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${colorSet.ring} resize-none text-slate-800 placeholder:text-slate-400`}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={inputs[field.id] || (field.options?.[0] ?? '')}
                    onChange={(e) => setInputs(prev => ({ ...prev, [field.id]: e.target.value }))}
                    className={`w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${colorSet.ring} text-slate-700`}
                  >
                    {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={inputs[field.id] || ''}
                    onChange={(e) => setInputs(prev => ({ ...prev, [field.id]: e.target.value }))}
                    className={`w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${colorSet.ring} text-slate-800 placeholder:text-slate-400`}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white rounded-xl transition-all shadow-lg ${colorSet.btn} disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Gerando...</>
              : <><Sparkles className="w-4 h-4" /> Gerar com IA</>
            }
          </button>

          <AnimatePresence>
            {output && (
              <motion.div
                ref={outputRef}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${colorSet.bg} rounded-xl p-4`}
              >
                <div
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(output) }}
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white rounded-lg border border-slate-200 text-slate-600 hover:border-slate-300 transition-all"
                  >
                    {copied
                      ? <><CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> Copiado!</>
                      : <><Copy className="w-3.5 h-3.5" /> Copiar</>
                    }
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white rounded-lg border border-slate-200 text-slate-600 hover:border-slate-300 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Gerar outra versão
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function FerramentasPage() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-28">
      <div className="flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ferramentas de IA</h1>
                <p className="text-slate-500 text-sm">Crie conteúdo de marketing com inteligência artificial.</p>
              </div>
            </div>

            {/* Tool selected → show panel */}
            {selectedTool ? (
              <ToolPanel tool={selectedTool} onBack={() => setSelectedTool(null)} />
            ) : (
              /* Tool cards grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {TOOLS.map((tool) => {
                  const colorSet = COLORS[tool.color];
                  return (
                    <motion.button
                      key={tool.id}
                      whileHover={{ scale: 1.03, y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedTool(tool)}
                      className="text-left bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group"
                    >
                      <div className={`bg-gradient-to-br ${tool.bgGradient} p-6 flex items-center justify-center`}>
                        <tool.icon className="w-9 h-9 text-white" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-slate-900 text-sm mb-1.5 leading-tight">{tool.name}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3">{tool.description}</p>
                        <div className={`flex items-center gap-1 text-xs font-bold ${colorSet.text}`}>
                          Abrir <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
      <Dock />
    </div>
  );
}
