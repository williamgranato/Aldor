'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';

type Badge = { k: 'veneno'|'sangramento'; until: number };

function remaining(ms:number){ const s = Math.max(0, Math.ceil((ms - Date.now())/1000)); return `${s}s`; }

const ICONS: Record<string,string> = {
  veneno: '/images/ui/status/poison.png',
  sangramento: '/images/ui/status/bleed.png',
};

export default function StatusBadges(){
  const { state } = useGame();
  const list = ((state.player as any).status as Badge[]) || [];
  const [_, setTick] = useState(0);
  useEffect(()=>{ const t = setInterval(()=>setTick(x=>x+1), 1000); return ()=>clearInterval(t); },[]);
  const active = list.filter(b=>b.until> Date.now());
  if(active.length===0) return null;
  return (
    <div className="flex items-center gap-2">
      {active.map((b, i)=>(
        <div key={i} className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-black/30 ring-1 ring-zinc-700 shadow">
          <Image src={ICONS[b.k]} alt={b.k} width={14} height={14} />
          <span className="capitalize">{b.k}</span>
          <span className="opacity-80">{remaining(b.until)}</span>
        </div>
      ))}
    </div>
  );
}
