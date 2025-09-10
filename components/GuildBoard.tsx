// components/GuildBoard.tsx (patchado)
'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { MISSIONS } from '@/data/missions';
import { addPouch, copperToCoins } from '@/utils/money_aldor_client';

export default function GuildBoard(){
  const { state, undertakeQuest, addItem, setState } = useGame();
  const [acceptingId, setAcceptingId] = useState<string|null>(null);
  const [progress, setProgress] = useState(0);
  const playerRank = state.player.adventurerRank as string;

  const rankTimes:{[k:string]:number} = {F:3,E:4,D:5,C:6,A:7,S:10,SS:15};
  const staminaCosts:{[k:string]:number} = {F:5,E:10,D:20,C:40,A:80,S:160,SS:320};

  const missions = useMemo(()=>MISSIONS.map(m=>({
    ...m,
    duration: rankTimes[m.rank]||5,
    staminaCost: staminaCosts[m.rank]||5
  })),[playerRank]);

  const onAccept = (m:any, loop:boolean=false)=>{
    if(acceptingId) return;
    if(state.player.stamina.current < m.staminaCost){
      alert("Sem stamina suficiente!");
      return;
    }
    setAcceptingId(m.id);
    setProgress(0);
    const start = Date.now();
    const int = setInterval(()=>{
      const pct = Math.min(100, ((Date.now()-start)/(m.duration*1000))*100);
      setProgress(pct);
    }, 120);
    setTimeout(()=>{
      clearInterval(int);
      // Consome stamina
      setState(s=>({...s, player:{...s.player, stamina:{...s.player.stamina, current: Math.max(0,s.player.stamina.current-m.staminaCost)}}}));
      undertakeQuest(m);
      setAcceptingId(null);
      setProgress(0);
      if(loop && state.player.stamina.current>=m.staminaCost){
        onAccept(m,true);
      }
    }, m.duration*1000);
  };

  return (
    <div className="rounded-2xl border border-amber-900/40 bg-amber-950/30 p-4 space-y-4">
      <div className="text-amber-100 font-semibold">Quadro de Contratos</div>
      <div className="grid md:grid-cols-2 gap-3">
        {missions.map(m=>(
          <div key={m.id} className="rounded-xl border border-amber-800/40 bg-black/20 p-3">
            <div className="font-semibold text-amber-200">{m.title} <span className="opacity-60">[{m.rank}]</span></div>
            <div className="text-xs opacity-80 mb-1">{m.description}</div>
            <div className="text-xs opacity-80">Duração: {m.duration}s • Stamina: {m.staminaCost}</div>
            {acceptingId === m.id ? (
              <div className="mt-2">
                <div className="w-full h-2 bg-black/40 rounded"><div className="h-full bg-amber-400" style={{width:`${progress}%`}}/></div>
                <div className="text-xs mt-1 opacity-75">{Math.round(progress)}%</div>
              </div>
            ): (
              <div className="mt-2 flex gap-2">
                <button onClick={()=>onAccept(m,false)} className="px-3 py-1.5 rounded bg-amber-500 text-black font-bold">Aceitar</button>
                <button onClick={()=>onAccept(m,true)} className="px-3 py-1.5 rounded bg-amber-700 text-black font-bold">Loop</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
