'use client';
import React from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import Image from 'next/image';
import PaperDoll from '@/components/PaperDoll';
import { Heart, Shield, Sword, Crosshair, Zap, Brain, Star, Dumbbell, Sparkles } from 'lucide-react';

const LABELS: Record<string,string> = {
  strength: 'Força',
  agility: 'Agilidade',
  intelligence: 'Inteligência',
  vitality: 'Vitalidade',
  luck: 'Sorte',
};

function resolvePlaceholder(item:any){
  const t = item?.type?.toLowerCase?.() || '';
  if(['arma','weapon','sword','axe','bow','dagger','mace'].some(k=> t.includes(k))) return '/images/sword.png';
  if(['armadura','armor','chest','helm','helmet','boots','greaves','shield'].some(k=> t.includes(k))) return '/images/armor_leather.png';
  if(['comida','food','meal','poção','potion','consumable'].some(k=> t.includes(k))) return '/images/food.png';
  return '/images/items/placeholder.png';
}

function itemImg(it:any){
  if(!it) return '/images/items/placeholder.png';
  let img = it.image || resolvePlaceholder(it);
  if(it.type === 'material'){
    const fname = (img||'').split('/').pop();
    img = `/images/items/materials/${fname}`;
  }
  return img;
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

export default function Page(){
  const { state, increaseAttribute, equip, unequip, useItem,  resetSave } = useGame();
  const player = state.player;

  const attrs = Object.entries(player.attributes||{});
  const bonuses = getEquipBonuses(player.equipment || {});

  const totalAtk = (player.attributes?.strength||0) + (bonuses.atk||0);
  const totalDef = (player.attributes?.vitality||0) + (bonuses.defense||0);
  const totalCrit = (player.attributes?.luck||0) + (bonuses.crit||0);

  // drag helpers
  const onDragStart = (it:any)=> (e:React.DragEvent)=>{
    e.dataTransfer.setData('application/json', JSON.stringify(it));
  };
  const handleDropOnSlot = (slot:any, payload:any)=>{
    if(!payload) return;
    // bloqueia equipamento inválido? validações poderiam ir aqui
    equip(slot, payload);
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 min-h-screen text-white">
      {/* Card do jogador */}
      <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
        <div className="flex items-center gap-6">
          {/* Avatar com drop de consumíveis */}
          <div
            onDragOver={(e)=> e.preventDefault()}
            onDrop={(e)=>{
              const txt = e.dataTransfer.getData('application/json');
              if(!txt) return;
              try{
                const payload = JSON.parse(txt);
                const t = (payload?.type||'').toLowerCase();
                if(['comida','food','meal','poção','potion','consumable'].some(k=> t.includes(k))){
                  useItem?.(payload);
                }
              }catch{}
            }}
            className="relative w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-white/20 shrink-0"
            title="Arraste comida/poção aqui para consumir"
          >
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
                <div className="h-2 bg-amber-500" style={{width: `${Math.min(100,(player.xp%(player.level*100))/(player.level*100)*100)}%`}} />
              </div>
            </div>

            {/* Status: barras finas + extras */}
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs mb-1"><span>HP</span><span>{player.stats.hp} / {player.stats.maxHp}</span></div>
                  <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                    <div className="h-2 bg-red-500" style={{width: `${(player.stats.hp/player.stats.maxHp)*100}%`}} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span>Stamina</span><span>{player.stamina.current} / {player.stamina.max}</span></div>
                  <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                    <div className="h-2 bg-emerald-500" style={{width: `${(player.stamina.current/player.stamina.max)*100}%`}} />
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

      {/* Equipamentos / PaperDoll */}
      <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
        <h3 className="text-lg font-semibold mb-4">Equipamentos</h3>
        <div className="hidden md:block">
          <PaperDoll
            equipment={player.equipment || {}}
            onDropItem={handleDropOnSlot}
            onUnequip={(slot)=> unequip(slot as any)}
          />
        </div>
        <div className="mt-6 md:hidden">
          <PaperDoll
            equipment={player.equipment || {}}
            onDropItem={handleDropOnSlot}
            onUnequip={(slot)=> unequip(slot as any)}
          />
        </div>
      </div>

      {/* Atributos */}
      <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
        <h3 className="text-lg font-semibold mb-3">Atributos</h3>
        <p className="text-xs opacity-80 mb-3">Distribua pontos para evoluir seu personagem.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {attrs.map(([key,val])=> (
            <div key={key} className="flex items-center justify-between gap-3 text-sm rounded-lg px-3 py-2 bg-white/5 border border-white/10">
              <span className="capitalize flex items-center gap-2">
                {key==='strength' && <Dumbbell className="w-4 h-4 opacity-80" />}
                {key==='agility' && <Zap className="w-4 h-4 opacity-80" />}
                {key==='intelligence' && <Brain className="w-4 h-4 opacity-80" />}
                {key==='vitality' && <Shield className="w-4 h-4 opacity-80" />}
                {key==='luck' && <Star className="w-4 h-4 opacity-80" />}
                {LABELS[key] || key}: {val as any}
              </span>
              {player.statPoints>0 && (
                <button
                  className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs shadow-inner active:scale-95 transition"
                  title={
                    key==='strength'?'Aumenta ATK em +2':
                    key==='vitality'?'Aumenta HP Máx em +10':
                    key==='intelligence'?'Aumenta Stamina Máx em +3':
                    key==='luck'?'Aumenta chance de crítico':
                    key==='agility'?'Aumenta velocidade/AGI':''
                  }
                  onClick={()=> increaseAttribute(key as any)}
                >+</button>
              )}
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

      {/* Inventário */}
      <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
        <h3 className="text-lg font-semibold mb-4">Inventário (arraste para equipar)</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {(player.inventory as any[]).map((it:any,i:number)=>(
            <div
              key={i}
              draggable
              onDragStart={onDragStart(it)}
              className={`relative rounded-xl p-2 flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing ring-2 transition group ${
                it.rarity==='comum'?'ring-gray-400':
                it.rarity==='incomum'?'ring-green-500':
                it.rarity==='raro'?'ring-blue-500':
                it.rarity==='épico'?'ring-purple-500':
                it.rarity==='lendário'?'ring-orange-500':
                it.rarity==='mítico'?'ring-yellow-400':'ring-white/10'
              }`}
              title={it.name}
            >
              <img src={itemImg(it)} alt={it.name} className="w-16 h-16 object-contain" />
              <div className="text-xs mt-1 line-clamp-1">{it.name}</div>
              {it.qty && <span className="absolute bottom-1 right-1 text-xs bg-black/60 px-1 rounded">{it.qty}</span>}
              {(it.atk || it.defense || it.hp) && (
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition z-10">
                  {it.atk && <div>⚔️ ATK: {it.atk}</div>}
                  {it.defense && <div>🛡️ DEF: {it.defense}</div>}
                  {it.hp && <div>❤️ HP: {it.hp}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      
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