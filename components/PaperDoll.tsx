// /components/PaperDoll.tsx
'use client';
import React, { useMemo, useState } from 'react';
import type { EquippedState, Item, Slot } from '../data/items_catalog';
import { ITEMS } from '../data/items_catalog';
import ItemMiniCard from './ItemMiniCard';

type Props = {
  equipped?: EquippedState;
  inventory?: Item[]; // passe seu inventário do provider
  onEquip?: (slot: Slot, item: Item) => void;
  onUnequip?: (slot: Slot) => void;
};

const SLOTS: Slot[] = ['cabeça','ombros','peito','mãos','cintura','pernas','pés','mão_principal','mão_secundária','anel_1','anel_2','amuleto','manto','acessório'];

function slotCompatible(slot: Slot, item: Item): boolean {
  if (!item.slot) return false;
  if (slot === 'mão_secundária' && item.slot === 'mão_principal') return false;
  if (slot === 'mão_secundária' && item.type === 'arma' && (item.durability ?? 0) > -1) {
    // escudo só na secundária
    return item.slot === 'mão_secundária';
  }
  return item.slot === slot;
}

export default function PaperDoll({ equipped, inventory, onEquip, onUnequip }: Props) {
  const eq = equipped ?? {};
  const [activeSlot, setActiveSlot] = useState<Slot | null>(null);
  const [q, setQ] = useState('');

  const filteredList = useMemo(() => {
    if (!activeSlot) return [];
    const src = (inventory && inventory.length ? inventory : ITEMS) as Item[];
    const bySlot = src.filter(it => slotCompatible(activeSlot, it));
    const byText = q.trim() ? bySlot.filter(it => (it.name + it.material + it.rarity + it.id).toLowerCase().includes(q.toLowerCase())) : bySlot;
    // ordenar por "poder" simples: atk+def + crit/2
    const score = (it: Item) => (it.atk ?? 0) + (it.def ?? 0) + ((it.crit ?? 0) * 0.5);
    return byText.sort((a,b) => score(b) - score(a));
  }, [activeSlot, inventory, q]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Silhueta e slots */}
      <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
        <div className="text-sm font-semibold mb-2">Equipamentos</div>
        <div className="grid grid-cols-2 gap-2">
          {SLOTS.map((slot) => {
            const data = (eq as any)[slot];
            const it = data ? ITEMS.find(i => i.id === data.itemId) : undefined;
            return (
              <button
                key={slot}
                className={`p-2 rounded-xl border text-left text-sm ${activeSlot===slot?'border-amber-500 bg-neutral-800/50':'border-neutral-800 bg-neutral-950/40'} hover:border-neutral-600 transition`}
                onClick={() => setActiveSlot(slot)}
                title={slot}
                aria-pressed={activeSlot===slot}
              >
                <div className="text-[11px] uppercase text-neutral-400 mb-1">{slot.replace('_',' ')}</div>
                {it ? (
                  <ItemMiniCard item={it} compact />
                ) : (
                  <div className="h-12 text-neutral-500 text-xs flex items-center">vazio</div>
                )}
                {it ? (
                  <div className="mt-1">
                    <button
                      className="text-[11px] px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700"
                      onClick={(e) => { e.stopPropagation(); onUnequip?.(slot); }}
                    >
                      Desequipar
                    </button>
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Seletor por slot */}
      <div className="md:col-span-1 p-2 rounded-2xl bg-neutral-900/60 border border-neutral-800">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="text-sm font-semibold">
            {activeSlot ? `Selecionar para: ${activeSlot.replace('_',' ')}` : 'Selecione um slot'}
          </div>
          <input
            className="px-2 py-1 rounded bg-neutral-950/60 border border-neutral-800 text-xs w-40"
            placeholder="buscar..."
            value={q}
            onChange={(e)=>setQ(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-72 overflow-auto pr-1">
          {activeSlot ? filteredList.map(it => (
            <div key={it.id} className="p-2 rounded-xl border border-neutral-800 bg-neutral-950/40">
              <ItemMiniCard item={it} />
              <div className="mt-2 flex gap-2">
                <button
                  className="text-[11px] px-2 py-1 rounded bg-emerald-700/80 hover:bg-emerald-700"
                  onClick={()=>onEquip?.(activeSlot, it)}
                >
                  Equipar
                </button>
                <button
                  className="text-[11px] px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700"
                  onClick={()=>{
                    // comparação simples: só indica que o modal externo deve abrir
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('aldor:compare', { detail: { slot: activeSlot, item: it } }));
                    }
                  }}
                >
                  Comparar
                </button>
              </div>
            </div>
          )) : <div className="text-[11px] text-neutral-400">Clique em um slot para filtrar itens compatíveis.</div>}
        </div>
      </div>
    </div>
  );
}
