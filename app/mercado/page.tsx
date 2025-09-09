// /app/mercado/page.tsx
'use client';
import React, { useMemo } from 'react';
import MarketGrid from '@/components/MarketGrid';
import { ITEMS, type Item } from '@/data/items_catalog';
import { useGame } from '@/context/GameProvider_aldor_client';

export default function MercadoPage() {
  const game = useGame();
  const s = game.state;

  const offers: Item[] = (s.market?.catalog ?? ITEMS.filter(i=>i.type!=='material').slice(0,6)) as any;
  const copper = s.player?.coins?.copper ?? 0;
  const fmt = (c:number)=> `${c}c`; // plugue seu util se preferir

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
        <div className="text-sm font-semibold mb-2">Mercado</div>
        <MarketGrid
          items={offers}
          canAfford={(it)=> copper >= it.valueCopper}
          onBuy={(it)=> { game.buyItem?.(it, 1); }}
          moneyToString={fmt}
        />
      </div>
    </div>
  );
}
