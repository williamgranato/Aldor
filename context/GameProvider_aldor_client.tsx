'use client';
import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import { useRouter } from 'next/navigation';
import type { GameState, CoinPouch, Rank } from '@/types_aldor_client';
import { addPouch } from '@/utils/money_aldor_client';

type Ctx = any;

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
    stamina: { current:10, max:10, lastRefillDay: Date.now() },
    status: [],
    coins: { gold:0, silver:0, bronze:0, copper:0 },
    inventory: [],
    skills: {}
  },
  guild: { isMember:false, completedQuests:[], activeQuests:[] },
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
  function createCharacter(payload: { name:string; role:string; race:string; origin:string; attributes?: Partial<GameState['player']['attributes']> }){
    setState(prev=>{
      const attrs = { ...prev.player.attributes, ...(payload.attributes||{}) };
      const character = { id:'char1', name: payload.name, origin: payload.origin, role: payload.role, race: payload.race };
      const player = { ...prev.player, character, attributes: attrs, level:1, xp:0, statPoints:0, coins:{ gold:0,silver:0,bronze:0,copper:0 }, inventory:[] };
      return { ...prev, player };
    });
    markDirty();
    router.push('/');
  }

  // Load inicial
  useEffect(()=>{ const l = loadSave(); if(l) setState(l as any); },[]);

  // Autosave loop
  useEffect(()=>{
    const id = setInterval(()=>{ if(dirtyRef.current) saveNow(state); }, 1000);
    const flush = ()=>{ if(dirtyRef.current) saveNow(state); };
    window.addEventListener('beforeunload', flush);
    window.addEventListener('visibilitychange', flush);
    return ()=>{ clearInterval(id); window.removeEventListener('beforeunload', flush); window.removeEventListener('visibilitychange', flush); };
  },[state]);

  // === Helpers de gameplay (mínimos, preservando contratos) ===
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
    setState(prev=>{
      const st = prev.player.stamina;
      if(st.current < amount) return prev;
      return { ...prev, player:{ ...prev.player, stamina: { ...st, current: st.current - amount } } };
    });
    markDirty();
    return true;
  }
  function changeHP(delta:number){
    setState(prev=>{
      const st = prev.player.stats;
      const hp = Math.max(0, Math.min(st.maxHp, st.hp + delta));
      return { ...prev, player:{ ...prev.player, stats: { ...st, hp } } };
    });
    markDirty();
  }
  function ensureMemberCard(){
    setState(prev=>{
      if(prev.guild.isMember) return prev;
      const card = { name: prev.player.character.name, origin: prev.player.character.origin, role: prev.player.character.role, rank: 'F' as Rank };
      return { ...prev, guild: { ...prev.guild, isMember: true, memberCard: card } };
    });
    markDirty();
  }
  function logGuildEvent(entry:any){
    setState(prev=>{
      const cq = prev.guild.completedQuests ?? [];
      return { ...prev, guild: { ...prev.guild, completedQuests: [...cq, { id: entry?.id || 'evt', rank: entry?.rank || 'F', at: Date.now() }] } };
    });
    markDirty();
  }

  const ctx: Ctx = {
    state, setState,
    giveXP, giveCoins, spendStamina, changeHP,
    ensureMemberCard, logGuildEvent,
    resetSave, createCharacter
  };

  return <GameContext.Provider value={ctx}>{children}</GameContext.Provider>;
}

export function useGame(){
  const ctx = useContext(GameContext);
  if(!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
