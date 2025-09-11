// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { ToastProvider } from '@/components/ToastProvider';
import { GameProviderClient } from '@/context/GameProvider_aldor_client';
import AppHeader from '@/components/AppHeader';
import { AuthProvider } from '@/context/AuthProvider_aldor_client';
import AuthGate from '@/components/AuthGate';
import NavTabs from '@/components/NavTabs';
import DebugOverlay from '@/components/DebugOverlay';

export const metadata: Metadata = {
  title: 'Aldor',
  description: 'Aventura medieval singleplayer'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-zinc-100">
        <ToastProvider>
          <GameProviderClient>
            <AuthProvider>
              <AppHeader />
              <NavTabs />
              <div className="max-w-5xl mx-auto px-4 py-6">
                {children}
              </div>
              <DebugOverlay />
              <AuthGate />
            </AuthProvider>
          </GameProviderClient>
        </ToastProvider>
      </body>
    </html>
  );
}
