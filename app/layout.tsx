'use client';
import './globals.css';
import { Inter } from 'next/font/google';
import { GameProvider } from '@/context/GameProvider_aldor_client';
import { AuthProvider } from '@/context/AuthProvider_aldor_client';
import { ToastProvider } from '@/components/ToastProvider';
import AppHeader from '@/components/AppHeader';
import Link from 'next/link';
import { Home, Shield, Coins, Building, Sword, User } from 'lucide-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <GameProvider>
          <AuthProvider>
            <ToastProvider>
              <AppHeader />
              <nav className="flex gap-3 px-6 py-2 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border-b border-zinc-700 text-sm font-medium">
                <Link href="/" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gradient-to-r hover:from-amber-500/80 hover:to-yellow-400/80 hover:text-black transition-all">
                  <Home className="w-4 h-4" /> Início
                </Link>
                <Link href="/guilda" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gradient-to-r hover:from-indigo-500/80 hover:to-indigo-400/80 hover:text-black transition-all">
                  <Shield className="w-4 h-4" /> Guilda
                </Link>
                <Link href="/mercado" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gradient-to-r hover:from-emerald-500/80 hover:to-emerald-400/80 hover:text-black transition-all">
                  <Coins className="w-4 h-4" /> Mercado
                </Link>
                <Link href="/praca" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gradient-to-r hover:from-pink-500/80 hover:to-rose-400/80 hover:text-black transition-all">
                  <Building className="w-4 h-4" /> Praça
                </Link>
                <Link href="/treino" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gradient-to-r hover:from-red-500/80 hover:to-orange-400/80 hover:text-black transition-all">
                  <Sword className="w-4 h-4" /> Treino
                </Link>
                <Link href="/personagem" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gradient-to-r hover:from-purple-500/80 hover:to-fuchsia-400/80 hover:text-black transition-all">
                  <User className="w-4 h-4" /> Personagem
                </Link>
              </nav>
              <main className="flex-1">
                {children}
              </main>
            </ToastProvider>
          </AuthProvider>
        </GameProvider>
      </body>
    </html>
  );
}
