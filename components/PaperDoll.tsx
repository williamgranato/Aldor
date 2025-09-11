'use client';
import React from 'react';

export default function PaperDoll({ equipment, size=128 }:{ equipment:any, size?:number }){
  const slots = equipment || {};
  const Slot = ({id,label}:{id:string,label:string})=>{
    const src = id ? `/images/items/${id}.png` : '/images/items/placeholder.png';
    return (
      <div className="w-16 h-16 border border-slate-700 rounded bg-slate-900/50 flex items-center justify-center">
        <img src={src} alt={label} className="max-w-[80%] max-h-[80%] object-contain" />
      </div>
    );
  };
  return (
    <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800" style={{width:size*2}}>
      <Slot id={slots?.head} label="Cabeça" />
      <Slot id={slots?.chest} label="Peito" />
      <Slot id={slots?.legs} label="Pernas" />
      <Slot id={slots?.weapon} label="Arma" />
      <Slot id={slots?.shield} label="Escudo" />
      <Slot id={slots?.ring} label="Anel" />
    </div>
  );
}
