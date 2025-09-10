// components/AppHeader.tsx (patchado para exibir stamina)
'use client';
import React from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';

export default function AppHeader(){
  const { state } = useGame();
  const stamina = state.player.stamina;
  return (
    <div className="flex items-center gap-4 p-2 bg-amber-950/30 border-b border-amber-900/40">
      <div className="text-amber-100 font-bold">{state.player.character.name}</div>
      <div className="text-xs text-amber-200">HP {state.player.stats.hp}/{state.player.stats.maxHp}</div>
      <div className="text-xs text-amber-200">Stamina {stamina.current}/{stamina.max}</div>
      <div className="ml-auto flex gap-2 text-xs text-amber-300">
        <span>💰 {state.player.coins.gold}g {state.player.coins.silver}s {state.player.coins.bronze}b {state.player.coins.copper}c</span>
      </div>
    </div>
  );
}
