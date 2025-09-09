// /components/InventoryPanel.tsx
'use client';
import React, { useMemo, useState } from 'react';
import type { Item } from '../data/items_catalog';
import ItemMiniCard from './ItemMiniCard';
import { useGame } from '@/context/GameProvider_aldor_client';

type Props = {
  /** Mantido por compatibilidade, mas ignorado: sempre usamos o inventário do provider */
  items?: Item[];
  view?: 'grid'|'list';
  onEquip?: (item: Item) => void;
  onDiscard?: (item: Item) => void;
};

export default function InventoryPanel({ items, view='grid', onEquip, onDiscard }: Props) {
  const game = useGame();
  const providerItems: Item[] = (game.state?.player?.inventory ?? []) as any;
  const data = providerItems; // fonte canônica: NUNCA catálogo/market

  const [q, setQ] = useState('');
  const [type, setType] = useState<string>('');
  const [rarity, setRarity] = useState<string>('');
  const [slot, setSlot] = useState<string>('');
  const [material, setMaterial] = useState<string>('');
  const [sort, setSort] = useState<string>('power');

  const filtered = useMemo(()=>{
    let r = data.slice();
    if (q.trim()) r = r.filter(i => (i.name + i.id + (i.material ?? '') + i.rarity + i.type).toLowerCase().includes(q.toLowerCase()));
    if (type) r = r.filter(i => i.type === type);
    if (rarity) r = r.filter(i => i.rarity === rarity);
    if (slot) r = r.filter(i => i.slot === slot);
    if (material) r = r.filter(i => i.material === material);
    const power = (i: Item) => (i.atk ?? 0) + (i.def ?? 0) + ((i.crit ?? 0) * 0.5) + (((i as any).bonuses?.HP ?? 0) * 0.1);
    if (sort === 'power') r.sort((a,b)=> power(b)-power(a));
    else if (sort === 'value') r.sort((a,b)=> (b.valueCopper)-(a.valueCopper));
    else if (sort === 'req') r.sort((a,b)=> (b.reqLevel)-(a.reqLevel));
    return r;
  }, [data, q, type, rarity, slot, material, sort]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 items-center">
        <input className="px-2 py-1 rounded bg-neutral-950/60 border border-neutral-800 text-sm" placeholder="buscar..." value={q} onChange={e=>setQ(e.target.value)} />
        <select className="px-2 py-1 rounded bg-neutral-950/60 border border-neutral-800 text-sm" value={type} onChange={e=>setType(e.target.value)}>
          <option value="">tipo</option>
          <option value="arma">arma</option>
          <option value="armadura">armadura</option>
          <option value="joia">joia</option>
          <option value="acessório">acessório</option>
          <option value="poção">poção</option>
          <option value="material">material</option>
          <option value="gema">gema</option>
        </select>
        <select className="px-2 py-1 rounded bg-neutral-950/60 border border-neutral-800 text-sm" value={rarity} onChange={e=>setRarity(e.target.value)}>
          <option value="">raridade</option>
          <option value="comum">comum</option>
          <option value="incomum">incomum</option>
          <option value="raro">raro</option>
          <option value="épico">épico</option>
          <option value="lendário">lendário</option>
        </select>
        <select className="px-2 py-1 rounded bg-neutral-950/60 border border-neutral-800 text-sm" value={slot} onChange={e=>setSlot(e.target.value)}>
          <option value="">slot</option>
          <option value="cabeça">cabeça</option><option value="ombros">ombros</option><option value="peito">peito</option><option value="mãos">mãos</option><option value="cintura">cintura</option><option value="pernas">pernas</option><option value="pés">pés</option><option value="mão_principal">mão principal</option><option value="mão_secundária">mão secundária</option><option value="anel_1">anel 1</option><option value="anel_2">anel 2</option><option value="amuleto">amuleto</option><option value="manto">manto</option><option value="acessório">acessório</option>
        </select>
        <select className="px-2 py-1 rounded bg-neutral-950/60 border border-neutral-800 text-sm" value={material} onChange={e=>setMaterial(e.target.value)}>
          <option value="">material</option>
          <option value="couro">couro</option><option value="tecido">tecido</option><option value="escamas">escamas</option><option value="placas">placas</option><option value="madeira_nobre">madeira_nobre</option><option value="ferro">ferro</option><option value="aço">aço</option><option value="mithril">mithril</option><option value="adamantita">adamantita</option><option value="fibras_arcanas">fibras_arcanas</option><option value="resina">resina</option><option value="runa">runa</option>
        </select>
        <select className="px-2 py-1 rounded bg-neutral-950/60 border border-neutral-800 text-sm" value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="power">poder</option>
          <option value="value">valor</option>
          <option value="req">reqLevel</option>
        </select>
      </div>
      <div className={view==='grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2' : 'space-y-2'}>
        {filtered.map(it => (
          <div key={it.id} className="p-2 rounded-xl border border-neutral-800 bg-neutral-950/40">
            {/* Inventory mode: sem preço e SEM botão Comprar */}
            <ItemMiniCard item={it} mode="inventory" />
            <div className="mt-2 flex gap-2">
              <button className="text-[11px] px-2 py-1 rounded bg-emerald-700/80 hover:bg-emerald-700" onClick={()=>onEquip?.(it)}>Equipar</button>
              <button className="text-[11px] px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700" onClick={()=>{
                if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('aldor:compare', { detail: { item: it } }));
              }}>Inspecionar</button>
              <button className="text-[11px] px-2 py-1 rounded bg-red-900/70 hover:bg-red-900" onClick={()=>onDiscard?.(it)}>Descartar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
