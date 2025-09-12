export type MarketItem = {
  id: string;
  name: string;
  rarity?: 'comum'|'incomum'|'raro'|'épico'|'lendário'|'mítico';
  image?: string;
  valueCopper: number;
  tags?: string[];
};

export type FlashOffer = {
  item: MarketItem;
  priceCopper: number;
  merchantId: string;
  expiresAt: number;
  stock: number;
  originalPriceCopper: number;
  discountPct: number;
};

export type ReputationEntry = { merchantId: string; value: number; };

export function computeDiscountPct(rep: number): number {
  if (rep >= 80) return 15;
  if (rep >= 60) return 10;
  if (rep >= 40) return 7;
  if (rep >= 20) return 5;
  return 0;
}

export function applyReputationDiscount(basePriceCopper: number, rep: number): number {
  const pct = computeDiscountPct(rep);
  return Math.max(0, Math.floor(basePriceCopper * (100 - pct) / 100));
}

export function seedRng(seed: number){
  let s = seed >>> 0;
  return function next(){
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function pickN<T>(rng: ()=>number, arr: T[], n: number): T[]{
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.min(n, a.length));
}

export function getFlashWindow(now: Date){
  const h = now.getHours();
  const baseH = h < 6 ? 0 : h < 12 ? 6 : h < 18 ? 12 : 18;
  const start = new Date(now);
  start.setMinutes(0,0,0);
  start.setHours(baseH);
  const end = new Date(start);
  end.setHours(start.getHours()+6);
  return { start, end };
}

export function generateFlashOffers(now: Date, catalog: MarketItem[], merchantId = "mercador_geral"): FlashOffer[]{
  const { start, end } = getFlashWindow(now);
  const seed = Math.floor(start.getTime()/ (6*60*60*1000));
  const rng = seedRng(seed);
  const pool = catalog.filter(it => it.valueCopper > 0);
  const chosen = pickN(rng, pool, 3);
  return chosen.map(item => {
    const discountPct = [10,15,20,25][Math.floor(rng()*4)];
    const original = item.valueCopper;
    const price = Math.max(1, Math.floor(original * (100 - discountPct)/100));
    return {
      item,
      priceCopper: price,
      merchantId,
      expiresAt: end.getTime(),
      stock: 1 + Math.floor(rng()*3),
      originalPriceCopper: original,
      discountPct,
    };
  });
}

export type HaggleResult = { success: boolean; priceCopper: number; deltaRep: number; roll: number; threshold: number };

export function haggle(basePriceCopper: number, carisma: number, rep: number, rng: ()=>number = Math.random): HaggleResult{
  const bonus = Math.min(0.3, (carisma||0)*0.01 + (rep||0)*0.001);
  const roll = rng();
  const threshold = 0.5 - bonus;
  if (roll < threshold){
    const price = Math.floor(basePriceCopper * 1.05);
    return { success: false, priceCopper: price, deltaRep: -1, roll, threshold };
  }
  const discount = 5 + Math.floor((bonus*100) % 8);
  const price = Math.max(1, Math.floor(basePriceCopper * (100 - discount)/100));
  return { success: true, priceCopper: price, deltaRep: +1, roll, threshold };
}

export function updateReputation(list: ReputationEntry[], merchantId: string, delta: number): ReputationEntry[]{
  const cur = list.find(r => r.merchantId === merchantId);
  if (!cur){
    const v = Math.max(0, Math.min(100, delta));
    return [...list, { merchantId, value: v }];
  }
  const v = Math.max(0, Math.min(100, cur.value + delta));
  return list.map(r => r.merchantId === merchantId ? { ...r, value: v } : r);
}
