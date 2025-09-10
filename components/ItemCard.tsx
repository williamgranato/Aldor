// /components/ItemCard.tsx
import React from 'react';
import type { Item } from '../data/items_catalog';

type Props = {
  item: Item;
  onClick?: () => void;
};

const rarityRing: Record<Item['rarity'], string> = {
  comum: 'ring-1 ring-gray-400',
  incomum: 'ring-1 ring-green-500',
  raro: 'ring-2 ring-blue-500',
  épico: 'ring-2 ring-purple-500',
  lendário: 'ring-2 ring-amber-500',
};

export default function ItemCard({ item, onClick }: Props) {
  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-2xl bg-neutral-900/60 hover:bg-neutral-800 transition cursor-pointer ring-offset-2 ${rarityRing[item.rarity]}`}
      title={`${item.name} • ${item.rarity.toUpperCase()} • Req Nível ${item.reqLevel}`}
      onClick={onClick}
    >
      <img
        src={`/images/items/${item.image}`}
        alt={item.name}
        className="w-12 h-12 object-contain rounded-lg"
        draggable={false}
      />
      <div className="flex-1">
        <div className="text-sm font-semibold">{item.name}</div>
        <div className="text-xs text-neutral-300">
          {item.slot ? <span className="mr-2 uppercase">{item.slot.replace('_',' ')}</span> : null}
          {item.material ? <span className="mr-2">• {item.material}</span> : null}
          <span>• Req {item.reqLevel}</span>
        </div>
        <div className="text-[11px] text-neutral-400 mt-1 flex flex-wrap gap-2">
          {item.atk ? <span>ATQ {item.atk}</span> : null}
          {item.def ? <span>DEF {item.def}</span> : null}
          {item.crit ? <span>CRIT {item.crit}%</span> : null}
          {item.dodge ? <span>ESQ {item.dodge}%</span> : null}
          {item.sockets != null ? <span>Sockets {item.sockets}</span> : null}
          {item.durability != null ? <span>Durab {item.durability}</span> : null}
        </div>
      </div>
      <div className="text-right text-xs text-neutral-300">
        <div className="opacity-80">{item.rarity}</div>
        <div className="font-mono">{item.valueCopper}c</div>
      </div>
    </div>
  );
}
