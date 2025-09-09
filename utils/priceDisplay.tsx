import Image from 'next/image';
import type { CoinPrice } from '@/types/market';

export function normalizePrice(p?: Partial<CoinPrice> | null): CoinPrice {
  return {
    gold: Number(p?.gold ?? 0) || 0,
    silver: Number(p?.silver ?? 0) || 0,
    bronze: Number(p?.bronze ?? 0) || 0,
    copper: Number(p?.copper ?? 0) || 0,
  };
}

export function PriceRow({ price }: { price: Partial<CoinPrice> | null | undefined }) {
  const p = normalizePrice(price);
  const Item = ({src, alt, val}:{src:string;alt:string;val:number}) => (
    <div className="flex items-center gap-1">
      <Image src={src} alt={alt} width={16} height={16} className="opacity-90" />
      <span className="text-sm tabular-nums">{val}</span>
    </div>
  );
  return (
    <div className="flex items-center justify-center gap-3 py-2 px-3 rounded-lg bg-black/10">
      <Item src="/images/items/gold.png" alt="ouro" val={p.gold} />
      <Item src="/images/items/silver.png" alt="prata" val={p.silver} />
      <Item src="/images/items/bronze.png" alt="bronze" val={p.bronze} />
      <Item src="/images/items/copper.png" alt="cobre" val={p.copper} />
    </div>
  );
}
