'use client';
import React, { useState } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import SaveManagerModal from './SaveManagerModal';
import { motion } from 'framer-motion';
import { Heart, Zap, Coins } from 'lucide-react';

function CoinInline({ type, amount }:{type:'gold'|'silver'|'bronze'|'copper'; amount:number}){
  const src = `/images/items/${type}.png`;
  return <span className="inline-flex items-center gap-1"><img src={src} alt={type} className="w-4 h-4"/><span>{amount}</span></span>;
}

export default function AppHeader(){
  const { state, resetSave } = useGame();
  const [showSave,setShowSave]=useState(false);
  const player=state.player;

  const xpPct=(player.xp%(player.level*100))/(player.level*100);
  const hpPct=player.stats.hp/player.stats.maxHp;
  const stamPct=player.stamina.current/player.stamina.max;

  return (
    <motion.div initial={{y:-40,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.5}} className="sticky top-0 z-50 bg-slate-900/70 backdrop-blur-md border-b border-amber-900/40 shadow-md">
      <div className="flex items-center justify-between px-4 py-2 text-sm text-amber-100">
        <div className="flex items-center gap-3">
          <div>
            <div className="font-bold">{player.character.name} (Nv {player.level})</div>
            <div className="w-40 h-2 bg-slate-700 rounded overflow-hidden mt-1">
              <motion.div initial={{width:0}} animate={{width:`${xpPct*100}%`}} transition={{duration:0.5}} className="h-full bg-gradient-to-r from-blue-500 to-purple-600"/>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500"/>
            <div className="w-28 h-2 bg-slate-700 rounded overflow-hidden">
              <motion.div animate={{width:`${hpPct*100}%`}} transition={{duration:0.5}} className="h-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.7)]"/>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-400"/>
            <div className="w-28 h-2 bg-slate-700 rounded overflow-hidden">
              <motion.div animate={{width:`${stamPct*100}%`}} transition={{duration:0.5}} className="h-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.7)]"/>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400"/>
            <div className="flex gap-1">
              <CoinInline type="gold" amount={player.coins.gold}/>
              <CoinInline type="silver" amount={player.coins.silver}/>
              <CoinInline type="bronze" amount={player.coins.bronze}/>
              <CoinInline type="copper" amount={player.coins.copper}/>
            </div>
          </div>
          <button onClick={()=>setShowSave(true)} className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700">Trocar Save</button>
          <button onClick={()=>resetSave()} className="px-2 py-1 rounded bg-red-700 hover:bg-red-600">Deletar Conta</button>
        </div>
      </div>
      {showSave && <SaveManagerModal onClose={()=>setShowSave(false)}/>}
    </motion.div>
  );
}
