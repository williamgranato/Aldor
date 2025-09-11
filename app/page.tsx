'use client';
import React, { useMemo, useState, useCallback } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import PaperDoll from '@/components/PaperDoll';
import InventoryPanel from '@/components/InventoryPanel';
import StatBar from '@/components/StatBar';
import DeltaStatBadge from '@/components/DeltaStatBadge';
import { Heart, Flame, Star, Shield, Swords, Zap, Sparkles, Coins as CoinsIcon, Search, Filter } from 'lucide-react';
import { copperToCoins } from '@/utils/money_aldor_client';

type Filters = { q:string; type?:string; rarity?:string; slot?:string; material?:string; order?:'poder'|'valor'|'reqLevel'; };

export default function HomePage(){
  const game = useGame();
  const player:any = game.state?.player || {};
  const inv:any[] = Array.isArray(player.inventory?.items) ? player.inventory.items : (Array.isArray(player.inventory)?player.inventory:[]);
  const equipped = player.equipped || {};
  const [selectedSlot,setSelectedSlot]=useState<string>('');
  const [filters,setFilters]=useState<Filters>({q:'',order:'poder'});

  const equipItem=useCallback((slot:string,item:any)=>{(game.item_equip??game.equip)?.(slot,item);},[game]);
  const unequipSlot=useCallback((slot:string)=>{(game.item_unequip??game.unequip)?.(slot);},[game]);
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

  function stat(key:string, fallback:number=0){ return player?.stats?.[key] ?? fallback; }
  const level = player.level ?? 1;
  const xp = player.xp ?? 0;
  const nextLevelXp = level*100;
  const rank = player.adventurerRank ?? (game.state?.guild?.isMember ? 'F' : 'Sem Guilda');

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-6">
      {/* Painel do Aventureiro */}
      <div className="rounded-2xl bg-neutral-900/60 border border-amber-500/20 shadow-lg backdrop-blur-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/images/avatar.png" alt="avatar" className="w-20 h-20 rounded-xl ring-1 ring-amber-500/30" />
            <div>
              <div className="text-lg font-semibold">{player?.character?.name ?? 'Aventureiro'}</div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Shield className="w-4 h-4"/><span>Rank {rank}</span>
                <Star className="w-4 h-4"/><span>Nível {level}</span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <StatBar icon={<Heart className="w-3.5 h-3.5"/>} label="HP" value={player?.stats?.hp ?? 0} max={player?.stats?.maxHp ?? 100} />
                <StatBar icon={<Flame className="w-3.5 h-3.5"/>} label="STA" value={player?.stamina?.current ?? 0} max={player?.stamina?.max ?? 100} />
                <StatBar icon={<Star className="w-3.5 h-3.5"/>} label="XP" value={xp % nextLevelXp} max={nextLevelXp} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2"><img src="/images/items/gold.png" className="w-5 h-5"/><span>{coins.gold}</span></div>
            <div className="flex items-center gap-2"><img src="/images/items/silver.png" className="w-5 h-5"/><span>{coins.silver}</span></div>
            <div className="flex items-center gap-2"><img src="/images/items/bronze.png" className="w-5 h-5"/><span>{coins.bronze}</span></div>
            <div className="flex items-center gap-2"><img src="/images/items/copper.png" className="w-5 h-5"/><span>{coins.copper}</span></div>
          </div>
        </div>
        {/* atributos base */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-neutral-300">
          <div className="flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 rounded-lg px-2 py-1"><Swords className="w-3.5 h-3.5"/><span>ATQ {stat('attack',10)}</span></div>
          <div className="flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 rounded-lg px-2 py-1"><Shield className="w-3.5 h-3.5"/><span>DEF {stat('defense',5)}</span></div>
          <div className="flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 rounded-lg px-2 py-1"><Zap className="w-3.5 h-3.5"/><span>CRIT {((player?.stats?.crit??0)*100).toFixed(0)}%</span></div>
          <div className="flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 rounded-lg px-2 py-1"><Sparkles className="w-3.5 h-3.5"/><span>Sorte {player?.attributes?.luck ?? 5}</span></div>
          <div className="flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 rounded-lg px-2 py-1"><CoinsIcon className="w-3.5 h-3.5"/><span>Cobre {(player?.coins?.copper ?? 0)}</span></div>
        </div>
      </div>

      {/* Equipamentos + filtros de slot */}
      <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 font-semibold"><Shield className="w-4 h-4"/><span>Equipamentos</span></div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 opacity-60"/>
            <select value={selectedSlot} onChange={e=>setSelectedSlot(e.target.value)}
              className="px-2 py-1 bg-neutral-900/80 border border-neutral-700 rounded-lg text-sm">
              <option value="">Todos os slots</option>
              <option value="cabeça">Cabeça</option>
              <option value="peito">Peito</option>
              <option value="pernas">Pernas</option>
              <option value="mão_principal">Mão principal</option>
              <option value="mão_secundária">Mão secundária</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <PaperDoll equipment={equipped}/>
          <div className="flex-1 space-y-2">
            <div className="text-xs text-neutral-400">Clique num slot para filtrar o inventário rapidamente. Use “Desequipar” para devolver itens.</div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(equipped||{}).map(slot=>(
                <button key={slot} onClick={()=>unequipSlot(slot)}
                  className="px-2 py-1 text-xs bg-rose-800/40 border border-rose-700 rounded-md hover:bg-rose-700/40 transition">
                  Desequipar {slot}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inventário com filtros */}
      <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 font-semibold"><CoinsIcon className="w-4 h-4"/><span>Inventário</span></div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-2 py-1 bg-neutral-900/80 border border-neutral-700 rounded-lg">
              <Search className="w-4 h-4 opacity-70"/><input value={filters.q} onChange={e=>setFilters(f=>({...f,q:e.target.value}))} placeholder="Buscar..." className="bg-transparent outline-none text-sm"/>
            </div>
            <select value={filters.order} onChange={e=>setFilters(f=>({...f,order:e.target.value as any}))}
              className="px-2 py-1 bg-neutral-900/80 border border-neutral-700 rounded-lg text-sm">
              <option value="poder">Ordenar: poder</option>
              <option value="valor">Ordenar: valor</option>
              <option value="reqLevel">Ordenar: nível req</option>
            </select>
          </div>
        </div>
        <InventoryPanel
          inventory={{items:filtered}}
          onEquip={(item:any)=>equipItem(item.slot||'mão_principal',item)}
          onUse={(item:any)=>useItem(item)}
          onDiscard={(item:any)=>game.removeItem?.(item.id,1)}
        />
        <div className="mt-2 text-xs text-neutral-500">Passe o mouse em um item para ver os deltas de atributos antes de equipar.</div>
      </div>

      {/* Log / Atividade */}
      <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-4">
        <div className="font-semibold mb-2">Atividade recente</div>
        <div className="text-sm text-neutral-400">
          {(game.state?.guild?.logs?.slice(-5) ?? []).reverse().map((log:any,idx:number)=>(
            <div key={idx} className="flex items-center gap-2 py-1">
              <Swords className="w-4 h-4 opacity-70"/><span>{log?.text || 'Ação registrada'}</span>
            </div>
          ))}
          {!(game.state?.guild?.logs?.length>0) && <div className="text-neutral-500">Sem eventos recentes.</div>}
        </div>
      </div>
    </div>
  );
}
