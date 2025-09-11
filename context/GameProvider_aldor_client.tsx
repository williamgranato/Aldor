'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { GameState, PlayerState, SaveBlob, CoinPouch } from '@/types_aldor_client';
import { coinsToCopper, copperToCoins, addPouch, subPouch } from '@/utils/money_aldor_client';

const STORAGE_KEY_PREFIX = 'aldor_save_slot_';

function safeLocalStorage(){
  if (typeof window === 'undefined') return null as any;
  try { return window.localStorage; } catch { return null as any; }
}

function loadSlotFromStorage(slot:number): SaveBlob | null {
  const ls = safeLocalStorage(); if(!ls) return null;
  try { const raw = ls.getItem(STORAGE_KEY_PREFIX+slot); return raw ? JSON.parse(raw) as SaveBlob : null; } catch { return null; }
}
function saveSlotToStorage(slot:number, data:SaveBlob){
  const ls = safeLocalStorage(); if(!ls) return;
  try { ls.setItem(STORAGE_KEY_PREFIX+slot, JSON.stringify(data)); } catch {}
}
function clearSlotInStorage(slot:number){
  const ls = safeLocalStorage(); if(!ls) return;
  try { ls.removeItem(STORAGE_KEY_PREFIX+slot); } catch {}
}

const defaultPlayer: PlayerState = {
  id: (typeof crypto!=='undefined' && (crypto as any).randomUUID ? (crypto as any).randomUUID() : String(Date.now())),
  character: { id:'hero', name:'Aventureiro', origin:'Sem Origem', race:'Humano', roleKey:'guerreiro', raceKey:'humano' } as any,
  guildRank: 0,
  adventurerRank: 'Sem Guilda',
  xp: 0, level: 1, statPoints: 0,
  attributes: { strength: 5, agility: 5, intelligence: 5, vitality: 5, luck: 5 },
  stats: { hp: 100, maxHp: 100, attack: 10, defense: 5, crit: 0.05 },
  stamina: { current: 200, max: 200, lastRefillDay: 0 },
  status: [],
  coins: { gold:0, silver:0, bronze:0, copper:0 },
  inventory: [],
  skills: {},
  equipped: {}
};

const defaultState: GameState = {
  version: 3,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  player: defaultPlayer,
  guild: { isMember:false, completedQuests:[], activeQuests:[], memberCard: undefined } as any,
  market: { catalog: [] } as any,
  world: { dateMs: Date.now(), season:'Primavera', weather:'Ensolarado', temperatureC:22 } as any,
  ui: { headerStyle: 'modern' }
};

type Ctx = {
  state: GameState; setState: React.Dispatch<React.SetStateAction<GameState>>;
  slot: number; setSlot: (n:number)=>void;
  clearSlot:(n?:number)=>void; loadSlot:(n?:number)=>void; saveCurrentSlot:()=>void;
  // helpers
  giveXP:(amount:number)=>void; addXP:(amount:number)=>void;
  giveCoins:(p:Partial<CoinPouch>)=>void; addCoins:(p:Partial<CoinPouch>)=>void;
  spendStamina:(amount:number)=>boolean;
  changeHP:(delta:number)=>void;
  ensureMemberCard:()=>void;
  logGuildEvent:(entry:any)=>void;
  // new inventory helpers
  item_equip?:(slot:string,item:any)=>void;
  item_unequip?:(slot:string)=>void;
  use_item?:(item:any)=>void;
  removeItem?:(id:string,qty:number)=>void;
  equip?:(slot:string,item:any)=>void;
  unequip?:(slot:string)=>void;
};

const GameContext = createContext<Ctx|null>(null);

export function GameProviderClient({ children }:{children:React.ReactNode}){
  const [slot, setSlot] = useState<number>(1);
  const [state, setState] = useState<GameState>(defaultState);
  const saveTimer = useRef<ReturnType<typeof setTimeout>|null>(null);

  // bootstrap load
  useEffect(()=>{
    const loaded = loadSlotFromStorage(slot);
    if(loaded){ setState(loaded as any); } else { saveSlotToStorage(slot, defaultState as any); }
  }, [slot]);

  function scheduleSave(next?:GameState){
    if(saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(()=>{
      const blob = (next ?? state) as any as SaveBlob;
      saveSlotToStorage(slot, { ...(blob as any), updatedAt: Date.now() });
    }, 150);
  }
  function saveCurrentSlot(){ scheduleSave(); }

  function giveXP(amount:number){
    if(!amount) return;
    setState(prev=>{
      const xp = Math.max(0, (prev.player?.xp ?? 0) + Math.floor(amount));
      let level = prev.player?.level ?? 1;
      while(xp >= level*100) level++;
      const player = { ...prev.player, xp, level };
      return { ...prev, player };
    });
    scheduleSave();
  }
  const addXP = giveXP;

  function giveCoins(p:Partial<CoinPouch>){
    if(!p) return;
    setState(prev=>{
      const pouch = addPouch(prev.player?.coins ?? {gold:0,silver:0,bronze:0,copper:0}, p);
      const player = { ...prev.player, coins: pouch };
      return { ...prev, player };
    });
    scheduleSave();
  }
  const addCoins = giveCoins;

  function spendStamina(amount:number){
    let ok = true;
    setState(prev=>{
      const st = prev.player?.stamina ?? { current:0, max:200, lastRefillDay:0 };
      if(st.current < amount){ ok=false; return prev; }
      const player = { ...prev.player, stamina: { ...st, current: st.current - amount } };
      return { ...prev, player };
    });
    if(ok) scheduleSave();
    return ok;
  }

  function changeHP(delta:number){
    setState(prev=>{
      const st = prev.player?.stats ?? { hp:100, maxHp:100 } as any;
      let hp = (st.hp ?? 100) + Math.floor(delta);
      const maxHp = st.maxHp ?? 100;
      hp = Math.max(0, Math.min(maxHp, hp));
      const stats = { ...st, hp };
      const player = { ...prev.player, stats };
      return { ...prev, player };
    });
    scheduleSave();
  }

  function ensureMemberCard(){
    setState(prev=>{
      const g = prev.guild ?? ({} as any);
      if(g.isMember) return prev;
      const card = {
        name: prev.player?.character?.name ?? 'Aventureiro',
        origin: prev.player?.character?.origin ?? 'Desconhecido',
        role: prev.player?.character?.roleKey ?? 'guerreiro',
        createdAt: Date.now()
      };
      return { ...prev, guild: { ...g, isMember: true, memberCard: card } };
    });
    scheduleSave();
  }

  function logGuildEvent(entry:any){
    setState(prev=>{
      const g = prev.guild ?? ({} as any);
      const logs = (g.logs ?? []) as any[];
      return { ...prev, guild: { ...g, logs: [...logs, entry] } };
    });
    scheduleSave();
  }

  // passive stamina regen
  useEffect(()=>{
    const id = setInterval(()=>{
      setState(prev=>{
        const st = prev.player?.stamina ?? { current:0, max:200, lastRefillDay:0 };
        if(st.current >= st.max) return prev;
        const player = { ...prev.player, stamina: { ...st, current: st.current + 1 } };
        return { ...prev, player };
      });
      scheduleSave();
    }, 3000);
    return ()=> clearInterval(id);
  },[]);

  // === New Inventory Helpers ===
  const removeItem=(id:string,qty:number)=>{
    setState(prev=>{
      const items=[...(prev.player.inventory as any[]||[])];
      const i=items.findIndex(x=>x.id===id);
      if(i>=0){
        const left=(items[i].qty||0)-qty;
        if(left<=0) items.splice(i,1);
        else items[i]={...items[i],qty:left};
      }
      return {...prev,player:{...prev.player,inventory:items}};
    });
    scheduleSave();
  };

  const item_equip=(slot:string,item:any)=>{
    setState(prev=>{
      const items=[...(prev.player.inventory as any[]||[])];
      const idx=items.findIndex(x=>x.id===item.id);
      if(idx>=0){
        const left=(items[idx].qty||0)-1;
        if(left<=0) items.splice(idx,1);
        else items[idx]={...items[idx],qty:left};
      }
      const eq={...(prev.player.equipped||{})};
      eq[slot]={itemId:item.id};
      return {...prev,player:{...prev.player,inventory:items,equipped:eq}};
    });
    scheduleSave();
  };

  const item_unequip=(slot:string)=>{
    setState(prev=>{
      const eq={...(prev.player.equipped||{})};
      const data=eq[slot];
      if(!data?.itemId) return prev;
      const items=[...(prev.player.inventory as any[]||[])];
      const i=items.findIndex(x=>x.id===data.itemId);
      if(i>=0) items[i]={...items[i],qty:(items[i].qty||0)+1};
      else items.push({id:data.itemId,qty:1});
      delete eq[slot];
      return {...prev,player:{...prev.player,inventory:items,equipped:eq}};
    });
    scheduleSave();
  };

  const use_item=(item:any)=>{
    setState(prev=>{
      const items=[...(prev.player.inventory as any[]||[])];
      const idx=items.findIndex(x=>x.id===item.id);
      if(idx>=0){
        const left=(items[idx].qty||0)-1;
        if(left<=0) items.splice(idx,1);
        else items[idx]={...items[idx],qty:left};
      }
      const p={...prev.player};
      if(item.restoreHp){ p.stats={...p.stats,hp:Math.min(p.stats.maxHp,(p.stats.hp||0)+item.restoreHp)}; }
      if(item.restoreSta){ p.stamina={...p.stamina,current:Math.min(p.stamina.max,(p.stamina.current||0)+item.restoreSta)}; }
      return {...prev,player:p};
    });
    scheduleSave();
  };

  const equip=(slot:string,item:any)=> item_equip(slot,item);
  const unequip=(slot:string)=> item_unequip(slot);

  const ctx: Ctx = {
    state, setState,
    slot,
    setSlot:(n:number)=>{ setSlot(n); },
    clearSlot:(n?:number)=>{ clearSlotInStorage(n ?? slot); },
    loadSlot:(n?:number)=>{ const l=loadSlotFromStorage(n ?? slot); if(l) setState(l as any); },
    saveCurrentSlot,
    giveXP, addXP,
    giveCoins, addCoins,
    spendStamina,
    changeHP,
    ensureMemberCard,
    logGuildEvent,
    item_equip,item_unequip,use_item,removeItem,equip,unequip
  };

  return <GameContext.Provider value={ctx}>{children}</GameContext.Provider>;
}

export const GameProvider = GameProviderClient;

export function useGame(){
  const ctx = useContext(GameContext);
  if(!ctx) throw new Error('useGame must be used inside GameProviderClient');
  return ctx;
}
