'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { getGuildMissions } from '@/data/missions';
import MissionList from '@/components/guild/MissionList';
import type { Mission } from '@/components/guild/MissionCard';
import { useToasts } from '@/components/ToastProvider';
import { copperToCoins } from '@/utils/money_aldor_client';
import * as itemsCatalog from '@/data/items_catalog';
import { enemyForRank, simulateCombat } from '@/utils/combat_aldor_client';

type Tier = 'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'|'SSS';
const ORDER: Tier[] = ['F','E','D','C','B','A','S','SS','SSS'];
const idx = (t:Tier)=> ORDER.indexOf(t);
const allowTier = (pt:Tier, mt:Tier)=> Math.abs(idx(pt)-idx(mt))<=1;
const levelToTier = (level:number): Tier => {
  if(level>=55) return 'SSS'; if(level>=45) return 'SS'; if(level>=35) return 'S';
  if(level>=28) return 'A'; if(level>=22) return 'B'; if(level>=16) return 'C';
  if(level>=10) return 'D'; if(level>=5) return 'E'; return 'F';
};

export default function GuildaPage(){
  const g:any = useGame();
  const { state, giveXP, giveCoins, logGuildEvent, registerInGuild, setState } = g;
  const { add: pushToast } = useToasts();

  const isMember = state?.player?.guild?.isMember ?? false;
  const level = state?.player?.level ?? 1;
  const playerTier = state?.player?.adventurerRank ?? levelToTier(level);

  // MISSÕES (client-only para evitar hydration mismatch)
  const [missions, setMissions] = useState<Mission[]>([] as any);
  useEffect(()=>{ setMissions(getGuildMissions() as any); }, []);

  const [tierFilter, setTierFilter] = useState<Tier|'ALL'>('ALL');
  const visible = useMemo(()=> missions.filter(m=>{
    const tierOK = tierFilter==='ALL' ? true : m.tier===tierFilter;
    const gateOK = allowTier(playerTier, m.tier);
    return tierOK && gateOK;
  }), [missions, tierFilter, playerTier]);

  // 1 missão ativa por vez
  const [activeId, setActiveId] = useState<string|null>(null);
  const [remainingMs, setRemainingMs] = useState<number>(0);
  const activeRef = useRef<{ id:string, endsAt:number, duration:number }|null>(null);
  const timerRef = useRef<any>(null);

  useEffect(()=>()=>{ if(timerRef.current) clearInterval(timerRef.current); },[]);

  function startMission(m:Mission){
    if(!isMember){
      const ok = registerInGuild?.();
      if(!ok){ pushToast({title:'Cadastro necessário', message:'Você precisa pagar 1 prata para se registrar na Guilda.'}); return; }
      pushToast({title:'Bem-vindo à Guilda!', message:'Cartão criado. Rank inicial: F.'});
    }
    if(activeId) return;
    setActiveId(m.id);
    const duration = m.durationMs;
    const endsAt = Date.now() + duration;
    activeRef.current = { id:m.id, endsAt, duration };
    setRemainingMs(duration);
    if(timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(()=>{
      setRemainingMs(prev=>{
        const next = Math.max(0, (activeRef.current?.endsAt||0) - Date.now());
        if(next<=0){
          clearInterval(timerRef.current);
          completeMission(m);
        }
        return next;
      });
    }, 250);
  }

  function completeMission(m:Mission){
    // Idempotência simples no lado do cliente: zera o run ao concluir
    if(!activeRef.current || activeRef.current.id!==m.id) return;
    activeRef.current = null;
    setActiveId(null);
    setRemainingMs(0);

    // v2: simulate combat & apply HP loss
    try{
      const enemy = enemyForRank(m.tier as any);
      const difficulty = Math.max(0.75, 1 + (ORDER.indexOf(m.tier as any)/10));
      const sim = simulateCombat(state?.player, enemy, { difficultyMultiplier: difficulty });
      const hpNow = (state?.player?.stats?.hp ?? 30);
      const hpLoss = Math.max(0, hpNow - (sim.php ?? hpNow));
      if(hpLoss>0){ g.changeHP?.(-hpLoss); }
      // TODO: optionally gate rewards by sim.win
    }catch{}
    // Aplicar recompensas 1x (XP, moedas, drops)
    if(m.reward?.xp) giveXP?.(m.reward.xp);
    if(m.reward?.coinsCopper) giveCoins?.({ copper: m.reward.coinsCopper });

    // Drops com nome correto do catálogo
    const anyCat:any = itemsCatalog;
    const gained:any[] = [];
    (m.reward?.drops||[]).forEach(d=>{
      const it = anyCat[d.id];
      const name = it?.name || 'Item desconhecido';
      // inventário mínimo (compat)
      setState((s:any)=>{
        const inv = s?.player?.inventory ?? { items: [] };
        const items = Array.isArray(inv.items) ? [...inv.items] : [];
        const idx = items.findIndex((i:any)=> i?.id === d.id);
        if(idx>=0){ items[idx] = { ...items[idx], qty:(items[idx].qty||0)+d.qty }; }
        else { items.push({ id:d.id, name, icon:`/images/items/${d.id}.png`, qty:d.qty }); }
        return { ...s, player:{ ...s.player, inventory:{ items } } };
      });
      gained.push(`${name} x${d.qty}`);
    });

    // Avançar o relógio do mundo
    setState((s:any)=>{
      const w = s.world || {};
      const dateMs = (w.dateMs || Date.now()) + (m.durationMs||0);
      return { ...s, world:{ ...w, dateMs } };
    });

    // Log
    logGuildEvent?.({ at: Date.now(), missionId: m.id, tier: m.tier, gained: { xp:m.reward?.xp, copper:m.reward?.coinsCopper, drops:gained } });

    // Toast com conversão
    const c = copperToCoins(m.reward?.coinsCopper||0);
    const dropsText = gained.length? gained.join(', ') : 'Nenhum';
    pushToast?.({ title:'🏆 Missão concluída!', message:`+${m.reward?.xp||0} XP · ${c.gold}g ${c.silver}s ${c.bronze}b ${c.copper}c · Drops: ${dropsText}` });

    try{ g.saveCurrentSlot?.(); }catch{}
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={()=>setTierFilter('ALL')} className={`px-3 py-1.5 rounded-lg border ${tierFilter==='ALL'?'border-amber-400 text-amber-300':'border-slate-700 text-white/80'} bg-slate-900/50`}>Todas</button>
        {ORDER.map(t=>(
          <button key={t} onClick={()=>setTierFilter(t)} className={`px-3 py-1.5 rounded-lg border ${tierFilter===t?'border-amber-400 text-amber-300':'border-slate-700 text-white/80'} bg-slate-900/50`}>
            Rank {t}
          </button>
        ))}
      </div>

      {/* lista de missões (só [rank-1, rank, rank+1]) */}
      <MissionList
        missions={visible as any}
        activeId={activeId}
        remainingMs={remainingMs}
        onAccept={startMission}
      />
    </div>
  );
}
