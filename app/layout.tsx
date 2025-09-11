'use client';
import './globals.css';
import { Inter } from 'next/font/google';
import AppHeader from '@/components/AppHeader';
import NavMenu from '@/components/NavMenu';
import { GameProvider } from '@/context/GameProvider_aldor_client';
import { AuthProvider } from '@/context/AuthProvider_aldor_client';
import { ToastProvider } from '@/components/ToastProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <GameProvider>
          <AuthProvider>
            <ToastProvider>
              <AppHeader />
              <NavMenu />
              {children}
            </ToastProvider>
          </AuthProvider>
        </GameProvider>
      </body>
    </html>
  );
}
