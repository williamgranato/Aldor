'use client';
import React from 'react';
import DeltaStatBadge from '@/components/DeltaStatBadge';

export default function InventoryPanel({inventory,onEquip,onUse,onDiscard,onInspect}:{inventory:{items:any[]};onEquip?:(item:any)=>void;onUse?:(item:any)=>void;onDiscard?:(item:any)=>void;onInspect?:(item:any)=>void;}){
  const rows=Array.isArray(inventory?.items)?inventory.items:[];
  return(<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
    {rows.map((it:any,idx:number)=>{
      const id=it.id||('item_'+idx);
      const src=`/images/items/${it.image||it.icon||id+'.png'}`;
      return(<div key={id} className="p-2 border border-neutral-700 rounded bg-neutral-900/60">
        <div className="flex items-center gap-2">
          <img src={src} className="w-10 h-10"/>
          <div className="flex-1">
            <div className="font-semibold text-sm">{it.name||id}</div>
            <div className="text-xs text-neutral-400">{it.rarity}</div>
          </div>
        </div>
        <DeltaStatBadge deltas={{atk:it.atk||0}}/>
        <div className="mt-1 flex gap-1 flex-wrap">
          {onEquip&&it.slot&&<button onClick={()=>onEquip(it)} className="px-2 bg-emerald-700 rounded text-xs">Equipar</button>}
          {onUse&&(it.type==='consumível'||it.type==='poção'||it.type==='comida')&&<button onClick={()=>onUse(it)} className="px-2 bg-amber-600 rounded text-xs">Usar</button>}
          {onInspect&&<button onClick={()=>onInspect(it)} className="px-2 bg-indigo-700 rounded text-xs">Ver mais</button>}
        </div>
      </div>);
    })}
  </div>);
}
