'use client';
import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

type Any = any;

function PriceRow({price}:{price:Any}){
  const g = price?.gold||0, s=price?.silver||0, b=price?.bronze||0, c=price?.copper||0;
  return (
    <div className="text-sm flex items-center gap-2 opacity-90">
      {g>0 && <span className="inline-flex items-center gap-1"><img src="/images/items/gold.png" alt="gold" className="w-4 h-4"/>{g}</span>}
      {s>0 && <span className="inline-flex items-center gap-1"><img src="/images/items/silver.png" alt="silver" className="w-4 h-4"/>{s}</span>}
      {b>0 && <span className="inline-flex items-center gap-1"><img src="/images/items/bronze.png" alt="bronze" className="w-4 h-4"/>{b}</span>}
      {c>0 && <span className="inline-flex items-center gap-1"><img src="/images/items/copper.png" alt="copper" className="w-4 h-4"/>{c}</span>}
    </div>
  );
}

type Props = {
  item: Any | null;
  onClose: ()=>void;
  onBuy: (id:string)=>void;
  canAfford: (price:any)=>boolean;
};

export function MarketModal({ item, onClose, onBuy, canAfford }: Props){
  if(!item) return null;
  const final = item.discountedPrice ?? item.price;
  const afford = canAfford(final);
  const out = item.stock<=0;
  const imgSrc = item.image || '/images/items/placeholder.png';

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50"
        initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <motion.div
            initial={{opacity:0, y:16, scale:0.98}}
            animate={{opacity:1, y:0, scale:1}}
            exit={{opacity:0, y:16, scale:0.98}}
            transition={{type:'spring', stiffness:200, damping:20}}
            className="relative w-full max-w-3xl rounded-2xl bg-white/10 backdrop-blur-lg ring-1 ring-white/10 shadow-xl overflow-hidden">
            <button className="absolute top-3 right-3 text-xs px-2 py-1 rounded-md bg-black/30 hover:bg-black/40 flex items-center gap-1" onClick={onClose} aria-label="Fechar (Esc)">
              <X size={14}/> Fechar
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
              <div>
                <div className="w-48 h-48 bg-black/20 rounded-xl overflow-hidden flex items-center justify-center mx-auto">
                  <Image src={imgSrc} alt={item.name} width={256} height={256} className="object-contain w-full h-full" />
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
                  {typeof item.durability==='number' && <div>Durabilidade: <b>{item.durability}</b></div>}
                  {typeof item.atq==='number' && <div>ATQ: <b>{item.atq}</b></div>}
                  {typeof item.def==='number' && <div>DEF: <b>{item.def}</b></div>}
                  {typeof item.crit==='number' && <div>CRIT: <b>{item.crit}%</b></div>}
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
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
