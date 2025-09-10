// /components/ItemMiniCard.tsx
import React from 'react';
import type { Item } from '../data/items_catalog';

export type CardMode = 'inventory' | 'market';

function mainStatString(item: Item): string {
  if (item.type === 'arma') return `ATQ ${item.atk ?? 0}${item.crit?` • CRIT ${item.crit}%`:''}`;
  if (item.slot === 'mão_secundária') return `DEF ${item.def ?? 0}${(item as any).bonuses?.MITIGATION_PCT?` • Mitig ${(item as any).bonuses?.MITIGATION_PCT}%`:''}`;
  if (item.type === 'armadura') return `DEF ${item.def ?? 0}${(item as any).bonuses?.HP?` • +HP ${(item as any).bonuses?.HP}`:''}`;
  if (item.type === 'joia' || item.type === 'acessório') {
    const chips: string[] = [];
    const b = (item as any).bonuses || {};
    (['STR','AGI','INT','VIT','LUCK','CRIT','DODGE'] as const).forEach(k=>{
      const v = (b as any)[k];
      if (v) chips.push(`${k}+${v}`);
    });
    return chips.slice(0,3).join(' • ') || 'Bônus utilitários';
  }
  if (item.type === 'poção') {
    const heal = (item as any).bonuses?.HP;
    return heal ? `Cura ${heal}` : 'Uso único';
  }
  return item.rarity;
}

const rarityRing: Record<Item['rarity'], string> = {
  comum: 'ring-1 ring-gray-400',
  incomum: 'ring-1 ring-green-500',
  raro: 'ring-2 ring-blue-500',
  épico: 'ring-2 ring-purple-500',
  lendário: 'ring-2 ring-amber-500',
};

export default function ItemMiniCard({ item, compact=false, mode='inventory' }: { item: Item; compact?: boolean; mode?: CardMode }) {
  return (
    <div className={`flex items-center gap-2 ${compact?'':'p-1'} rounded-xl bg-neutral-900/60 ring-offset-2 ${rarityRing[item.rarity]}`} title={item.name}>
      <img src={`/images/items/${item.image}`} alt={item.name} className="w-10 h-10 object-contain rounded" />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold truncate">{item.name}</div>
        <div className="text-[11px] text-neutral-400 truncate">
          {mainStatString(item)}
        </div>
        <div className="text-[10px] text-neutral-500 flex gap-2">
          {item.reqLevel ? <span>Req {item.reqLevel}</span> : null}
          {item.material ? <span>{item.material}</span> : null}
          {item.sockets!=null ? <span>Sockets {item.sockets}</span> : null}
          {item.durability!=null ? <span>Durab {item.durability}</span> : null}
        </div>
      </div>
      {/* Preço visível apenas no modo mercado */}
      {mode === 'market' ? <div className="text-[11px] text-neutral-300 font-mono">{item.valueCopper}c</div> : null}
    </div>
  );
}
