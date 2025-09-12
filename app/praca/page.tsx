'use client';
import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { getPracaMissions } from '@/data/missoes';
import { motion } from 'framer-motion';
import { Hourglass, RefreshCw, Zap, Coins as CoinsIcn, Star } from 'lucide-react';

type Mission = ReturnType<typeof getPracaMissions>[number];

function pick3<T>(arr:T[]):T[]{
  const copy=[...arr];
  const out: T[] = [];
  for(let i=0;i<3 && copy.length;i++){
    const idx = Math.floor(Math.random()*copy.length);
    out.push(copy.splice(idx,1)[0]);
  }
  return out;
}

export default function PracaPage(){
  const { giveXP, giveCoins, spendStamina } = useGame();
  const [pool,setPool] = useState<Mission[]>([]);
  const [missions,setMissions] = useState<Mission[]>([]);
  const [active,setActive] = useState<string|null>(null);
  const [loop,setLoop] = useState<Record<string,boolean>>({});
  const staminaCost = 5;

  useEffect(()=>{
    const all = getPracaMissions();
    setPool(all);
    setMissions(pick3(all));
  },[]);

  function startMission(id:string){
    if(active) return;
    const ok = spendStamina(staminaCost);
    if(!ok){ alert('Stamina insuficiente. Descanse na taverna!'); return; }
    setActive(id); setTimeout(()=>finishMission(id),3000);
  }
  function finishMission(id:string){
    const m = missions.find(x=>x.id===id) || pool.find(x=>x.id===id);
    if(!m) { setActive(null); return; }
    if(m.rewards?.xp) giveXP(m.rewards.xp);
    const copper=(m.rewards?.copper??0)+(m.rewards?.coins?.copper??0);
    if(copper>0) giveCoins({copper});
    setActive(null);
    if(loop[id]) setTimeout(()=>startMission(id),200);
  }

  return (
    <div className="p-4 space-y-4">
      {missions.map(m=>{
        const copper=(m.rewards?.copper??0)+(m.rewards?.coins?.copper??0);
        const bronze=(m.rewards?.coins?.bronze??0);
        const silver=(m.rewards?.coins?.silver??0);
        const gold  =(m.rewards?.coins?.gold  ??0);
        return (
        <motion.div whileHover={{scale:1.02}} key={m.id} className="p-4 rounded-xl bg-slate-900/60 border border-amber-900/40 shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">{m.name}</div>
              <div className="text-sm opacity-70">{m.description}</div>
              <div className="flex gap-3 text-xs mt-1 items-center">
                <span className="inline-flex items-center gap-1" title="Duração"><Hourglass className="w-3 h-3"/>3s</span>
                <span className="inline-flex items-center gap-1" title="Custo de Stamina"><Zap className="w-3 h-3"/><b>5</b></span>
                {m.rewards?.xp? <span className="inline-flex items-center gap-1" title="XP"><Star className="w-3 h-3"/>{m.rewards.xp}</span>:null}
                {gold? <span className="inline-flex items-center gap-1" title="Ouro"><CoinsIcn className="w-3 h-3"/>{gold} ouro</span>:null}
                {silver? <span className="inline-flex items-center gap-1" title="Prata"><CoinsIcn className="w-3 h-3"/>{silver} prata</span>:null}
                {bronze? <span className="inline-flex items-center gap-1" title="Bronze"><CoinsIcn className="w-3 h-3"/>{bronze} bronze</span>:null}
                {(!gold && !silver && !bronze)? <span className="inline-flex items-center gap-1" title="Cobre"><CoinsIcn className="w-3 h-3"/>{copper} cobre</span>:null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={()=>setLoop(s=>({...s,[m.id]:!s[m.id]}))} className={"px-3 py-1 rounded-lg border text-sm flex items-center gap-1 " + (loop[m.id]?'bg-amber-700/60 border-amber-600':'bg-slate-800 hover:bg-slate-700 border-slate-700')}>
                <RefreshCw className="w-3 h-3"/><span>Loop</span>
              </button>
              {active===m.id?(
                <motion.div initial={{width:0}} animate={{width:'100%'}} transition={{duration:3, ease:'linear'}} className="h-2 bg-amber-500 rounded-full w-40"/>
              ):(
                <button onClick={()=>startMission(m.id)} className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-sm">Aceitar</button>
              )}
            </div>
          </div>
        </motion.div>
      )})}
    </div>
  );
}
