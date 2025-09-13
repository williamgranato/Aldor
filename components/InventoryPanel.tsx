'use client';
import React from 'react';
import DeltaStatBadge from '@/components/DeltaStatBadge';
import RarityBadge from '@/components/common/RarityBadge';

export default function InventoryPanel({inventory,onEquip,onUse,onDiscard,onInspect}:{inventory:{items:any[]};onEquip?:(item:any)=>void;onUse?:(item:any)=>void;onDiscard?:(item:any)=>void;onInspect?:(item:any)=>void;}){
  const rows=Array.isArray(inventory?.items)?inventory.items:[];
  return(<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
    {rows.map((it:any,idx:number)=>{
      const id=it.id||('item_'+idx);
      const src=`/images/items/${it.image||it.icon||id+'.png'}`;
      return(
        <div key={id} className="p-2 border border-neutral-700 rounded bg-neutral-900/60">
          <div className="flex items-center gap-2">
            <RarityBadge icon={src} name={it.name||id} rarity={it.rarity} />
          </div>
          <DeltaStatBadge deltas={{atk:it.atk||0}}/>
          <div className="mt-1 flex gap-1 flex-wrap">
            {onEquip && it.slot && (
              <button onClick={()=>onEquip(it)} className="px-2 bg-emerald-700 rounded text-xs">Equipar</button>
            )}
            {onUse && (it.type==='poção'||it.type==='comida'||it.type==='consumível') && (
              <button onClick={()=>onUse(it)} className="px-2 bg-amber-600 rounded text-xs">Usar</button>
            )}
            {onInspect && (
              <button onClick={()=>onInspect(it)} className="px-2 bg-indigo-700 rounded text-xs">Ver mais</button>
            )}
          </div>
        </div>
      );
    })}
  </div>);
}