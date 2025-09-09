import type { CoinPrice, GeneratedMarketItem, SeasonalContext } from '@/types/market';
export function applySeasonalPricing(base:CoinPrice,item:GeneratedMarketItem,ctx?:SeasonalContext):CoinPrice{
  if(!ctx) return base; let f=1;
  if(ctx.season==='winter' && item.material?.toLowerCase().includes('fur')) f-=0.05;
  if(ctx.season==='summer' && item.material?.toLowerCase().includes('leather')) f+=0.05;
  if(ctx.weather==='storm' && item.type==='shield') f+=0.05;
  if(ctx.weather==='rain' && item.type==='potion') f-=0.05;
  const clamp=(v:number)=>Math.max(0,Math.round(v));
  return { gold:clamp(base.gold*f), silver:clamp(base.silver*f), bronze:clamp(base.bronze*f), copper:clamp(base.copper*f) };
}
export function toCopper(p:CoinPrice){ return (((p.gold*100+p.silver)*100+p.bronze)*100+p.copper); }
export function fromCopper(c:number){ const g=Math.floor(c/1_000_000); c-=g*1_000_000; const s=Math.floor(c/10_000); c-=s*10_000; const b=Math.floor(c/100); c-=b*100; return { gold:g, silver:s, bronze:b, copper:c }; }
export function applyDiscount(p:CoinPrice, percent:number){ const d=Math.round(toCopper(p)*(1-percent)); return fromCopper(d); }
