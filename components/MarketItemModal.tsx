// /components/MarketItemModal.tsx
'use client';
import React, { useEffect, useRef } from 'react';
import type { Item } from '../data/items_catalog';

type Props = { item: Item | null; onClose: () => void };

export default function MarketItemModal({ item, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    function onKey(e: KeyboardEvent){ if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div ref={ref} className="w-[min(92vw,640px)] max-h-[80vh] overflow-auto rounded-2xl bg-neutral-900 border border-neutral-700 p-4 focus:outline-none" tabIndex={-1}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">{item.name}</div>
          <button className="text-xs text-neutral-300 hover:text-white" onClick={onClose} aria-label="Fechar">✕</button>
        </div>
        <div className="flex gap-3">
          <img src={`/images/items/${item.image}`} alt={item.name} title={item.name} className="w-16 h-16 object-contain rounded" />
          <div className="text-xs text-neutral-300 space-y-1">
            <div><b>Tipo:</b> {item.type}{item.slot?` • ${item.slot}`:''}</div>
            <div><b>Nível requerido:</b> {item.reqLevel} • <b>Raridade:</b> {item.rarity}{item.material?` • ${item.material}`:''}</div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {item.atk!=null ? <span><b>ATQ:</b> {item.atk}</span> : null}
              {item.def!=null ? <span><b>DEF:</b> {item.def}</span> : null}
              {item.crit!=null ? <span><b>CRIT:</b> {item.crit}%</span> : null}
              {item.dodge!=null ? <span><b>DODGE:</b> {item.dodge}%</span> : null}
              {item.bonuses?.HP ? <span><b>HP:</b> +{item.bonuses.HP}</span> : null}
            </div>
            {item.bonuses ? (
              <div><b>Bônus:</b> {Object.entries(item.bonuses).map(([k,v])=>`${k}+${v}`).join(', ')}</div>
            ) : null}
            {item.durability!=null ? <div><b>Durabilidade:</b> {item.durability}</div> : null}
            {item.sockets!=null ? <div><b>Sockets:</b> {item.sockets}</div> : null}
            {item.setId ? <div><b>Conjunto:</b> {item.setId}</div> : null}
            <div><b>Valor:</b> {item.valueCopper}c</div>
            <div className="text-[11px] text-neutral-400">Dica: Gemas aumentam atributos. Reparos no ferreiro.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
