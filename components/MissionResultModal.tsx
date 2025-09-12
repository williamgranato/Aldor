// components/MissionResultModal.tsx
'use client';
import React from 'react';
import * as itemsCatalog from '@/data/items_catalog';
import { useGame } from '@/context/GameProvider_aldor_client';


const anyItems:any = itemsCatalog as any;
function findCatalogItem(id:string){
  const arrays = [anyItems.ITEMS, anyItems.EXTRA_ITEMS, anyItems.GEMS];
  for(const arr of arrays){ if(Array.isArray(arr)){ const it = arr.find((x:any)=> x.id===id); if(it) return it; } }
  return anyItems[id];
}

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
                  (d:any)=> (
                    <div key={d.id} className="px-2 py-1 text-xs rounded bg-black/30 border border-amber-900/40">
                      <div className="flex items-center gap-2">
                        <div className={'w-8 h-8 rounded-md ring-2 bg-black/40 p-0.5 flex items-center justify-center ' + (d.rarity==='mítico'?'ring-amber-400': d.rarity==='lendário'?'ring-orange-400': d.rarity==='épico'?'ring-violet-400': d.rarity==='raro'?'ring-blue-400': d.rarity==='incomum'?'ring-emerald-400':'ring-gray-400')} title={(d.name||'Item') + (d.rarity? ' — '+d.rarity : '')}>
                          <img src={(d.icon?.startsWith('/')? d.icon : '/'+(d.icon||'')) || '/images/items/unknown.png'} className="w-full h-full object-contain" />
                        </div>
                        <div className="text-xs font-medium max-w-[12rem] truncate">{d.name}</div>
                      </div>
                    </div>
                  )))}
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
