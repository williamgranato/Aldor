'use client';
import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import { useRouter } from 'next/navigation';
import type { GameState, CoinPouch, Rank } from '@/types_aldor_client';
import { addPouch } from '@/utils/money_aldor_client';

type Ctx = any;

const RANKS: Rank[] = ['F','E','D','C','B','A','S','SS','SSS'] as any;

function nextRank(r:Rank): Rank {
  const i = RANKS.indexOf(r);
  return (RANKS[Math.min(RANKS.length-1, i+1)] || r) as Rank;
}
function rankThreshold(rank: Rank): number {
  // F->E = 10, E->D = 20, D->C = 40, doubling
  const idx = Math.max(0, RANKS.indexOf(rank));
  const stepsFromF = Math.max(0, idx - RANKS.indexOf('F'));
  return 10 * Math.pow(2, stepsFromF);
}

const defaultState: GameState = {
  player: {
    id: 'player1',
    character: { id:'char1', name:'Aventureiro', origin:'Desconhecido', role:'guerreiro', race:'humano' },
    guildRank: 0,
    adventurerRank: 'Sem Guilda',
    xp: 0,
    level: 1,
    statPoints: 0,
    attributes: { strength:1, agility:1, intelligence:1, vitality:1, luck:0 },
    stats: { hp:30, maxHp:30, attack:5, defense:2, crit:0 },
    stamina: { current:100, max:100, lastRefillDay: Date.now(), lastRegenAt: Date.now() as any },
    status: [],
    coins: { gold:0, silver:0, bronze:0, copper:0 },
    inventory: [],
    skills: {}
  },
  guild: { isMember:false, completedQuests:[], activeQuests:[], memberCard: { name: 'Aventureiro', origin: 'Desconhecido', role:'guerreiro', rank: 'F' as Rank } },
  world: { dateMs: Date.now() },
  ui: { headerStyle: 'modern' }
};

const GameContext = createContext<Ctx|null>(null);

export function GameProvider({ children }:{children:React.ReactNode}){
  const router = useRouter();
  const [state, setState] = useState<GameState>(defaultState);
  const dirtyRef = useRef(false);
  function markDirty(){ dirtyRef.current = true; }

  // === Persistência (save único com dirty flag) ===
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
    setState(prev=>{
      if(prev.guild.isMember) return prev;
      const rank: Rank = 'F' as Rank;
      const card = { name: prev.player.character.name, origin: prev.player.character.origin, role: prev.player.character.role, rank };
      return { ...prev, guild: { ...prev.guild, isMember: true, memberCard: card } };
    });
    markDirty();
  }

  // Derived stamina max from INT
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

  // === Gameplay helpers ===
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
      // addPouch suporta negativos para subtrair
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

  // Complete mission for guild: log + check rank progression
  function completeGuildMission(rank: Rank){
    setState(prev=>{
      const cq = prev.guild.completedQuests ?? [];
      const newCq = [...cq, { id: `m_${Date.now()}`, rank, at: Date.now() }];
      // count completions at current rank of memberCard
      const currentRank: Rank = (prev.guild.memberCard?.rank || 'F') as Rank;
      const doneAtCurrent = newCq.filter(q=>q.rank===currentRank).length;
      let memberCard = prev.guild.memberCard || { name: prev.player.character.name, origin: prev.player.character.origin, role: prev.player.character.role, rank: 'F' as Rank };
      const threshold = rankThreshold(currentRank);
      if(doneAtCurrent >= threshold){
        memberCard = { ...memberCard, rank: (nextRank(currentRank) as Rank) };
      }
      return { ...prev, guild: { ...prev.guild, completedQuests: newCq, memberCard } };
    });
    markDirty();
  }

  // Load inicial
  useEffect(()=>{ const l = loadSave(); if(l) setState(l as any); },[]);

  // Autosave + stamina regen
  useEffect(()=>{
    const id = setInterval(()=>{
      if(dirtyRef.current) saveNow(state);
      // stamina regen: +1 a cada 5s
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

  // Recalc stamina max when INT changes
  useEffect(()=>{
    recalcStaminaMax();
  }, [state.player.attributes.intelligence]);

  const ctx: Ctx = {
    state, setState,
    giveXP, giveCoins, spendStamina, recoverStamina, changeHP,
    ensureMemberCard, completeGuildMission,
    resetSave
  };

  return <GameContext.Provider value={ctx}>{children}</GameContext.Provider>;
}

export function useGame(){
  const ctx = useContext(GameContext);
  if(!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
