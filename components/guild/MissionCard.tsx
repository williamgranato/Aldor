'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Swords, Hourglass, RefreshCw, Lock, Zap, Coins as CoinsIcn, Star } from 'lucide-react';

export default function MissionCard({ mission, onAccept, onLoopToggle, looping, active, disabled, winChance }:
  { mission:any; onAccept:()=>void; onLoopToggle:()=>void; looping:boolean; active:boolean; disabled?:boolean; winChance?:number; }){
  const copper = mission.rewards?.copper ?? mission.rewards?.coins?.copper ?? 0;
  const bronze = mission.rewards?.coins?.bronze ?? 0;
  const silver = mission.rewards?.coins?.silver ?? 0;
  const gold   = mission.rewards?.coins?.gold ?? 0;
  const xp     = mission.rewards?.xp ?? 0;
  const tier   = mission.requiredRank ?? mission.rank ?? 'F';

  return (
    <motion.div whileHover={{scale: disabled?1:1.02}} className={"p-4 rounded-xl border shadow-md " + (disabled?'bg-slate-900/30 border-slate-800 opacity-70':'bg-slate-900/60 border-amber-900/40')}>
      <div className="flex justify-between items-center">
        <div>
          <div className="font-semibold">
            {mission.title || mission.name}
            <span className="ml-2 text-xs px-2 py-0.5 rounded bg-amber-800/40 border border-amber-700/40">
              Rank {tier}
            </span>
          </div>
          <div className="text-sm opacity-70">{mission.story || mission.description}</div>
          <div className="flex gap-3 text-xs mt-1 items-center">
            <span className="inline-flex items-center gap-1" title="Duração"><Hourglass className="w-3 h-3"/>{Math.round(mission.duration/1000)}s</span>
            <span className="inline-flex items-center gap-1" title="Custo de Stamina"><Zap className="w-3 h-3"/><b>5</b></span>
            {xp? <span className="inline-flex items-center gap-1" title="XP"><Star className="w-3 h-3"/>{xp}</span>:null}
            {typeof winChance === 'number'? <span className="inline-flex items-center gap-1" title="Chance de vitória"><Swords className="w-3 h-3"/>{winChance}%</span>:null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {disabled? <div className="px-3 py-1 rounded-lg bg-slate-800 text-xs inline-flex items-center gap-1"><Lock className="w-3 h-3"/> Requer Guilda</div> : (
            <>
              <button onClick={onLoopToggle} className={"px-3 py-1 rounded-lg border text-sm flex items-center gap-1 " + (looping?'bg-amber-700/60 border-amber-600':'bg-slate-800 hover:bg-slate-700 border-slate-700')}>
                <RefreshCw className="w-3 h-3"/><span>Loop</span>
              </button>
              <button onClick={onAccept} disabled={active} className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-sm flex items-center gap-1 disabled:opacity-60">
                <Swords className="w-3 h-3"/><span>{active?'Em andamento':'Aceitar'}</span>
              </button>
            </>
          )}
        </div>
      </div>
      {active? <motion.div initial={{width:0}} animate={{width:'100%'}} transition={{duration: mission.duration/1000, ease:'linear'}} className="mt-2 h-2 bg-amber-500 rounded-full"/>:null}
    </motion.div>
  );
}
