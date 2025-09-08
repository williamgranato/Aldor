'use client';
import React from 'react';
import LoginGate from '../../components/LoginGate';
import { useGame } from '../../context/GameProvider';

export default function NivelPage() {
  const { state, addXP, levelUpIfNeeded } = useGame();
  const p = state.player;
  const xpForNext = (lvl: number) => Math.floor(100 * Math.pow(1.2, lvl - 1));
  const next = xpForNext(p.level);

  return (
    <LoginGate>
      <div className="card space-y-3">
        <h2 className="text-lg font-semibold">Progresso</h2>
        <div>Nível atual: <b>{p.level}</b></div>
        <div>XP atual: <b>{p.xp}</b> / Próximo nível: <b>{next}</b></div>
        <div className="flex gap-2 flex-wrap">
          <button className="button" onClick={() => addXP(50)}>+50 XP</button>
          <button className="button" onClick={() => addXP(200)}>+200 XP</button>
          <button className="button" onClick={() => levelUpIfNeeded()}>Forçar Checagem de Nível</button>
        </div>
      </div>
    </LoginGate>
  );
}
