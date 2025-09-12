// utils/loot.ts
import type { Rank } from '@/types_aldor_client';

type ItemCat = { id:string; name:string; rarity?: 'comum'|'incomum'|'raro'|'épico'|'lendário'|'mítico'; icon?: string };

const RARITY_WEIGHTS = {
  comum: 60,
  incomum: 25,
  raro: 10,
  épico: 4,
  lendário: 1,
  mítico: 0.3,
} as const;

function rarityBoostForRank(rank: Rank){
  const order: Rank[] = ['F','E','D','C','B','A','S','SS','SSS'] as any;
  const idx = Math.max(0, order.indexOf(rank));
  const boost = Math.floor(idx/2) * 0.1;
  return boost;
}

export type Drop = { id:string; name:string; icon?:string };

function safeCatalog(): ItemCat[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('@/data/items_catalog');
    const arr: ItemCat[] = mod.ITEMS || mod.default || [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function weightedPick(arr: ItemCat[], rank: Rank): ItemCat|undefined{
  if(!arr.length) return undefined;
  const boost = rarityBoostForRank(rank);
  const weights = arr.map(it=>{
    const base = RARITY_WEIGHTS[(it.rarity || 'comum') as keyof typeof RARITY_WEIGHTS] ?? 1;
    const isHigh = ['raro','épico','lendário','mítico'].includes((it.rarity||'comum'));
    const w = base * (isHigh ? (1+boost) : 1);
    return Math.max(0.0001, w);
  });
  const total = weights.reduce((a,b)=>a+b,0);
  let r = Math.random() * total;
  for(let i=0;i<arr.length;i++){
    r -= weights[i];
    if(r<=0) return arr[i];
  }
  return arr[arr.length-1];
}

export function rollLootForRank(rank: Rank){
  const cat = safeCatalog();
  if(!cat.length) return [] as Drop[];
  const count = (['F','E','D'].includes(rank)) ? 1 : 2;
  const drops: Drop[] = [];
  for(let i=0;i<count;i++){
    const pick = weightedPick(cat, rank);
    if(pick) drops.push({ id: pick.id, name: pick.name, icon: pick.icon });
  }
  return drops;
}
