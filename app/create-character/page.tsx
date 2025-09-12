'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Shield, User } from 'lucide-react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { MT_REGIONS } from '@/data/mushoku_expanded';

type Grupo = { reino:string; cidades:string[] };
type Region = { continente:string; grupos: Grupo[] };

const TOTAL_POINTS = 10 as const;

export default function CreateCharacterPage(){
  const { setState } = useGame();
  const router = useRouter();
  const [name,setName] = useState('');
  const [role,setRole] = useState('guerreiro');
  const [origin,setOrigin] = useState('');
  const [points,setPoints] = useState<number>(TOTAL_POINTS);
  const [attrs,setAttrs] = useState({ strength:0, agility:0, intelligence:0, vitality:0, luck:0 });

  function inc(k:keyof typeof attrs){ if(points<=0) return; setAttrs(a=>({ ...a, [k]: a[k]+1 })); setPoints(p=>p-1); }
  function dec(k:keyof typeof attrs){ if(attrs[k]<=0) return; setAttrs(a=>({ ...a, [k]: a[k]-1 })); setPoints(p=>p+1); }

  function create(){
    if(!name.trim() || !origin){ alert('Defina um nome e uma cidade de nascimento.'); return; }
    setState((prev:any)=>{
      const baseInt = (prev.player.attributes?.intelligence||0) + attrs.intelligence;
      const maxStamina = 100 + baseInt*3;
      const player = {
        ...prev.player,
        character: { ...prev.player.character, name, origin, role },
        attributes: {
          strength: (prev.player.attributes?.strength||0) + attrs.strength,
          agility: (prev.player.attributes?.agility||0) + attrs.agility,
          intelligence: baseInt,
          vitality: (prev.player.attributes?.vitality||0) + attrs.vitality,
          luck: (prev.player.attributes?.luck||0) + attrs.luck,
        },
        stamina: { ...prev.player.stamina, max: maxStamina, current: Math.min(maxStamina, prev.player.stamina.current) },
        coins: { gold:0, silver:1, bronze:0, copper:0 },
      };
      return { ...prev, player };
    });
    alert('Bem-vindo a Aldor — ano 1420. Reinos armados, tavernas barulhentas e uma guilda à sua espera. Forje sua lenda!');
    router.replace('/');
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="rounded-2xl p-6 bg-slate-900/60 border border-amber-900/40 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-300"/><div className="text-lg font-semibold">Crie seu Personagem</div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-sm opacity-80">Nome</label>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 opacity-80"/>
              <input className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700" value={name} onChange={e=>setName(e.target.value)} placeholder="Escolha um nome"/>
            </div>

            <label className="text-sm opacity-80">Classe</label>
            <select className="bg-neutral-900/90 text-neutral-100 border border-neutral-700 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700" value={role} onChange={e=>setRole(e.target.value)}>
              <option value="guerreiro">Guerreiro</option>
              <option value="arqueiro">Arqueiro</option>
              <option value="mago">Mago</option>
              <option value="ladino">Ladino</option>
            </select>

            <label className="text-sm opacity-80">Cidade de Nascimento</label>
            <div className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700">
              <select className="bg-neutral-900/90 text-neutral-100 border border-neutral-700 w-full bg-transparent outline-none" value={origin} onChange={e=>setOrigin(e.target.value)}>
                <option value="">Selecione…</option>
                {(MT_REGIONS as Region[]).map((reg)=> (
                  <optgroup key={reg.continente} label={reg.continente}>
                    {reg.grupos.map(g=>(
                      g.cidades.map(c=>(<option key={reg.continente+'_'+g.reino+'_'+c} value={c}>{g.reino} — {c}</option>))
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm opacity-80 mb-1">Atributos (pontos restantes: <b>{points}</b>)</div>
            {(['strength','agility','intelligence','vitality','luck'] as const).map(k=>(
              <div key={k} className="flex items-center justify-between bg-slate-900/50 rounded-lg border border-slate-800 px-3 py-2">
                <div className="capitalize">{k}</div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>dec(k)} className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700">-</button>
                  <div className="w-6 text-center">{attrs[k]}</div>
                  <button onClick={()=>inc(k)} disabled={points<=0} className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 disabled:opacity-60">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button onClick={create} className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 flex items-center gap-2">
            <Shield className="w-4 h-4"/> Criar Personagem
          </button>
        </div>
      </motion.div>
    </div>
  );
}
