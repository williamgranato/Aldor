// /components/MarketGrid.tsx
'use client';
import React, { useState } from 'react';
import type { Item } from '../data/items_catalog';
import ItemMiniCard from './ItemMiniCard';
import MarketItemModal from './MarketItemModal';

type Props = {
  items: Item[]; // ofertas atuais
  canAfford?: (item: Item) => boolean;
  onBuy?: (item: Item) => void;
  moneyToString?: (copper: number) => string;
};

export default function MarketGrid({ items, canAfford, onBuy, moneyToString }: Props) {
  const [selected, setSelected] = useState<Item | null>(null);
  const fmt = moneyToString ?? ((c:number)=> `${c}c`);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
        {items.map(it => {
          const afford = canAfford ? canAfford(it) : true;
          return (
            <div key={it.id} className="p-2 rounded-xl border border-neutral-800 bg-neutral-950/40">
              <ItemMiniCard item={it} mode="market" />
              <div className="mt-2 flex gap-2 items-center">
                <button
                  className={`text-[11px] px-2 py-1 rounded ${afford?'bg-emerald-700/80 hover:bg-emerald-700':'bg-neutral-800 cursor-not-allowed'}`}
                  onClick={()=> afford && onBuy?.(it)}
                  title={afford ? 'Comprar' : 'Moedas insuficientes'}
                  aria-disabled={!afford}
                >
                  Comprar ({fmt(it.valueCopper)})
                </button>
                <button
                  className="text-[11px] px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700"
                  onClick={()=> setSelected(it)}
                >
                  Ver mais
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <MarketItemModal item={selected} onClose={()=>setSelected(null)} />
    </div>
  );
}
