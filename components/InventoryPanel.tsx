'use client';
import React, { useState } from 'react';
import DeltaStatBadge from '@/components/DeltaStatBadge';
import RarityBadge from '@/components/common/RarityBadge';

const TABS = [
  { key: 'consumiveis', label: 'Consumíveis' },
  { key: 'itens', label: 'Itens' },
  { key: 'materiais', label: 'Materiais' },
];

export default function InventoryPanel({
  inventory,
  onEquip,
  onUse,
  onDiscard,
  onInspect,
}: {
  inventory: { items: any[] };
  onEquip?: (item: any) => void;
  onUse?: (item: any) => void;
  onDiscard?: (item: any) => void;
  onInspect?: (item: any) => void;
}) {
  const rows = Array.isArray(inventory?.items) ? inventory.items : [];
  const [tab, setTab] = useState('consumiveis');

  const filtered = rows.filter((it: any) => {
    const type = (it.type || '').toLowerCase();
    if (tab === 'consumiveis') return ['poção','pocao','comida','consumível','consumable'].some(k=> type.includes(k));
    if (tab === 'itens') return ['arma','armadura','joia','sword','shield','helmet','armor','weapon'].some(k=> type.includes(k));
    if (tab === 'materiais') return type === 'material';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Abas */}
      <div className="flex gap-2">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={()=> setTab(t.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition 
              ${tab===t.key
                ? 'bg-amber-600/30 border border-amber-400 text-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                : 'bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-amber-300 hover:border-amber-500/50'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Itens filtrados */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.length===0 && (
          <div className="col-span-full text-center text-sm opacity-70 py-6">
            Nenhum item nesta aba.
          </div>
        )}
        {filtered.map((it:any, idx:number) => {
          const id = it.id || ('item_'+idx);
          const src = `/images/items/${it.image || it.icon || id+'.png'}`;
          return (
            <div key={id} className="p-2 border border-neutral-700 rounded-lg bg-slate-900/60 hover:border-amber-500/50 transition">
              <div className="flex items-center gap-2">
                <RarityBadge icon={src} name={it.name||id} rarity={it.rarity} />
              </div>
              <DeltaStatBadge deltas={{atk:it.atk||0,def:it.defense||0,hp:it.hp||0}}/>
              <div className="mt-1 flex gap-1 flex-wrap">
                {onEquip && it.slot && (
                  <button onClick={()=>onEquip(it)} className="px-2 bg-emerald-700 hover:bg-emerald-600 rounded text-xs transition">Equipar</button>
                )}
                {onUse && (['poção','pocao','comida','consumível'].some(k=> (it.type||'').toLowerCase().includes(k))) && (
                  <button onClick={()=>onUse(it)} className="px-2 bg-amber-600 hover:bg-amber-500 rounded text-xs transition">Usar</button>
                )}
                {onInspect && (
                  <button onClick={()=>onInspect(it)} className="px-2 bg-indigo-700 hover:bg-indigo-600 rounded text-xs transition">Ver mais</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
