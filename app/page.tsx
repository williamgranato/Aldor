'use client';
import React, { useMemo, useState, useCallback } from 'react';
import PaperDoll from '@/components/PaperDoll';
import InventoryPanel from '@/components/InventoryPanel';
import { useGame } from '@/context/GameProvider_aldor_client';

type Filters = { q:string; type?:string; rarity?:string; slot?:string; material?:string; order?:'poder'|'valor'|'reqLevel'; };

export default function HomePage(){
  const game = useGame();
  const player = game.state?.player || {};
  const inv = (player.inventory?.items ?? []) as any[];
  const [selectedSlot,setSelectedSlot]=useState('');
  const [filters,setFilters]=useState<Filters>({q:'',order:'poder'});

  const equipItem=useCallback((slot:string,item:any)=>{(game.item_equip??game.equip)?.(slot,item);},[game]);
  const unequipSlot=useCallback((slot:string)=>{(game.item_unequip??game.unequip)?.(slot);},[game]);
  const useItem=useCallback((item:any)=>{(game.use_item??game.useItem)?.(item);},[game]);

  const filtered=useMemo(()=>{
    const q=filters.q.trim().toLowerCase();
    const selSlot=selectedSlot||filters.slot||'';
    let rows=inv.filter(it=>(it?.qty??0)>0);
    if(q) rows=rows.filter(it=>(it.name||'').toLowerCase().includes(q)||(it.id||'').toLowerCase().includes(q));
    if(filters.type) rows=rows.filter(it=>it.type===filters.type);
    if(filters.rarity) rows=rows.filter(it=>it.rarity===filters.rarity);
    if(filters.material) rows=rows.filter(it=>it.material===filters.material);
    if(selSlot) rows=rows.filter(it=>!it.slot||it.slot===selSlot);
    if(filters.order==='valor') rows=rows.slice().sort((a,b)=>(b.valueCopper||0)-(a.valueCopper||0));
    else if(filters.order==='reqLevel') rows=rows.slice().sort((a,b)=>(b.reqLevel||0)-(a.reqLevel||0));
    else rows=rows.slice().sort((a,b)=>((b.power||b.atk||0)-(a.power||a.atk||0)));
    return rows;
  },[inv,filters,selectedSlot]);

  return(<div className="space-y-4 p-4">
    <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 shadow">
      <div className="flex items-center gap-4">
        <img src="/images/avatar.png" alt="avatar" className="w-20 h-20 rounded-xl"/>
        <div>
          <div className="text-lg font-semibold">{player?.character?.name??'Aventureiro'}</div>
          <div className="text-xs text-neutral-400">Nível {player?.level??1} · Rank {player?.adventurerRank??'-'}</div>
        </div>
      </div>
    </div>
    <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">Equipamentos</div>
        <div className="text-xs text-neutral-400">{selectedSlot?`Filtro: ${selectedSlot}`:'Todos os slots'}</div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <PaperDoll equipment={player.equipped||{}}/>
        <div className="flex-1 space-y-2">
          <select value={selectedSlot} onChange={e=>setSelectedSlot(e.target.value)}
            className="px-2 py-1 bg-neutral-900/80 border border-neutral-700 rounded-lg text-sm">
            <option value="">Todos os slots</option><option value="cabeça">Cabeça</option><option value="peito">Peito</option>
            <option value="pernas">Pernas</option><option value="mão_principal">Mão principal</option><option value="mão_secundária">Mão secundária</option>
          </select>
          {selectedSlot&&<button onClick={()=>setSelectedSlot('')} className="px-2 py-1 text-xs bg-neutral-800 border border-neutral-700 rounded-md">Limpar slot</button>}
          <div className="flex flex-wrap gap-2">{Object.keys(player.equipped||{}).map(slot=>(
            <button key={slot} onClick={()=>unequipSlot(slot)} className="px-2 py-1 text-xs bg-rose-800/40 border border-rose-700 rounded-md">Desequipar {slot}</button>
          ))}</div>
        </div>
      </div>
    </div>
    <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <input className="px-2 py-1 bg-neutral-900/80 border border-neutral-700 rounded-lg text-sm" placeholder="Buscar..." value={filters.q}
          onChange={e=>setFilters(f=>({...f,q:e.target.value}))}/>
      </div>
      <InventoryPanel inventory={{items:filtered}} onEquip={item=>equipItem(item.slot||'mão_principal',item)} onUse={item=>useItem(item)} onDiscard={item=>game.removeItem?.(item.id,1)}/>
    </div>
  </div>);
}
