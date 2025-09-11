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
  skills: {}
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
  // Unified helpers (with backwards-compatible aliases)
  giveXP:(amount:number)=>void; addXP:(amount:number)=>void;
  giveCoins:(p:Partial<CoinPouch>)=>void; addCoins:(p:Partial<CoinPouch>)=>void;
  spendStamina:(amount:number)=>boolean;
  changeHP:(delta:number)=>void;
  ensureMemberCard:()=>void;
  logGuildEvent:(entry:any)=>void;
};

const GameContext = createContext<Ctx|null>(null);

export function GameProviderClient({ children }:{children:React.ReactNode}){
  const [slot, setSlot] = useState<number>(1);
  const [state, setState] = useState<GameState>(defaultState);
  const saveTimer = useRef<ReturnType<typeof setTimeout>|null>(null);

  // bootstrap load
  useEffect(()=>{
    const loaded = loadSlotFromStorage(slot);
    if(loaded){
      setState(loaded as any);
    } else {
      // first save
      saveSlotToStorage(slot, defaultState as any);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slot]);

  function scheduleSave(next?:GameState){
    if(saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(()=>{
      const blob = (next ?? state) as any as SaveBlob;
      saveSlotToStorage(slot, { ...(blob as any), updatedAt: Date.now() });
    }, 150);
  }

  function saveCurrentSlot(){
    scheduleSave();
  }

  function giveXP(amount:number){
    if(!amount) return;
    setState(prev=>{
      const xp = Math.max(0, (prev.player?.xp ?? 0) + Math.floor(amount));
      // simple level curve: level up each 100 xp; preserve existing if game has its own system
      let level = prev.player?.level ?? 1;
      const beforeLevel = level;
      while(xp >= level*100) level++;
      const player = { ...prev.player, xp, level };
      const next = { ...prev, player };
      return next;
    });
    scheduleSave();
  }
  const addXP = giveXP; // alias

  function giveCoins(p:Partial<CoinPouch>){
    if(!p) return;
    setState(prev=>{
      const pouch = addPouch(prev.player?.coins ?? {gold:0,silver:0,bronze:0,copper:0}, p);
      const player = { ...prev.player, coins: pouch };
      return { ...prev, player };
    });
    scheduleSave();
  }
  const addCoins = giveCoins; // alias

  function spendStamina(amount:number){
    let ok = true;
    setState(prev=>{
      const st = prev.player?.stamina ?? { current:0, max:200, lastRefillDay:0 };
      if(st.current < amount){ ok = false; return prev; }
      const player = { ...prev.player, stamina: { ...st, current: st.current - amount } };
      const next = { ...prev, player };
      return next;
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

  // passive stamina regen (client only)
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const ctx: Ctx = {
    state, setState,
    slot,
    setSlot:(n:number)=>{ setSlot(n); },
    clearSlot:(n?:number)=>{ clearSlotInStorage(n ?? slot); },
    loadSlot:(n?:number)=>{ const l = loadSlotFromStorage(n ?? slot); if(l) setState(l as any); },
    saveCurrentSlot,
    giveXP, addXP,
    giveCoins, addCoins,
    spendStamina,
    changeHP,
    ensureMemberCard,
    logGuildEvent,
  };

  return <GameContext.Provider value={ctx}>{children}</GameContext.Provider>;
}

// Backwards-compatible named export many pages tried to import
export const GameProvider = GameProviderClient;

export function useGame(){
  const ctx = useContext(GameContext);
  if(!ctx) throw new Error('useGame must be used inside GameProviderClient');
  return ctx;
}
