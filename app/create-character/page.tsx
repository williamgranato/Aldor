'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Shield, User } from 'lucide-react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { MT_REGIONS } from '@/data/mushoku_expanded';

type Grupo = { reino:string; cidades:string[] };
type Region = { continente:string; grupos: Grupo[] };

export default function CreateCharacterPage(){
  const { setState, touch } = useGame();
  const router = useRouter();
  const [name,setName] = useState('');
  const [role,setRole] = useState('guerreiro');
  const [origin,setOrigin] = useState('');

  function create(){
    if(!name.trim()||!origin){alert('Defina um nome e uma cidade.');return;}
    setState((prev:any)=>({...prev,player:{...prev.player,name,character:{...prev.player.character,name,origin,role}}}));
    try{touch?.();}catch{}
    router.replace('/');
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white">
      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="max-w-2xl mx-auto rounded-2xl p-6 bg-white/5 border border-white/10 shadow-lg space-y-4">
        <div className="flex items-center gap-2 mb-2"><User className="w-5 h-5 text-emerald-300"/> Criar Personagem</div>
        <div className="space-y-3">
          <label className="flex items-center gap-2"><User className="w-4 h-4 text-emerald-300"/> Nome</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full px-3 py-2 rounded bg-black/40 border border-white/10"/>
          <label className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-300"/> Classe</label>
          <select value={role} onChange={e=>setRole(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2">
            <option value="guerreiro">Guerreiro</option><option value="mago">Mago</option><option value="ladino">Ladino</option>
          </select>
          <label className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-300"/> Cidade</label>
          <select value={origin} onChange={e=>setOrigin(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2">
            <option value="">Selecione...</option>
            {MT_REGIONS.map((region:Region,idx:number)=>(
              <optgroup key={idx} label={region.continente}>
                {region.grupos.map((g:Grupo,i:number)=>(
                  g.cidades.map((c,j)=>(<option key={g.reino+'-'+j} value={c}>{g.reino} — {c}</option>))
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="flex justify-end"><button onClick={create} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded">Confirmar</button></div>
      </motion.div>
    </div>
  );
}
