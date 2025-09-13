'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameProvider_aldor_client';
import { Star, Heart, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AppHeader(){
  const { state } = useGame();
  const player = state.player;
  const xpNeeded = player.level * 100;
  const xpCurrent = player.xp % xpNeeded;
  const xpPct = xpCurrent / xpNeeded;
  const hpPct = player.stats.hp / player.stats.maxHp;
  const stamPct = player.stamina.current / player.stamina.max;

  return (
    <header className="w-full bg-slate-900/80 border-b border-slate-700 shadow-lg px-4 py-2 flex justify-between items-center">
      {/* Logo e infos básicas */}
      <div className="flex items-center gap-3">
        <Link href="/"><img src="/images/logo.png" alt="logo" className="h-8 w-auto"/></Link>
        <div className="flex flex-col">
          <span className="font-bold drop-shadow-md">{player.name}</span>
          <span className="text-xs text-slate-400 drop-shadow-md">Nível {player.level}</span>
        </div>
      </div>

      {/* Barras */}
      <div className="flex gap-6 items-center">
        {/* XP */}
        <div className="flex flex-col items-center">
          <span className="flex items-center gap-1 text-xs text-slate-300"><Star className="w-3 h-3 text-yellow-400"/>XP</span>
          <div className="relative w-40 h-3 bg-slate-700 rounded overflow-hidden mt-1">
            <motion.div initial={{width:0}} animate={{width:`${xpPct*100}%`}} transition={{duration:0.5}} className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600"/>
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white drop-shadow-md">{xpCurrent}/{xpNeeded}</span>
          </div>
        </div>
        {/* HP */}
        <div className="flex flex-col items-center">
          <span className="flex items-center gap-1 text-xs text-slate-300"><Heart className="w-3 h-3 text-red-500"/>HP</span>
          <div className="relative w-28 h-3 bg-slate-700 rounded overflow-hidden mt-1">
            <motion.div animate={{width:`${hpPct*100}%`}} transition={{duration:0.5}} className="absolute top-0 left-0 h-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.7)]"/>
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white drop-shadow-md">{player.stats.hp}/{player.stats.maxHp}</span>
          </div>
        </div>
        {/* Stamina */}
        <div className="flex flex-col items-center">
          <span className="flex items-center gap-1 text-xs text-slate-300"><Zap className="w-3 h-3 text-green-400"/>Stamina</span>
          <div className="relative w-28 h-3 bg-slate-700 rounded overflow-hidden mt-1">
            <motion.div animate={{width:`${stamPct*100}%`}} transition={{duration:0.5}} className="absolute top-0 left-0 h-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.7)]"/>
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white drop-shadow-md">{player.stamina.current}/{player.stamina.max}</span>
          </div>
        </div>
      </div>

      {/* Moedas */}
      <div className="flex gap-3 items-center text-xs text-white drop-shadow-md">
        {player.coins.gold? <span className="flex items-center gap-1"><img src="/images/items/gold.png" className="h-4 w-4"/>{player.coins.gold}</span>:null}
        {player.coins.silver? <span className="flex items-center gap-1"><img src="/images/items/silver.png" className="h-4 w-4"/>{player.coins.silver}</span>:null}
        {player.coins.bronze? <span className="flex items-center gap-1"><img src="/images/items/bronze.png" className="h-4 w-4"/>{player.coins.bronze}</span>:null}
        {player.coins.copper? <span className="flex items-center gap-1"><img src="/images/items/copper.png" className="h-4 w-4"/>{player.coins.copper}</span>:null}
      </div>
    </header>
  );
}
