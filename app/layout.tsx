import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'MarketFlow - Kanban para Marketing',
  description: 'SaaS de gestão de tarefas e campanhas para times de marketing.',
};

import { TopBar } from '@/components/TopBar';
import { Dock } from '@/components/Dock';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className="antialiased font-sans text-slate-900 bg-slate-50 dark:bg-slate-950 dark:text-slate-100 transition-colors">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col pb-24">
            <TopBar />
            <main className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
            <Dock />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
