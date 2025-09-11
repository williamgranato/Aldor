'use client';
import React from 'react';

export default function InventoryPanel({ inventory }: { inventory:any }) {
  const rows = inventory?.items ?? [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {rows.map((it:any, idx:number)=>{
        const id = it.id || it.name || ('item_'+idx);
        const src = `/images/items/${id}.png`;
        const hasDura = typeof it.durability === 'number';
        return (
          <div key={id} className="p-2 border border-slate-700 rounded bg-slate-800/50 flex flex-col items-center text-xs">
            <img src={src} alt={id} className="w-10 h-10 object-contain mb-1" />
            <div className="font-semibold">{it.name || id}</div>
            {it.qty && <div>Qtd: {it.qty}</div>}
            {hasDura && <div>Dur: {it.durability}</div>}
          </div>
        );
      })}
    </div>
  );
}
