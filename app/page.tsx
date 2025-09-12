'use client';
import React from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import Image from 'next/image';
import PaperDoll from '@/components/PaperDoll';
import { Heart, Shield, Sword, Crosshair, Zap, Brain, Star } from 'lucide-react';

const LABELS: Record<string,string> = {
  strength: 'Força',
  agility: 'Agilidade',
  intelligence: 'Inteligência',
  vitality: 'Vitalidade',
  luck: 'Sorte',
};

function resolvePlaceholder(item:any){
  const t = item?.type;
  if(t==='arma' || t==='weapon') return '/images/sword.png';
  if(t==='armadura' || t==='armor') return '/images/armor_leather.png';
  if(t==='comida' || t==='food') return '/images/food.png';
  return '/images/items/placeholder.png';
}

function itemImg(item:any){
  if(item?.image){
    return item.image.startsWith('/images') ? item.image : `/images/items/${item.image}`;
  }
  return resolvePlaceholder(item);
}

// soma atributos dos itens equipados
function getEquipBonuses(equipment:any){
  const totals:any = {};
  Object.values(equipment||{}).forEach((item:any)=>{
    if(!item) return;
    const bonuses = {
      hp: item.hp || 0,
      defense: item.defense || 0,
      atk: item.atk || 0,
      crit: item.crit || 0,
      agi: item.agi || 0,
      int: item.int || 0,
      luck: item.luck || 0,
    };
    Object.entries(bonuses).forEach(([k,v])=>{
      totals[k] = (totals[k]||0) + (v as number);
    });
  });
  return totals;
}

export default function HomePage(){
  const { state, increaseAttribute, equip, unequip } = useGame();
  const player = state.player;

  const attrs = Object.entries(player.attributes);

  const bonuses = getEquipBonuses(player.equipment || {});

  // drag start for inventory item
  const onDragStart = (it:any)=> (e:React.DragEvent)=>{
    const payload = { id: it.id, name: it.name, type: it.type, image: it.image };
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
  };

  const handleDropOnSlot = (slot:any, payload:any)=>{
    // find item in inventory by id
    const item = (player.inventory as any[]).find(i=> i.id === payload.id) || payload;
    equip(slot, item);
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 min-h-screen text-white">
      {/* Card do jogador */}
      <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-black/30 flex items-center justify-center overflow-hidden ring-2 ring-emerald-500/40">
            <Image src="/images/avatar.png" alt="avatar" width={96} height={96} className="object-contain" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{player.character.name}</h2>
            <p className="opacity-70 text-sm">Nível {player.level} · XP {player.xp}</p>
            <div className="mt-2 w-full h-3 bg-black/30 rounded-full overflow-hidden">
              <div className="h-3 bg-emerald-500 transition-all" style={{width: `${(player.xp % (player.level*100))/(player.level*100)*100}%`}} />
            </div>
            {player.statPoints > 0 && (
              <div className="mt-2 text-sm text-amber-400 font-semibold">
                {player.statPoints} pontos de atributo disponíveis!
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <PaperDoll
              equipment={player.equipment || {}}
              onDropItem={handleDropOnSlot}
              onUnequip={(slot)=> unequip(slot as any)}
            />
          </div>
        </div>
      </div>

      {/* Status rápido */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="rounded-xl p-4 bg-red-500/20 border border-red-500/30">
          <div className="text-sm opacity-80">HP</div>
          <div className="font-bold">{player.stats.hp} / {player.stats.maxHp}</div>
        </div>
        <div className="rounded-xl p-4 bg-green-500/20 border border-green-500/30">
          <div className="text-sm opacity-80">Stamina</div>
          <div className="font-bold">{player.stamina.current} / {player.stamina.max}</div>
        </div>
      </div>

      {/* Atributos */}
      <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
        <h3 className="text-lg font-semibold mb-4">Atributos</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {attrs.map(([key,val])=>(
            <div key={key} className="flex items-center justify-between rounded-xl p-3 bg-black/30">
              <span className="capitalize">{LABELS[key] ?? key}: {val as any}</span>
              {player.statPoints>0 && (
                <button
                  className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs"
                  onClick={()=> increaseAttribute(key as any)}
                >
                  +
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Inventário */}
      <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
        <h3 className="text-lg font-semibold mb-4">Inventário (arraste para equipar)</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {(player.inventory as any[]).map((it:any,i:number)=>(
            <div
              key={i}
              draggable
              onDragStart={onDragStart(it)}
              className="rounded-xl p-2 bg-black/30 flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing ring-1 ring-white/10 hover:ring-emerald-500/50 transition"
              title={it.name}
            >
              <Image src={itemImg(it)} alt={it.name} width={64} height={64} className="object-contain" />
              <div className="text-xs mt-1 line-clamp-1">{it.name}</div>
            </div>
          ))}
        </div>
        {/* PaperDoll em mobile */}
        <div className="mt-6 md:hidden">
          <PaperDoll
            equipment={player.equipment || {}}
            onDropItem={handleDropOnSlot}
            onUnequip={(slot)=> unequip(slot as any)}
          />
        </div>
      </div>
    </div>
  );
}
