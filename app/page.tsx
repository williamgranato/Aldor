'use client';
import React, { useMemo, useState, useCallback } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import PaperDoll from '@/components/PaperDoll';
import InventoryPanel from '@/components/InventoryPanel';
import StatBar from '@/components/StatBar';
import ItemModal from '@/components/ItemModal';
import { Heart, Flame, Star, Shield, Coins as CoinsIcon, Search, Filter } from 'lucide-react';
import { copperToCoins } from '@/utils/money_aldor_client';

type Filters = { q:string; type?:string; rarity?:string; slot?:string; material?:string; order?:'poder'|'valor'|'reqLevel'; };

export default function HomePage(){
  const game = useGame();
  const player:any = game.state?.player || {};
  const inv:any[] = Array.isArray(player.inventory?.items) ? player.inventory.items : (Array.isArray(player.inventory)?player.inventory:[]);
  const equipped = player.equipped || {};
  const [selectedSlot,setSelectedSlot]=useState<string>('');
  const [filters,setFilters]=useState<Filters>({q:'',order:'poder'});
  const [modalItem,setModalItem]=useState<any|null>(null);

  const equipItem=useCallback((slot:string,item:any)=>{(game.item_equip??game.equip)?.(slot,item);},[game]);
  const useItem=useCallback((item:any)=>{(game.use_item??game.useItem)?.(item);},[game]);

  const coins = copperToCoins(player.coins?.copper ?? 0);

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

  const level = player.level ?? 1;
  const xp = player.xp ?? 0;
  const nextLevelXp = level*100;
  const rank = player.adventurerRank ?? (game.state?.guild?.isMember ? 'F' : 'Sem Guilda');

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-6">
      <div className="rounded-2xl bg-neutral-900/60 border border-amber-500/20 p-4">
        <div className="flex items-center gap-4">
          <img src="/images/avatar.png" className="w-20 h-20 rounded-xl"/>
          <div>
            <div className="font-semibold">{player?.character?.name ?? 'Aventureiro'}</div>
            <div className="text-xs text-neutral-400">Rank {rank} · Nível {level}</div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <StatBar icon={<Heart className="w-3.5 h-3.5"/>} label="HP" value={player?.stats?.hp ?? 0} max={player?.stats?.maxHp ?? 100} />
              <StatBar icon={<Flame className="w-3.5 h-3.5"/>} label="STA" value={player?.stamina?.current ?? 0} max={player?.stamina?.max ?? 100} />
              <StatBar icon={<Star className="w-3.5 h-3.5"/>} label="XP" value={xp % nextLevelXp} max={nextLevelXp} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-2 text-sm">
          <div className="flex items-center gap-1"><img src="/images/items/gold.png" className="w-4 h-4"/>{coins.gold}</div>
          <div className="flex items-center gap-1"><img src="/images/items/silver.png" className="w-4 h-4"/>{coins.silver}</div>
          <div className="flex items-center gap-1"><img src="/images/items/bronze.png" className="w-4 h-4"/>{coins.bronze}</div>
          <div className="flex items-center gap-1"><img src="/images/items/copper.png" className="w-4 h-4"/>{coins.copper}</div>
        </div>
      </div>

      <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 font-semibold"><Shield className="w-4 h-4"/> Equipamentos</div>
          <select value={selectedSlot} onChange={e=>setSelectedSlot(e.target.value)} className="text-sm bg-neutral-900/80 border border-neutral-700 rounded">
            <option value="">Todos</option>
            <option value="cabeça">Cabeça</option>
            <option value="peito">Peito</option>
          </select>
        </div>
        <PaperDoll equipment={equipped}/>
      </div>

      <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <div className="flex items-center gap-1 bg-neutral-800 rounded px-2">
            <Search className="w-4 h-4"/><input value={filters.q} onChange={e=>setFilters(f=>({...f,q:e.target.value}))} placeholder="Buscar" className="bg-transparent outline-none"/>
          </div>
          <select value={filters.type||''} onChange={e=>setFilters(f=>({...f,type:e.target.value||undefined}))}><option value="">Tipo</option><option value="arma">Arma</option></select>
          <select value={filters.rarity||''} onChange={e=>setFilters(f=>({...f,rarity:e.target.value||undefined}))}><option value="">Raridade</option><option value="raro">Raro</option></select>
        </div>
        <InventoryPanel inventory={{items:filtered}} onEquip={(item:any)=>equipItem(item.slot||'mão_principal',item)} onUse={(item:any)=>useItem(item)} onInspect={(it:any)=>setModalItem(it)}/>
      </div>

      {modalItem && <ItemModal item={modalItem} equipped={equipped} onClose={()=>setModalItem(null)} onEquip={equipItem} onUse={useItem}/>}
    </div>
  );
}
