'use client';
import { canPromote, countCompletedAtOrAbove, rankThresholds } from '@/utils/rankProgress';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { GameState, PlayerState, Item, Quest, CoinPouch, AttributeKey, SaveBlob, Rank, Character, CharacterBase, EquippedState, SkillsBonus } from '@/types_aldor_client';
import { coinsToCopper, copperToCoins, addPouch } from '@/utils/money_aldor_client';
import { simulateCombat, enemyForRank, computeEffectiveStats } from '@/utils/combat_aldor_client';
import { generateDailyQuests } from '@/utils/dailyQuests_aldor_client';
import { rankOrder } from '@/utils/rankStyle';
import { useToasts } from '@/components/ToastProvider';

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
export type Season = 'Primavera'|'Verão'|'Outono'|'Inverno';
export type Weather = 'Ensolarado'|'Nublado'|'Chuva'|'Neve'|'Vento';
type WorldState = { dateMs:number; season:Season; weather:Weather; temperatureC:number; lastMissionsDay?:string };
const defaultWorld: WorldState = { dateMs: Date.now(), season:'Primavera', weather:'Ensolarado', temperatureC:22 };

// --- Default player ---
const defaultPlayer: PlayerState = {
  id: 'player_default',
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
  ui: { headerStyle: 'modern' },
  world: defaultWorld
} as any;

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

  // Quests
  const undertakeQuest=(q:Quest)=>{
    const orderArr = rankOrder as unknown as string[];
    const me=orderArr.indexOf(state.player.adventurerRank as any);
    const rq=orderArr.indexOf((q.requiredRank as any)||'F');
    if(me<rq) return {win:false, message:'Seu rank não permite aceitar esta missão.'};
    const parts=q.id.split(':'); const mul=parts[3]?parseFloat(parts[3]):1; const enemy=enemyForRank(((q.requiredRank as any)||'F'));
    const res=simulateCombat({ hp:state.player.stats.hp, maxHp:state.player.stats.maxHp, attack:state.player.stats.attack, defense:state.player.stats.defense, crit:state.player.stats.crit }, enemy, { difficultyMultiplier:mul });
    setState(s=>{ const p={...s.player}; p.stats={...p.stats, hp:Math.max(1,p.stats.hp - (res.hpLost ?? res.php ?? 0))};
      if(res.win){ p.coins=addPouch(p.coins, copperToCoins(q.rewards?.coinsCopper||0)); p.xp=p.xp + (q.rewards?.xp||0) + (res.xpBonus||0); }
      const completed=res.win?[...s.guild.completedQuests,{id:q.id, rank:q.requiredRank as Rank, at:Date.now()}]:s.guild.completedQuests;
      return {...s, player:p, guild:{...s.guild, completedQuests:completed}, updatedAt:Date.now()};
    });
    return {win:true, message:`${q.title}: ${mul>1?'(Difícil) ':''}Missão realizada!`};
  };

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
      const guild={...s.guild, isMember:true, memberCard:{ name:info.name, origin:info.origin, role:info.role, roleKey:info.roleKey||character.roleKey, race: info.race||character.race, raceKey: info.raceKey||character.raceKey, rank:'F' as Rank }};
      const player={...s.player, coins, character, adventurerRank:'F' as Rank};
      return {...s, guild, player, updatedAt:Date.now()};
    });
    if(!ok){ add({type:'error', title:'Taxa de inscrição', message:'Saldo insuficiente (1 prata).'}); return false; }
    add({type:'success', title:'Bem-vindo à Guilda!', message:'Seu cartão foi emitido (Rank F).'});
    return true;
  };

  const ctx: Ctx = {
    state, setState,
    addXP:()=>{}, levelUpIfNeeded:()=>{},
    allocateStat:()=>{}, train:()=>{},
    giveCoins:()=>{}, takeCoins:()=>false,
    addItem:()=>{}, removeItem:()=>false,
    buyItem:()=>false, sellItem:()=>false,
    undertakeQuest, completeQuest:()=>{}, restAtInn:()=>{},
    advanceDay:()=>{}, createGuildCard, setHeaderStyle:()=>{},
    exportSave: async()=>{}, importSave: async()=>{},
    lastSavedAt, isSaving
  };

  return <GameContext.Provider value={ctx}>{children}</GameContext.Provider>;
}

export function useGame(){
  const ctx = useContext(GameContext);
  if(!ctx) throw new Error('useGame must be used inside GameProviderClient');
  return ctx;
}
