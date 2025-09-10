'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { GeneratedMarketItem, MarketItem, MarketState, SeasonalContext } from '@/types/market';
import { formatSeedFromDateMs, mulberry32, seedFromString } from '@/utils/seed';
import { applyDiscount, applySeasonalPricing } from '@/utils/marketPricing';
import * as Catalog from '@/data/items_catalog';
type UseDailyMarketArgs = { worldDateMs:number; playerLevel:number; coins:{gold:number;silver:number;bronze:number;copper:number}; equipped?:Record<string,any>; slotId?:string|number;
  season?:SeasonalContext['season']; weather?:SeasonalContext['weather']; temperature?:number;
  providerActions?:{ inventory?:{add?:(item:any)=>void}; coins?:{deduct?:(p:any)=>void}; market?:{buy?:(item:any,p:any)=>void}; save?:{ autosave?:(r:string)=>void; patchSlot?:(k:string,d:any)=>void; loadSlotKey?:(k:string)=>any } };
};
const DAILY_COUNT=50, FLASH_COUNT=3, FLASH_DURATION_MS=60*60*1000;
const rarityWeight=(r:string)=>r==='legendary'?1:r==='epic'?3:r==='rare'?8:r==='uncommon'?18:70;
function weightedSample<T extends MarketItem>(rng:()=>number,arr:T[],k:number){const bag:T[]=[]; for(const it of arr){const w=rarityWeight(it.rarity); for(let i=0;i<w;i++) bag.push(it);} const res:T[]=[]; while(res.length<k&&bag.length) res.push(bag.splice(Math.floor(rng()*bag.length),1)[0]); return res;}
const toSeed=(ms:number)=>formatSeedFromDateMs(ms);
const storageKey=(slot:any,seed:string)=>`marketState:${slot??'default'}:${seed}`;
export function useDailyMarket(args:UseDailyMarketArgs){
  const { worldDateMs, playerLevel, coins, equipped, slotId, season, weather, temperature, providerActions }=args;
  const seed=useMemo(()=>toSeed(worldDateMs),[worldDateMs]); const rng=useMemo(()=>mulberry32(seedFromString(seed)),[seed]);
  const [state,setState]=useState<MarketState|null>(null);
  const seasonalCtx:SeasonalContext|undefined=useMemo(()=>{ if(!season||!weather||typeof temperature!=='number') return undefined; return {season,weather,temperature}; },[season,weather,temperature]);
  useEffect(()=>{ const key=storageKey(slotId,seed); let persisted:MarketState|null=null;
    try{persisted=providerActions?.save?.loadSlotKey?.(key)??null;}catch{} if(!persisted){try{const raw=localStorage.getItem(key); if(raw) persisted=JSON.parse(raw);}catch{}}
    if(persisted&&persisted.seed===seed){setState(persisted);return;}
    const all = Object.values((Catalog as any).default ?? Catalog) as MarketItem[]; const pool = (Array.isArray(all)?all:Object.values(all).flat()).filter(Boolean);
    const sampled=weightedSample(rng,pool,DAILY_COUNT);
    const flashIdx=new Set<number>(); while(flashIdx.size<Math.min(FLASH_COUNT,sampled.length)) flashIdx.add(Math.floor(Math.random()*sampled.length));
    const gen = sampled.map((it,idx)=>{ const stock=1+Math.floor(Math.random()*3); const isFlash=flashIdx.has(idx);
      const seasonal=applySeasonalPricing(it.price, ({...(it as any),stock,isFlash} as any), seasonalCtx);
      return { ...(it as any), stock, isFlash, flashEndsAtMs: isFlash? worldDateMs + FLASH_DURATION_MS : undefined, discountedPrice: isFlash? applyDiscount(seasonal,0.15):undefined, price: seasonal };
    });
    const next:MarketState={seed,items:gen,rep:0,haggledIds:{},slotId:slotId as any}; setState(next); persist(next);
    function persist(s:MarketState){ try{providerActions?.save?.patchSlot?.(key,s)}catch{} try{localStorage.setItem(key,JSON.stringify(s))}catch{} }
  },[seed,slotId]);
  function persist(s:MarketState){ const key=storageKey(slotId,s.seed); try{providerActions?.save?.patchSlot?.(key,s)}catch{} try{localStorage.setItem(key,JSON.stringify(s))}catch{} }
  const csum=(p:any)=>(((p.gold*100+p.silver)*100+p.bronze)*100+p.copper);
  function canAfford(price:any){ return csum(coins)>=csum(price); }
  function buy(id:string){ if(!state) return {ok:false,reason:'no_state' as const}; const i=state.items.findIndex(x=>x.id===id); if(i<0) return {ok:false,reason:'not_found' as const};
    const it=state.items[i]; const price=it.discountedPrice??it.price; if(!canAfford(price)) return {ok:false,reason:'no_coins' as const}; if(it.stock<=0) return {ok:false,reason:'sold_out' as const};
    let finalPrice=price; if(state.rep>=100) finalPrice=applyDiscount(finalPrice,0.05); else if(state.rep>=67) finalPrice=applyDiscount(finalPrice,0.03); else if(state.rep>=34) finalPrice=applyDiscount(finalPrice,0.01);
    const items=[...state.items]; items[i]={...it,stock:it.stock-1}; const next={...state,items,rep:Math.min(100,state.rep+1)} as MarketState; setState(next); persist(next);
    try{providerActions?.market?.buy?.(it,finalPrice)}catch{} try{providerActions?.coins?.deduct?.(finalPrice)}catch{} try{providerActions?.inventory?.add?.(it)}catch{} try{providerActions?.save?.autosave?.('market_buy')}catch{};
    window.dispatchEvent(new CustomEvent('market:buy',{detail:{item:it,finalPrice,slotId}})); window.dispatchEvent(new CustomEvent('coins:deduct',{detail:{price:finalPrice}}));
    window.dispatchEvent(new CustomEvent('inventory:add',{detail:{item:it}})); window.dispatchEvent(new CustomEvent('save:autosave',{detail:{reason:'market_buy'}}));
    return {ok:true as const};
  }
  function haggle(id:string,car:number=0,luck:number=0){ if(!state) return {ok:false,reason:'no_state' as const}; if(state.haggledIds[id]) return {ok:false,reason:'already_haggled' as const};
    const i=state.items.findIndex(x=>x.id===id); if(i<0) return {ok:false,reason:'not_found' as const}; const it=state.items[i];
    const base=0.2+car*0.005+luck*0.003; const det=Math.random(); const ok = det < Math.min(0.6, base);
    const items=[...state.items]; if(ok){ const p=0.05 + Math.random()*0.05; items[i]={...it,discountedPrice: applyDiscount(it.discountedPrice??it.price,p)}; }
    const next={...state,items,haggledIds:{...state.haggledIds,[id]:true}} as MarketState; setState(next); persist(next); return {ok:true as const, success: ok};
  }
  useEffect(()=>{ if(!state) return; const changed=state.items.map(it=>{ if(!it.isFlash||!it.flashEndsAtMs) return it; if(worldDateMs>=it.flashEndsAtMs){ const {discountedPrice, ...rest}:any=it; return {...rest,isFlash:false,flashEndsAtMs:undefined}; } return it; });
    if(JSON.stringify(changed)!==JSON.stringify(state.items)){ const next={...state,items:changed} as MarketState; setState(next); persist(next); }
  },[worldDateMs,state]);
  return { seed, state, canAfford, buy, haggle };
}