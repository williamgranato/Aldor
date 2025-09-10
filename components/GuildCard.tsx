'use client';
// components/GuildCard.tsx
import React, { useMemo } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { seasonGradient } from '@/utils/seasonStyle';

export default function GuildCard(){
  const { state, createGuildCard } = useGame();
  const isMember = state.guild?.isMember;
  const rank = state.player?.adventurerRank || 'Sem Guilda';
  const world = state.world;
  const grad = seasonGradient?.[world?.season || 'Primavera'] || 'bg-zinc-900';

  const completed = state.guild?.completedQuests?.length || 0;
  const points = completed; // simplão: 1 ponto por missão concluída

  const handleJoin = ()=>{
    const info = { name: state.player?.character?.name || 'Aventureiro', origin: 'Desconhecido', role: 'Guerreiro', roleKey:'guerreiro' };
    createGuildCard(info);
  };

  return (
    <div className={`rounded-2xl p-4 border border-amber-800/30 ${grad}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-amber-200 font-semibold text-lg">Guilda de Aldor</div>
          <div className="text-sm opacity-80">Status: {isMember ? 'Membro ativo' : 'Não-membro'}</div>
          <div className="text-sm opacity-80">Rank: <span className="font-semibold">{rank}</span></div>
          <div className="text-xs opacity-70">Pontos de Contratos: {points}</div>
        </div>
        {!isMember && (
          <button onClick={handleJoin} className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold shadow">
            Inscrever-se (1 prata)
          </button>
        )}
      </div>
    </div>
  );
}