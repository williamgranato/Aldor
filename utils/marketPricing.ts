import type { CoinPrice, GeneratedMarketItem, SeasonalContext } from '../types/market';
export function applySeasonalPricing(base: CoinPrice, item: GeneratedMarketItem, ctx?: SeasonalContext): CoinPrice {
  if (!ctx) return base;
  let factor = 1;
  if (ctx.season === 'winter' && item.material?.toLowerCase().includes('fur')) factor -= 0.05;
  if (ctx.season === 'summer' && item.material?.toLowerCase().includes('leather')) factor += 0.05;
  if (ctx.weather === 'storm' && item.type === 'shield') factor += 0.05;
  if (ctx.weather === 'rain' && item.type === 'potion') factor -= 0.05;
  const clamp = (v:number)=> Math.max(0, Math.round(v));
  return { gold: clamp(base.gold * factor), silver: clamp(base.silver * factor), bronze: clamp(base.bronze * factor), copper: clamp(base.copper * factor) };
}
export function toCopper(p: CoinPrice) {
  return (((p.gold * 100 + p.silver) * 100 + p.bronze) * 100 + p.copper);
}
export function fromCopper(c: number): CoinPrice {
  const gold = Math.floor(c / 1_000_000); c -= gold * 1_000_000;
  const silver = Math.floor(c / 10_000); c -= silver * 10_000;
  const bronze = Math.floor(c / 100); c -= bronze * 100;
  const copper = c;
  return { gold, silver, bronze, copper };
}
export function applyDiscount(p: CoinPrice, percent: number): CoinPrice {
  const c = toCopper(p);
  const d = Math.round(c * (1 - percent));
  return fromCopper(d);
}
