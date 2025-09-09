'use client';
import Image from 'next/image';
import React from 'react';

function useTick(ms:number){
  const [,setT] = React.useState(0);
  React.useEffect(()=>{ const id = setInterval(()=>setT(t=>t+1), ms); return ()=>clearInterval(id); },[ms]);
}

export default function StatusIcons({ list }:{ list: Array<{type:'bleed'|'poison', addedAt:number, durationMs?:number}> }){
  useTick(1000);
  if(!list || !list.length) return null;

  const now = Date.now();
  return (
    <div className="flex items-center gap-2">
      {list.map((s,i)=>{
        const left = Math.max(0, Math.round(((s.addedAt + (s.durationMs||60000)) - now)/1000));
        const label = s.type==='bleed'?'Sangramento':'Veneno';
        return (
          <div key={i} className="flex items-center gap-2 text-xs px-2 py-1 rounded-md border border-zinc-800 bg-zinc-900/60">
            <Image src={s.type==='bleed'?'/images/ui/status/bleed.png':'/images/ui/status/poison.png'} alt={s.type} width={14} height={14} />
            <span className={s.type==='bleed'?'text-rose-400':'text-emerald-400'}>{label}</span>
            <span className="opacity-70">({left}s)</span>
          </div>
        );
      })}
    </div>
  );
}
