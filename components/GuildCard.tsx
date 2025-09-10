'use client';
import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { seasonGradient } from '@/utils/seasonStyle';
import { MT_REGIONS } from '@/data/mushoku_expanded';

export default function GuildCard(){
  const { state, createGuildCard } = useGame();
  const isMember = state.guild?.isMember;
  const rank = state.player?.adventurerRank || 'Sem Guilda';
  const world = state.world;
  const grad = seasonGradient?.[world?.season || 'Primavera'] || 'bg-zinc-900';

  // gera lista plana de cidades para valor inicial
  const allCities: string[] = MT_REGIONS.flatMap((cont:any) =>
    cont.grupos.flatMap((grupo:any) =>
      grupo.cidades.map((cidade:string) => cidade)
    )
  );

  const [origin,setOrigin] = useState(allCities[0] || '');
  const [role,setRole] = useState('Espadachim');
  const [aptidao, setAptidao] = useState<number|null>(null);

  useEffect(()=>{
    const val = Math.floor(Math.min(500, Math.max(0, Math.round(250 + (Math.random()-0.5)*200))));
    setAptidao(val);
  },[]);

  const handleJoin = ()=>{
    const info = {
      name: state.player?.character?.name || 'Aventureiro',
      origin, role, roleKey: role.toLowerCase()
    };
    const ok = createGuildCard(info);
    if(ok){
      alert(`Bem-vindo à Guilda dos Aventureiros! Rank inicial F. Aptidão mágica: ${aptidao}`);
    }
  };

  return (
    <div className={`rounded-2xl p-4 border border-amber-800/30 ${grad}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-amber-200 font-semibold text-lg">Guilda de Aldor</div>
          <div className="text-sm opacity-80">Status: {isMember ? 'Membro ativo' : 'Não-membro'}</div>
          <div className="text-sm opacity-80">Rank: <span className="font-semibold">{rank}</span></div>
          {isMember && state.guild?.memberCard && (
            <div className="text-xs opacity-70 mt-2">
              Cidade: {state.guild.memberCard.origin} • Vocação: {state.guild.memberCard.role}
            </div>
          )}
        </div>
        {!isMember && (
          <button onClick={handleJoin} className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold shadow">
            Registrar (1 prata)
          </button>
        )}
      </div>
      {!isMember && (
        <div className="mt-3 space-y-2 text-sm">
          <label>Cidade de Nascimento:
            <select value={origin} onChange={e=>setOrigin(e.target.value)} className="ml-2 p-1 bg-amber-950 border border-amber-700 rounded">
              {MT_REGIONS.map((cont:any, idx:number)=>(
                <optgroup key={idx} label={cont.continente}>
                  {cont.grupos.map((grupo:any)=>
                    grupo.cidades.map((cidade:string)=>(
                      <option key={`${grupo.reino}-${cidade}`} value={cidade}>
                        [{grupo.reino}] {cidade}
                      </option>
                    ))
                  )}
                </optgroup>
              ))}
            </select>
          </label><br/>
          <label>Vocação:
            <select value={role} onChange={e=>setRole(e.target.value)} className="ml-2 p-1 bg-amber-950 border border-amber-700 rounded">
              {['Espadachim','Mago','Healer','Tanker','Ladrão','Invocador'].map(c=><option key={c}>{c}</option>)}
            </select>
          </label><br/>
          <div suppressHydrationWarning>Aptidão mágica sorteada: {aptidao ?? '...'}</div>
        </div>
      )}
    </div>
  );
}
