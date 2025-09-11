'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import GuildCard from '@/components/GuildCard';
import GuildBoard from '@/components/GuildBoard';
import { useGame } from '@/context/GameProvider_aldor_client';
import { copperToCoins } from '@/utils/money_aldor_client';
import { useToasts } from '@/components/ToastProvider';

/** Guilda – épica, completa, com HUD/Inventário integrados */
type Tier = 'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'|'SSS';
const TIER_SECONDS: Record<Tier, number> = { F:3,E:4,D:5,C:6,B:7,A:8,S:9,SS:10,SSS:11 };
const TIER_COLORS: Record<Tier, string> = {
  F:'from-zinc-800 to-zinc-700',  E:'from-emerald-800 to-emerald-700',
  D:'from-sky-800 to-sky-700',    C:'from-indigo-800 to-indigo-700',
  B:'from-violet-800 to-violet-700', A:'from-fuchsia-800 to-fuchsia-700',
  S:'from-amber-800 to-amber-700', SS:'from-rose-800 to-rose-700',
  SSS:'from-red-900 to-red-700',
};

type RewardSpec = {
  xp: number;
  coinsCopper: number;
  drops?: Array<{ id: string; name: string; icon: string; qty: number; chance: number; }>; // 0..1
};
type Mission = { id:string; tier:Tier; title:string; desc:string; durationMs:number; reward:RewardSpec; };

function rngInt(min:number,max:number){ return Math.floor(Math.random()*(max-min+1))+min; }
function roll(p:number){ return Math.random() < p; }
const ORDER: Tier[] = ['F','E','D','C','B','A','S','SS','SSS'];
const idx = (t:Tier)=> ORDER.indexOf(t);

function levelToTier(level:number): Tier{
  if(level>=55) return 'SSS';
  if(level>=45) return 'SS';
  if(level>=35) return 'S';
  if(level>=28) return 'A';
  if(level>=22) return 'B';
  if(level>=16) return 'C';
  if(level>=10) return 'D';
  if(level>=5) return 'E';
  return 'F';
}

// Catálogo simplificado (manter imagens locais)
const CATALOG = {
  herb: { id:'herb', name:'Erva Silvestre', icon:'/images/items/herb.png' },
  fang: { id:'fang', name:'Presa de Lobo', icon:'/images/items/fang.png' },
  core: { id:'core', name:'Núcleo Arcano', icon:'/images/items/core.png' },
  ore:  { id:'ore',  name:'Minério Bruto', icon:'/images/items/ore.png' },
};

function makeMissions(): Mission[] {
  const defs: Array<{tier:Tier,title:string,desc:string,reward:(t:Tier)=>RewardSpec}> = [
    { tier:'F', title:'Varredura da Praça', desc:'Ajude a limpar a praça antes do entardecer.',
      reward:(t)=>({ xp: rngInt(3,6), coinsCopper: rngInt(20,40), drops:[{...CATALOG.herb, qty:1, chance:0.35}] }) },
    { tier:'F', title:'Carregar Barris', desc:'Ajude na taverna a mover barris cheios.',
      reward:(t)=>({ xp: rngInt(3,6), coinsCopper: rngInt(25,45), drops:[{...CATALOG.herb, qty:1, chance:0.2}] }) },
    { tier:'E', title:'Correio da Aldeia', desc:'Entregue cartas entre comerciantes.',
      reward:(t)=>({ xp: rngInt(6,10), coinsCopper: rngInt(40,80), drops:[{...CATALOG.fang, qty:1, chance:0.25}] }) },
    { tier:'E', title:'Patrulha Leve', desc:'Caminhe com o guarda nas ruas principais.',
      reward:(t)=>({ xp: rngInt(6,10), coinsCopper: rngInt(50,85), drops:[{...CATALOG.herb, qty:1, chance:0.25}] }) },
    { tier:'D', title:'Patrulha da Estrada', desc:'Acompanhe um comboio até a ponte.',
      reward:(t)=>({ xp: rngInt(10,16), coinsCopper: rngInt(90,140), drops:[{...CATALOG.ore, qty:1, chance:0.2}] }) },
    { tier:'D', title:'Coleta de Ervas Raras', desc:'Traga espécimes para o alquimista.',
      reward:(t)=>({ xp: rngInt(10,16), coinsCopper: rngInt(100,150), drops:[{...CATALOG.herb, qty:2, chance:0.35}] }) },
    { tier:'C', title:'Caçada Local', desc:'Eliminar bestas que rondam os campos.',
      reward:(t)=>({ xp: rngInt(16,22), coinsCopper: rngInt(150,220), drops:[{...CATALOG.fang, qty:2, chance:0.3}] }) },
    { tier:'B', title:'Exploração de Ruínas', desc:'Mapeie corredores instáveis e recupere inscrições.',
      reward:(t)=>({ xp: rngInt(22,30), coinsCopper: rngInt(240,320), drops:[{...CATALOG.core, qty:1, chance:0.18}] }) },
    { tier:'A', title:'Escolta Nobre', desc:'Proteja a comitiva até o portão leste.',
      reward:(t)=>({ xp: rngInt(30,42), coinsCopper: rngInt(360,480), drops:[{...CATALOG.core, qty:1, chance:0.25}] }) },
    { tier:'S', title:'Behemoth Menor', desc:'Investigue e afaste uma criatura além do vale.',
      reward:(t)=>({ xp: rngInt(45,65), coinsCopper: rngInt(520,700), drops:[{...CATALOG.core, qty:2, chance:0.22}] }) },
    { tier:'SS', title:'Fenda Arcana', desc:'Fechar rasgo mágico com auxílio do círculo da guilda.',
      reward:(t)=>({ xp: rngInt(70,95), coinsCopper: rngInt(820,1100), drops:[{...CATALOG.core, qty:3, chance:0.25}] }) },
    { tier:'SSS', title:'Dragão Antigo', desc:'Não recomendado a novatos.',
      reward:(t)=>({ xp: rngInt(120,180), coinsCopper: rngInt(1600,2200), drops:[{...CATALOG.core, qty:4, chance:0.3}] }) },
  ];
  return defs.map(d=> ({
    id: `guild:${d.tier}:${d.title}`,
    tier: d.tier, title: d.title, desc: d.desc,
    durationMs: TIER_SECONDS[d.tier]*1000,
    reward: d.reward(d.tier),
  }));
}

function useRewards(){
  const g:any = useGame();
  const { setState, giveXP, addXP, giveCoins, addCoins, logGuildEvent } = g;

  function awardXP(amount:number){
    if(!amount) return;
    if(typeof giveXP==='function') return giveXP(amount);
    if(typeof addXP==='function') return addXP(amount);
    setState((s:any)=>({...s, player:{...s.player, xp:(s?.player?.xp||0)+amount}}));
  }
  function awardCopper(copper:number){
    if(!copper) return;
    if(typeof giveCoins==='function') return giveCoins({ copper });
    if(typeof addCoins==='function') return addCoins({ copper });
    setState((s:any)=>({...s, player:{...s.player, coins:{ copper:(s?.player?.coins?.copper||0)+copper }}}));
  }
  function awardItem(id:string, name:string, icon:string, qty:number){
    setState((s:any)=>{
      const inv = s?.player?.inventory ?? { items: [] };
      const items = Array.isArray(inv.items) ? [...inv.items] : [];
      const idx = items.findIndex((it:any)=> it?.id===id);
      if(idx>=0){ items[idx] = { ...items[idx], qty:(items[idx].qty||0)+qty }; }
      else { items.push({ id, name, icon, qty }); }
      return { ...s, player:{ ...s.player, inventory:{ ...inv, items } } };
    });
  }
  function logEvent(entry:any){
    if(typeof logGuildEvent==='function') return logGuildEvent(entry);
    setState((s:any)=>{
      const logs = s?.player?.guild?.logs ?? [];
      const guild = { ...(s?.player?.guild||{}), logs:[...logs, entry] };
      return { ...s, player: { ...s.player, guild } };
    });
  }
  function awardAll(mission:Mission){
    const spec = mission?.reward;
    if(!spec) return { xp:0, copper:0, drops:[] as any[] };
    const gained:any = { xp: spec.xp||0, copper: spec.coinsCopper||0, drops:[] as any[] };
    if(spec.xp) awardXP(spec.xp);
    if(spec.coinsCopper) awardCopper(spec.coinsCopper);
    spec.drops?.forEach(d=>{ if(roll(d.chance)){ awardItem(d.id,d.name,d.icon,d.qty); gained.drops.push(d); } });
    logEvent({ at: Date.now(), missionId: mission.id, tier: mission.tier, gained });
    return gained;
  }
  return { awardAll };
}

function CoinsInline({ copper }:{ copper:number }){
  const c = copperToCoins(copper);
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex items-center gap-1"><img src="/images/items/gold.png" className="w-4 h-4"/>{c.gold}</span>
      <span className="inline-flex items-center gap-1"><img src="/images/items/silver.png" className="w-4 h-4"/>{c.silver}</span>
      <span className="inline-flex items-center gap-1"><img src="/images/items/bronze.png" className="w-4 h-4"/>{c.bronze}</span>
      <span className="inline-flex items-center gap-1"><img src="/images/items/copper.png" className="w-4 h-4"/>{c.copper}</span>
    </span>
  );
}

export default function GuildaPage(){
  const { state, ensureMemberCard, spendStamina, changeHP } = useGame() as any;
  const { awardAll } = useRewards();
  const { add: pushToast } = useToasts();
  const isMember = state?.player?.guild?.isMember ?? false;
  const level = state?.player?.level ?? 1;
  const playerTier = state?.player?.rankTier ?? levelToTier(level);

  const allMissions = useMemo(()=> makeMissions(), []);
  const [tierFilter, setTierFilter] = useState<Tier|'ALL'>('ALL');
  const missions = useMemo(()=> allMissions.filter(m => tierFilter==='ALL' ? true : m.tier===tierFilter), [allMissions, tierFilter]);

  const [activeId, setActiveId] = useState<string|null>(null);
  const [remainingMs, setRemainingMs] = useState<number>(0);
  const [active, setActive] = useState<Mission|null>(null);
  const timerRef = useRef<NodeJS.Timeout|null>(null);

  useEffect(()=>()=>{ if(timerRef.current) clearInterval(timerRef.current as any); },[]);

  function staminaCost(t:Tier){ return [6,8,10,12,14,16,18,20,22][idx(t)] || 8; }
  function hpLoss(t:Tier){ return [0,0,2,3,4,6,8,10,12][idx(t)] || 0; }
  function allowed(player:Tier, m:Tier){ return Math.abs(idx(player)-idx(m)) <= 1; }

  function startMission(m:Mission){
    if(!isMember){ try{ ensureMemberCard?.(); } catch{}; return; }
    if(!allowed(playerTier, m.tier)){
      pushToast({ title:'⚠️ Dificuldade alta', message:`Seu rank (${playerTier}) não permite missões rank ${m.tier}.` });
      return;
    }
    if(activeId) return;

    // Consome stamina e aplica HP (fallbacks se provider não tiver helpers)
    const cost = staminaCost(m.tier);
    let ok = true;
    if(typeof spendStamina==='function'){ ok = spendStamina(cost); }
    else {
      // fallback leve
      ok = (state?.player?.stamina?.current ?? 0) >= cost;
    }
    if(!ok){
      pushToast({ title:'Sem stamina', message:`Você precisa de ${cost} de stamina.` });
      return;
    }
    if(typeof changeHP==='function'){ changeHP(-hpLoss(m.tier)); }

    setActiveId(m.id);
    setActive(m);
    setRemainingMs(m.durationMs);
    if(timerRef.current) clearInterval(timerRef.current as any);
    timerRef.current = setInterval(()=>{
      setRemainingMs(prev=>{
        const next = prev - 250;
        if(next <= 0){
          clearInterval(timerRef.current as any);
          finishMission(m);
          return 0;
        }
        return next;
      });
    }, 250);
  }

  function finishMission(m:Mission){
    const gained = awardAll(m);
    setActiveId(null);
    setActive(null);
    setRemainingMs(0);

    const coins = copperToCoins(gained.copper || m.reward.coinsCopper || 0);
    const dropsTxt = (gained.drops||[]).map((d:any)=>`${d.name} x${d.qty}`).join(', ') || 'Nenhum';
    pushToast({
      title: '🏆 Missão concluída!',
      message: `+${gained.xp||m.reward.xp} XP · ${coins.gold}g ${coins.silver}s ${coins.bronze}b ${coins.copper}c · Drops: ${dropsTxt}`
    });
  }

  function format(ms:number){ return Math.ceil(ms/1000)+'s'; }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-5">
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={()=>setTierFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg border ${tierFilter==='ALL'?'border-amber-400 text-amber-300':'border-slate-700 text-white/80'} bg-slate-900/50`}>
          Todas
        </button>
        {ORDER.map(t=>(
          <button key={t} onClick={()=>setTierFilter(t)}
            className={`px-3 py-1.5 rounded-lg border ${tierFilter===t?'border-amber-400 text-amber-300':'border-slate-700 text-white/80'} bg-slate-900/50`}>
            Rank {t}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {missions.map(m=>{
          const activeThis = activeId===m.id;
          const disabled = !!activeId && !activeThis;
          const tooHard = !allowed(playerTier, m.tier);
          return (
            <div key={m.id} className={`rounded-xl overflow-hidden border bg-slate-950/60 border-slate-800 ring-1 ring-inset ring-transparent hover:ring-amber-400/30 transition-shadow shadow-lg hover:shadow-amber-500/10`}>
              <div className={`p-4 bg-gradient-to-br ${TIER_COLORS[m.tier]} text-white`}>
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-widest opacity-90">Rank {m.tier}</div>
                  {tooHard && <span className="text-[11px] px-2 py-0.5 rounded bg-black/40 border border-white/20">Difícil</span>}
                </div>
                <div className="text-lg font-semibold">{m.title}</div>
                <div className="text-sm opacity-90">{m.desc}</div>
              </div>
              <div className="p-4 space-y-3">
                <div className="text-xs text-white/70">Duração: {format(m.durationMs)}</div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-amber-500/10 px-2 py-0.5 border border-amber-500/30">+{m.reward.xp} XP</span>
                    <span className="opacity-60">·</span>
                    <CoinsInline copper={m.reward.coinsCopper} />
                  </div>
                </div>
                {!!m.reward.drops?.length && (
                  <div className="text-xs text-white/80">
                    <div className="mb-1 opacity-80">Possíveis drops</div>
                    <div className="flex flex-wrap gap-2">
                      {m.reward.drops!.map(d=>(
                        <div key={d.id} className="flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1">
                          <img src={d.icon} alt={d.name} className="w-4 h-4 object-contain" />
                          <span>{d.name}</span>
                          <span className="opacity-70">x{d.qty}</span>
                          <span className="opacity-70">({Math.round(d.chance*100)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    className={`px-3 py-1.5 rounded-md text-sm transition ${disabled ? 'bg-slate-700 text-white/40 cursor-not-allowed' : (tooHard ? 'bg-slate-700/80 text-white/60' : 'bg-emerald-600 hover:bg-emerald-500')}`}
                    disabled={disabled || tooHard}
                    onClick={()=> startMission(m)}>
                    {activeThis ? 'Em execução...' : (tooHard ? 'Fora do seu rank' : 'Aceitar')}
                  </button>
                </div>
                {activeThis && (
                  <div className="h-2 rounded bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all" style={{ width: `${100 - Math.max(0,(remainingMs/m.durationMs)*100)}%` }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cartão + Board */}
      <GuildCard />
      {isMember && <GuildBoard />}
    </div>
  );
}
