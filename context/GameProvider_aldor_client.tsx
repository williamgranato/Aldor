'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { GameState, PlayerState, Item, Quest, CoinPouch, AttributeKey, SaveBlob } from '@/types_aldor_client';
import { coinsToCopper, copperToCoins, addPouch } from '@/utils/money_aldor_client';
import { simulateCombat, enemyForRank } from '@/utils/combat_aldor_client';
import { generateDailyQuests } from '@/utils/dailyQuests_aldor_client';
import { rankOrder } from '@/utils/rankStyle';
import { useToasts } from '@/components/ToastProvider';

export type Season = 'Primavera'|'Verão'|'Outono'|'Inverno';
export type Weather = 'Ensolarado'|'Nublado'|'Chuva'|'Neve'|'Vento';

// --- Storage helpers ---
const STORAGE_KEY = 'aldor_save_v2';
function loadGame<T=SaveBlob>(): T | null {
  if (typeof window === 'undefined') return null;
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) as T : null; } catch { return null; }
}
function saveGame(s: SaveBlob){
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}
export async function exportSave(state: SaveBlob){
  const blob = new Blob([JSON.stringify(state, null, 2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'aldor-save.json'; a.click();
  URL.revokeObjectURL(url);
}
export async function importSaveBlob(file: File): Promise<SaveBlob>{
  const txt = await file.text();
  return JSON.parse(txt) as SaveBlob;
}
export function clearSave(){ if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY); }
export function nukeAllSaves(){ clearSave(); }

// --- World / Date / Season ---
type WorldState = { dateMs:number; season:Season; weather:Weather; temperatureC:number; lastMissionsDay?:string };
const defaultWorld: WorldState = { dateMs: Date.now(), season:'Primavera', weather:'Ensolarado', temperatureC:22 };
function ymd(ms:number){ const d=new Date(ms); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function nextDay(ms:number){ const d=new Date(ms); d.setDate(d.getDate()+1); return d.getTime(); }
function rollSeason(ms:number):Season{ const m=new Date(ms).getMonth()+1; if(m>=3&&m<=5)return'Primavera'; if(m<=8&&m>=6)return'Verão'; if(m<=11&&m>=9)return'Outono'; return'Inverno'; }
function rollWeather(ms:number){ const m=new Date(ms).getMonth()+1; const baseT=(m>=12||m<=2)?14:(m<=5?20:(m<=8?28:18)); const seed=((ms>>>8)%5);
  const list:Weather[]=['Ensolarado','Nublado','Chuva','Vento','Ensolarado']; const weather=(m===12||m<=2)&&seed===2?'Neve':list[seed]; const delta=[-3,-1,0,1,3][seed];
  return {weather, temperatureC: baseT+delta}; }

// --- Default player ---
const defaultPlayer: PlayerState = {
  character: { id:'hero', name:'Aventureiro', origin:'Sem Origem', role:'Sem Classe', race:'Humano', roleKey:'guerreiro', raceKey:'humano' } as any,
  guildRank: 0,
  adventurerRank: 'Sem Guilda',
  xp: 0, level: 1, statPoints: 0,
  attributes: { strength: 5, agility: 5, intelligence: 5, vitality: 5, luck: 5 },
  stats: { hp: 100, maxHp: 100, attack: 10, defense: 5, crit: 0.05 },
  stamina: { current: 10, max: 10, lastRefillDay: 0 },
  status: [],
  coins: { gold:0, silver:0, bronze:0, copper:0 },
  inventory: [], skills: {}
};

const defaultState: GameState = {
  version: 2, createdAt: Date.now(), updatedAt: Date.now(),
  player: defaultPlayer,
  guild: { isMember:false, completedQuests:[], activeQuests:[], memberCard: undefined },
  market: { catalog: [] },
  // UI theme switcher
  ui: { headerStyle: 'modern' },
  // @ts-ignore
  world: defaultWorld
} as any;

// --- XP / Level ---
export const NEED_XP = (L:number)=> Math.floor(100 * Math.pow(1.2, Math.max(0, L-1)));

// Context API
type Ctx = {
  state: GameState; setState: React.Dispatch<React.SetStateAction<GameState>>;
  addXP:(n:number)=>void; levelUpIfNeeded:()=>void;
  allocateStat:(attr:AttributeKey)=>void; train:(attr:AttributeKey)=>void;
  giveCoins:(p:Partial<CoinPouch>)=>void; takeCoins:(p:Partial<CoinPouch>)=>boolean;
  addItem:(i:Item,q?:number)=>void; removeItem:(id:string,q?:number)=>boolean;
  buyItem:(i:Item,q?:number)=>boolean; sellItem:(id:string,q?:number)=>boolean;
  undertakeQuest:(q:Quest)=>{win:boolean; message:string}; completeQuest:(id:string)=>void; restAtInn:()=>void;
  advanceDay:(reason?:string)=>void;
  createGuildCard:(info:{name:string, origin:string, role:string, roleKey?:string, race?:string, raceKey?:string})=>boolean;
  setHeaderStyle:(style:'legacy'|'modern')=>void;
  exportSave:()=>Promise<void>; importSave:(f:File)=>Promise<void>;
  lastSavedAt?:number; isSaving?:boolean;
};

const GameContext = createContext<Ctx|null>(null);

export function GameProviderClient({ children }:{children:React.ReactNode}){
  const { add } = useToasts();
  const [state, setState] = useState<GameState>(defaultState);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number|undefined>(undefined);

  // Load + migrate
  useEffect(()=>{
    const loaded = loadGame<GameState>();
    if(loaded){
      const merged:any = { ...defaultState, ...loaded };
      merged.player = { ...defaultPlayer, ...loaded.player };
      // ensure keys exist
      merged.player.character = { ...defaultPlayer.character, ...merged.player.character };
      if(!merged.player.character.roleKey) merged.player.character.roleKey = 'guerreiro';
      if(!merged.player.character.raceKey) merged.player.character.raceKey = 'humano';
      merged.guild = { ...defaultState.guild, ...loaded.guild };
      merged.market = { ...defaultState.market, ...loaded.market };
      merged.world = loaded.world || defaultWorld;
      merged.ui = loaded.ui || defaultState.ui;
      merged.player.statPoints = typeof merged.player.statPoints === 'number' ? merged.player.statPoints : 0;
      merged.player.stats = merged.player.stats || defaultPlayer.stats;
      merged.player.stamina = merged.player.stamina || defaultPlayer.stamina;
      merged.player.status = merged.player.status || [];
      setState(merged);
    }
  },[]);

  // Auto-save
  useEffect(()=>{
    if (typeof window === 'undefined') return;
    setIsSaving(true);
    const id = setTimeout(()=>{ saveGame(state); setIsSaving(false); setLastSavedAt(Date.now()); }, 300);
    return ()=>clearTimeout(id);
  }, [state]);

  const levelUpIfNeeded = ()=> setState(s=>{
    let xp=Math.max(0,Math.floor(s.player.xp)), level=Math.max(1,Math.floor(s.player.level)), pts=Math.max(0,Math.floor(s.player.statPoints||0));
    let ups=0, need=NEED_XP(level);
    while(xp>=need){ xp-=need; level++; pts++; ups++; need=NEED_XP(level); }
    if(!ups) return s;
    const gainHP=5*ups, newMax=(s.player.stats?.maxHp||100)+gainHP;
    const stats={...(s.player.stats||{hp:100,maxHp:100,attack:10,defense:5,crit:0.05}),maxHp:newMax,hp:newMax};
    return {...s, player:{...s.player, xp, level, statPoints:pts, stats}, updatedAt:Date.now()};
  });

  const addXP=(n:number)=>{ setState(s=>({...s, player:{...s.player, xp:Math.max(0, Math.floor(s.player.xp + Math.floor(n)))}, updatedAt:Date.now()})); setTimeout(()=>levelUpIfNeeded(),0); };

  const allocateStat=(attr:AttributeKey)=> setState(s=>{
    const pts=Math.max(0,s.player.statPoints||0); if(pts<=0) return s;
    const attrs={...s.player.attributes,[attr]:(s.player.attributes as any)[attr]+1};
    const stats={...s.player.stats}; if(attr==='vitality'){stats.maxHp+=2; stats.hp=Math.min(stats.maxHp, stats.hp+2);} if(attr==='strength'){stats.attack+=1;} if(attr==='agility'){stats.defense+=1;} if(attr==='intelligence'){stats.crit=Math.min(0.9,stats.crit+0.01);}
    return {...s, player:{...s.player, attributes:attrs, statPoints:pts-1, stats}, updatedAt:Date.now()};
  });

  const train=(attr:AttributeKey)=> setState(s=>{
    const lvl=s.player.level, cost=Math.round(120*Math.pow(1.28,Math.max(0,lvl-1))), have=coinsToCopper(s.player.coins);
    if(have<cost) return s; const coins=copperToCoins(have-cost); const attrs={...s.player.attributes,[attr]:(s.player.attributes as any)[attr]+1};
    return {...s, player:{...s.player, attributes:attrs, coins}, updatedAt:Date.now()};
  });

  const giveCoins=(p:Partial<CoinPouch>)=> setState(s=>({...s, player:{...s.player, coins:addPouch(s.player.coins,p)}, updatedAt:Date.now()}));
  const takeCoins=(p:Partial<CoinPouch>)=>{ let ok=false; setState(s=>{ const have=coinsToCopper(s.player.coins), need=coinsToCopper(p); if(have<need) return s; ok=true; return {...s, player:{...s.player, coins:copperToCoins(have-need)}, updatedAt:Date.now()}; }); return ok; };

  const addItem=(i:Item,q:number=1)=> setState(s=>{ const inv=[...s.player.inventory]; const idx=inv.findIndex(x=>x.id===i.id); if(idx>=0) inv[idx]={...inv[idx], qty:(inv[idx].qty||0)+q}; else inv.push({...i,qty:q}); return {...s, player:{...s.player, inventory:inv}, updatedAt:Date.now()}; });
  const removeItem=(id:string,q:number=1)=>{ let ok=false; setState(s=>{ const inv=[...s.player.inventory]; const idx=inv.findIndex(x=>x.id===id); if(idx<0) return s; const left=Math.max(0,(inv[idx].qty||0)-q); ok=true; if(left===0) inv.splice(idx,1); else inv[idx]={...inv[idx], qty:left}; return {...s, player:{...s.player, inventory:inv}, updatedAt:Date.now()}; }); return ok; };
  const buyItem=(i:Item,q:number=1)=>{ const cost=(i.valueCopper||0)*q; const ok=takeCoins(copperToCoins(cost)); if(!ok) return false; addItem(i,q); return true; };
  const sellItem=(id:string,q:number=1)=>{ let price=0; setState(s=>{ const inv=[...s.player.inventory]; const idx=inv.findIndex(x=>x.id===id); if(idx<0) return s; const it=inv[idx]; const sellQty=Math.min(q,it.qty||1); price=Math.round((it.valueCopper||10)*0.6)*sellQty; const left=Math.max(0,(it.qty||0)-sellQty); if(left===0) inv.splice(idx,1); else inv[idx]={...it,qty:left}; return {...s, player:{...s.player, inventory:inv, coins:addPouch(s.player.coins, copperToCoins(price))}, updatedAt:Date.now()}; });
    return true; };

  // World clock
  const advanceDay=(reason?:string)=> setState(s=>{ const w=(s as any).world||defaultWorld; const dateMs=nextDay(w.dateMs); const w2={...w, dateMs, season:rollSeason(dateMs), ...rollWeather(dateMs)}; return {...s, world:w2, updatedAt:Date.now()} as any; });

  // Regen quests no mount e quando a data mudar
  useEffect(()=>{ setState(s=>{ const w:any=(s as any).world||defaultWorld; const day=ymd(w.dateMs); if(w.lastMissionsDay===day) return s;
    const active=generateDailyQuests(s.player.adventurerRank, day, w.season, w.weather); const guild={...s.guild, activeQuests:active}; const world={...w, lastMissionsDay:day};
    return {...s, guild, world, updatedAt:Date.now()} as any; }); }, [state.world?.dateMs]);

  // Quests
  const undertakeQuest=(q:Quest)=>{
    const orderArr = rankOrder as unknown as string[];
    const me=orderArr.indexOf(state.player.adventurerRank as any);
    const rq=orderArr.indexOf((q.requiredRank as any)||'F');
    if(me<rq) return {win:false, message:'Seu rank não permite aceitar esta missão.'};
    const parts=q.id.split(':'); const mul=parts[3]?parseFloat(parts[3]):1; const enemy=enemyForRank(((q.requiredRank as any)||'F'));
    const res=simulateCombat({ hp:state.player.stats.hp, maxHp:state.player.stats.maxHp, attack:state.player.stats.attack, defense:state.player.stats.defense, crit:state.player.stats.crit }, enemy, { difficultyMultiplier:mul, potions:1 });
    setState(s=>{ const p={...s.player}; p.stats={...p.stats, hp:Math.max(1,p.stats.hp - res.hpLost)};
      if(res.win){ p.coins=addPouch(p.coins, copperToCoins(q.rewards?.coinsCopper||0)); p.xp=p.xp + (q.rewards?.xp||0) + (res.xpBonus||0); }
      const completed=res.win?[...s.guild.completedQuests,{id:q.id,at:Date.now()}]:s.guild.completedQuests;
      return {...s, player:p, guild:{...s.guild, completedQuests:completed}, updatedAt:Date.now()};
    });
    setTimeout(()=>levelUpIfNeeded(),0);
    return {win:true, message:`${q.title}: ${mul>1?'(Difícil) ':''}Missão realizada!`};
  };
  const completeQuest=(id:string)=>{};
  const restAtInn=()=>{ setState(s=>{ const have=coinsToCopper(s.player.coins); const cost=20; if(have<cost) return s; const coins=copperToCoins(have-cost); const stats={...s.player.stats, hp:s.player.stats.maxHp}; return {...s, player:{...s.player, coins, stats}, updatedAt:Date.now()}; }); setTimeout(()=>advanceDay('rest'),0); };

  // Guild Card: aceita roleKey/raceKey; rank F; cobra 1 prata
  const createGuildCard=(info:{name:string, origin:string, role:string, roleKey?:string, race?:string, raceKey?:string})=>{
    let ok=false;
    setState(s=>{
      const have=coinsToCopper(s.player.coins), need=coinsToCopper({silver:1} as any);
      if(have<need){ return s; }
      ok=true;
      const coins=copperToCoins(have-need);
      const character:any = { ...s.player.character, name:info.name, origin:info.origin, role:info.role };
      if(info.roleKey) character.roleKey = info.roleKey;
      if(info.race) character.race = info.race;
      if(info.raceKey) character.raceKey = info.raceKey;
      const guild={...s.guild, isMember:true, memberCard:{ name:info.name, origin:info.origin, role:info.role, roleKey:info.roleKey||character.roleKey, race: info.race||character.race, raceKey: info.raceKey||character.raceKey, rank:'F' }};
      const player={...s.player, coins, character, adventurerRank:'F'};
      return {...s, guild, player, updatedAt:Date.now()};
    });
    if(!ok){ add({type:'error', title:'Taxa de inscrição', message:'Saldo insuficiente (1 prata).'}); return false; }
    add({type:'success', title:'Bem-vindo à Guilda!', message:'Seu cartão foi emitido (Rank F).'});
    return true;
  };

  const setHeaderStyle=(style:'legacy'|'modern')=> setState(s=>({...s, ui:{ ...(s as any).ui, headerStyle: style }, updatedAt:Date.now()}));

  const ctx: Ctx = {
    state, setState,
    addXP, levelUpIfNeeded, allocateStat, train,
    giveCoins, takeCoins, addItem, removeItem, buyItem, sellItem,
    undertakeQuest, completeQuest, restAtInn, advanceDay,
    createGuildCard, setHeaderStyle,
    exportSave: ()=>exportSave(state),
    importSave: async(f:File)=>{ const blob=await importSaveBlob(f); setState(blob as any); },
    lastSavedAt, isSaving
  };

  return <GameContext.Provider value={ctx}>{children}</GameContext.Provider>;
}

export function useGame(){ const ctx=useContext(GameContext); if(!ctx) throw new Error('useGame must be used inside GameProviderClient'); return ctx; }

// Exposição global opcional para integração sem imports dinâmicos
if (typeof window !== 'undefined') {
  (window as any).__aldorHook = useGame;
}
