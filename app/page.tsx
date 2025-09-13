'use client';
import React from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import Image from 'next/image';
import PaperDoll from '@/components/PaperDoll';
import InventoryPanel from '@/components/InventoryPanel';
import { Heart, Shield, Sword, Crosshair, Zap, Brain, Star, Dumbbell } from 'lucide-react';

const LABELS: Record<string,string> = {
  strength: 'Força',
  agility: 'Agilidade',
  intelligence: 'Inteligência',
  vitality: 'Vitalidade',
  luck: 'Sorte',
};

const DESCRICOES: Record<string,string> = {
  strength: 'Aumenta o ATK em +2 por ponto.',
  vitality: 'Aumenta o HP Máx em +10 por ponto.',
  intelligence: 'Aumenta a Stamina Máx em +3 por ponto.',
  luck: 'Aumenta chance de crítico.',
  agility: 'Aumenta velocidade/AGI.',
};

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

export default function Page(){
  const { state, increaseAttribute, equip, unequip, useItem, resetSave } = useGame();
  const player = state.player;

  const attrs = Object.entries(player.attributes||{});
  const bonuses = getEquipBonuses(player.equipment || {});

  const totalAtk = (player.attributes?.strength||0) + (bonuses.atk||0);
  const totalDef = (player.attributes?.vitality||0) + (bonuses.defense||0);
  const totalCrit = (player.attributes?.luck||0) + (bonuses.crit||0);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 min-h-screen text-white">
      {/* Card do jogador */}
      <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-white/20 shrink-0">
            <Image src="/images/avatar.png" alt="Avatar" fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-2xl font-bold truncate">{player.character?.name || player.name || 'Aventureiro'}</h1>
              <span className="text-xs px-2 py-1 rounded bg-emerald-600/30 border border-emerald-500/30">Nível {player.level}</span>
            </div>
            {/* XP bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1 opacity-80">
                <span>XP</span>
                <span>{player.xp} / {(player.level*100)}</span>
              </div>
              <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                <div className="h-2 bg-amber-500 transition-all" style={{width: `${Math.min(100,(player.xp%(player.level*100))/(player.level*100)*100)}%`}} />
              </div>
            </div>

            {/* Status */}
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs mb-1"><span>HP</span><span>{player.stats.hp} / {player.stats.maxHp}</span></div>
                  <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                    <div className="h-2 bg-red-500 transition-all" style={{width: `${(player.stats.hp/player.stats.maxHp)*100}%`}} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span>Stamina</span><span>{player.stamina.current} / {player.stamina.max}</span></div>
                  <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                    <div className="h-2 bg-emerald-500 transition-all" style={{width: `${(player.stamina.current/player.stamina.max)*100}%`}} />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30">🛡 Defesa: {totalDef}</span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">⚔ Ataque: {totalAtk}</span>
                <span className="px-3 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/30">🎯 Crítico: {totalCrit}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Equipamentos + Inventário lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipamentos */}
        <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
          <h3 className="text-lg font-semibold mb-4">Equipamentos</h3>
          <PaperDoll
            equipment={player.equipment || {}}
            onDropItem={(slot,payload)=> equip(slot,payload)}
            onUnequip={(slot)=> unequip(slot as any)}
          />
        </div>

        {/* Inventário com abas */}
        <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
          <h3 className="text-lg font-semibold mb-4">Inventário</h3>
          <InventoryPanel
            inventory={{ items: player.inventory || [] }}
            onEquip={(it)=> equip(it.slot, it)}
            onUse={useItem}
            onInspect={(it)=> console.log('Inspect', it)}
          />
        </div>
      </div>

      {/* Atributos com descrições */}
      <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
        <h3 className="text-lg font-semibold mb-3">Atributos</h3>
        <p className="text-xs opacity-80 mb-3">Distribua pontos para evoluir seu personagem.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {attrs.map(([key,val])=> (
            <div key={key} className="flex flex-col gap-1 rounded-lg px-3 py-2 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700 hover:border-amber-500/50 transition">
              <div className="flex items-center justify-between">
                <span className="capitalize flex items-center gap-2 font-semibold">
                  {key==='strength' && <Dumbbell className="w-4 h-4 text-red-400" />}
                  {key==='agility' && <Zap className="w-4 h-4 text-yellow-400" />}
                  {key==='intelligence' && <Brain className="w-4 h-4 text-blue-400" />}
                  {key==='vitality' && <Shield className="w-4 h-4 text-green-400" />}
                  {key==='luck' && <Star className="w-4 h-4 text-purple-400" />}
                  {LABELS[key] || key}: {val as any}
                </span>
                {player.statPoints>0 && (
                  <button
                    className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs shadow-inner active:scale-95 transition"
                    onClick={()=> increaseAttribute(key as any)}
                  >+</button>
                )}
              </div>
              <span className="text-xs opacity-80">{DESCRICOES[key]}</span>
            </div>
          ))}
        </div>
        {player.statPoints>0 && (
          <div className="mt-2 text-xs opacity-80">Pontos disponíveis: {player.statPoints}</div>
        )}
      </div>

      {/* Bônus de Equipamentos */}
      {Object.keys(bonuses).length > 0 && (
        <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
          <h3 className="text-lg font-semibold mb-4">Bônus de Equipamentos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {bonuses.hp > 0 && <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-red-500"/>+{bonuses.hp} HP</div>}
            {bonuses.defense > 0 && <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-sky-500"/>+{bonuses.defense} DEF</div>}
            {bonuses.atk > 0 && <div className="flex items-center gap-2"><Sword className="w-4 h-4 text-emerald-500"/>+{bonuses.atk} ATK</div>}
            {bonuses.crit > 0 && <div className="flex items-center gap-2"><Crosshair className="w-4 h-4 text-yellow-400"/>+{bonuses.crit}% CRIT</div>}
            {bonuses.agi > 0 && <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-purple-400"/>+{bonuses.agi} AGI</div>}
            {bonuses.int > 0 && <div className="flex items-center gap-2"><Brain className="w-4 h-4 text-indigo-400"/>+{bonuses.int} INT</div>}
            {bonuses.luck > 0 && <div className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-400"/>+{bonuses.luck} SORTE</div>}
          </div>
        </div>
      )}

      {/* Botão de deletar save */}
      <div className="rounded-2xl p-6 bg-red-900/30 border border-red-700/50 text-center">
        <button
          onClick={()=> resetSave()}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-semibold"
        >
          Deletar Save (Começar do zero)
        </button>
      </div>
    </div>
  );
}
