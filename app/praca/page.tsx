'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { getPracaMissions } from '@/data/missoes';
import { copperToCoins } from '@/utils/money_aldor_client';

/** Fallback leve para exibir moedas sem depender de '@/components/common/Coin' */
function CoinInline({ type, amount }: { type: 'gold'|'silver'|'bronze'|'copper'; amount: number }){
  const src = `/images/items/${type}.png`;
  return (
    <span className="inline-flex items-center gap-1" title={type} aria-label={type}>
      <img src={src} alt={type} className="w-4 h-4 object-contain" />
      <span>{amount ?? 0}</span>
    </span>
  );
}

type Mission = ReturnType<typeof getPracaMissions>[number];

function coinsView(copper: number){
  const c = copperToCoins(copper);
  return (
    <span className="inline-flex items-center gap-2">
      <CoinInline type="gold" amount={c.gold} />
      <CoinInline type="silver" amount={c.silver} />
      <CoinInline type="bronze" amount={c.bronze} />
      <CoinInline type="copper" amount={c.copper} />
    </span>
  );
}

export default function PracaPage(){
  const { state, addXP, giveCoins, addWorldTime, ADD_WORLD_TIME, advanceTime } = useGame() as any;
  const missions = useMemo(()=> getPracaMissions(), []);

  // Apenas 1 missão ativa por vez (trava local + pode coexistir com trava global)
  const [activeId, setActiveId] = useState<string | null>(null);
  const [remainingMs, setRemainingMs] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // cleanup
  useEffect(()=>()=> { if (timerRef.current) clearInterval(timerRef.current as any); }, []);

  function startMission(m: Mission){
    if (activeId) return;
    setActiveId(m.id);
    setRemainingMs(m.durationMs);
    if (timerRef.current) clearInterval(timerRef.current as any);
    timerRef.current = setInterval(()=>{
      setRemainingMs(prev=>{
        const next = prev - 1000;
        if (next <= 0) {
          clearInterval(timerRef.current as any);
          finishMission(m);
          return 0;
        }
        return next;
      });
    }, 1000);
  }

  function finishMission(m: Mission){
    // Recompensas
    if (m.rewards?.xp) addXP(m.rewards.xp);
    const copper = (m.rewards?.copper ?? 0) + (m.rewards?.coins?.copper ?? 0);
    if (copper > 0) giveCoins({ copper });

    // Avançar relógio do mundo se a ação existir (mantém compat com versões antigas)
    const maybeAddWorldTime = (typeof addWorldTime==="function"?addWorldTime:(typeof (ADD_WORLD_TIME as any)==="function"?(ADD_WORLD_TIME as any):(typeof advanceTime==="function"?advanceTime:undefined))) as any;
    if (typeof maybeAddWorldTime === 'function') {
      try { maybeAddWorldTime(m.durationMs); } catch {}
    }

    setActiveId(null);
    setRemainingMs(0);
  }

  function formatCountdown(ms: number){
    const s = Math.max(0, Math.ceil(ms/1000));
    return `${s}s`;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Praça</h1>
      <p className="text-white/80 text-sm">Tarefas simples que qualquer um pode fazer.</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {missions.map(m=>{
          const disabled = !!activeId;
          const isActive = activeId === m.id;
          const rewardCopper = (m.rewards?.copper ?? 0) + (m.rewards?.coins?.copper ?? 0);
          return (
            <div key={m.id} className="rounded-xl overflow-hidden bg-slate-900/50 border border-slate-800 hover:border-slate-600 transition">
              <div className="aspect-[16/9] bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
                <img src="/images/ui/praca_quest.png" alt="" className="h-24 object-contain opacity-90" />
              </div>
              <div className="p-3 space-y-2">
                <div className="font-semibold">{m.title}</div>
                <p className="text-sm text-white/80 line-clamp-2">{m.desc}</p>
                <div className="text-xs text-white/70">Duração: {Math.round(m.durationMs/1000)}s</div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm flex items-center gap-2">
                    <span>{m.rewards.xp} XP</span>
                    <span className="opacity-70">·</span>
                    {coinsView(rewardCopper)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className={`px-3 py-1 rounded-md text-sm ${disabled && !isActive ? 'bg-slate-700 text-white/40 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500'}`}
                      disabled={disabled && !isActive}
                      onClick={()=> startMission(m)}
                      title={disabled && !isActive ? 'Já há uma missão ativa' : 'Aceitar'}
                    >
                      {isActive ? `Em andamento (${formatCountdown(remainingMs)})` : 'Aceitar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
