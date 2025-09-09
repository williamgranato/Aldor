import { ITEMS, CatalogItem } from '@/data/items_catalog';
import { RARITY_COLORS, RarityKey } from '@/data/rarities';

export type MarketEntry = CatalogItem & {
  rarity: RarityKey;
  priceCopper: number;
  attrs?: Partial<Record<'atk'|'def'|'hp'|'crit', number>>;
};

function pickRarity(xp:number): RarityKey{
  const lvl = Math.max(1, Math.floor(xp/150)+1);
  const r = Math.random()*100;
  if(lvl>50 && r<1.2) return 'lendário';
  if(lvl>30 && r<4) return 'épico';
  if(lvl>15 && r<12) return 'raro';
  if(r<30) return 'incomum';
  return 'comum';
}

function rollAttrs(it: CatalogItem, rarity: RarityKey){
  const scale = { comum:1, incomum:1.2, raro:1.5, épico:2.0, lendário:3.0 }[rarity];
  const out:any = {};
  if(it.type==='weapon'){ out.atk = Math.round((3+Math.random()*5)*scale); if(rarity!=='comum') out.crit = +(0.02*scale).toFixed(2); }
  if(it.type==='armor'){ out.def = Math.round((2+Math.random()*4)*scale); out.hp = Math.round((5+Math.random()*10)*scale); }
  if(it.type==='trinket'){ out.crit = +(0.03*scale).toFixed(2); }
  return out;
}

export function generateMarketStock(xp:number, count=18): MarketEntry[]{
  const base = [...ITEMS];
  const out: MarketEntry[] = [];
  for(let i=0;i<count;i++){
    const it = base[Math.floor(Math.random()*base.length)];
    const rarity = pickRarity(xp);
    const attrs = rollAttrs(it, rarity);
    const mult = { comum:1, incomum:1.5, raro:2.2, épico:3.2, lendário:5.0 }[rarity];
    const priceCopper = Math.round((it.valueCopper||10) * mult);
    out.push({ ...it, rarity, priceCopper, attrs });
  }
  return out;
}
