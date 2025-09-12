'use client';
import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { GameState, CoinPouch, Rank } from '@/types_aldor_client';
import { addPouch } from '@/utils/money_aldor_client';
import { getGuildMissions } from '@/data/missoes';
import { ReputationEntry, updateReputation } from '@/data/market_addons';

type Ctx = any;

const RANKS: Rank[] = ['F','E','D','C','B','A','S','SS','SSS'] as any;

function rankThreshold(rank: Rank): number {
  const idx = Math.max(0, RANKS.indexOf(rank));
  const stepsFromF = Math.max(0, idx - RANKS.indexOf('F'));
  return 10 * Math.pow(2, stepsFromF);
}

const defaultState: GameState & { reputation: ReputationEntry[] } = {
  player: {
    id: 'player1',
    character: { id:'char1', name:'Aventureiro', origin:'', role:'', race:'humano' },
    guildRank: 0,
    adventurerRank: 'Sem Guilda',
    xp: 0,
    level: 1,
    statPoints: 0,
    attributes: { strength:1, agility:1, intelligence:1, vitality:1, luck:0 },
    stats: { hp:30, maxHp:30, attack:5, defense:2, crit:0 },
    stamina: { current:100, max:100, lastRefillDay: Date.now(), lastRegenAt: Date.now() },
    status: [],
    coins: { gold:0, silver:0, bronze:0, copper:0 },
    inventory: [],
    skills: {}
  },
  guild: { isMember:false, completedQuests:[], activeQuests:[], memberCard: undefined as any },
  world: { dateMs: Date.now() },
  ui: { headerStyle: 'modern' },
  reputation: []
};

const GameContext = createContext<Ctx|null>(null);

export function GameProvider({ children }:{children:React.ReactNode}){
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const dirtyRef = useRef(false);
  function markDirty(){ dirtyRef.current = true; }

  const saveKey = 'aldor_save';
  function saveNow(blob:any){ try{ localStorage.setItem(saveKey, JSON.stringify({ ...(blob as any), updatedAt: Date.now() })); }catch{} dirtyRef.current=false; }
  function loadSave(){ try{ const raw = localStorage.getItem(saveKey); if(raw) return JSON.parse(raw); }catch{} return null; }
  function resetSave(){
    try{ localStorage.removeItem(saveKey); }catch{}
    setState(defaultState as any);
    dirtyRef.current = true;
    router.push('/create-character');
  }

  function ensureMemberCard(){
    setState(prev => {
      if(prev.guild.isMember && prev.guild.memberCard?.rank && prev.guild.activeQuests?.length) return prev;
      const rank: Rank = (prev.guild.memberCard?.rank || 'F') as Rank;
      const card = prev.guild.memberCard ?? {
        name: prev.player.character.name,
        origin: prev.player.character.origin,
        role: prev.player.character.role,
        rank,
      };
      const activeQuests = (prev.guild.activeQuests?.length ?? 0) > 0
        ? prev.guild.activeQuests
        : getGuildMissions(rank);
      return {
        ...prev,
        guild: {
          ...prev.guild,
          isMember: true,
          memberCard: card,
          activeQuests,
          completedQuests: prev.guild.completedQuests ?? [],
        },
      };
    });
    markDirty();
  }

  function computeMaxStamina(intelligence:number){
    return 100 + Math.max(0, Math.floor(intelligence))*3;
  }
  function recalcStaminaMax(){
    setState(prev=>{
      const max = computeMaxStamina(prev.player.attributes.intelligence||0);
      const st = prev.player.stamina;
      const current = Math.min(max, st.current);
      return { ...prev, player: { ...prev.player, stamina: { ...st, max, current } } };
    });
    markDirty();
  }

  function giveXP(amount:number){
    if(!amount) return;
    setState(prev=>{
      const xp = Math.max(0, prev.player.xp + Math.floor(amount));
      let level = prev.player.level;
      let statPoints = prev.player.statPoints;
      while(xp >= level*100){ level++; statPoints++; }
      const player = { ...prev.player, xp, level, statPoints };
      return { ...prev, player };
    });
    markDirty();
  }
  function giveCoins(p:Partial<CoinPouch>){
    if(!p) return;
    setState(prev=>{
      const pouch = addPouch(prev.player.coins, p);
      return { ...prev, player: { ...prev.player, coins: pouch } };
    });
    markDirty();
  }
  function spendStamina(amount:number){
    let success = false;
    setState(prev=>{
      const st = prev.player.stamina;
      if(st.current < amount) return prev;
      success = true;
      return { ...prev, player:{ ...prev.player, stamina: { ...st, current: st.current - amount } } };
    });
    if(success) markDirty();
    return success;
  }
  function recoverStamina(amount:number){
    setState(prev=>{
      const st = prev.player.stamina;
      const cur = Math.min(st.max, st.current + amount);
      return { ...prev, player:{ ...prev.player, stamina: { ...st, current: cur } } };
    });
    markDirty();
  }
  function changeHP(delta:number){
    setState(prev=>{
      const st = prev.player.stats;
      const hp = Math.max(0, Math.min(st.maxHp, st.hp + delta));
      return { ...prev, player:{ ...prev.player, stats: { ...st, hp } } };
    });
    markDirty();
  }

  function addLootToInventory(drops: {id:string; name:string; icon?:string; rarity?:string}[]){
    if(!drops?.length) return;
    setState(prev=>{
      const inv:any[] = (prev.player.inventory as any[]) || [];
      const updated = [...inv, ...drops.map(d=>({ ...d, qty:1 }))];
      return { ...prev, player: { ...prev.player, inventory: updated as any } };
    });
    markDirty();
  }

  function completeGuildMission(rank: Rank, payload?: {xp?:number; copper?:number; drops?: any[]; title?:string}){
    setState(prev=>{
      const cq:any[] = (prev.guild.completedQuests as any[]) ?? [];
      const entry:any = { id: `m_${Date.now()}`, rank, at: Date.now(), ...payload };
      const newCq = [entry, ...cq].slice(0, 100);
      const currentRank: Rank = (prev.guild.memberCard?.rank || 'F') as Rank;
      const doneAtCurrent = newCq.filter(q=>q.rank===currentRank).length;
      let memberCard = prev.guild.memberCard || { name: prev.player.character.name, origin: prev.player.character.origin, role: prev.player.character.role, rank: 'F' as Rank };
      const idx = RANKS.indexOf(currentRank);
      const threshold = rankThreshold(currentRank);
      if(doneAtCurrent >= threshold && idx>=0 && idx<RANKS.length-1){
        memberCard = { ...memberCard, rank: (RANKS[idx+1] as Rank) };
      }
      return { ...prev, guild: { ...prev.guild, completedQuests: newCq, memberCard, isMember: true } };
    });
    markDirty();
  }

  // === NOVAS FUNÇÕES DE MERCADO ===
  function comprar(item:any, priceCopper:number, merchantId:string){
    setState(prev=>{
      const pouch = { ...prev.player.coins, copper: (prev.player.coins.copper||0) - priceCopper };
      if(pouch.copper < 0) return prev; // sem dinheiro
      const inv:any[] = (prev.player.inventory as any[]) || [];
      const updatedInv = [...inv, { ...item, qty:1 }];
      return {
        ...prev,
        player: { ...prev.player, coins: pouch, inventory: updatedInv },
        reputation: updateReputation(prev.reputation||[], merchantId, +1)
      };
    });
    markDirty();
  }

  function reputationAdd(merchantId:string, delta:number){
    setState(prev=>({
      ...prev,
      reputation: updateReputation(prev.reputation||[], merchantId, delta)
    }));
    markDirty();
  }

  // Hydrate from localStorage
  useEffect(()=>{ const l = loadSave(); if(l) setState((p:any)=>({ ...p, ...l })); },[]);

  // Dirty flag flush + stamina regen
  useEffect(()=>{
    const id = setInterval(()=>{
      if(dirtyRef.current) saveNow(state);
      setState(prev=>{
        const now = Date.now();
        const st:any = prev.player.stamina;
        const last = st.lastRegenAt || now;
        const delta = now - last;
        if(delta < 5000) return prev;
        const ticks = Math.floor(delta/5000);
        const cur = Math.min(st.max, st.current + ticks);
        return { ...prev, player: { ...prev.player, stamina: { ...st, current: cur, lastRegenAt: last + ticks*5000 } } };
      });
    }, 1000);
    const flush = ()=>{ if(dirtyRef.current) saveNow(state); };
    window.addEventListener('beforeunload', flush);
    window.addEventListener('visibilitychange', flush);
    return ()=>{ clearInterval(id); window.removeEventListener('beforeunload', flush); window.removeEventListener('visibilitychange', flush); };
  },[state]);

  // Recalcular stamina máxima quando INT muda
  useEffect(()=>{ 
    setState(prev=>{
      const max = 100 + Math.max(0, Math.floor(prev.player.attributes.intelligence||0))*3;
      const st = prev.player.stamina;
      const current = Math.min(max, st.current);
      return { ...prev, player: { ...prev.player, stamina: { ...st, max, current } } };
    });
  }, [state.player.attributes.intelligence]);

  // Hydration ready -> habilita guard
  useEffect(()=>{ setHydrated(true); },[]);

  // Guard de criação de personagem
  useEffect(()=>{
    const isNew = (!state?.player?.character?.origin) && (!state?.player?.character?.name || state.player.character.name === 'Aventureiro');
    if(hydrated && isNew && pathname !== '/create-character'){
      router.replace('/create-character');
    }
  },[hydrated, state?.player?.character, pathname, router]);

  const ctx: Ctx = {
    state, setState,
    giveXP, giveCoins, spendStamina, recoverStamina, changeHP,
    ensureMemberCard, completeGuildMission, addLootToInventory,
    resetSave,
    comprar, reputationAdd
  };

  return <GameContext.Provider value={ctx}>{children}</GameContext.Provider>;
}

export function useGame(){
  const ctx = useContext(GameContext);
  if(!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
