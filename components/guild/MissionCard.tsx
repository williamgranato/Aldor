'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Swords, Hourglass, Zap, Coins as CoinsIcn, Star, Info } from 'lucide-react';

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

export default function MissionCard({
  mission, onAccept, onLoopToggle, looping, active, disabled, winChance
}:{
  mission:any;
  onAccept:()=>void;
  onLoopToggle:()=>void;
  looping:boolean;
  active:boolean;
  disabled?:boolean;
  winChance?:number;
}){
  const tier   = mission.requiredRank ?? mission.rank ?? 'F';
  const xp     = mission.rewards?.xp ?? 0;
  const copper = mission.rewards?.coinsCopper ?? mission.rewards?.copper ?? 0;

  return (
    <motion.div whileHover={{scale: disabled?1:1.02}} className={"p-4 rounded-xl border shadow-md " + (disabled?'bg-slate-900/30 border-slate-800 opacity-70':'bg-slate-900/60 border-amber-900/40')}>
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <div className="font-semibold">
            {mission.title}
            <span className="ml-2 text-xs px-2 py-0.5 rounded bg-amber-800/40 border border-amber-700/40">Rank {tier}</span>
          </div>
          <div className="text-sm opacity-80 mt-0.5">{mission.desc}</div>
          <div className="flex flex-wrap gap-3 text-xs mt-2 items-center">
            <span className="inline-flex items-center gap-1"><Hourglass className="w-3 h-3"/>{Math.round(mission.duration/1000)}s</span>
            <span className="inline-flex items-center gap-1"><Zap className="w-3 h-3"/>5 Stamina</span>
            {xp? <span className="inline-flex items-center gap-1"><Star className="w-3 h-3"/>{xp} XP</span>:null}
            {copper? <span className="inline-flex items-center gap-1"><CoinsIcn className="w-3 h-3"/>{copper}¢</span>:null}
            {typeof winChance==='number'? <span className="inline-flex items-center gap-1"><Swords className="w-3 h-3"/>{winChance}%</span>:null}
          </div>
          {mission.possibleDrops?.length? (
            <div className="mt-2 text-xs">
              <div className="flex items-center gap-1 text-neutral-300 mb-1"><Info className="w-3 h-3"/><span>Possíveis drops</span></div>
              <div className="flex flex-wrap gap-2">
                {mission.possibleDrops.map((d:any)=>(
                  <span key={d.id} className="inline-flex items-center gap-1">
                    <span className={"inline-flex items-center justify-center h-7 w-7 rounded ring-2 " + rarityRing(d.rarity)} title={`${d.name} — ${d.rarity||'comum'}`}>
                      <img src={d.icon} className="h-5 w-5 object-contain" alt={d.name}/>
                    </span>
                    <span className="truncate max-w-[110px]">{d.name} x{d.qty} ({Math.round(d.chance*100)}%)</span>
                  </span>
                ))}
              </div>
            </div>
          ):null}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onLoopToggle} className={"px-3 py-1 rounded-lg border text-sm flex items-center gap-1 " + (looping?'bg-amber-700/60 border-amber-600':'bg-slate-800 hover:bg-slate-700 border-slate-700')}>
            Loop
          </button>
          <button onClick={onAccept} disabled={active} className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-sm flex items-center gap-1 disabled:opacity-60">
            <Swords className="w-3 h-3"/>{active?'Em andamento':'Aceitar'}
          </button>
        </div>
      </div>
      {active? <motion.div initial={{width:0}} animate={{width:'100%'}} transition={{duration: mission.duration/1000, ease:'linear'}} className="mt-2 h-2 bg-amber-500 rounded-full"/>:null}
    </motion.div>
  );
}
