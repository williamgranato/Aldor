'use client';
import React, { useEffect } from 'react';
import type { GeneratedMarketItem } from '../types/market';
const Row = ({label, children}:{label:string; children:React.ReactNode})=> (<div className="flex justify-between py-1 text-sm"><span className="opacity-70">{label}</span><span className="font-medium">{children}</span></div>);
export function MarketModal({ item, onClose, onBuy, canAfford, equippedCompare }:{ item:GeneratedMarketItem|null; onClose:()=>void; onBuy:(id:string)=>void; canAfford:(p:any)=>boolean; equippedCompare?:any }){
  useEffect(()=>{ const onEsc=(e:KeyboardEvent)=>{ if(e.key==='Escape') onClose(); }; window.addEventListener('keydown', onEsc); return ()=> window.removeEventListener('keydown', onEsc); },[onClose]);
  if(!item) return null;
  const price = item.discountedPrice ?? item.price;
  const afford = canAfford(price);
  const rarityChip:Record<string,string> = { common:'bg-gray-600/40',uncommon:'bg-emerald-600/40',rare:'bg-sky-600/40',epic:'bg-violet-600/40',legendary:'bg-rose-600/40' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-sm bg-black/40" onClick={onClose}/>
      <div role="dialog" aria-modal="true" className="relative w-[min(96vw,900px)] max-h-[90vh] overflow-auto rounded-2xl p-6 bg-white/10 dark:bg-zinc-900/70 backdrop-blur-xl shadow-2xl border border-white/10">
        <div className="flex gap-6 flex-col md:flex-row">
          <img src={item.image || '/images/items/placeholder.png'} alt={item.name} className="w-40 h-40 rounded-xl object-cover" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <span className={`${rarityChip[item.rarity]||'bg-gray-600/40'} text-xs px-2 py-0.5 rounded`}>{item.rarity}</span>
              {item.isFlash && <span className="text-xs px-2 py-0.5 rounded bg-red-600/60">🔥 Oferta -15%</span>}
            </div>
            <div className="mt-1 text-sm opacity-80">{item.type}{item.slot?` • ${item.slot}`:''} {item.material?`• ${item.material}`:''}</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Row label="Req. Nível">{item.reqLevel ?? '-'}</Row>
              <Row label="Durabilidade">{item.durability ?? '-'}</Row>
              <Row label="Peso">{item.weight ?? '-'}</Row>
              <Row label="ATQ">{item.atq ?? '-'}</Row>
              <Row label="DEF">{item.def ?? '-'}</Row>
              <Row label="CRIT">{item.crit ?? '-'}</Row>
              <Row label="DODGE">{item.dodge ?? '-'}</Row>
              <Row label="HP">{item.hp ?? '-'}</Row>
              <Row label="Sockets">{item.sockets ?? 0}</Row>
              <Row label="Conjunto">{item.set ?? '-'}</Row>
            </div>
            {item.setBonus && (<div className="mt-2 text-sm"><span className="opacity-70">Bônus do Conjunto: </span>{item.setBonus}</div>)}
            {item.bonuses && (<div className="mt-3 flex flex-wrap gap-2 text-xs">{Object.entries(item.bonuses).map(([k,v])=>(<span key={k} className="px-2 py-1 rounded bg-white/10">{k}+{v}</span>))}</div>)}
            {item.lore && <p className="mt-3 text-sm opacity-90">{item.lore}</p>}
            {equippedCompare && (<div className="mt-4 rounded-xl p-3 bg-white/5"><div className="text-sm font-medium mb-1">Comparação com equipado</div><div className="grid grid-cols-2 gap-2 text-sm">{Object.entries(equippedCompare).map(([k,val]:any)=> (<div key={k} className="flex justify-between"><span className="opacity-70">{k}</span><span className={val>0?'text-emerald-400':val<0?'text-rose-400':'opacity-80'}>{val>0?'+':''}{val}</span></div>))}</div></div>)}
          </div>
        </div>
        <div className="mt-6 sticky bottom-0 pt-4 border-t border-white/10 flex items-center justify-between gap-3 bg-transparent">
          <div className="text-sm">
            <img src="/images/items/gold.png" className="inline w-5 h-5" alt="gold"/> {price.gold}
            <img src="/images/items/silver.png" className="inline w-5 h-5 ml-2" alt="silver"/> {price.silver}
            <img src="/images/items/bronze.png" className="inline w-5 h-5 ml-2" alt="bronze"/> {price.bronze}
            <img src="/images/items/copper.png" className="inline w-5 h-5 ml-2" alt="copper"/> {price.copper}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30">Fechar</button>
            <button onClick={()=> afford && item.stock>0 && onBuy(item.id)} className={`px-4 py-2 rounded-lg ${afford && item.stock>0 ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-zinc-600 text-white/60 cursor-not-allowed'}`} disabled={!afford || item.stock<=0} title={afford?'':'Moedas insuficientes'}>Comprar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
