'use client';
import React from 'react';

export default function StatBar({icon,label,value,max}:{icon:React.ReactNode;label:string;value:number;max:number}){
  const pct = Math.max(0, Math.min(100, Math.round((value/(max||1))*100)));
  return (
    <div className="text-xs">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-neutral-300">{icon}<span>{label}</span></div>
        <div className="text-neutral-400">{value}/{max}</div>
      </div>
      <div className="h-3 bg-neutral-800 rounded-md overflow-hidden relative">
        <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all" style={{width:`${pct}%`}}/>
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-black/80 mix-blend-screen">{value}/{max}</div>
      </div>
    </div>
  );
}
