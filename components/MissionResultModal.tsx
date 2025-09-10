// components/MissionResultModal.tsx
'use client';
import React from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';

export default function MissionResultModal(){
  const { state } = useGame();
  const res = (state as any)?.ui?.lastMissionResult;
  if(!res) return null;

  const close = ()=>{
    // limpar resultado leve
    (state as any).ui = { ...(state as any).ui, lastMissionResult: undefined };
    window.dispatchEvent(new Event('visibilitychange'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={close} />
      <div className="relative w-[min(560px,92vw)] rounded-2xl border border-amber-900/50 bg-amber-950/90 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="text-amber-100 font-semibold">Resultado da Missão</div>
          <button onClick={close} className="text-amber-300 hover:text-amber-100">✕</button>
        </div>
        <div className="text-sm">
          <div className={res.win ? 'text-emerald-400' : 'text-red-400'}>
            {res.win ? 'Sucesso!' : 'Falhou...'}
          </div>
          <div className="mt-1 text-xs opacity-80">Chance (~): <b>{res.chance ?? 0}%</b> • Dano recebido: <b>{res.hpLost ?? 0}</b></div>
          <div className="mt-2 opacity-90">XP: <b>{res.xp}</b> • Moedas: <b>{res.coinsCopper}¢</b></div>
          {Array.isArray(res.drops) && res.drops.length>0 && (
            <div className="mt-2">
              <div className="opacity-80 mb-1">Drops:</div>
              <div className="flex flex-wrap gap-2">
                {res.drops.map((d:any)=> (
                  <div key={d.id} className="px-2 py-1 text-xs rounded bg-black/30 border border-amber-900/40">
                    {d.id} × {d.qty}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button onClick={()=>{ close(); }} className="px-3 py-1.5 rounded bg-amber-500 text-black font-bold hover:bg-amber-400 shadow">Fechar</button>
        </div>
      </div>
    </div>
  );
}
