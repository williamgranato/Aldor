// components/MissionResultModal.tsx
'use client';
import React from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';

export default function MissionResultModal(){
  const { state, undertakeQuest } = useGame();
  const res = (state as any)?.ui?.lastMissionResult;
  const [closing, setClosing] = React.useState(false);
  if(!res) return null;

  function close(){
    setClosing(true);
    setTimeout(()=>{
      // soft clear: remove only lastMissionResult from ui
      (state as any).ui = { ...(state as any).ui, lastMissionResult: undefined };
      // Force a micro rerender by touching updatedAt if provider doesn't expose setter; hacky but works here
      // In projetos reais, expor um setUi no provider.
      window.dispatchEvent(new Event('visibilitychange'));
      setClosing(false);
    }, 120);
  }

  function retry(){
    close();
    // Reexecuta mesma missão (sem cadeia automática)
    // Nota: aqui precisaríamos do objeto completo da missão; passamos um minimal usando apenas id/title.
    undertakeQuest({ id: res.id, title: res.title, rewards: { coinsCopper: res.coinsCopper, xp: res.xp } } as any);
  }

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
          <button onClick={retry} className="px-3 py-1.5 rounded bg-amber-500 text-black font-bold hover:bg-amber-400 shadow">Tentar de novo</button>
          {/* Próxima da cadeia: inferir convenção id_1 -> id_2 -> id_3 */}
          {/_/.test(res.id) && !res.win && (
            <button onClick={()=>{ close(); const next = res.id.replace(/_(\d)$/,(m)=>'_'+(parseInt(m[1])+1)); undertakeQuest({ id: next, title: next, rewards:{coinsCopper: res.coinsCopper, xp: res.xp} } as any); }} className="px-3 py-1.5 rounded bg-amber-300 text-black font-bold hover:bg-amber-200 shadow">
              Próxima da cadeia
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
