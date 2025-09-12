'use client';
import React from 'react';
import DeltaStatBadge from '@/components/DeltaStatBadge';

export default function ItemModal({item,equipped,onClose,onEquip,onUse}:{item:any;equipped:any;onClose:()=>void;onEquip:(slot:string,item:any)=>void;onUse:(item:any)=>void}){
  if(!item) return null;
  const src=`/images/items/${item.image||item.icon||item.id+'.png'}`;
  const slot=item.slot||'mão_principal';
  return(<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-neutral-900 p-6 rounded-xl w-96 relative">
      <button onClick={onClose} className="absolute top-2 right-2">✕</button>
      <div className="flex gap-3 mb-3">
        <img src={src} className="w-16 h-16"/>
        <div><div className="font-semibold">{item.name}</div><div className="text-xs">{item.rarity} {item.type}</div></div>
      </div>
      <div className="text-sm space-y-1">
        {item.atk&&<div>ATQ {item.atk}</div>}
        {item.def&&<div>DEF {item.def}</div>}
        {item.hp&&<div>HP {item.hp}</div>}
      </div>
      <DeltaStatBadge deltas={{atk:item.atk||0}}/>
      <div className="flex gap-2 mt-3">
        {item.slot&&<button onClick={()=>onEquip(slot,item)} className="px-3 py-1 bg-emerald-700 rounded">Equipar</button>}
        {item.type==='consumível'&&<button onClick={()=>onUse(item)} className="px-3 py-1 bg-amber-600 rounded">Usar</button>}
        <button onClick={onClose} className="px-3 py-1 bg-neutral-700 rounded">Fechar</button>
      </div>
    </div>
  </div>);
}
