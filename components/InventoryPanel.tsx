// components/InventoryPanel.tsx
'use client';
import React, { useMemo } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';

type Row = { id:string; name:string; qty:number };

export default function InventoryPanel(){
  const { state } = useGame();
  const rows: Row[] = useMemo(()=>{
    const inv:any[] = state.player?.inventory || [];
    const map = new Map<string, Row>();
    for(const it of inv){
      const id = it.id || it.name;
      if(!id) continue;
      const r = map.get(id) || { id, name: it.name || id, qty: 0 };
      r.qty += (it.qty || 1);
      map.set(id, r);
    }
    return [...map.values()].sort((a,b)=> a.name.localeCompare(b.name));
  }, [state.player?.inventory]);

  if(rows.length===0){
    return <div className="text-xs opacity-70">Inventário vazio. Faça missões para ganhar itens.</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {rows.map(r=>{
        const src = `/images/items/${r.id}.png`;
        return (
          <div key={r.id} className="rounded-lg border border-amber-900/40 bg-black/20 p-2 flex items-center gap-2">
            <img src={src} alt={r.name} className="w-8 h-8 object-contain rounded" onError={(e)=>{(e.target as HTMLImageElement).style.display='none';}} />
            <div className="text-xs">
              <div className="font-semibold text-amber-100">{r.name}</div>
              <div className="opacity-80">× {r.qty}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
