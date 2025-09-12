'use client';
import React from 'react';
import MissionCard from './MissionCard';

export default function MissionList({ missions, onMissionComplete, canStart, successChance }: { missions:any[], onMissionComplete:(m:any)=>void, canStart:()=>boolean, successChance:(m:any)=>number }){
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {missions.map((m,i)=>(
        <MissionCard 
          key={i} 
          mission={m} 
          onComplete={()=>onMissionComplete(m)} 
          canStart={canStart} 
          successChance={successChance}
        />
      ))}
    </div>
  );
}
