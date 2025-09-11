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
      <div className="h-2 bg-neutral-800 rounded-md overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400" style={{width:`${pct}%`}}/>
      </div>
    </div>
  );
}
