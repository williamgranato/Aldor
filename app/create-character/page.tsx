'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/context/GameProvider_aldor_client';
import { MT_REGIONS, CLASS_ICONS, RACE_ICONS, type MTClassKey, type MTRaceKey } from '@/data/mushoku_expanded';
import { User, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const TOTAL_POINTS = 10;

export default function CreateCharacterPage(){
  const g:any = useGame();
  const router = useRouter();
  const [name, setName] = useState('Aventureiro');
  const [role, setRole] = useState<MTClassKey>('guerreiro');
  const [race, setRace] = useState<MTRaceKey>('humano');
  const [origin, setOrigin] = useState<string>('');
  const [attrs, setAttrs] = useState({ strength:1, agility:1, intelligence:1, vitality:1, luck:0 });

  const spent = Object.values(attrs).reduce((a,b)=>a+b,0);
  const remaining = TOTAL_POINTS - spent;

  function changeAttr(key:string, value:number){
    const newAttrs = { ...attrs, [key]: value };
    const newSpent = Object.values(newAttrs).reduce((a,b)=>a+b,0);
    if(newSpent <= TOTAL_POINTS) setAttrs(newAttrs);
  }

  function submit(){
    if(!origin){ alert('Selecione a cidade de nascimento'); return; }
    if(remaining<0){ alert('Distribua corretamente os pontos'); return; }
    g.createCharacter?.({ name, role, race, origin, attributes: attrs });
  }

  return (
    <div className="min-h-[calc(100dvh)] bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-amber-50 flex items-center justify-center p-4">
      <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className="w-[min(980px,96vw)] rounded-3xl border border-amber-900/40 bg-black/30 backdrop-blur-md shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          <motion.h1 initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:0.5,delay:0.2}} className="text-2xl font-bold tracking-wide bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
            Criar Personagem
          </motion.h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm opacity-80">Nome</span>
              <div className="mt-1 flex items-center gap-2 rounded-xl bg-slate-900/60 ring-1 ring-white/10 p-2">
                <User className="w-5 h-5 opacity-80" />
                <input value={name} onChange={e=>setName(e.target.value)} className="bg-transparent outline-none w-full" placeholder="Aventureiro" />
              </div>
            </label>

            <label className="block">
              <span className="text-sm opacity-80">Classe</span>
              <div className="mt-1 grid grid-cols-2 gap-2">
                {(Object.keys(CLASS_ICONS) as MTClassKey[]).map(k=>(
                  <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.97}} key={k} onClick={()=>setRole(k)} className={"flex items-center gap-2 rounded-xl bg-slate-900/60 ring-1 ring-white/10 p-2 transition " + (role===k?'ring-amber-500/80 shadow-lg shadow-amber-900/40':'hover:ring-amber-500/40')}>
                    <img src={CLASS_ICONS[k]} alt={k} className="w-6 h-6" />
                    <span className="capitalize">{k.replaceAll('_',' ')}</span>
                  </motion.button>
                ))}
              </div>
            </label>

            <label className="block">
              <span className="text-sm opacity-80">Raça</span>
              <div className="mt-1 grid grid-cols-3 gap-2">
                {(Object.keys(RACE_ICONS) as MTRaceKey[]).map(k=>(
                  <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.97}} key={k} onClick={()=>setRace(k)} className={"flex items-center gap-2 rounded-xl bg-slate-900/60 ring-1 ring-white/10 p-2 transition " + (race===k?'ring-amber-500/80 shadow-lg shadow-amber-900/40':'hover:ring-amber-500/40')}>
                    <img src={RACE_ICONS[k]} alt={k} className="w-6 h-6" />
                    <span className="capitalize">{k.replaceAll('_',' ')}</span>
                  </motion.button>
                ))}
              </div>
            </label>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm opacity-80">Cidade de Nascimento</span>
              <div className="mt-1 flex items-center gap-2 rounded-xl bg-slate-900/60 ring-1 ring-white/10 p-2">
                <MapPin className="w-5 h-5 opacity-80" />
                <select value={origin} onChange={e=>setOrigin(e.target.value)} className="bg-transparent outline-none w-full">
                  <option value="">Selecione…</option>
                  {Array.isArray(MT_REGIONS) && MT_REGIONS.map((cont:any)=>(
                    <optgroup key={cont.continente} label={cont.continente}>
                      {cont.grupos.map((g:any)=>(
                        g.cidades.map((c:string)=>(
                          <option key={c} value={c}>{g.reino} — {c}</option>
                        ))
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </label>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(attrs).map(([k,v])=>(
                <label key={k} className="block">
                  <span className="text-sm opacity-80 capitalize">{k}</span>
                  <motion.input whileFocus={{scale:1.02}} type="range" min={0} max={10} value={v as number} onChange={e=>changeAttr(k,Number(e.target.value))} className="w-full accent-amber-500" />
                  <div className="text-xs opacity-70">{v}</div>
                </label>
              ))}
            </div>
            <div className="text-sm text-amber-300">Pontos restantes: {remaining}</div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={()=>router.push('/')} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 ring-1 ring-white/10">Cancelar</button>
          <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.97}} onClick={submit} className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-900/30">Criar Personagem</motion.button>
        </div>
      </motion.div>
    </div>
  );
}
