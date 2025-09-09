// /components/EquipmentPanel.tsx
import React from 'react';
import type { EquippedState } from '../data/items_catalog';
import { ITEMS as CATALOG } from '../data/items_catalog';
import ItemCard from './ItemCard';

type Props = {
  /** Pode vir indefinido na primeira renderização — tratamos como objeto vazio */
  equipped?: EquippedState;
  onSelectSlot?: (slot: string) => void;
};

const SLOTS = ['cabeça','ombros','peito','mãos','cintura','pernas','pés','mão_principal','mão_secundária','anel_1','anel_2','amuleto','manto','acessório'];

export default function EquipmentPanel({ equipped, onSelectSlot }: Props) {
  const eq = equipped ?? {}; // evita TypeError: reading 'cabeça' of undefined
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {SLOTS.map((slot) => {
        const data = (eq as any)[slot];
        const item = data ? CATALOG.find(i => i.id === data.itemId) : undefined;
        return (
          <div key={slot} className="p-2 rounded-xl bg-neutral-900/50 border border-neutral-800">
            <div className="text-[11px] uppercase tracking-wide text-neutral-400 mb-1">{slot.replace('_',' ')}</div>
            {item ? (
              <ItemCard item={item} onClick={() => onSelectSlot?.(slot)} />
            ) : (
              <div
                className="h-16 rounded-xl bg-neutral-950/60 border border-dashed border-neutral-700 flex items-center justify-center text-neutral-500 cursor-pointer"
                onClick={() => onSelectSlot?.(slot)}
              >
                vazio
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
