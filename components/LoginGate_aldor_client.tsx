'use client';
import React from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import RegistrationCard from './RegistrationCard';

export default function LoginGateAldor({ children }: { children: React.ReactNode }){
  const { state } = useGame();
  const name = state.player?.character?.name || '';
  const hasChar = !!name.trim(); // só considera logado se tiver nome válido
  if (!hasChar) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <RegistrationCard />
      </div>
    );
  }
  return <>{children}</>;
}
