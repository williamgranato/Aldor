'use client';
import React from 'react';
import Image from 'next/image';
import type { GeneratedMarketItem } from '@/types/market';
import { PriceRow } from '@/utils/priceDisplay';
import itemsCatalog from '@/data/items_catalog';
import { getItemImagePath } from '@/utils/images';

type Props = {
  item: GeneratedMarketItem | null;
  onClose: ()=>void;
  onBuy: (id:string)=>void;
  canAfford: (price:any)=>boolean;
};

function resolveImage(item: GeneratedMarketItem): string {
  if (item.image) return getItemImagePath(item.image);
  const fromCatalog: any = (itemsCatalog as any[]).find(it => it.id === item.id);
  if (fromCatalog?.image) return getItemImagePath(fromCatalog.image);
  return '/images/items/placeholder.png';
}

export function MarketModal({ item, onClose, onBuy, canAfford }: Props){
  if(!item) return null;
  const final = item.discountedPrice ?? item.price;
  const afford = canAfford(final);
  const out = item.stock<=0;
  const imgSrc = resolveImage(item);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl rounded-2xl bg-white/10 backdrop-blur-lg ring-1 ring-white/10 shadow-xl overflow-hidden">
          <button className="absolute top-3 right-3 text-xs px-2 py-1 rounded-md bg-black/30 hover:bg-black/40" onClick={onClose} aria-label="Fechar (Esc)">
            Fechar
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
            <div>
              <div className="w-full aspect-square bg-black/20 rounded-xl overflow-hidden flex items-center justify-center">
                <Image src={imgSrc} alt={item.name} width={512} height={512} className="object-contain w-full h-full" />
              </div>
              <div className="mt-3">
                <PriceRow price={final} />
              </div>
            </div>
            <div className="min-h-[12rem]">
              <h2 className="text-xl font-bold">{item.name}</h2>
              <div className="text-xs uppercase tracking-wide opacity-60">{item.type} · {item.rarity}{item.slot? ' · '+item.slot : ''}</div>
              <div className="mt-3 grid grid-cols-2 gap-y-1 text-sm">
                {typeof item.reqLevel==='number' && <div>Requer nível: <b>{item.reqLevel}</b></div>}
                {typeof item.weight==='number' && <div>Peso: <b>{item.weight}</b></div>}
                {typeof item.durability==='number' && <div>Durabilidade: <b>{item.durability}</b></div>}
                {typeof item.atq==='number' && <div>ATQ: <b>{item.atq}</b></div>}
                {typeof item.def==='number' && <div>DEF: <b>{item.def}</b></div>}
                {typeof item.crit==='number' && <div>CRIT: <b>{item.crit}%</b></div>}
                {typeof item.dodge==='number' && <div>DODGE: <b>{item.dodge}%</b></div>}
                {typeof item.hp==='number' && <div>HP: <b>{item.hp}</b></div>}
              </div>
              {item.bonuses && Object.keys(item.bonuses).length>0 && (
                <div className="mt-3">
                  <div className="text-xs uppercase tracking-wide opacity-60 mb-1">Bônus</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(item.bonuses).map(([k,v])=> typeof v==='number' && v!==0 ? (
                      <span key={k} className="text-[11px] px-2 py-0.5 rounded-full bg-white/10">{k}+{v}</span>
                    ): null)}
                  </div>
                </div>
              )}
              {item.set && (
                <div className="mt-3">
                  <div className="text-xs uppercase tracking-wide opacity-60">Conjunto</div>
                  <div className="text-sm">{item.set}</div>
                  {item.setBonus && <div className="text-xs opacity-80 mt-1">{item.setBonus}</div>}
                </div>
              )}
              {item.lore && <p className="mt-3 text-sm opacity-80">{item.lore}</p>}
            </div>
          </div>
          <div className="sticky bottom-0 w-full border-t border-white/10 p-4 bg-black/20 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition text-sm" onClick={onClose}>Fechar</button>
              <button className={`px-4 py-2 rounded-xl text-sm ${(!afford||out) ? 'bg-white/10 opacity-60 cursor-not-allowed' : 'bg-emerald-500/90 hover:bg-emerald-500 text-black'}`} disabled={!afford||out} onClick={()=> onBuy(item.id)} title={!afford ? 'Moedas insuficientes' : out ? 'Esgotado' : 'Comprar'}>
                Comprar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
