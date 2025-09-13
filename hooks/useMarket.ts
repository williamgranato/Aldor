'use client';
import { useEffect, useMemo, useState } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { ITEMS } from '@/data/items_catalog';

type Any = any;

const BLOCKED_TYPES = ['material','ferramenta','runa','missão','quest','tool'];
const ALLOWED_TYPES = ['arma','armadura','acessório','consumível','comida','potion','weapon','armor','trinket','consumable','shield'];

function dayKeyFrom(ms:number){
  const d = new Date(ms||Date.now());
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
}

// simple seeded rng (deterministic per day)
function rngFactory(seed:number){
  let s = seed >>> 0;
  return ()=>{
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xFFFFFFFF;
  };
}

function pouchToCopper(p:any){
  if(typeof p === 'number') return Math.max(0, Math.floor(p));
  const g = Math.floor(Math.max(0, p?.gold||0));
  const s = Math.floor(Math.max(0, p?.silver||0));
  const b = Math.floor(Math.max(0, p?.bronze||0));
  const c = Math.floor(Math.max(0, p?.copper||0));
  return g*10000 + s*100 + b*10 + c;
}

function copperToPouch(c:number){
  c = Math.max(0, Math.floor(c));
  const gold = Math.floor(c/10000); c -= gold*10000;
  const silver = Math.floor(c/100); c -= silver*100;
  const bronze = Math.floor(c/10); c -= bronze*10;
  const copper = c;
  return { gold, silver, bronze, copper };
}

export type GeneratedMarketItem = {
  id: string;
  name: string;
  type: string;
  rarity: string;
  image?: string;
  stock: number;
  price: Any;
  reqLevel?: number;
  def?: number;
  atq?: number;
  crit?: number;
  hp?: number;
  bonuses?: Record<string, number>;
  slot?: string;
  durability?: number;
  isFlash?: boolean;
  discountedPrice?: Any;
};

type Options = {
  worldDateMs: number;
  playerLevel: number;
  coins: Any;
  equipped: Any;
  providerActions: {
    addLootToInventory: (drops:Any[])=>void;
    giveCoins: (p:Any)=>void;
    touch: ()=>void;
  }
};

export function useMarket(opts: Options){
  const { state, setState } = useGame();
  const [list, setList] = useState<GeneratedMarketItem[]>([]);

  const dayKey = useMemo(()=> dayKeyFrom(opts.worldDateMs), [opts.worldDateMs]);

  useEffect(()=>{
    // reuse from save if exists
    const saved = (state as any)?.market?.[dayKey];
    if(saved && Array.isArray(saved)){
      setList(saved);
      return;
    }

    // generate new daily list
    const rng = rngFactory(opts.worldDateMs||Date.now());

    const basePool = (ITEMS as Any[]).filter(it=>{
      if(BLOCKED_TYPES.includes(it.type)) return false;
      if(ALLOWED_TYPES.includes(it.type)) return true;
      // allow some legacy aliases (Portuguese types)
      return ['arma','armadura','acessório','consumível','comida','escudo'].includes(it.type);
    });

    const count = 18;
    const picks: GeneratedMarketItem[] = [];
    for(let i=0;i<count;i++){
      const idx = Math.floor(rng() * basePool.length);
      const base = basePool[idx];
      if(!base) continue;
      // randomize small discount chance
      const flash = rng() < 0.12;
      const priceCopper = Math.max(1, base.valueCopper ?? 10) * (flash ? 0.85 : 1);
      const priceInt = Math.floor(priceCopper);
      const item: GeneratedMarketItem = {
        id: base.id,
        name: base.name,
        type: base.type,
        rarity: base.rarity,
        image: base.image,
        reqLevel: base.reqLevel,
        def: base.def,
        atq: base.atk ?? base.atq,
        crit: base.crit,
        hp: base.hp,
        bonuses: base.bonuses,
        slot: base.slot,
        durability: base.durability,
        stock: 1 + Math.floor(rng()*3), // 1-3
        price: copperToPouch(priceInt),
        isFlash: flash,
        discountedPrice: flash ? copperToPouch(priceInt) : undefined,
      };
      picks.push(item);
    }

    // persist in save
    setState((prev:any)=>{
      const nextMarket = { ...(prev.market||{}), [dayKey]: picks };
      return { ...prev, market: nextMarket };
    });
    setList(picks);
  }, [dayKey]);

  function buy(id:string){
    let purchased: GeneratedMarketItem | null = null;

    setList(prev=>{
      const updated = prev.map(it=>{
        if(it.id===id && it.stock>0 && !purchased){
          purchased = { ...it, stock: it.stock - 1 };
          return purchased;
        }
        return it;
      });
      if(purchased){
        // persist
        setState((prev:any)=>{
          const cur = { ...((prev.market||{})[dayKey]||[]) };
          const arr = (prev.market?.[dayKey] || []).map((it:Any)=> it.id===id ? purchased : it);
          const nextMarket = { ...(prev.market||{}), [dayKey]: arr };
          return { ...prev, market: nextMarket };
        });
      }
      return updated;
    });

    if(purchased){
      const priceCopper = pouchToCopper(purchased.discountedPrice || purchased.price);
      const wallet = pouchToCopper(opts.coins||{});
      if(wallet < priceCopper){
        return { error: 'Saldo insuficiente' };
      }
      const newWallet = wallet - priceCopper;
      const newPouch = copperToPouch(newWallet);
      const delta = {
        gold: (newPouch.gold - (opts.coins?.gold||0)),
        silver: (newPouch.silver - (opts.coins?.silver||0)),
        bronze: (newPouch.bronze - (opts.coins?.bronze||0)),
        copper: (newPouch.copper - (opts.coins?.copper||0)),
      };
      opts.providerActions.giveCoins(delta);
      opts.providerActions.addLootToInventory([{ id:purchased.id, name:purchased.name, image:purchased.image, rarity:purchased.rarity, qty:1 }]);
      opts.providerActions.touch();
      return { item: purchased, finalPrice: purchased.price };
    }
    return null;
  }

  return { items: list, buy };
}
