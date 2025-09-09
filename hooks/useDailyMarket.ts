'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { GeneratedMarketItem, MarketItem, MarketState, SeasonalContext } from '../types/market';
import { formatSeedFromDateMs, mulberry32, seedFromString } from '../utils/seed';
import { applyDiscount, applySeasonalPricing } from '../utils/marketPricing';

// Catálogo esperado em ../data/items_catalog
import * as Catalog from '../data/items_catalog';

type UseDailyMarketArgs = {
  worldDateMs: number;
  playerLevel: number;
  coins: { gold:number; silver:number; bronze:number; copper:number };
  equipped?: Record<string, any>;
  slotId?: string|number;
  season?: SeasonalContext['season'];
  weather?: SeasonalContext['weather'];
  temperature?: number;
  providerActions?: {
    inventory?: { add?: (item:any)=>void };
    coins?: { deduct?: (price:any)=>void };
    market?: { buy?: (item:any, price:any)=>void };
    save?: { autosave?: (reason:string)=>void, patchSlot?: (key:string, data:any)=>void, loadSlotKey?: (key:string)=>any };
  }
};
const DAILY_COUNT = 50;
const FLASH_COUNT = 3;
const FLASH_DURATION_MS = 60 * 60 * 1000; // 1h jogo

function rarityWeight(r: string) { switch(r){ case 'legendary':return 1; case 'epic':return 3; case 'rare':return 8; case 'uncommon':return 18; default:return 70; } }
function weightedSample<T extends MarketItem>(rng:()=>number, arr:T[], k:number):T[] {
  const bag:T[]=[]; for (const it of arr) { const w=rarityWeight(it.rarity); for(let i=0;i<w;i++) bag.push(it); }
  const res:T[]=[]; while (res.length<k && bag.length) { res.push(bag.splice(Math.floor(rng()*bag.length),1)[0]); } return res;
}
function toSeed(ms:number) { return formatSeedFromDateMs(ms); }
function storageKey(slotId:any, seed:string) { return `marketState:${slotId ?? 'default'}:${seed}`; }

export function useDailyMarket(args: UseDailyMarketArgs){
  const { worldDateMs, playerLevel, coins, equipped, slotId, season, weather, temperature, providerActions } = args;
  const seed = useMemo(()=> toSeed(worldDateMs), [worldDateMs]);
  const rng = useMemo(()=> mulberry32(seedFromString(seed)), [seed]);
  const [state, setState] = useState<MarketState|null>(null);
  const seasonalCtx: SeasonalContext|undefined = useMemo(()=>{ if(!season||!weather||typeof temperature!=='number') return undefined; return { season, weather, temperature }; },[season,weather,temperature]);

  useEffect(()=>{
    const key = storageKey(slotId, seed);
    let persisted:MarketState|null = null;
    try { persisted = providerActions?.save?.loadSlotKey?.(key) ?? null; } catch{}
    if(!persisted) { try { const raw=localStorage.getItem(key); if(raw) persisted=JSON.parse(raw); } catch{} }
    if(persisted && persisted.seed===seed) { setState(persisted); return; }

    const allItems = Object.values((Catalog as any).default ?? Catalog) as MarketItem[];
    const flat: MarketItem[] = Array.isArray(allItems) ? allItems : Object.values(allItems).flat();
    const pool = flat.filter(Boolean);
    const sampled = weightedSample(rng, pool, DAILY_COUNT);

    const flashIdx = new Set<number>(); while (flashIdx.size < Math.min(FLASH_COUNT, sampled.length)) flashIdx.add(Math.floor(Math.abs(seedFromString(seed+'#'+flashIdx.size)) % sampled.length));

    const gen = sampled.map((it,idx)=>{
      const stock = 1 + Math.floor(mulberry32(seedFromString(seed+':'+it.id+':stock'))()*3);
      const isFlash = flashIdx.has(idx);
      const base = it.price;
      const seasonal = applySeasonalPricing(base, { ...(it as any), stock, isFlash }, seasonalCtx);
      return {
        ...(it as any),
        stock,
        isFlash,
        flashEndsAtMs: isFlash ? worldDateMs + FLASH_DURATION_MS : undefined,
        discountedPrice: isFlash ? applyDiscount(seasonal, 0.15) : undefined,
        price: seasonal
      };
    });

    const next:MarketState = { seed, items: gen, rep: 0, haggledIds: {}, slotId: slotId as any };
    setState(next);
    persist(next);
    function persist(s:MarketState){ try{providerActions?.save?.patchSlot?.(key, s)}catch{} try{localStorage.setItem(key, JSON.stringify(s))}catch{} }
  }, [seed, slotId]); // regera no virar do dia

  function persist(s:MarketState){
    const key = storageKey(slotId, s.seed);
    try{providerActions?.save?.patchSlot?.(key, s)}catch{}
    try{localStorage.setItem(key, JSON.stringify(s))}catch{}
  }
  function csum(p:{gold:number;silver:number;bronze:number;copper:number}){ return (((p.gold*100+p.silver)*100+p.bronze)*100+p.copper); }
  function canAfford(price: any){ const wallet = csum(coins as any); return wallet >= csum(price); }

  function buy(itemId:string){
    if(!state) return {ok:false, reason:'no_state' as const};
    const idx = state.items.findIndex(i=> i.id===itemId);
    if(idx<0) return {ok:false, reason:'not_found' as const};
    const it = state.items[idx];
    const price = it.discountedPrice ?? it.price;
    if(!canAfford(price)) return {ok:false, reason:'no_coins' as const};
    if(it.stock<=0) return {ok:false, reason:'sold_out' as const};

    let finalPrice = price;
    if(state.rep>=100) finalPrice = applyDiscount(finalPrice, 0.05);
    else if(state.rep>=67) finalPrice = applyDiscount(finalPrice, 0.03);
    else if(state.rep>=34) finalPrice = applyDiscount(finalPrice, 0.01);

    const newItems = [...state.items]; newItems[idx] = { ...it, stock: it.stock - 1 };
    const newState:MarketState = { ...state, items: newItems, rep: Math.min(100, state.rep + 1) };
    setState(newState); persist(newState);

    try{providerActions?.market?.buy?.(it, finalPrice)}catch{}
    try{providerActions?.coins?.deduct?.(finalPrice)}catch{}
    try{providerActions?.inventory?.add?.(it)}catch{}
    try{providerActions?.save?.autosave?.('market_buy')}catch{}

    window.dispatchEvent(new CustomEvent('market:buy', { detail: { item: it, finalPrice, slotId } }));
    window.dispatchEvent(new CustomEvent('coins:deduct', { detail: { price: finalPrice } }));
    window.dispatchEvent(new CustomEvent('inventory:add', { detail: { item: it } }));
    window.dispatchEvent(new CustomEvent('save:autosave', { detail: { reason: 'market_buy' } }));
    return { ok:true as const };
  }

  function haggle(itemId:string, charisma:number=0, luck:number=0){
    if(!state) return {ok:false, reason:'no_state' as const};
    if(state.haggledIds[itemId]) return {ok:false, reason:'already_haggled' as const};
    const idx = state.items.findIndex(i=> i.id===itemId); if(idx<0) return {ok:false, reason:'not_found' as const};
    const it = state.items[idx];
    const baseChance = 0.2 + (charisma*0.005) + (luck*0.003);
    const roll = mulberry32(seedFromString(state.seed + ':' + itemId))();
    const success = roll < Math.min(0.6, baseChance);
    const newItems = [...state.items];
    if(success){
      const det = mulberry32(seedFromString('haggle:'+state.seed+':'+itemId))();
      const pct = 0.05 + det*0.05;
      newItems[idx] = { ...it, discountedPrice: applyDiscount(it.discountedPrice ?? it.price, pct) };
    }
    const newState:MarketState = { ...state, items: newItems, haggledIds: { ...state.haggledIds, [itemId]: true } };
    setState(newState); persist(newState);
    return { ok:true as const, success };
  }

  useEffect(()=>{
    if(!state) return;
    const changed = state.items.map(it=>{
      if(!it.isFlash || !it.flashEndsAtMs) return it;
      if(worldDateMs >= it.flashEndsAtMs){ const { discountedPrice, ...rest }:any = it; return { ...rest, isFlash:false, flashEndsAtMs: undefined }; }
      return it;
    });
    if(JSON.stringify(changed)!==JSON.stringify(state.items)){
      const next = { ...state, items: changed };
      setState(next); persist(next);
    }
  }, [worldDateMs]);

  return { seed, state, canAfford, buy, haggle };
}
