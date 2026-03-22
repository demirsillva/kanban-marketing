'use client';

import { useState, useEffect } from 'react';
import {
  Settings2, Key, User, Bell, Palette, Users, Shield,
  Eye, EyeOff, Check, ChevronRight, Sparkles, Brain,
  Zap, Bot, Save, Trash2, AlertTriangle, Moon, Sun,
  Monitor, Globe, Lock, Mail, Smartphone, Plus, X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApiKey {
  id: string;
  value: string;
  savedAt?: string;
}

interface SettingsData {
  apiKeys: ApiKey[];
  profile: { name: string; email: string; role: string; avatar: string };
  notifications: { email: boolean; push: boolean; tasks: boolean; deadlines: boolean; mentions: boolean };
  appearance: { theme: 'light' | 'dark' | 'system'; language: string; compactMode: boolean };
}

const DEFAULT_SETTINGS: SettingsData = {
  apiKeys: [],
  profile: { name: 'Demir Silva', email: 'demir@marketflow.com', role: 'Marketing Manager', avatar: 'https://picsum.photos/seed/demir/100/100' },
  notifications: { email: true, push: true, tasks: true, deadlines: true, mentions: false },
  appearance: { theme: 'light', language: 'pt-BR', compactMode: false },
};

const STORAGE_KEY = 'kanban-settings';

// ── AI Providers ──────────────────────────────────────────────────────────────

const AI_PROVIDERS = [
  { id: 'openai',     label: 'OpenAI (GPT-4)',      icon: Brain,    color: 'from-emerald-500 to-teal-600',   placeholder: 'sk-proj-...', description: 'Use GPT-4o para gerar copys, roteiros e legendas with alta qualidade.',       docsUrl: 'https://platform.openai.com/api-keys' },
  { id: 'gemini',    label: 'Google Gemini',        icon: Sparkles, color: 'from-blue-500 to-indigo-600',    placeholder: 'AIza...',     description: 'Gemini Pro para geração de conteúdo multimodal e buscas contextuais.',       docsUrl: 'https://aistudio.google.com/app/apikey' },
  { id: 'anthropic', label: 'Anthropic (Claude)',   icon: Bot,      color: 'from-orange-500 to-amber-600',   placeholder: 'sk-ant-...', description: 'Claude 3.5 Sonnet para roteiros longos e análises de referências.',           docsUrl: 'https://console.anthropic.com/api-keys' },
  { id: 'perplexity',label: 'Perplexity AI',        icon: Zap,      color: 'from-violet-500 to-purple-600',  placeholder: 'pplx-...',    description: 'Busca de referências e tendências em tempo real com IA.',                    docsUrl: 'https://www.perplexity.ai/settings/api' },
  { id: 'mistral',   label: 'Mistral AI',           icon: Zap,      color: 'from-cyan-500 to-sky-600',       placeholder: 'msk-...',     description: 'Modelos open-source de alta performance para conteúdo em PT-BR.',            docsUrl: 'https://console.mistral.ai/api-keys' },
  { id: 'cohere',    label: 'Cohere',               icon: Bot,      color: 'from-rose-500 to-pink-600',      placeholder: 'co-...',      description: 'Command R+ para geração e rerank de conteúdo de marketing.',                  docsUrl: 'https://dashboard.cohere.com/api-keys' },
];

// ── Sidebar sections (ordered by best UX as requested) ───────────────────────

const SECTIONS = [
  { id: 'profile',       label: 'Perfil',         icon: User },
  { id: 'appearance',    label: 'Aparência',      icon: Palette },
  { id: 'team',          label: 'Equipe & Acesso',icon: Users },
  { id: 'api',           label: 'Chaves de API',  icon: Key },
  { id: 'notifications', label: 'Notificações',   icon: Bell },
  { id: 'security',      label: 'Segurança',      icon: Shield },
];

// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{ height: '22px', width: '42px' }}
      className={cn('rounded-full relative transition-colors duration-200 flex-shrink-0', value ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700')}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-[3px] w-4 h-4 bg-white dark:bg-slate-900 rounded-full shadow-sm"
      />
    </button>
  );
}

// ── API Key Card (for a configured provider) ──────────────────────────────────

function ConfiguredKeyCard({
  provider,
  savedKey,
  onDelete,
}: {
  provider: typeof AI_PROVIDERS[0];
  savedKey: ApiKey;
  onDelete: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const Icon = provider.icon;
  const masked = savedKey.value.slice(0, 6) + '••••••••••••' + savedKey.value.slice(-4);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4"
    >
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${provider.color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{provider.label}</span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Conectado
          </span>
        </div>
        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 dark:text-slate-500 truncate">{visible ? savedKey.value : masked}</p>
        {savedKey.savedAt && <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Salva em {savedKey.savedAt}</p>}
      </div>
      <button onClick={() => setVisible(!visible)} className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:text-slate-500 rounded-lg transition-colors">
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
      <button onClick={onDelete} className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ── Add Key Modal ─────────────────────────────────────────────────────────────

function AddKeyModal({
  existingIds,
  onAdd,
  onClose,
}: {
  existingIds: string[];
  onAdd: (providerId: string, value: string) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<'choose' | 'enter'>('choose');
  const [selectedProvider, setSelectedProvider] = useState<typeof AI_PROVIDERS[0] | null>(null);
  const [keyValue, setKeyValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [saved, setSaved] = useState(false);

  const available = AI_PROVIDERS.filter(p => !existingIds.includes(p.id));

  const handleSave = () => {
    if (!selectedProvider || !keyValue.trim()) return;
    onAdd(selectedProvider.id, keyValue.trim());
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              {step === 'choose' ? 'Escolha o provedor de IA' : `Adicionar chave — ${selectedProvider?.label}`}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">
              {step === 'choose' ? 'Selecione para qual IA deseja configurar a chave API.' : 'Cole ou digite sua chave API abaixo.'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:text-slate-500 rounded-lg hover:bg-slate-50 dark:bg-slate-800/50 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: choose provider */}
            {step === 'choose' && (
              <motion.div key="choose" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                {available.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 text-center py-4">Todos os provedores já estão configurados! ✅</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {available.map(provider => {
                      const Icon = provider.icon;
                      return (
                        <button
                          key={provider.id}
                          onClick={() => { setSelectedProvider(provider); setStep('enter'); }}
                          className="flex items-start gap-3 p-4 rounded-xl border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all text-left group"
                        >
                          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${provider.color} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-700 leading-tight">{provider.label}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 dark:text-slate-500 leading-tight mt-0.5 line-clamp-2">{provider.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: enter key */}
            {step === 'enter' && selectedProvider && (
              <motion.div key="enter" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${selectedProvider.color} flex items-center justify-center flex-shrink-0`}>
                    <selectedProvider.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedProvider.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{selectedProvider.description}</p>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1.5 block">Chave API</label>
                  <div className="relative">
                    <input
                      type={visible ? 'text' : 'password'}
                      value={keyValue}
                      onChange={(e) => setKeyValue(e.target.value)}
                      placeholder={selectedProvider.placeholder}
                      autoFocus
                      className="w-full pl-3 pr-10 py-2.5 text-sm font-mono bg-slate-50 dark:bg-slate-800/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 text-slate-800 dark:text-slate-200 placeholder:font-sans placeholder:text-slate-400 dark:text-slate-500"
                    />
                    <button onClick={() => setVisible(!visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:text-slate-500">
                      {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <a href={selectedProvider.docsUrl} target="_blank" rel="noreferrer" className="text-[11px] text-indigo-500 hover:underline mt-1 block">
                    Onde encontro minha chave? →
                  </a>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setStep('choose'); setKeyValue(''); setSelectedProvider(null); }}
                    className="flex-1 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:bg-slate-700 transition-colors"
                  >
                    ← Voltar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!keyValue.trim()}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saved ? <><Check className="w-4 h-4" /> Salva!</> : <><Save className="w-4 h-4" /> Salvar chave</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ConfiguracoesPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [showAddKey, setShowAddKey] = useState(false);

  useEffect(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); if (s) setSettings(JSON.parse(s)); } catch { /* ignore */ }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, isLoaded]);

  const saveApiKey = (providerId: string, value: string) => {
    const now = new Date().toLocaleDateString('pt-BR');
    setSettings(prev => {
      const existing = prev.apiKeys.find(k => k.id === providerId);
      const newKey: ApiKey = { id: providerId, value, savedAt: now };
      return { ...prev, apiKeys: existing ? prev.apiKeys.map(k => k.id === providerId ? newKey : k) : [...prev.apiKeys, newKey] };
    });
  };

  const deleteApiKey = (providerId: string) => {
    setSettings(prev => ({ ...prev, apiKeys: prev.apiKeys.filter(k => k.id !== providerId) }));
  };

  const configuredKeys = settings.apiKeys.filter(k => k.value);
  const configuredProviders = configuredKeys.map(k => AI_PROVIDERS.find(p => p.id === k.id)).filter(Boolean) as typeof AI_PROVIDERS;

  if (!isLoaded) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-300">
          <Settings2 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Configurações</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm">Gerencie sua conta, integrações e preferências.</p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-52 flex-shrink-0">
          <nav className="space-y-1">
            {SECTIONS.map(section => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left',
                    isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:bg-white dark:bg-slate-900 hover:text-slate-900 dark:text-slate-100 hover:shadow-sm'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {section.label}
                  {section.id === 'api' && configuredKeys.length > 0 && (
                    <span className={cn('ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full', isActive ? 'bg-white dark:bg-slate-900/20 text-white' : 'bg-emerald-100 text-emerald-700')}>
                      {configuredKeys.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.15 }}>

              {/* ── API Keys ─────────────────────────────────────────── */}
              {activeSection === 'api' && (
                <div className="space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Chaves de API de IA</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Configure as chaves para ativar as Ferramentas de IA. As chaves são armazenadas localmente no seu navegador.</p>
                    </div>
                    <button
                      onClick={() => setShowAddKey(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex-shrink-0"
                    >
                      <Plus className="w-4 h-4" /> Adicionar chave
                    </button>
                  </div>

                  {/* Security warning */}
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      <strong>Segurança:</strong> As chaves são salvas apenas no <code className="bg-amber-100 px-1 rounded">localStorage</code> do seu navegador e nunca enviadas para servidores externos. Nunca compartilhe suas chaves.
                    </p>
                  </div>

                  {/* Configured keys */}
                  <AnimatePresence>
                    {configuredProviders.length > 0 ? (
                      <div className="space-y-3">
                        {configuredProviders.map(provider => (
                          <ConfiguredKeyCard
                            key={provider.id}
                            provider={provider}
                            savedKey={configuredKeys.find(k => k.id === provider.id)!}
                            onDelete={() => deleteApiKey(provider.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <Key className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nenhuma chave configurada</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-4">Adicione a chave de um provedor de IA para ativar as Ferramentas.</p>
                        <button
                          onClick={() => setShowAddKey(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
                        >
                          <Plus className="w-4 h-4" /> Adicionar primeira chave
                        </button>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Available but not configured */}
                  {configuredKeys.length > 0 && configuredKeys.length < AI_PROVIDERS.length && (
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-3">Provedores disponíveis</p>
                      <div className="grid grid-cols-2 gap-3">
                        {AI_PROVIDERS.filter(p => !configuredKeys.find(k => k.id === p.id)).map(provider => {
                          const Icon = provider.icon;
                          return (
                            <button
                              key={provider.id}
                              onClick={() => setShowAddKey(true)}
                              className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all text-left group"
                            >
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${provider.color} flex items-center justify-center flex-shrink-0`}>
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-700 truncate">{provider.label}</p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500">Não configurado</p>
                              </div>
                              <Plus className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 flex-shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Profile ───────────────────────────────────────────── */}
              {activeSection === 'profile' && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Perfil</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Informações da sua conta e identidade visual.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 shadow-sm p-6">
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-4 block">Foto de Perfil</label>
                    <div className="flex items-center gap-5">
                      <img src={settings.profile.avatar} alt="Avatar" className="w-[72px] h-[72px] rounded-2xl object-cover border-2 border-slate-100 shadow" />
                      <div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold mb-1">{settings.profile.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-2">{settings.profile.email}</p>
                        <button className="text-xs font-bold text-indigo-600 hover:underline">Alterar foto</button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider block">Informações Pessoais</label>
                    {[{ field: 'name', label: 'Nome completo', icon: User }, { field: 'email', label: 'E-mail', icon: Mail }, { field: 'role', label: 'Cargo', icon: Globe }].map(({ field, label, icon: Icon }) => (
                      <div key={field}>
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1.5"><Icon className="w-3 h-3" />{label}</label>
                        <input
                          type={field === 'email' ? 'email' : 'text'}
                          value={settings.profile[field as keyof typeof settings.profile]}
                          onChange={(e) => setSettings(prev => ({ ...prev, profile: { ...prev.profile, [field]: e.target.value } }))}
                          className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-800 dark:text-slate-200"
                        />
                      </div>
                    ))}
                    <button onClick={() => { setProfileSaved(true); setTimeout(() => setProfileSaved(false), 2000); }} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                      {profileSaved ? <><Check className="w-4 h-4" /> Salvo!</> : <><Save className="w-4 h-4" /> Salvar alterações</>}
                    </button>
                  </div>
                </div>
              )}

              {/* ── Notifications ─────────────────────────────────────── */}
              {activeSection === 'notifications' && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Notificações</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Escolha como e quando ser notificado.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50 dark:divide-slate-800/50">
                    {[
                      { id: 'email', label: 'Notificações por e-mail', description: 'Receba resumos e alertas no seu e-mail.', icon: Mail },
                      { id: 'push', label: 'Notificações push', description: 'Alertas no navegador em tempo real.', icon: Smartphone },
                      { id: 'tasks', label: 'Atualizações de tarefas', description: 'Quando uma tarefa for atualizada ou comentada.', icon: Bell },
                      { id: 'deadlines', label: 'Lembrete de prazos', description: 'Aviso 24h antes de uma entrega vencer.', icon: Bell },
                      { id: 'mentions', label: 'Menções', description: 'Quando alguém te mencionar em comentários.', icon: Users },
                    ].map(item => {
                      const Icon = item.icon;
                      return (
                        <div key={item.id} className="flex items-center justify-between p-5">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center mt-0.5"><Icon className="w-4 h-4 text-slate-500 dark:text-slate-400 dark:text-slate-500" /></div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.label}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">{item.description}</p>
                            </div>
                          </div>
                          <Toggle value={settings.notifications[item.id as keyof typeof settings.notifications]} onChange={(v) => setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, [item.id]: v } }))} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Appearance ────────────────────────────────────────── */}
              {activeSection === 'appearance' && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Aparência</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Personalize a interface conforme sua preferência.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 shadow-sm p-6">
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-4 block">Tema</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[{ id: 'light', label: 'Claro', icon: Sun }, { id: 'dark', label: 'Escuro', icon: Moon }, { id: 'system', label: 'Sistema', icon: Monitor }].map(theme => {
                        const Icon = theme.icon;
                        const isSelected = settings.appearance.theme === theme.id;
                        return (
                          <button key={theme.id} onClick={() => setSettings(prev => ({ ...prev, appearance: { ...prev.appearance, theme: theme.id as any } }))} className={cn('flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all', isSelected ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100' : 'border-slate-100 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-200')}>
                            <Icon className={cn('w-5 h-5', isSelected ? 'text-indigo-600' : 'text-slate-500 dark:text-slate-400 dark:text-slate-500')} />
                            <span className={cn('text-xs font-bold', isSelected ? 'text-indigo-600' : 'text-slate-500 dark:text-slate-400 dark:text-slate-500')}>{theme.label}</span>
                            {isSelected && <Check className="w-3 h-3 text-indigo-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 shadow-sm p-6">
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-3 block">Idioma</label>
                    <select value={settings.appearance.language} onChange={(e) => setSettings(prev => ({ ...prev, appearance: { ...prev.appearance, language: e.target.value } }))} className="w-full max-w-xs px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-700 dark:text-slate-300">
                      <option value="pt-BR">🇧🇷 Português (Brasil)</option>
                      <option value="en">🇺🇸 English</option>
                      <option value="es">🇪🇸 Español</option>
                    </select>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Modo Compacto</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">Reduz o espaçamento para exibir mais conteúdo na tela.</p>
                    </div>
                    <Toggle value={settings.appearance.compactMode} onChange={(v) => setSettings(prev => ({ ...prev, appearance: { ...prev.appearance, compactMode: v } }))} />
                  </div>
                </div>
              )}

              {/* ── Team ──────────────────────────────────────────────── */}
              {activeSection === 'team' && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Equipe & Acesso</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Gerencie membros e permissões do workspace.</p>
                  </div>
                  {[{ name: 'Ana Silva', email: 'ana@marketflow.com', role: 'Editor', avatar: 'https://picsum.photos/seed/ana/100/100', active: true }, { name: 'Bruno Costa', email: 'bruno@marketflow.com', role: 'Visualizador', avatar: 'https://picsum.photos/seed/bruno/100/100', active: true }, { name: 'Carla Souza', email: 'carla@marketflow.com', role: 'Editor', avatar: 'https://picsum.photos/seed/carla/100/100', active: false }].map((member) => (
                    <div key={member.email} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
                      <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{member.name}</p>
                          <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', member.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 dark:text-slate-500')}>{member.active ? 'Ativo' : 'Inativo'}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{member.email}</p>
                      </div>
                      <select className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 rounded-lg py-1.5 px-2 focus:outline-none"><option>Editor</option><option>Visualizador</option><option>Admin</option></select>
                      <button className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-2xl text-sm font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-all">+ Convidar membro</button>
                </div>
              )}

              {/* ── Security ──────────────────────────────────────────── */}
              {activeSection === 'security' && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Segurança</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Proteja sua conta com autenticação adicional.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                    <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider block">Alterar Senha</label>
                    {['Senha atual', 'Nova senha', 'Confirmar nova senha'].map((label, i) => (
                      <div key={i}>
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-1 block">{label}</label>
                        <input type="password" placeholder="••••••••" className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                      </div>
                    ))}
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"><Lock className="w-4 h-4" /> Atualizar senha</button>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Autenticação em dois fatores (2FA)</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">Adicione uma camada extra de proteção à sua conta.</p>
                    </div>
                    <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1">Ativar <ChevronRight className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                    <p className="text-sm font-bold text-red-700 mb-1">Zona de perigo</p>
                    <p className="text-xs text-red-600 mb-3">Essas ações são permanentes e irreversíveis.</p>
                    <button className="text-xs font-bold text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5" /> Excluir minha conta</button>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Add Key Modal */}
      <AnimatePresence>
        {showAddKey && (
          <AddKeyModal
            existingIds={configuredKeys.map(k => k.id)}
            onAdd={(id, val) => { saveApiKey(id, val); }}
            onClose={() => setShowAddKey(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
