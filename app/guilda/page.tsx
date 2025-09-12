'use client';
import React, { useEffect, useState } from 'react';
import { Shield, ScrollText, Award } from 'lucide-react';
import { useGame } from '@/context/GameProvider_aldor_client';
import MissionCard from '@/components/guild/MissionCard';
import { rollLootForRank } from '@/utils/loot';
import { useToasts } from '@/components/ToastProvider';

type Rank = 'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'|'SSS';

export default function GuildPage(){
  const { state, giveCoins, giveXP, spendStamina, ensureMemberCard, completeGuildMission, addLootToInventory } = useGame();
  const { add } = useToasts();
  const isMember = !!state.guild?.isMember;
  const rank: Rank = (state.guild?.memberCard?.rank || 'F') as Rank;
  const staminaCost = 5;
  const [active,setActive] = useState<string|null>(null);
  const [loop,setLoop] = useState<Record<string,boolean>>({});
  const [winMap,setWinMap] = useState<Record<string,number>>({});

  useEffect(()=>{ if(isMember) ensureMemberCard(); },[isMember]);

  function estimateWinChance(m:any): number {
    const tier = (m.requiredRank || m.rank || 'F') as Rank;
    const attrs = state.player?.attributes || {};
    const stats = state.player?.stats || {};
    const power = (attrs.strength||0)*2 + (attrs.intelligence||0)*1.5 + (attrs.vitality||0)*2 + (attrs.agility||0) + (stats.attack||0) + (stats.defense||0)*0.8 + (stats.hp||0)/10;
    const tierReq = {F:10,E:20,D:35,C:50,B:70,A:95,S:130,SS:170,SSS:220}[tier] || 10;
    let p = Math.max(5, Math.min(95, 50 + (power - tierReq)));
    return Math.round(p);
  }

  useEffect(()=>{
    const qs = state.guild?.activeQuests||[];
    const map: Record<string,number> = {};
    for(const m of qs){ map[m.id] = estimateWinChance(m); }
    setWinMap(map);
  }, [state.guild?.activeQuests, state.player?.attributes, state.player?.stats]);

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
      const copper = m.rewards?.copper||0;
      const xp = m.rewards?.xp||0;
      const drops = rollLootForRank(rank);
      if(copper) giveCoins({copper});
      if(xp) giveXP(xp);
      if(drops?.length) addLootToInventory(drops);
      completeGuildMission(rank, { xp, copper, drops, title: m.title||m.name });
      const names = drops?.length ? ' • Drops: '+drops.map((d:any)=>d.name).join(', ') : '';
      add({ title:'Missão concluída', message:`${m.title||m.name}: +${xp} XP${copper?`, +${copper}¢`:''}${names}`, type:'success', ttl:3600 });
    } else {
      add({ title:'Missão falhou', message:`${m.title||m.name}: inimigos foram mais fortes.`, type:'error', ttl:3000 });
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

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 text-amber-300">
        <Award className="w-5 h-5"/>
        <h2 className="font-semibold">Guilda dos Aventureiros — Rank {rank}</h2>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Missões disponíveis</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {(state.guild?.activeQuests||[]).map((m:any)=>(
            <MissionCard key={m.id} mission={m} active={active===m.id}
              onAccept={()=>startMission(m)}
              onLoopToggle={()=>setLoop(l=>({...l,[m.id]:!l[m.id]}))}
              looping={!!loop[m.id]}
              winChance={winMap[m.id]}
            />
          ))}
          {(!state.guild?.activeQuests || state.guild.activeQuests.length===0) && (
            <div className="text-sm text-neutral-400">Nenhuma missão disponível no momento.</div>
          )}
        </div>
      </div>
      <div>
        <h3 className="font-semibold flex items-center gap-2 text-amber-300"><ScrollText className="w-5 h-5"/> Histórico da Guilda</h3>
        <div className="mt-2 space-y-2">
          {(state.guild?.completedQuests||[]).slice(0,15).map((q:any)=>(
            <div key={q.id} className="text-sm p-2 rounded bg-neutral-800/60 border border-neutral-700">
              <div className="flex justify-between"><div>{q.title}</div><div className="text-neutral-400 text-xs">{new Date(q.at).toLocaleTimeString()}</div></div>
              <div className="text-xs">XP: {q.xp||0}, Cobre: {q.copper||0}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
