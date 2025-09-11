'use client';
import React, { useState } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import DeltaStatBadge from '@/components/DeltaStatBadge';

type Props={inventory:{items:any[]};onEquip?:(item:any)=>void;onUse?:(item:any)=>void;onDiscard?:(item:any)=>void;};

export default function InventoryPanel({inventory,onEquip,onUse,onDiscard}:Props){
  const rows=Array.isArray(inventory?.items)?inventory.items:[];
  const game=useGame();
  const equipped = game.state?.player?.equipped || {};
  const [hoverId,setHoverId]=useState<string|null>(null);

  function computeDelta(item:any){
    if(!item?.slot) return {};
    const currentId = equipped[item.slot]?.itemId;
    if(currentId===item.id) return {};
    const cur = rows.find(x=>x.id===currentId) || {};
    const keys=['atk','def','hp','crit'];
    const deltas:Record<string,number>={};
    keys.forEach(k=>{
      const a=item?.[k]||0;
      const b=cur?.[k]||0;
      const d=a-b;
      if(d!==0) deltas[k]=d;
    });
    return deltas;
  }

  return(<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
    {rows.map((it:any,idx:number)=>{
      const id=it.id||('item_'+idx);
      const src=`/images/items/${it.image||it.icon||id+'.png'}`;
      const showDelta=hoverId===id;
      return(<div key={id}
        className="p-2 border border-neutral-800 rounded-2xl bg-neutral-900/60 hover:bg-neutral-800 transition"
        onMouseEnter={()=>setHoverId(id)} onMouseLeave={()=>setHoverId(null)}
      >
        <div className="flex items-center gap-3">
          <img src={src} alt={id} className="w-12 h-12 object-contain rounded-lg"/>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{it.name||id}</div>
            <div className="text-xs text-neutral-400">
              {(it.qty!=null)&&<span className="mr-2">Qtd: {it.qty}</span>}
              {it.rarity&&<span className="mr-2">{it.rarity}</span>}
              {it.slot&&<span className="mr-2">{it.slot}</span>}
            </div>
          </div>
        </div>
        {showDelta && <DeltaStatBadge deltas={computeDelta(it)} />}
        <div className="mt-2 flex items-center gap-2">
          {onEquip&&it.slot&&<button className="px-2 py-1 text-xs bg-emerald-700 hover:bg-emerald-600" onClick={()=>onEquip(it)}>Equipar</button>}
          {onUse&&it.type==='consumível'&&<button className="px-2 py-1 text-xs bg-amber-600 hover:bg-amber-500" onClick={()=>onUse(it)}>Usar</button>}
          {onDiscard&&<button className="px-2 py-1 text-xs bg-rose-800 hover:bg-rose-700" onClick={()=>onDiscard(it)}>Descartar</button>}
        </div>
      </div>);
    })}
  </div>);
}
