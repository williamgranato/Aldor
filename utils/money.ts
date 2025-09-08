import { CoinPouch } from '../types';

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function coinsToCopper(c: CoinPouch): number {
  const g = (c.gold || 0) * 1000 * 10;
  const s = (c.silver || 0) * 1000;
  const b = (c.bronze || 0) * 100;
  const cp = (c.copper || 0);
  return g + s + b + cp;
}

export function copperToCoins(total: number): CoinPouch {
  let rest = Math.max(0, Math.floor(total));
  const gold = Math.floor(rest / (1000 * 10)); rest -= gold * (1000 * 10);
  const silver = Math.floor(rest / 1000); rest -= silver * 1000;
  const bronze = Math.floor(rest / 100); rest -= bronze * 100;
  const copper = rest;
  return { gold, silver, bronze, copper };
}
