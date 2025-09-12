'use client';
import React, { useMemo, useState } from 'react';
import { MarketCard } from '@/components/market/MarketCard';
import { MarketModal } from '@/components/market/MarketModal';

type Props = { items:any[]; buy:(id:string)=>any };

export function Market({ items, buy }:Props){
  const [query,setQuery] = useState('');
  const [fType,setFType] = useState('');
  const [fRarity,setFRarity] = useState('');
  const [selected,setSelected] = useState<any>(null);

  const typeMap:Record<string,string[]> = {
    weapon:['arma','weapon'],
    armor:['armadura','armor'],
    shield:['escudo','shield'],
    trinket:['acessório','trinket'],
    consumable:['consumivel','consumable'],
    misc:['misc']
  };

  const filtered = useMemo(()=>{
    return items.filter(i=>{
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
      if(res.finalPrice){ window.dispatchEvent(new CustomEvent('coins:deduct',{detail:{price:res.finalPrice}})); }
      window.dispatchEvent(new CustomEvent('inventory:add',{detail:{item:res.item}}));
      window.dispatchEvent(new CustomEvent('save:autosave',{detail:{reason:'market-buy'}}));
      setSelected(null);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-2 flex-wrap">
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar..." className="px-2 py-1 rounded bg-black/30 border border-white/10"/>
        <select value={fType} onChange={e=>setFType(e.target.value)} className="px-2 py-1 rounded bg-black/30 border border-white/10">
          <option value="">Todos</option>
          <option value="weapon">Armas</option>
          <option value="armor">Armaduras</option>
          <option value="shield">Escudos</option>
          <option value="trinket">Acessórios</option>
          <option value="consumable">Consumíveis</option>
          <option value="misc">Diversos</option>
        </select>
        <select value={fRarity} onChange={e=>setFRarity(e.target.value)} className="px-2 py-1 rounded bg-black/30 border border-white/10">
          <option value="">Todas raridades</option>
          <option value="comum">Comum</option>
          <option value="incomum">Incomum</option>
          <option value="raro">Raro</option>
          <option value="épico">Épico</option>
          <option value="lendário">Lendário</option>
          <option value="mítico">Mítico</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map(item=>(
          <MarketCard key={item.id} item={item} onBuy={onBuy} onView={setSelected}/>
        ))}
      </div>

      {selected && <MarketModal item={selected} onClose={()=>setSelected(null)} onBuy={onBuy}/>}
    </div>
  );
}
