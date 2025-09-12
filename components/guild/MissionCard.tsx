'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Swords, Hourglass, RefreshCw } from 'lucide-react';

export default function MissionCard({ mission, onAccept, onLoopToggle, looping, active }:{ mission:any; onAccept:()=>void; onLoopToggle:()=>void; looping:boolean; active:boolean; }){
  return (
    <motion.div whileHover={{scale:1.02}} className="p-4 rounded-xl bg-slate-900/60 border border-amber-900/40 shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-semibold">{mission.name} <span className="ml-2 text-xs px-2 py-0.5 rounded bg-amber-800/40 border border-amber-700/40">{mission.rank}</span></div>
          <div className="text-sm opacity-70">{mission.description}</div>
          <div className="flex gap-3 text-xs mt-1 items-center">
            <span className="inline-flex items-center gap-1"><Hourglass className="w-3 h-3"/>{Math.round(mission.duration/1000)}s</span>
            {mission.rewards?.xp? <span>{mission.rewards.xp} XP</span>:null}
            {mission.rewards?.copper? <span>{mission.rewards.copper} cobre</span>:null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onLoopToggle} className={"px-3 py-1 rounded-lg border text-sm flex items-center gap-1 " + (looping?'bg-amber-700/60 border-amber-600':'bg-slate-800 hover:bg-slate-700 border-slate-700')}>
            <RefreshCw className="w-3 h-3"/><span>Loop</span>
          </button>
          <button onClick={onAccept} disabled={active} className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-sm flex items-center gap-1 disabled:opacity-60">
            <Swords className="w-3 h-3"/><span>{active?'Em andamento':'Aceitar'}</span>
          </button>
        </div>
      </div>
      {active? <motion.div initial={{width:0}} animate={{width:'100%'}} transition={{duration: mission.duration/1000, ease:'linear'}} className="mt-2 h-2 bg-amber-500 rounded-full"/>:null}
    </motion.div>
  );
}
