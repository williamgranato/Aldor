'use client';
import React from 'react';
import type { GeneratedMarketItem } from '@/types/market';
const Coin=({src,alt}:{src:string;alt:string})=>(<img src={src} alt={alt} className="w-5 h-5 inline-block align-middle" />);
export function MarketCard({ item, onBuy, onView, canAfford }:{ item:GeneratedMarketItem; onBuy:(id:string)=>void; onView:(item:GeneratedMarketItem)=>void; canAfford:(p:any)=>boolean }){
  const rings:Record<string,string>={common:'ring-gray-300',uncommon:'ring-emerald-400',rare:'ring-sky-400',epic:'ring-violet-500',legendary:'ring-rose-500'};
  const price=item.discountedPrice??item.price; const afford=canAfford(price);
  return (<div className={`group relative rounded-2xl ring-2 ${rings[item.rarity]||'ring-gray-300'} p-3 bg-white/10 dark:bg-black/20 backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl`}>
    {item.isFlash&&(<div className="absolute -top-2 -right-2 text-xs bg-red-500 text-white px-2 py-1 rounded-full shadow">🔥 Oferta</div>)}
    <div className="flex items-center gap-3">
      <img src={item.image || '/images/items/placeholder.png'} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
      <div className="flex-1">
        <div className="font-semibold">{item.name}</div>
        <div className="text-xs opacity-80">{item.type}{item.slot?` • ${item.slot}`:''} • {item.rarity}</div>
        <div className="mt-1 text-sm">
          {item.type==='weapon' && <span>ATQ {item.atq} {item.crit?`(+CRIT ${item.crit})`:''}</span>}
          {item.type!=='weapon' && item.type!=='potion' && <span>DEF {item.def} {item.hp?`(+HP ${item.hp})`:''}</span>}
          {item.type==='potion' && <span>Poção • cura/cooldown</span>}
        </div>
      </div>
    </div>
    <div className="mt-3 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm">
        <span title="Preço">
          <img src="/images/items/gold.png" className="inline w-5 h-5" alt="gold"/> {price.gold}
          <img src="/images/items/silver.png" className="inline w-5 h-5 ml-2" alt="silver"/> {price.silver}
          <img src="/images/items/bronze.png" className="inline w-5 h-5 ml-2" alt="bronze"/> {price.bronze}
          <img src="/images/items/copper.png" className="inline w-5 h-5 ml-2" alt="copper"/> {price.copper}
        </span>
        {item.stock<=0 && <span className="ml-2 text-xs px-2 py-0.5 rounded bg-zinc-800/50">Esgotado</span>}
      </div>
      <div className="flex gap-2">
        <button onClick={()=> onView(item)} className="px-3 py-1.5 text-sm rounded-lg bg-white/20 hover:bg-white/30 dark:bg-white/10">Ver mais</button>
        <button onClick={()=> afford && item.stock>0 && onBuy(item.id)} className={`px-3 py-1.5 text-sm rounded-lg ${afford && item.stock>0 ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-zinc-600 text-white/60 cursor-not-allowed'}`} title={afford?'':'Moedas insuficientes'} disabled={!afford || item.stock<=0}>Comprar</button>
      </div>
    </div>
  </div>);
}
