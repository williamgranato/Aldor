'use client';
import React from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import Image from 'next/image';

export default function HomePage(){
  const { state, increaseAttribute } = useGame();
  const player = state.player;

  const getPlaceholder = (item:any)=>{
    if(item.type==='arma' || item.type==='weapon') return '/images/sword.png';
    if(item.type==='armadura' || item.type==='armor') return '/images/armor_leather.png';
    if(item.type==='comida' || item.type==='food') return '/images/food.png';
    return '/images/items/placeholder.png';
  };

  const attrs = Object.entries(player.attributes);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 min-h-screen text-white">
      {/* Card do jogador */}
      <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-black/30 flex items-center justify-center overflow-hidden">
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
              <span className="capitalize">{key}: {val}</span>
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
        <h3 className="text-lg font-semibold mb-4">Inventário</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {player.inventory.map((it:any,i:number)=>(
            <div key={i} className="rounded-xl p-2 bg-black/30 flex flex-col items-center justify-center text-center">
              <Image src={getPlaceholder(it)} alt={it.name} width={64} height={64} className="object-contain" />
              <div className="text-xs mt-1 line-clamp-1">{it.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Atalhos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {label:'Mercado', href:'/mercado'},
          {label:'Guilda', href:'/guilda'},
          {label:'Missões', href:'/missoes'},
          {label:'Taverna', href:'/taverna'}
        ].map(btn=>(
          <a key={btn.label} href={btn.href} className="rounded-xl p-4 bg-emerald-600/20 border border-emerald-600/40 text-center font-semibold hover:bg-emerald-600/30 transition">
            {btn.label}
          </a>
        ))}
      </div>
    </div>
  );
}
