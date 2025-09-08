'use client';
import React from 'react';
import LoginGate from '../components/LoginGate';
import { useGame } from '../context/GameProvider';

export default function Page() {
  const { state, giveCoins, addXP } = useGame();
  return (
    <LoginGate>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card space-y-2">
          <h2 className="text-lg font-semibold">Bem-vindo(a) a Aldor</h2>
          <p>Escolha uma guia acima para começar. Use os botões rápidos para testar o progresso:</p>
          <div className="flex gap-2 flex-wrap">
            <button className="button" onClick={() => giveCoins({ silver: 5, bronze: 20 })}>Ganhar 5🪙 Prata & 20 Bronze</button>
            <button className="button" onClick={() => addXP(120)}>Ganhar 120 XP</button>
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Inventário</h3>
          <ul className="space-y-1">
            {state.player.inventory.length===0 && <li className="opacity-70">Vazio</li>}
            {state.player.inventory.map(it => (
              <li key={it.id} className="flex justify-between">
                <span>{it.name} {it.qty?`x${it.qty}`:''}</span>
                <span className="opacity-70">{it.rarity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </LoginGate>
  );
}
