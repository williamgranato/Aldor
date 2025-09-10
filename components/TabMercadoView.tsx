// /components/TabMercadoView.tsx
'use client';
// Integra Mercado com atributos, cards e modal, sem mudanças em outros arquivos.

import React, { useEffect, useMemo, useState } from 'react';
import MarketGrid from './MarketGrid';
import { ITEMS, type Item } from '@/data/items_catalog';

type ProviderAPI = {
  getMoneyCopper: () => number;
  getMarketOffers: () => Item[];
  buy: (item: Item) => void;
  formatCoinsFromCopper?: (c:number)=>string;
};

export default function TabMercadoView() {
  const [api, setApi] = useState<ProviderAPI | null>(null);
  const [offers, setOffers] = useState<Item[]>([]);
  const [copper, setCopper] = useState<number>(0);
  const [fmt, setFmt] = useState<(c:number)=>string>(()=> (c)=> `${c}c`);

  useEffect(() => {
    let mounted = true;
    async function load() {
      let hook: any = null;
      try {
        const p1 = await import('@/providers/GameProvider').catch(()=>null);
        const p2 = !p1 ? await import('@/context/GameContext').catch(()=>null) : null;
        const mod = p1 ?? p2;
        const useHook = mod?.useGame ?? mod?.useAldor ?? mod?.usePlayer ?? null;
        hook = useHook ? useHook() : (typeof window !== 'undefined' ? (window as any).__aldorHook?.() : null);
      } catch {}
      if (!mounted) return;

      if (hook) {
        const apiBuilt: ProviderAPI = {
          getMoneyCopper: () => hook.moneyCopper ?? hook.money?.copper ?? 0,
          getMarketOffers: () => hook.marketOffers ?? [],
          buy: (item) => hook.buy?.(item),
          formatCoinsFromCopper: hook.formatCoinsFromCopper ?? hook.moneyToString,
        };
        setApi(apiBuilt);
        setOffers(apiBuilt.getMarketOffers());
        setCopper(apiBuilt.getMoneyCopper());
        if (apiBuilt.formatCoinsFromCopper) setFmt(()=>apiBuilt.formatCoinsFromCopper!);
      } else {
        // Fallback: sem provider, oferta dummy para UI não quebrar
        setApi(null);
        setOffers(ITEMS.filter(i => i.type !== 'material').slice(0, 6));
        setCopper(0);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!api) return;
    const id = setInterval(() => {
      setOffers(api.getMarketOffers());
      setCopper(api.getMoneyCopper());
    }, 500);
    return () => clearInterval(id);
  }, [api]);

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
        <div className="text-sm font-semibold mb-2">Mercado</div>
        <MarketGrid
          items={offers}
          canAfford={(it)=> copper >= it.valueCopper}
          onBuy={(it)=> api?.buy(it)}
          moneyToString={fmt}
        />
      </div>
    </div>
  );
}
