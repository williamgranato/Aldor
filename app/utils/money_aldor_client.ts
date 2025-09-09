// Money helpers (copper is the smallest unit)
// 1 bronze = 10 copper
// 1 silver = 100 copper
// 1 gold   = 10_000 copper

export type CoinPouch = { gold:number; silver:number; bronze:number; copper:number };

export const CLAMP = (n:number,min=0,max=Number.MAX_SAFE_INTEGER)=>Math.max(min,Math.min(max,Math.floor(n)));
// Back-compat alias:
export const clamp = CLAMP;

export function coinsToCopper(p:Partial<CoinPouch>): number{
  const g = CLAMP(p.gold||0);
  const s = CLAMP(p.silver||0);
  const b = CLAMP(p.bronze||0);
  const c = CLAMP(p.copper||0);
  return g*10000 + s*100 + b*10 + c;
}

export function copperToCoins(c:number): CoinPouch{
  let rest = Math.max(0, Math.floor(c));
  const gold = Math.floor(rest / 10000); rest -= gold * 10000;
  const silver = Math.floor(rest / 100); rest -= silver * 100;
  const bronze = Math.floor(rest / 10); rest -= bronze * 10;
  const copper = rest;
  return { gold, silver, bronze, copper };
}

export function addPouch(a:CoinPouch,b:Partial<CoinPouch>): CoinPouch{
  return copperToCoins( coinsToCopper(a) + coinsToCopper(b) );
}

export function subPouch(a:CoinPouch,b:Partial<CoinPouch>): CoinPouch{
  const x = coinsToCopper(a) - coinsToCopper(b);
  if(x<0) return a;
  return copperToCoins(x);
}
