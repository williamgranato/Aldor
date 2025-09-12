'use client';
import React from 'react';
import { rarityRingClass } from '@/utils/loot';

export default function RarityBadge({icon, name, rarity}:{icon?:string; name:string; rarity?:string}){
  const ring = rarityRingClass(rarity as any);
  const src = icon ? (icon.startsWith('/')? icon : '/'+icon) : '/images/items/unknown.png';
  return (
    <div className="flex items-center gap-2" title={`${name}${rarity? ' — '+rarity : ''}`}>
      <div className={`w-8 h-8 rounded-md ring-2 ${ring} bg-black/40 p-0.5 flex items-center justify-center`}>
        <img src={src} alt={name} className="w-full h-full object-contain" />
      </div>
      <div className="max-w-[12rem] truncate text-sm">{name}</div>
    </div>
  );
}
