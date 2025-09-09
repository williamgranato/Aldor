'use client';
import React, { useMemo, useState } from 'react';
import { MarketCard } from '../components/market/MarketCard';
import { MarketModal } from '../components/market/MarketModal';
import { useDailyMarket } from '../hooks/useDailyMarket';
import type { GeneratedMarketItem } from '../types/market';
import { useGame } from '../providers/GameProvider';

const FILTERS = { type: ['all','weapon','armor','shield','trinket','potion'] as const, rarity: ['all','common','uncommon','rare','epic','legendary'] as const };

export function Market() {
  const game = (()=>{ try{ return useGame(); }catch{ return null as any; }})();
  const state = game?.state ?? { player: { level:1, coins:{gold:0,silver:0,bronze:0,copper:0}, equipped:{} }, world: { dateMs: Date.now() } };
  const actions = game?.actions; const slotId = (game as any)?.slotId ?? 0;

  const [selected, setSelected] = useState<GeneratedMarketItem|null>(null);
  const [query, setQuery] = useState('');
  const [fType, setFType] = useState<typeof FILTERS.type[number]>('all');
  const [fRarity, setFRarity] = useState<typeof FILTERS.rarity[number]>('all');

  const { state: marketState, seed, canAfford, buy, haggle } = useDailyMarket({
    worldDateMs: state.world.dateMs,
    playerLevel: state.player.level,
    coins: state.player.coins,
    equipped: state.player.equipped,
    slotId,
    season: (state.world as any)?.season,
    weather: (state.world as any)?.weather,
    temperature: (state.world as any)?.temperature,
    providerActions: actions,
  });

  const items = useMemo(() => {
    let arr = marketState?.items ?? [];
    if (query) arr = arr.filter(i=> i.name.toLowerCase().includes(query.toLowerCase()));
    if (fType!=='all') arr = arr.filter(i=> i.type===fType);
    if (fRarity!=='all') arr = arr.filter(i=> i.rarity===fRarity);
    return arr;
  }, [marketState, query, fType, fRarity]);

  function onBuy(id:string){ const res = buy(id); }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold">Mercado</h1>
          <div className="text-xs opacity-70">Rotação diária — seed {seed}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs opacity-70">Reputação</div>
          <div className="w-40 h-3 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${marketState?.rep ?? 0}%` }} /></div>
          {marketState && (<span className="text-xs opacity-80 ml-2">{marketState.rep < 34 ? '0% desc.' : marketState.rep < 67 ? '1% desc.' : marketState.rep < 100 ? '3% desc.' : '5% desc.'}</span>)}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <input value={query} onChange={e=> setQuery(e.target.value)} placeholder="Buscar item..." className="px-3 py-2 bg-white/10 rounded-lg outline-none focus:ring-2 ring-white/20"/>
        <select value={fType} onChange={e=> setFType(e.target.value as any)} className="px-3 py-2 bg-white/10 rounded-lg">{FILTERS.type.map(t=> <option key={t} value={t}>{t}</option>)}</select>
        <select value={fRarity} onChange={e=> setFRarity(e.target.value as any)} className="px-3 py-2 bg-white/10 rounded-lg">{FILTERS.rarity.map(t=> <option key={t} value={t}>{t}</option>)}</select>
      </div>
      {!marketState && (<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">{Array.from({length:10}).map((_,i)=>(<div key={i} className="h-36 rounded-2xl bg-white/5 animate-pulse" />))}</div>)}
      {marketState && (<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">{items.map(item => (<MarketCard key={item.id} item={item} onBuy={onBuy} onView={setSelected} canAfford={canAfford}/>))}</div>)}
      <MarketModal item={selected} onClose={()=> setSelected(null)} onBuy={onBuy} canAfford={canAfford} />
    </div>
  );
}
