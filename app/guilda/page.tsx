'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Shield, ScrollText, Award } from 'lucide-react';
import { useGame } from '@/context/GameProvider_aldor_client';
import MissionCard from '@/components/guild/MissionCard';
import { getGuildMissions } from '@/data/missoes';
import { rollLootForRank } from '@/utils/loot';
import { useToasts } from '@/components/ToastProvider';

type Rank = 'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'|'SSS';

function rarityRing(r?:string){
  switch(r){
    case 'incomum': return 'ring-emerald-400 text-emerald-400';
    case 'raro': return 'ring-blue-400 text-blue-400';
    case 'épico': return 'ring-violet-400 text-violet-400';
    case 'lendário': return 'ring-orange-400 text-orange-400';
    case 'mítico': return 'ring-amber-400 text-amber-400';
    default: return 'ring-gray-400 text-gray-400';
  }
}

export default function GuildPage(){
  const { state, giveCoins, giveXP, spendStamina, ensureMemberCard, completeGuildMission, addLootToInventory } = useGame();
  const { add } = useToasts();
  const isMember = !!state.guild?.isMember;
  const rank: Rank = (state.guild?.memberCard?.rank || 'F') as Rank;
  const staminaCost = 5;
  const [active,setActive] = useState<string|null>(null);
  const [loop,setLoop] = useState<Record<string,boolean>>({});
  const [winMap,setWinMap] = useState<Record<string,number>>({});
  const [filter,setFilter] = useState<Rank>(rank);

  useEffect(()=>{ if(isMember) ensureMemberCard(); },[isMember]);

  const missions = useMemo(()=>getGuildMissions(filter), [filter]);

  function estimateWinChance(m:any): number {
    const tier = (m.requiredRank || m.rank || 'F') as Rank;
    const attrs = state.player?.attributes || {};
    const stats = state.player?.stats || {};
    const power = (attrs.strength||0)*2 + (attrs.intelligence||0)*1.5 + (attrs.vitality||0)*2 + (attrs.agility||0) + (stats.attack||0) + (stats.defense||0)*0.8 + (stats.hp||0)/10;
    const tierReq = {F:10,E:20,D:35,C:50,B:70,A:95,S:130,SS:170,SSS:220}[tier] || 10;
    return Math.round(Math.max(5, Math.min(95, 50 + (power - tierReq))));
  }

  useEffect(()=>{
    const map: Record<string,number> = {};
    for(const m of missions){ map[m.id] = estimateWinChance(m); }
    setWinMap(map);
  }, [missions, state.player?.attributes, state.player?.stats]);

  function startMission(m:any){
    if(active || !isMember) return;
    const ok = spendStamina(staminaCost);
    if(!ok){ add({ type:'warning', message:'Stamina insuficiente. Descanse na taverna!', ttl:3000 }); return; }
    setActive(m.id);
    setTimeout(()=>finishMission(m), m.duration);
  }

  function finishMission(m:any){
    const winChance = winMap[m.id] ?? estimateWinChance(m);
    const won = Math.random()*100 < winChance;
    setActive(null);
    if(won){
      const copper = m.rewards?.coinsCopper||m.rewards?.copper||0;
      const xp = m.rewards?.xp||0;
      const drops = rollLootForRank(rank);
      if(copper) giveCoins({copper});
      if(xp) giveXP(xp);
      if(drops?.length) addLootToInventory(drops);
      completeGuildMission(rank, { xp, copper, drops, title: m.title });
      add({ title:'Missão concluída', message:`${m.title}: +${xp} XP, +${copper}¢`, type:'success', ttl:3600 });
    } else {
      add({ title:'Missão falhou', message:`${m.title}: inimigos foram mais fortes.`, type:'error', ttl:3000 });
    }
    if(loop[m.id]) setTimeout(()=>startMission(m), 200);
  }

  if(!isMember){
    return (
      <div className="p-6 text-center text-neutral-300">
        <Shield className="w-10 h-10 mx-auto text-amber-400 mb-2"/>
        <p>Você ainda não faz parte da Guilda.</p>
        <p className="text-sm text-neutral-400">Vá até o registro da guilda para se tornar um aventureiro rank F.</p>
      </div>
    );
  }

  const rankOrder: Rank[] = ['F','E','D','C','B','A','S','SS','SSS'];

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 text-amber-300">
        <Award className="w-5 h-5"/>
        <h2 className="font-semibold">Guilda dos Aventureiros — Rank {rank}</h2>
      </div>

      {/* Filtro de Rank */}
      <div className="mb-4">
        <label className="mr-2">Filtrar por Rank:</label>
        <select value={filter} onChange={e=>setFilter(e.target.value as Rank)} className="bg-slate-800 border border-slate-600 rounded px-2 py-1">
          {rankOrder.slice(0, rankOrder.indexOf(rank)+1).map(r=>(<option key={r} value={r}>{r}</option>))}
        </select>
      </div>

      {/* Missões */}
      <div>
        <h3 className="font-semibold mb-2">Missões disponíveis</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {missions.map((m:any)=>(
            <MissionCard key={m.id} mission={m} active={active===m.id}
              onAccept={()=>startMission(m)}
              onLoopToggle={()=>setLoop(l=>({...l,[m.id]:!l[m.id]}))}
              looping={!!loop[m.id]}
              winChance={winMap[m.id]}
            />
          ))}
        </div>
      </div>

      {/* Histórico */}
      <div>
        <h3 className="font-semibold flex items-center gap-2 text-amber-300"><ScrollText className="w-5 h-5"/> Histórico da Guilda</h3>
        <div className="mt-2 space-y-2">
          {(state.guild?.completedQuests||[]).slice(0,15).map((q:any)=>(
            <div key={q.id} className="text-sm p-2 rounded bg-neutral-800/60 border border-neutral-700 drop-shadow">
              <div className="flex justify-between mb-1">
                <div className="font-medium">{q.title}</div>
                <div className="text-neutral-400 text-xs">{new Date(q.at).toLocaleTimeString()}</div>
              </div>
              <div className="text-xs flex items-center gap-3 flex-wrap">
                <span>XP: <b>{q.xp||0}</b></span>
                <span className="inline-flex items-center gap-1"><img src="/images/items/copper.png" className="h-4 w-4"/> {q.copper||0}¢</span>
                {q.drops?.length ? (
                  <span className="inline-flex items-center gap-1">
                    Drops:
                    <span className="inline-flex items-center gap-2">
                      {q.drops.map((d:any)=>(
                        <span key={d.id} className="inline-flex items-center gap-1">
                          <span className={"inline-flex items-center justify-center h-6 w-6 rounded ring-2 " + rarityRing(d.rarity)} title={`${d.name} — ${d.rarity||'comum'}`}>
                            <img src={d.icon||d.image||'/images/items/unknown.png'} className="h-4 w-4 object-contain"/>
                          </span>
                          <span className="max-w-[120px] truncate">{d.name}</span>
                        </span>
                      ))}
                    </span>
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
