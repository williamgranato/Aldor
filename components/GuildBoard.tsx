// components/GuildBoard.tsx
'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { MISSIONS, type Mission } from '@/data/missions_catalog';
import { canPromote, countCompletedAtOrAbove } from '@/utils/rankProgress';

type VMission = Mission & { successChance?: number; npc?: {name:string, cls:string, bonus:number} };

function riskColor(p:number){
  if(p>=80) return 'text-emerald-400';
  if(p>=55) return 'text-yellow-300';
  if(p>=30) return 'text-orange-400';
  return 'text-red-400';
}

function ProgressBar({ value }:{value:number}){
  return (
    <div className="w-full h-2 bg-black/40 rounded overflow-hidden ring-1 ring-amber-900/40">
      <div className="h-full bg-amber-400 transition-all duration-200" style={{ width: `${value}%` }} />
    </div>
  );
}

function rollNPC(seed:number){
  const names = ['Ragna', 'Thorin', 'Elira', 'Kalev', 'Mora', 'Jax', 'Liora', 'Borin'];
  const classes = ['Ladino','Mago','Guerreiro','Arqueiro','Clérigo'];
  const n = names[seed % names.length];
  const c = classes[(seed*7) % classes.length];
  const bonus = (seed % 5) * 2; // 0..8%
  return { name:n, cls:c, bonus };
}

export default function GuildBoard(){
  const { state, undertakeQuest } = useGame();
  const [acceptingId, setAcceptingId] = useState<string|null>(null);
  const [progress, setProgress] = useState(0);
  const playerRank = state.player.adventurerRank as string;
  const completed = state.guild.completedQuests?.length || 0;

  // Gera uma missão de evento rara (1% chance)
  const eventMission: VMission | null = useMemo(()=>{
    const daySeed = Math.floor((state.world?.dateMs||Date.now())/86400000);
    if ((daySeed % 100) !== 0) return null;
    return {
      id: 'event_raid',
      title: 'Defesa Noturna da Guilda',
      desc: 'Rumores de um ataque coordenado. Reúna forças e defenda a sede da guilda.',
      rank: 'B',
      difficulty: 1.4,
      rewards: { coinsCopper: 120, xp: 65 },
      drops: [],
      successChance: 0, npc: undefined
    } as any;
  }, [state.world?.dateMs]);

  // Calcula chance de sucesso aproximada (mock leve baseado em rank e dificuldade)
  const withCalc = useMemo(()=>{
    const order = ['F','E','D','C','B','A','S','SS','SSS'];
    const pr = Math.max(0, order.indexOf(playerRank));
    const map = [...MISSIONS];
    if(eventMission) map.unshift(eventMission);
    return map.map((m, idx)=>{
      const base = 60 + (pr*5) - (Math.round((m.difficulty-1)*40));
      const seedBonus = (m.id.charCodeAt(0)+idx) % 7; // 0..6
      const npc = rollNPC(idx + pr*13);
      const chance = Math.max(5, Math.min(95, base + seedBonus + npc.bonus));
      return { ...m, successChance: chance, npc };
    });
  }, [playerRank, eventMission]);

  // Aceitar missão com progresso de 5s
  const onAccept = (m: VMission)=>{
    if(acceptingId) return;
    setAcceptingId(m.id);
    setProgress(0);
    const start = Date.now();
    const int = setInterval(()=>{
      const pct = Math.min(100, ((Date.now()-start)/5000)*100);
      setProgress(pct);
    }, 120);
    setTimeout(()=>{
      clearInterval(int);
      // Aplica bônus do NPC reduzindo dificuldade via sufixo no ID (parseado em undertakeQuest)
      const mul = Math.max(0.8, 1 + ((100 - (m.successChance||50)) / 400) - (m.npc?.bonus||0)/100);
      const qWithMul: any = { ...m, id: `${m.id}:mul:${mul.toFixed(2)}` };
      undertakeQuest(qWithMul as any);
      setAcceptingId(null);
      setProgress(0);
    }, 5000);
  };

  // Próximo rank
  const completedAtOrAbove = countCompletedAtOrAbove(state.guild.completedQuests || [], playerRank as any);
  const promo = canPromote(playerRank as any, completedAtOrAbove);
  const nextRank = promo.ok ? promo.next : null;
  const need = null;

  // Histórico
  const history = useMemo(()=>{
    const h = (state.guild.completedQuests||[]).slice(-10).reverse();
    return h.map((x)=>{
      const mission = withCalc.find(m=>m.id.split(':')[0]===x.id.split(':')[0]);
      return { id:x.id, at:x.at, title: mission?.title || x.id, rank: mission?.rank || '?' };
    });
  }, [state.guild.completedQuests, withCalc]);

  return (
    <div className="rounded-2xl border border-amber-900/40 bg-amber-950/30 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-amber-100 font-semibold">Quadro de Contratos</div>
        <div className="text-xs opacity-80">
          Próximo Rank: <span className="font-semibold">{nextRank || '—'}</span>
          {need !== undefined && <span className="opacity-70"> (precisa de mais contratos)</span>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {withCalc.map(m=>(
          <div key={m.id} className="rounded-xl border border-amber-800/40 bg-black/20 p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold text-amber-200">{m.title} <span className="text-xs opacity-60">[{m.rank}]</span></div>
                <div className="text-xs opacity-80">{m.desc}</div>
              </div>
              <div className={`text-right text-sm ${riskColor(m.successChance||50)}`}>
                {Math.round(m.successChance||50)}%<div className="text-xs opacity-60">sucesso</div>
              </div>
            </div>

            <div className="mt-2 text-xs opacity-80 flex items-center gap-3">
              <div>Recompensas: {m.rewards.xp} XP • {m.rewards.coinsCopper}¢</div>
              <div className="ml-auto opacity-80">Companheiro: <span className="font-semibold">{m.npc?.name}</span> ({m.npc?.cls}, +{m.npc?.bonus}%)</div>
            </div>

            {acceptingId === m.id ? (
              <div className="mt-3">
                <ProgressBar value={progress} />
                <div className="text-xs mt-1 opacity-75">{Math.round(progress)}% — Executando contrato...</div>
              </div>
            ) : (
              <div className="mt-3">
                <button onClick={()=>onAccept(m)} className="px-3 py-1.5 rounded bg-amber-500 text-black font-bold hover:bg-amber-400 shadow">
                  Aceitar (5s)
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="text-amber-100 font-semibold mb-2">Histórico recente</div>
        {history.length === 0 ? (
          <div className="text-xs opacity-70">Nenhuma missão concluída ainda.</div>
        ) : (
          <ul className="text-xs opacity-80 space-y-1">
            {history.map(h=> (
              <li key={h.at} className="flex items-center justify-between">
                <span>{new Date(h.at).toLocaleString()} — {h.title}</span>
                <span className="opacity-60">[{h.rank}]</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
