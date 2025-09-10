'use client';
import React from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
// created earlier
export default function InventoryPanel(){
  const { state } = useGame();
  const rows: any[] = React.useMemo(()=>{
    const inv:any[] = state.player?.inventory || [];
    return inv;
  }, [state.player?.inventory]);

  function barClass(p:number){
    if(p>=70) return 'bg-emerald-500';
    if(p>=30) return 'bg-yellow-400';
    return 'bg-red-500';
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {rows.map((it:any, idx:number)=>{
        const id = it.id || it.name || ('item_'+idx);
        const src = `/images/items/${id}.png`;
        const hasDura = typeof it.durability === 'number';
        const max = it.durabilityMax || 100;
        const pct = hasDura ? Math.max(0, Math.round((it.durability / max) * 100)) : null;

        return (
          <div key={id+'_'+idx} className="rounded-lg border border-amber-900/40 bg-black/20 p-2">
            <div className="flex items-center gap-2">
              <img src={src} alt={id} className="w-8 h-8 object-contain rounded" onError={(e)=>{(e.target as HTMLImageElement).style.display='none';}} />
              <div className="text-xs">
                <div className="font-semibold text-amber-100">{it.name || id}</div>
                {typeof it.qty === 'number' && <div className="opacity-80">× {it.qty}</div>}
              </div>
            </div>

            {hasDura && (
              <div className="mt-2">
                <div className="w-full h-2 bg-black/40 rounded overflow-hidden">
                  <div className={`h-full ${barClass(pct!)}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="text-[10px] opacity-70 mt-1">{pct}% durabilidade</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}