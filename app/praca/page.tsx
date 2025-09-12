'use client';
import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { getPracaMissions } from '@/data/missoes';
import { copperToCoins } from '@/utils/money_aldor_client';
import { motion } from 'framer-motion';
import { Hourglass } from 'lucide-react';

type Mission = ReturnType<typeof getPracaMissions>[number];

function CoinInline({ type, amount }:{ type:'gold'|'silver'|'bronze'|'copper'; amount:number }){
  const src = `/images/items/${type}.png`;
  return <span className="inline-flex items-center gap-1"><img src={src} alt={type} className="w-4 h-4"/><span>{amount}</span></span>;
}

export default function PracaPage(){
  const { giveXP, giveCoins } = useGame();
  const [missions,setMissions] = useState<Mission[]>([]);
  const [active,setActive] = useState<string|null>(null);

  useEffect(()=>{ setMissions(getPracaMissions()); },[]);

  function startMission(id:string){ setActive(id); setTimeout(()=>finishMission(id),3000); }
  function finishMission(id:string){
    const m = missions.find(x=>x.id===id); if(!m) return;
    if(m.rewards?.xp) giveXP(m.rewards.xp);
    const copper=(m.rewards?.copper??0)+(m.rewards?.coins?.copper??0);
    if(copper>0) giveCoins({copper});
    setActive(null);
  }

  return (
    <div className="p-4 space-y-4">
      {missions.map(m=>(
        <motion.div whileHover={{scale:1.02}} key={m.id} className="p-4 rounded-xl bg-slate-900/60 border border-amber-900/40 shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">{m.name}</div>
              <div className="text-sm opacity-70">{m.description}</div>
              <div className="flex gap-2 text-xs mt-1">
                <CoinInline type="copper" amount={(m.rewards?.copper??0)+(m.rewards?.coins?.copper??0)} />
                {m.rewards?.xp? <span className="flex items-center gap-1"><Hourglass className="w-3 h-3"/>{m.rewards.xp} XP</span>:null}
              </div>
            </div>
            <div>
              {active===m.id?(
                <motion.div initial={{width:0}} animate={{width:'100%'}} transition={{duration:3, ease:'linear'}} className="h-2 bg-amber-500 rounded-full"/>
              ):(
                <button onClick={()=>startMission(m.id)} className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-sm">Aceitar</button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
