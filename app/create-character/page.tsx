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

  const ATTR_LABEL: Record<string,string> = {
    strength: 'Força',
    agility: 'Destreza',
    vitality: 'Vigor',
    intelligence: 'Arcano',
    luck: 'Sagacidade'
  };

  const ATTR_DESCR: Record<string,string> = {
    strength: 'Aumenta ataque físico e capacidade de carga.',
    agility: 'Aumenta esquiva e chance crítica.',
    vitality: 'Aumenta HP máximo e defesa geral.',
    intelligence: 'Aumenta a Stamina máxima (+3 por ponto) e poder mágico.',
    luck: 'Afeta recompensas, drops e eventos aleatórios.'
  };

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
    alert('Bem-vindo a Aldor — ano 1420. Forje sua lenda!');
    router.replace('/');
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="rounded-2xl p-6 bg-slate-900/60 border border-amber-700/40 shadow-lg space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-amber-300"/><div className="font-semibold">Criar Personagem</div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 font-medium"><User className="w-4 h-4 text-amber-300"/> Nome</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full px-2 py-1 rounded bg-neutral-900/90 border border-neutral-700"/>

          <label className="flex items-center gap-2 font-medium"><Shield className="w-4 h-4 text-amber-300"/> Classe</label>
          <select value={role} onChange={e=>setRole(e.target.value)} className="w-full bg-neutral-900/90 text-neutral-100 border border-neutral-700 rounded px-2 py-1">
            <option value="guerreiro">Guerreiro</option>
            <option value="mago">Mago</option>
            <option value="ladino">Ladino</option>
          </select>

          <label className="flex items-center gap-2 font-medium"><Sparkles className="w-4 h-4 text-amber-300"/> Cidade</label>
          <select value={origin} onChange={e=>setOrigin(e.target.value)} className="w-full bg-neutral-900/90 text-neutral-100 border border-neutral-700 rounded px-2 py-1">
            <option value="">Selecione...</option>
            {MT_REGIONS.map((reg:Region)=>(
              <optgroup key={reg.continente} label={reg.continente}>
                {reg.grupos.map((g:Grupo)=>(
                  <React.Fragment key={g.reino}>
                    <option disabled className="font-semibold">{g.reino}</option>
                    {g.cidades.map(c=>(<option key={c} value={c}>{c}</option>))}
                  </React.Fragment>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <div className="font-semibold mb-2">Distribua seus pontos ({points} restantes)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.keys(attrs).map((key)=>(
              <div key={key} className="p-2 rounded bg-neutral-800/60 border border-neutral-700">
                <div className="flex justify-between items-center">
                  <div className="font-semibold">{ATTR_LABEL[key]}</div>
                  <div>{(attrs as any)[key]}</div>
                </div>
                <div className="text-xs text-neutral-400">{ATTR_DESCR[key]}</div>
                <div className="flex gap-1 mt-1">
                  <button onClick={()=>inc(key as any)} disabled={points<=0} className="px-2 bg-emerald-700 rounded">+</button>
                  <button onClick={()=>dec(key as any)} disabled={(attrs as any)[key]<=0} className="px-2 bg-rose-700 rounded">-</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={create} className="px-4 py-2 rounded bg-amber-700 hover:bg-amber-600">Confirmar</button>
        </div>
      </motion.div>
    </div>
  );
}
