'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Shield, ScrollText, Award, Landmark } from 'lucide-react';
import { useGame } from '@/context/GameProvider_aldor_client';
import MissionCard from '@/components/guild/MissionCard';
import { getGuildMissions } from '@/data/missoes';
import { rollLootForRank } from '@/utils/loot';
import { useToasts } from '@/components/ToastProvider';

type Rank = 'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'|'SSS';

function rarityClass(r?:string){
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

  function rankIntro(r: Rank){
    const map: Record<Rank,string> = {
      F:'O salão cheira a pergaminho novo e couro molhado. Novatos sussurram contratos, olhos brilhando de expectativa.',
      E:'Você reconhece rostos: veteranos de F trotando para E, rumores de bandidos e lobos rondam o quadro de missões.',
      D:'As paredes exibem troféus discretos. O escriba anota teu nome com respeito contido.',
      C:'O brasão da guilda parece mais pesado aqui. Mensageiros correm, e missões falam em necromantes e golems.',
      B:'Capas encharcadas secam penduradas. O murmúrio é de basiliscos, mares e faróis sem luz.',
      A:'Os atendentes te cumprimentam pelo nome. Falam mais baixo quando você passa.',
      S:'A sala parece maior. Ou você ficou. Cataclismos começam a soar como tarefas possíveis.',
      SS:'Velhos mestres te observam com um quase sorriso. A guilda é teu segundo coração.',
      SSS:'O brasão reverencia de volta. A fronteira entre lenda e rotina ficou tímida.',
    };
    return map[r] || map.F;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="rounded-2xl border border-amber-900/40 bg-gradient-to-r from-amber-900/30 to-slate-900/40 p-4 shadow-lg">
        <div className="flex items-center gap-3 text-amber-300">
          <Landmark className="w-6 h-6"/>
          <h2 className="font-semibold text-lg">Guilda dos Aventureiros — Rank {rank}</h2>
        </div>
        <p className="mt-1 text-sm text-neutral-300">{rankIntro(rank)}</p>
      </div>

      <div className="mb-2">
        <label className="mr-2 text-sm text-neutral-300">Filtrar por Rank:</label>
        <select value={filter} onChange={(e)=>setFilter(e.target.value as Rank)} className="bg-slate-900/70 border border-slate-700 rounded px-2 py-1 text-sm">
          {rankOrder.slice(0, rankOrder.indexOf(rank)+1).map((r)=>(<option key={r} value={r}>{r}</option>))}
        </select>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-3 shadow-md">
        <div className="flex items-center gap-2 text-amber-300 mb-2">
          <ScrollText className="w-5 h-5"/><h3 className="font-semibold">Quadro de Missões</h3>
        </div>
        <p className="text-xs text-neutral-400 mb-3">Os contratos pregados no quadro chamam sua atenção. Escolha seu próximo feito.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {missions.map((m:any)=>(
            <MissionCard key={m.id} mission={m} active={active===m.id}
              onAccept={()=>startMission(m)}
              onLoopToggle={()=>setLoop((l)=>({...l,[m.id]:!l[m.id]}))}
              looping={!!loop[m.id]}
              winChance={winMap[m.id]}
            />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-3 shadow-md">
        <div className="flex items-center gap-2 text-amber-300 mb-2">
          <Award className="w-5 h-5"/><h3 className="font-semibold">Livro de Registros da Guilda</h3>
        </div>
        <div className="space-y-2">
          {(state.guild?.completedQuests||[]).slice(0,15).map((q:any)=>(
            <div key={q.id} className="text-sm p-2 rounded bg-neutral-800/60 border border-neutral-700 drop-shadow">
              <div className="flex justify-between mb-1">
                <div className="font-medium">{q.title}</div>
                <div className="text-neutral-400 text-xs">{new Date(q.at).toLocaleTimeString()}</div>
              </div>
              <div className="text-xs flex items-center gap-3 flex-wrap">
                <span>Recebeu <b>{q.xp||0}</b> XP</span>
                <span className="inline-flex items-center gap-1"><img src="/images/items/copper.png" className="h-4 w-4" alt="cobre"/> {q.copper||0}¢</span>
                {q.drops?.length ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>e coletou:</span>
                    {q.drops.map((d:any)=>(
                      <div key={d.id} className="inline-flex items-center gap-1">
                        <span className={"inline-flex items-center justify-center h-6 w-6 rounded ring-2 " + rarityClass(d.rarity)} title={(d.name||'Item') + ' — ' + (d.rarity||'comum')}>
                          <img src={d.icon||d.image||'/images/items/unknown.png'} className="h-4 w-4 object-contain" alt={d.name||'item'}/>
                        </span>
                        <span className="max-w-[140px] truncate">{d.name||'Item desconhecido'}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
