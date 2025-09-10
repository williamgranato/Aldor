'use client';
import React from 'react';
import Image from 'next/image';
import type { GeneratedMarketItem } from '@/types/market';
import { PriceRow } from '@/utils/priceDisplay';

type Props = {
  item: GeneratedMarketItem;
  onView: (it: GeneratedMarketItem)=>void;
  onBuy: (id: string)=>void;
  canAfford: (price:any)=>boolean;
};

const rarityRing: Record<string, string> = {
  common: 'ring-1 ring-white/10',
  uncommon: 'ring-1 ring-emerald-400/40',
  rare: 'ring-1 ring-sky-400/40',
  epic: 'ring-1 ring-fuchsia-400/40',
  legendary: 'ring-1 ring-amber-400/50',
};

export function MarketCard({ item, onView, onBuy, canAfford }: Props){
  const mainAttr = (()=>{
    if(item.type==='weapon'){
      return <div className="text-xs opacity-80">ATQ <b className="font-semibold">{item.atq ?? 0}</b>{typeof item.crit==='number' ? <> · CRIT <b className="font-semibold">{item.crit}</b>%</> : null}</div>;
    }
    if(item.type==='armor' || item.type==='shield'){
      return <div className="text-xs opacity-80">DEF <b className="font-semibold">{item.def ?? 0}</b>{typeof item.hp==='number' ? <> · HP <b className="font-semibold">{item.hp}</b></> : null}</div>;
    }
    if(item.type==='trinket'){
      const chips = Object.entries(item.bonuses ?? {}).filter(([_,v])=>typeof v==='number' && v!==0).slice(0,3);
      return <div className="flex flex-wrap gap-1">{chips.map(([k,v])=>(<span key={k} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10">{k}+{v}</span>))}</div>;
    }
    if(item.type==='potion'){
      return <div className="text-xs opacity-80">{item.hp? <>Cura <b className="font-semibold">{item.hp}</b></>: 'Poção'}</div>;
    }
    return null;
  })();

  const finalPrice = item.discountedPrice ?? item.price;
  const afford = canAfford(finalPrice);
  const out = item.stock<=0;
  const badge = item.isFlash ? '🔥 Oferta' : (out ? 'Esgotado' : null);

  const imgSrc = item.image || '/images/items/placeholder.png';

  return (
    <div className={`rounded-2xl p-3 bg-white/5 backdrop-blur-sm hover:-translate-y-0.5 transition-all shadow-sm ${rarityRing[item.rarity] ?? 'ring-1 ring-white/10'} ring-inset`}>
      <div className="relative">
        {badge && (
          <div className="absolute -top-2 -left-2 z-10 text-[10px] px-2 py-1 rounded-full bg-amber-500/90 text-black shadow">{badge}</div>
        )}
        <div className="w-full aspect-square overflow-hidden rounded-xl bg-black/20 flex items-center justify-center">
          <Image src={imgSrc} alt={item.name} width={256} height={256} className="object-contain w-full h-full" />
        </div>

        {/* PRICE ROW directly under the image */}
        <div className="mt-2">
          <PriceRow price={finalPrice} />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-sm font-semibold leading-tight line-clamp-1">{item.name}</div>
        <div className="mt-1">{mainAttr}</div>
        <div className="mt-1 text-[10px] uppercase tracking-wide opacity-60">{item.rarity}</div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition text-sm"
          onClick={()=>onView(item)}
          aria-label={`Ver mais sobre ${item.name}`}
        >
          Ver mais
        </button>
        <button
          className={`px-3 py-2 rounded-xl text-sm ${(!afford||out) ? 'bg-white/10 opacity-60 cursor-not-allowed' : 'bg-emerald-500/90 hover:bg-emerald-500 text-black'}`}
          disabled={!afford||out}
          onClick={()=> onBuy(item.id)}
          title={!afford ? 'Moedas insuficientes' : out ? 'Esgotado' : 'Comprar'}
        >
          Comprar
        </button>
      </div>
    </div>
  );
}
