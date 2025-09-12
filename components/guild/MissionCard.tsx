'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Clock, Zap, Star, Coins, RefreshCw, Shield, Percent } from 'lucide-react';
import { motion } from 'framer-motion';

type MissionCardProps = {
  mission: any;
  onComplete?: () => void;
  onLoopChange?: (active: boolean) => void;
  canStart?: () => boolean;
  successChance?: (mission:any) => number;
};

const rankColor = (r:string)=>{
  switch((r||'').toUpperCase()){
    case 'F': return 'bg-gray-500';
    case 'E': return 'bg-emerald-500';
    case 'D': return 'bg-sky-500';
    case 'C': return 'bg-violet-500';
    case 'B': return 'bg-orange-500';
    case 'A': return 'bg-rose-500';
    case 'S': return 'bg-amber-500';
    default: return 'bg-gray-500';
  }
};

const coinIcon = (k:string)=>{
  const key = k.toLowerCase();
  if(key.includes('gold')) return '/image/gold.png';
  if(key.includes('silver')) return '/image/silver.png';
  if(key.includes('bronze')) return '/image/bronze.png';
  if(key.includes('copper') || key.includes('cooper')) return '/image/cooper.png';
  return '/image/coin.png';
};

export default function MissionCard({ mission, onComplete, onLoopChange, canStart, successChance }: MissionCardProps){
  const [progress,setProgress] = useState(0);
  const [countdown,setCountdown] = useState(3);
  const [looping,setLooping] = useState(false);
  const [active,setActive] = useState(false);
  const timerRef = useRef<any>(null);
  const tickRef = useRef<any>(null);
  const DURATION = 3000;

  const startRun = ()=>{
    if(canStart && !canStart()) return;
    setActive(true);
    setProgress(0);
    setCountdown(3);
    const start = Date.now();
    tickRef.current = setInterval(()=>{
      const elapsed = Date.now() - start;
      const left = Math.max(0, DURATION - elapsed);
      setCountdown(Math.ceil(left/1000));
    },100);
    timerRef.current = setTimeout(()=>{
      setActive(false);
      setProgress(0);
      clearInterval(tickRef.current);
      onComplete && onComplete();
      if(looping) startRun();
    }, DURATION);
  };

  useEffect(()=>{
    return ()=>{
      if(timerRef.current) clearTimeout(timerRef.current);
      if(tickRef.current) clearInterval(tickRef.current);
    };
  },[]);

  const toggleLoop = ()=>{
    const nv = !looping;
    setLooping(nv);
    onLoopChange && onLoopChange(nv);
    if(nv && !active) startRun();
  };

  const coins = mission?.rewards?.coins || null;
  const chance = successChance ? successChance(mission) : undefined;

  return (
    <motion.div 
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.35 }}
      className={`space-y-3 rounded-2xl p-4 border border-white/10 shadow-lg bg-black/30 ${looping?'ring-2 ring-emerald-400':''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 rounded bg-sky-600/30 border border-sky-400 flex items-center gap-1 text-sky-300 text-xs">
            <Shield className="w-3 h-3"/> Rank {mission.rank}
          </div>
          <h4 className="text-base font-semibold">{mission.name}</h4>
        </div>
        <motion.button
          onClick={toggleLoop}
          whileHover={{ scale:1.05 }}
          whileTap={{ scale:0.95 }}
          className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${looping?'bg-emerald-600':'bg-gray-700 hover:bg-gray-600'}`}
        >
          <RefreshCw className="w-3 h-3"/> Loop
        </motion.button>
      </div>

      <p className="text-sm opacity-80">{mission.description}</p>

      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
        <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> 3s</span>
        <span className="flex items-center gap-1"><Zap className="w-3 h-3"/> {(mission.cost||5)} Stamina</span>
        <span className="flex items-center gap-1"><Star className="w-3 h-3"/> {mission.rewards?.xp || 0} XP</span>
        {typeof chance === 'number' && (
          <span className="flex items-center gap-1"><Percent className="w-3 h-3"/> {chance.toFixed(1)}%</span>
        )}
      </div>

      {coins && (
        <div className="text-xs flex items-center gap-3 flex-wrap">
          <div className="opacity-70">Moedas:</div>
          {Object.entries(coins).map(([k,v]:any)=> (
            <div key={k} className="flex items-center gap-1">
              <img src={coinIcon(k)} alt={k} className="w-4 h-4"/>
              <span className="capitalize">{k}</span>
              <span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>
      )}

      {mission.drops && mission.drops.length>0 && (
        <div className="text-xs">
          <div className="opacity-70">Possíveis drops:</div>
          <div className="flex flex-wrap gap-3 mt-1">
            {mission.drops.map((d:any,idx:number)=>(
              <div key={idx} className="flex items-center gap-1">
                {d.image && <img src={d.image.startsWith('/images')?d.image:'/images/items/'+d.image} alt={d.name} className="w-4 h-4"/>}
                <span>{d.name} ({d.chance || '??'}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {active && (
        <div className="relative w-full h-3 bg-black/40 rounded overflow-hidden">
          <motion.div 
            key={String(active)} 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 3, ease: 'linear' }}
            className={`h-3 ${rankColor(mission.rank)}`}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white/90">
            {countdown}s
          </div>
        </div>
      )}

      <motion.button
        onClick={startRun}
        disabled={active || (canStart && !canStart())}
        whileHover={{ scale:1.05 }}
        whileTap={{ scale:0.95 }}
        className="mt-1 px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-sm font-semibold disabled:opacity-50"
      >
        Aceitar Missão
      </motion.button>
    </motion.div>
  );
}
