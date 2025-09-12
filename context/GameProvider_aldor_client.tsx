'use client';
import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { GameState, CoinPouch, Rank } from '@/types_aldor_client';
import { addPouch } from '@/utils/money_aldor_client';
import { getGuildMissions } from '@/data/missoes';

type Ctx = any;

const RANKS: Rank[] = ['F','E','D','C','B','A','S','SS','SSS'] as any;

function rankThreshold(rank: Rank): number {
  const idx = Math.max(0, RANKS.indexOf(rank));
  const stepsFromF = Math.max(0, idx - RANKS.indexOf('F'));
  return 10 * Math.pow(2, stepsFromF);
}

const defaultState: GameState = {
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
  ui: { headerStyle: 'modern' }
};

const GameContext = createContext<Ctx|null>(null);

export function GameProvider({ children }:{children:React.ReactNode}){
function increaseAttribute(key:any){
  setState(prev=>{
    const pts = prev.player.statPoints || 0;
    if(pts <= 0) return prev;
    const attrs:any = { ...prev.player.attributes };
    attrs[key] = (attrs[key] || 0) + 1;
    let stats = { ...prev.player.stats };
    let stamina = { ...prev.player.stamina };
    if(key === 'vitality'){
      stats.maxHp += 10;
      stats.hp = Math.min(stats.maxHp, stats.hp + 10);
    }
    if(key === 'intelligence'){
      stamina.max += 3;
      stamina.current = Math.min(stamina.max, stamina.current + 3);
    }
    return {
      ...prev,
      player: { ...prev.player, attributes: attrs, statPoints: pts - 1, stats, stamina }
    };
  });
  markDirty();
}

function useItem(item:any){
  if(!item) return;
  setState(prev=>{
    const inv:any[] = Array.isArray(prev.player.inventory) ? [...prev.player.inventory] : [];
    const idx = inv.findIndex(i=> i.id === item.id);
    if(idx === -1) return prev;
    const newInv = [...inv];
    const existing = newInv[idx];
    if(existing?.qty && existing.qty > 1){ newInv[idx] = { ...existing, qty: existing.qty - 1 }; }
    else { newInv.splice(idx,1); }
    let newPlayer = { ...prev.player, inventory: newInv };
    if(item.hp){
      const st = newPlayer.stats;
      const hp = Math.min(st.maxHp, st.hp + (item.hp||0));
      newPlayer = { ...newPlayer, stats: { ...st, hp } };
    }
    if(item.stamina){
      const st = newPlayer.stamina;
      const current = Math.min(st.max, st.current + (item.stamina||0));
      newPlayer = { ...newPlayer, stamina: { ...st, current } };
    }
    return { ...prev, player: newPlayer };
  });
  markDirty();
}

  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<GameState>(defaultState);
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

  // Hydrate from localStorage
  useEffect(()=>{ const l = loadSave(); if(l) setState((p:any)=>({ ...p, ...l })); },[]);

  // Dirty flag flush + stamina regen (+1 a cada 5s, com lastRegenAt)
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

  // Guard de criação de personagem (só após hydration)
  useEffect(()=>{
    const isNew = (!state?.player?.character?.origin) && (!state?.player?.character?.name || state.player.character.name === 'Aventureiro');
    if(hydrated && isNew && pathname !== '/create-character'){
      router.replace('/create-character');
    }
  },[hydrated, state?.player?.character, pathname, router]);

  function unequip(slot:any){
  setState(prev=>{
    const equipment = { ...(prev.player.equipment||{}) };
    const current = equipment[slot];
    if(!current) return prev;
    const inv:any[] = Array.isArray(prev.player.inventory)
      ? [...prev.player.inventory, current]
      : [current];
    const eq = { ...equipment, [slot]: null };
    return { ...prev, player: { ...prev.player, inventory: inv, equipment: eq } };
  });
  markDirty();
}

  const ctx: Ctx = {
    state, setState,
    giveXP, giveCoins, spendStamina, recoverStamina, changeHP,
    ensureMemberCard, completeGuildMission, addLootToInventory,
    resetSave
  , unequip , increaseAttribute , useItem };

  return <GameContext.Provider value={ctx}>{children}</GameContext.Provider>;
}

export function useGame(){
  function unequip(slot:any){
  setState(prev=>{
    const equipment = { ...(prev.player.equipment||{}) };
    const current = equipment[slot];
    if(!current) return prev;
    const inv:any[] = Array.isArray(prev.player.inventory)
      ? [...prev.player.inventory, current]
      : [current];
    const eq = { ...equipment, [slot]: null };
    return { ...prev, player: { ...prev.player, inventory: inv, equipment: eq } };
  });
  markDirty();
}

  const ctx = useContext(GameContext);
  if(!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}


// added by patch: useItem (consume consumables)
