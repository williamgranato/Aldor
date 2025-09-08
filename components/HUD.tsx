'use client';
import React from 'react';
import { useGame } from '../context/GameProvider';

export default function HUD() {
  const { state } = useGame();
  const p = state.player;

  const Coin = ({ src, alt, value }: any) => (
    <span className="inline-flex items-center gap-1">
      <img src={src} alt={alt} className="h-4 w-4 object-contain" />
      <span>{value}</span>
    </span>
  );

  return (
    <div className="container my-3 flex flex-wrap items-center gap-4 p-2 rounded-xl border border-zinc-800 bg-black/30">
      <div className="font-semibold">{p.character?.name || 'Sem Nome'}</div>
      <div className="opacity-80">Nv. {p.level}</div>
      <div className="opacity-80">XP: {p.xp}</div>
      <div className="flex items-center gap-3 ml-auto">
        <Coin src="/images/items/gold.png" alt="Ouro" value={p.coins.gold} />
        <Coin src="/images/items/silver.png" alt="Prata" value={p.coins.silver} />
        <Coin src="/images/items/bronze.png" alt="Bronze" value={p.coins.bronze} />
        <Coin src="/images/items/copper.png" alt="Cobre" value={p.coins.copper} />
      </div>
    </div>
  );
}
