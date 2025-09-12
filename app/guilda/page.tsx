'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Shield, ScrollText } from 'lucide-react';
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

  useEffect(()=>{
    if(isMember) ensureMemberCard();
  },[isMember]);

  function startMission(m:any){
    if(active || !isMember) return;
    const ok = spendStamina(staminaCost);
    if(!ok){ add({ type:'warning', message:'Stamina insuficiente. Descanse na taverna!', ttl:3000 }); return; }
    setActive(m.id);
    setTimeout(()=>finishMission(m), m.duration);
  }
  function finishMission(m:any){
    const copper = m.rewards?.copper||0;
    const xp = m.rewards?.xp||0;
    const drops = rollLootForRank(rank);
    if(copper) giveCoins({copper});
    if(xp) giveXP(xp);
    if(drops?.length) addLootToInventory(drops);
    completeGuildMission(rank, { xp, copper, drops, title: m.title||m.name });
    setActive(null);
    const names = drops?.length ? ' • Drops: '+drops.map((d:any)=>d.name).join(', ') : '';
    add({
      title: 'Missão concluída',
      message: `${m.title||m.name}: +${xp} XP${copper?`, +${copper}¢`:''}${names}`,
      type: 'success',
      ttl: 3800
    });
    if(loop[m.id]) setTimeout(()=>startMission(m), 200);
  }

  return (
    <div className="p-4">
      <div className="grid gap-3 md:grid-cols-2">
        {state.guild?.activeQuests?.map((m:any)=>(
          <MissionCard key={m.id} mission={m} active={active===m.id}
            onStart={()=>startMission(m)}
            onLoop={(val)=>setLoop(l=>({...l,[m.id]:val}))}
            loop={loop[m.id]} />
        ))}
      </div>

      <div className="mt-6">
        <h2 className="font-semibold flex items-center gap-2 text-amber-300">
          <ScrollText className="w-5 h-5"/> Histórico da Guilda
        </h2>
        <div className="mt-2 space-y-2">
          {(state.guild?.completedQuests||[]).slice(0,15).map((q:any)=>(
            <div key={q.id} className="text-sm p-2 rounded bg-neutral-800/60 border border-neutral-700">
              <div className="flex justify-between">
                <div>{q.title}</div>
                <div className="text-neutral-400 text-xs">{new Date(q.at).toLocaleTimeString()}</div>
              </div>
              <div className="text-xs">XP: {q.xp||0}, Cobre: {q.copper||0}</div>
              {Array.isArray(q.drops)&&q.drops.length>0? (
                <div className="flex gap-1 flex-wrap mt-1">
                  {q.drops.map((d:any)=>(
                    <div key={d.id} className={'w-8 h-8 rounded-md ring-2 bg-black/40 p-0.5 flex items-center justify-center ' + (d.rarity==='mítico'?'ring-amber-400': d.rarity==='lendário'?'ring-orange-400': d.rarity==='épico'?'ring-violet-400': d.rarity==='raro'?'ring-blue-400': d.rarity==='incomum'?'ring-emerald-400':'ring-gray-400')} title={(d.name||'Item') + (d.rarity? ' — '+d.rarity : '')}>
                      <img src={(d.icon?.startsWith('/')? d.icon : '/'+(d.icon||'')) || '/images/items/unknown.png'} className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              ):null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
