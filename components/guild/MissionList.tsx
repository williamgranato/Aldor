'use client';
import React from 'react';
import MissionCard, { Mission } from './MissionCard';

export default function MissionList({
  missions, activeId, remainingMs, onAccept
}:{
  missions: Mission[];
  activeId: string|null;
  remainingMs: number;
  onAccept: (m:Mission)=>void;
}){
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {missions.map(m=>{
        const active = activeId === m.id;
        const progressPct = active ? (100 - Math.max(0, (remainingMs/m.durationMs)*100)) : 0;
        return (
          <MissionCard
            key={m.id}
            mission={m}
            disabled={!!activeId && !active}
            active={active}
            progressPct={progressPct}
            onAccept={()=> onAccept(m)}
          />
        );
      })}
    </div>
  );
}
