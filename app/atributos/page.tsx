'use client';
import React from 'react';
import LoginGate from '../../components/LoginGate';
import { useGame } from '../../context/GameProvider';
import type { AttributeKey } from '../../types';

const attrs: { key: AttributeKey; label: string }[] = [
  { key: 'strength', label: 'Força' },
  { key: 'agility', label: 'Agilidade' },
  { key: 'intelligence', label: 'Inteligência' },
  { key: 'vitality', label: 'Vitalidade' },
  { key: 'luck', label: 'Sorte' },
];

export default function AtributosPage() {
  const { state, bumpAttribute, giveCoins, takeCoins } = useGame();
  const p = state.player;
  return (
    <LoginGate>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card space-y-2">
          <h2 className="text-lg font-semibold">Atributos</h2>
          {attrs.map(a => (
            <div key={a.key} className="flex items-center justify-between gap-2">
              <div>{a.label}</div>
              <div className="flex items-center gap-2">
                <button className="button" onClick={() => bumpAttribute(a.key, -1)}>-</button>
                <div className="w-8 text-center">{p.attributes[a.key]}</div>
                <button className="button" onClick={() => bumpAttribute(a.key, +1)}>+</button>
              </div>
            </div>
          ))}
        </div>
        <div className="card space-y-2">
          <h2 className="text-lg font-semibold">Moedas</h2>
          <div className="flex gap-2 flex-wrap">
            <button className="button" onClick={() => giveCoins({ gold:1 })}>+1 Ouro</button>
            <button className="button" onClick={() => giveCoins({ silver:10 })}>+10 Prata</button>
            <button className="button" onClick={() => giveCoins({ bronze:10 })}>+10 Bronze</button>
            <button className="button" onClick={() => giveCoins({ copper:100 })}>+100 Cobre</button>
          </div>
        </div>
      </div>
    </LoginGate>
  );
}
