// utils/loot.ts — loot balanceado (50% consumível, 10% equipamento, pesos por raridade)
// Patch mínimo: mantemos assinatura e export `rollLootForRank`, mas enriquecemos com catálogos reais.
import * as catalog from '@/data/items_catalog';
import type { Rank } from '@/types_aldor_client';

type Rarity = catalog.Rarity | 'mítico';
type CatItem = catalog.Item & { rarity?: Rarity };

const RARITY_WEIGHTS: Record<Rarity, number> = {
  comum: 60,
  incomum: 25,
  raro: 10,
  épico: 4,
  lendário: 1,
  mítico: 0.3,
};

const ORDER: Rank[] = ['F','E','D','C','B','A','S','SS','SSS'] as any;

// Pequeno impulso para raridades altas em ranks superiores
function rarityBoostForRank(rank: Rank){
  const idx = Math.max(0, ORDER.indexOf(rank));
  const fromF = Math.max(0, idx - ORDER.indexOf('F'));
  const mult = 1 + (fromF * 0.08); // +8% por rank acima de F
  return mult;
}

function pickOne<T>(arr: T[]): T | null {
  if(!Array.isArray(arr) || arr.length===0) return null;
  return arr[Math.floor(Math.random()*arr.length)];
}

function weightedPick<T extends CatItem>(arr: T[], rank: Rank): T | null {
  if(!arr.length) return null;
  const boost = rarityBoostForRank(rank);
  // acumula pesos
  const weights = arr.map(it => (RARITY_WEIGHTS[(it.rarity as Rarity) || 'comum'] || 1) * ((it.rarity && it.rarity!=='comum') ? boost : 1));
  const total = weights.reduce((a,b)=>a+b,0);
  let r = Math.random() * total;
  for(let i=0;i<arr.length;i++){
    r -= weights[i];
    if(r<=0) return arr[i];
  }
  return arr[arr.length-1];
}

function ensureIconPath(image: string | undefined){
  if(!image) return undefined;
  // O projeto usa /public/images/items/*
  if(image.startsWith('/images/')) return image.slice(1);
  if(image.startsWith('images/')) return image;
  return `images/items/${image}`.replace('//','/');
}

type Drop = { id:string; name:string; icon?:string; rarity?: Rarity };

export function rollLootForRank(rank: Rank){
  const all: CatItem[] = (catalog.ITEMS as any) as CatItem[];

  const consumiveis = all.filter(x => x.type==='comida' || x.type==='poção');
  const equipaveis  = all.filter(x => x.type==='arma' || x.type==='armadura' || x.type==='acessório' || x.type==='joia');

  const drops: Drop[] = [];

  // Sorteio 1: 50% consumível
  if(Math.random() < 0.50){
    const it = pickOne(consumiveis);
    if(it) drops.push({ id: it.id, name: it.name, icon: ensureIconPath(it.image), rarity: (it.rarity as Rarity) || 'comum' });
  }

  // Sorteio 2: 10% equipável (com pesos por raridade)
  if(Math.random() < 0.10){
    const it = weightedPick(equipaveis, rank);
    if(it) drops.push({ id: it.id, name: it.name, icon: ensureIconPath(it.image), rarity: (it.rarity as Rarity) || 'comum' });
  }

  return drops;
}

// Helpers de apresentação
export function rarityRingClass(rarity?: Rarity){
  switch(rarity){
    case 'incomum': return 'ring-emerald-400 text-emerald-400';
    case 'raro': return 'ring-blue-400 text-blue-400';
    case 'épico': return 'ring-violet-400 text-violet-400';
    case 'lendário': return 'ring-orange-400 text-orange-400';
    case 'mítico': return 'ring-amber-400 text-amber-400';
    case 'comum':
    default: return 'ring-gray-400 text-gray-400';
  }
}
