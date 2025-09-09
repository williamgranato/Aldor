// Safe price helpers — tolerate undefined/null fields
export type CoinPrice = { gold:number; silver:number; bronze:number; copper:number };

export function normalizePrice(p: Partial<CoinPrice> | null | undefined): CoinPrice {
  const g = Number((p as any)?.gold ?? 0) || 0;
  const s = Number((p as any)?.silver ?? 0) || 0;
  const b = Number((p as any)?.bronze ?? 0) || 0;
  const c = Number((p as any)?.copper ?? 0) || 0;
  return { gold: g, silver: s, bronze: b, copper: c };
}

export function applySeasonalPricing(base: Partial<CoinPrice> | null | undefined, item: any, ctx?: { season?: string; weather?: string; temperature?: number }): CoinPrice {
  // Start from a normalized base to avoid runtime errors
  const normalized = normalizePrice(base);
  if(!ctx) return normalized;
  let f = 1;
  const material = (item?.material || '').toString().toLowerCase();
  const type = (item?.type || '').toString().toLowerCase();

  if(ctx.season === 'winter' && material.includes('fur')) f -= 0.05;
  if(ctx.season === 'summer' && material.includes('leather')) f += 0.05;
  if(ctx.weather === 'storm' && type === 'shield') f += 0.05;
  if(ctx.weather === 'rain' && type === 'potion') f -= 0.05;

  const clamp = (v:number)=> Math.max(0, Math.round(v));
  return {
    gold: clamp(normalized.gold * f),
    silver: clamp(normalized.silver * f),
    bronze: clamp(normalized.bronze * f),
    copper: clamp(normalized.copper * f),
  };
}

export function toCopper(p: Partial<CoinPrice> | null | undefined) {
  const n = normalizePrice(p as any);
  return (((n.gold*100 + n.silver)*100 + n.bronze)*100 + n.copper);
}

export function fromCopper(c:number): CoinPrice {
  const gold = Math.floor(c/1_000_000); c -= gold*1_000_000;
  const silver = Math.floor(c/10_000); c -= silver*10_000;
  const bronze = Math.floor(c/100); c -= bronze*100;
  const copper = c;
  return { gold, silver, bronze, copper };
}

export function applyDiscount(p: Partial<CoinPrice> | null | undefined, percent:number){
  const d = Math.round(toCopper(p)*(1-percent));
  return fromCopper(d);
}
