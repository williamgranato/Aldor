'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import missionsMod from '@/data/missions';
import { copperToCoins } from '@/utils/money_aldor_client';

// Fallback leve de moedas
function CoinInline({ type, amount }: { type: 'gold'|'silver'|'bronze'|'copper'; amount: number }){
  const src = `/images/items/${type}.png`;
  return (
    <span className="inline-flex items-center gap-1" title={type} aria-label={type}>
      <img src={src} alt={type} className="w-4 h-4 object-contain" />
      <span>{amount ?? 0}</span>
    </span>
  );
}

export default function GuildMissions(){
  const { state, giveXP, giveCoins, ensureMemberCard, setState } = useGame() as any;

  // Garantir cartão do membro por player-id (persistente)
  useEffect(()=>{
    try {
      if (!state?.player?.guild?.isMember || !state?.player?.guild?.memberCardId) {
        if (typeof ensureMemberCard === 'function') ensureMemberCard();
        else {
          // fallback: cria direto
          setState((s:any)=>{
            const pid = s?.player?.id || s?.player?.playerId || s?.playerId || 'player';
            const guild = { ...(s?.player?.guild ?? {}), isMember: true, memberCardId: `guildcard:${pid}`, memberSince: Date.now() };
            return { ...s, player: { ...s.player, guild } };
          });
        }
      }
    } catch {}
  }, [state?.player?.id]);

  // Corrigir import de missões: pode ser default array, ou objeto com .guild
  const missionsCat: any = (missionsMod as any)?.default ?? missionsMod;
  const baseList: any[] = (missionsCat?.guild ?? missionsCat) as any[];
  const missions = useMemo(()=> Array.isArray(baseList) ? baseList : [], []);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [remainingMs, setRemainingMs] = useState<number>(0);
  const [activeMission, setActiveMission] = useState<any>(null);

  useEffect(()=>{
    let timer: any;
    if (activeId && activeMission) {
      timer = setInterval(()=>{
        setRemainingMs(prev=>{
          const next = prev - 1000;
          if (next <= 0) {
            clearInterval(timer);
            finishMission(activeMission);
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return ()=> { if (timer) clearInterval(timer); };
  }, [activeId, activeMission]);

  function startMission(m: any){
    if (activeId) return;
    setActiveId(m.id);
    setRemainingMs(m.durationMs);
    setActiveMission(m);
  }

  function finishMission(m: any){
    try {
      const xp = m?.rewards?.xp ?? 0;
      const copper = (m?.rewards?.copper ?? 0) + (m?.rewards?.coins?.copper ?? 0);
      if (xp && typeof giveXP === 'function') giveXP(xp);
      if (copper && typeof giveCoins === 'function') giveCoins({ copper });
    } finally {
      setActiveId(null);
      setRemainingMs(0);
      setActiveMission(null);
    }
  }

  function coinsView(copper:number){
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

  function formatCountdown(ms: number){
    const s = Math.max(0, Math.ceil(ms/1000));
    return `${s}s`;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Missões da Guilda</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {missions.map((m: any)=>(
          <div key={m.id ?? m.title} className="rounded-xl overflow-hidden bg-slate-900/50 border border-slate-800 hover:border-slate-600 transition">
            <div className="p-3 space-y-2">
              <div className="font-semibold">{m.title}</div>
              <p className="text-sm text-white/80 line-clamp-2">{m.desc}</p>
              <div className="text-xs text-white/70">Duração: {Math.round((m.durationMs ?? 3000)/1000)}s</div>
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm flex items-center gap-2">
                  <span>{m.rewards?.xp ?? 0} XP</span>
                  <span className="opacity-70">·</span>
                  {coinsView((m.rewards?.copper ?? 0) + (m.rewards?.coins?.copper ?? 0))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className={`px-3 py-1 rounded-md text-sm ${activeId && activeId!== (m.id ?? m.title) ? 'bg-slate-700 text-white/40 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                    disabled={!!activeId && activeId!==(m.id ?? m.title)}
                    onClick={()=> startMission(m)}
                  >
                    {activeId===(m.id ?? m.title) ? `Em andamento (${formatCountdown(remainingMs)})` : 'Aceitar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
