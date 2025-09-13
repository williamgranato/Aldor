'use client';
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { MarketCard } from '@/components/market/MarketCard';
import { MarketModal } from '@/components/market/MarketModal';

type Any = any;
type Props = { items:Any[]; buy:(id:string)=>any; canAfford:(price:any)=>boolean };

export function Market({ items, buy, canAfford }:Props){
  const [query,setQuery] = useState('');
  const [fType,setFType] = useState('');
  const [fRarity,setFRarity] = useState('');
  const [selected,setSelected] = useState<Any>(null);

  const typeMap:Record<string,string[]> = {
    weapon:['arma','weapon'],
    armor:['armadura','armor'],
    shield:['escudo','shield'],
    trinket:['acessório','trinket'],
    consumable:['consumivel','consumível','consumable','comida','potion'],
  };

  const filtered = useMemo(()=>{
    return (items||[]).filter(i=>{
      if(query && !i.name?.toLowerCase?.().includes(query.toLowerCase())) return false;
      if(fType){
        const arr = typeMap[fType]||[fType];
        if(!arr.includes(i.type)) return false;
      }
      if(fRarity && i.rarity!==fRarity) return false;
      return true;
    });
  },[items,query,fType,fRarity]);

  function onBuy(id:string){
    const res = buy(id);
    if(res?.item){
      window.dispatchEvent(new CustomEvent('save:autosave',{detail:{reason:'market-buy'}}));
      setSelected(null);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} className="flex gap-2 flex-wrap items-center">
        <div className="flex items-center gap-2 px-2 py-1 rounded bg-black/30 border border-white/10">
          <Search size={16} className="opacity-70"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar..." className="bg-transparent outline-none text-sm"/>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 rounded bg-black/30 border border-white/10">
          <Filter size={16} className="opacity-70"/>
          <select value={fType} onChange={e=>setFType(e.target.value)} className="bg-transparent outline-none text-sm">
            <option value="">Tipo</option>
            <option value="weapon">Armas</option>
            <option value="armor">Armaduras</option>
            <option value="shield">Escudos</option>
            <option value="trinket">Acessórios</option>
            <option value="consumable">Consumíveis</option>
          </select>
        </div>
        <select value={fRarity} onChange={e=>setFRarity(e.target.value)} className="px-2 py-1 rounded bg-black/30 border border-white/10 text-sm">
          <option value="">Raridade</option>
          <option value="comum">Comum</option>
          <option value="incomum">Incomum</option>
          <option value="raro">Raro</option>
          <option value="épico">Épico</option>
          <option value="lendário">Lendário</option>
          <option value="mítico">Mítico</option>
        </select>
      </motion.div>

      <motion.div initial="hidden" animate="show" variants={{hidden:{opacity:0},show:{opacity:1,transition:{staggerChildren:0.03}}}} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((item,index)=>(
          <motion.div key={item.id} variants={{hidden:{opacity:0,y:8},show:{opacity:1,y:0}}}>
            <MarketCard item={item} onBuy={onBuy} onView={setSelected} canAfford={canAfford}/>
          </motion.div>
        ))}
      </motion.div>

      {selected && <MarketModal item={selected} onClose={()=>setSelected(null)} onBuy={onBuy} canAfford={canAfford}/>}
    </div>
  );
}
