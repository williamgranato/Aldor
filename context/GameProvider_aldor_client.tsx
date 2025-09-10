'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import type { GameState, PlayerState, SaveBlob } from '@/types_aldor_client';

const STORAGE_KEY_PREFIX = 'aldor_save_slot_';

function loadSlot(slot:number): SaveBlob|null {
  if (typeof window==='undefined') return null;
  try { const raw = localStorage.getItem(STORAGE_KEY_PREFIX+slot); return raw ? JSON.parse(raw) as SaveBlob : null; }
  catch { return null; }
}
function saveSlot(slot:number, data:SaveBlob){
  if (typeof window==='undefined') return;
  try { localStorage.setItem(STORAGE_KEY_PREFIX+slot, JSON.stringify(data)); } catch {}
}
function clearSlot(slot:number){
  if (typeof window==='undefined') return;
  try { localStorage.removeItem(STORAGE_KEY_PREFIX+slot); } catch {}
}

const defaultPlayer: PlayerState = {
  id: (typeof crypto!=='undefined' && (crypto as any).randomUUID ? (crypto as any).randomUUID() : Date.now().toString()),
  character: { id:'hero', name:'Aventureiro', origin:'Sem Origem', role:'Sem Classe', race:'Humano', roleKey:'guerreiro', raceKey:'humano' } as any,
  guildRank: 0,
  adventurerRank: 'Sem Guilda',
  xp: 0, level: 1, statPoints: 0,
  attributes: { strength: 5, agility: 5, intelligence: 5, vitality: 5, luck: 5 },
  stats: { hp: 100, maxHp: 100, attack: 10, defense: 5, crit: 0.05 },
  stamina: { current: 200, max: 200, lastRefillDay: 0 },
  status: [],
  coins: { gold:0, silver:0, bronze:0, copper:0 },
  inventory: [], skills: {}
};

const defaultState: GameState = {
  version: 3, createdAt: Date.now(), updatedAt: Date.now(),
  player: defaultPlayer,
  guild: { isMember:false, completedQuests:[], activeQuests:[], memberCard: undefined },
  market: { catalog: [] },
  ui: { headerStyle: 'modern' },
  world: { dateMs: Date.now(), season:'Primavera', weather:'Ensolarado', temperatureC:22 }
} as any;

type Ctx = {
  state: GameState; setState: React.Dispatch<React.SetStateAction<GameState>>;
  slot: number; setSlot: (n:number)=>void;
  clearSlot:(n:number)=>void; loadSlot:(n:number)=>void;
};

const GameContext = createContext<Ctx|null>(null);

export function GameProviderClient({ children }:{children:React.ReactNode}){
  const [slot,setSlot] = useState(1);
  const [state,setState] = useState<GameState>(defaultState);

  // initial load / slot change
  useEffect(()=>{
    const loaded = loadSlot(slot);
    if(loaded){
      // migration: ensure stamina max=200, clamp current
      const s:any = { ...loaded };
      const p:any = { ...(s.player||{}) };
      const st = { max: 200, current: Math.min(200, Math.max(0, p?.stamina?.current ?? 200)), lastRefillDay: p?.stamina?.lastRefillDay ?? 0 };
      p.stamina = st;
      s.player = p;
      setState(s);
    }else{
      setState(defaultState);
    }
  },[slot]);

  // autosave
  useEffect(()=>{ if(state) saveSlot(slot, state as any); },[state,slot]);

  // stamina regen: +1 a cada 3s até o máximo
  useEffect(()=>{
    const t = setInterval(()=>{
      setState(prev=>{
        const p:any = prev.player || {};
        const st = p.stamina || { current:0, max:200 };
        if(st.current >= st.max) return prev;
        const next = { ...prev, player: { ...p, stamina: { ...st, current: st.current + 1 } }, updatedAt: Date.now() };
        return next;
      });
    }, 3000);
    return ()=> clearInterval(t);
  },[]);

  const ctx: Ctx = { state,setState, slot, setSlot, clearSlot, loadSlot:(n:number)=>{const l=loadSlot(n); if(l) setState(l as any);} };
  return <GameContext.Provider value={ctx}>{children}</GameContext.Provider>;
}

export function useGame(){
  const ctx = useContext(GameContext);
  if(!ctx) throw new Error('useGame must be used inside GameProviderClient');
  return ctx;
}
