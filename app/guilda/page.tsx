'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { copperToCoins, coinsToCopper } from '@/utils/money_aldor_client';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Guilda – página completa (redesign)
 * - Filtros por tier (F até SSS)
 * - 1 missão ativa por vez com progress bar
 * - Duração por tier: F=3s, E=4s, D=5s, C=6s, B=7s, A=8s, S=9s, SS=10s, SSS=11s
 * - Recompensas em XP, moedas (convertidas), e drops por chance
 * - Persistência via provider (autosave local-first)
 * - Sem dependências novas; usa imagens locais em /public/images/items/
 */

type Tier = 'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'|'SSS';

const TIER_SECONDS: Record<Tier, number> = {
  F:3, E:4, D:5, C:6, B:7, A:8, S:9, SS:10, SSS:11
};

const TIER_COLORS: Record<Tier, string> = {
  F:'from-zinc-800 to-zinc-700',
  E:'from-emerald-800 to-emerald-700',
  D:'from-sky-800 to-sky-700',
  C:'from-indigo-800 to-indigo-700',
  B:'from-violet-800 to-violet-700',
  A:'from-fuchsia-800 to-fuchsia-700',
  S:'from-amber-800 to-amber-700',
  SS:'from-rose-800 to-rose-700',
  SSS:'from-red-900 to-red-700',
};

type RewardSpec = {
  xp: number;
  coinsCopper: number;
  drops?: Array<{ id: string; name: string; icon: string; qty: number; chance: number; }>; // 0..1
};

type Mission = {
  id: string;
  tier: Tier;
  title: string;
  desc: string;
  durationMs: number;
  reward: RewardSpec;
};

function rngInt(min:number,max:number){ return Math.floor(Math.random()*(max-min+1))+min; }
function roll(p:number){ return Math.random() < p; }

// Ícones locais de exemplo (pode adaptar aos seus itens reais)
const CATALOG = {
  herb: { id:'herb', name:'Erva Silvestre', icon:'/images/items/herb.png' },
  fang: { id:'fang', name:'Presa de Lobo', icon:'/images/items/fang.png' },
  core: { id:'core', name:'Núcleo Arcano', icon:'/images/items/core.png' },
  ore:  { id:'ore',  name:'Minério Bruto', icon:'/images/items/ore.png' },
};

function makeMissions(): Mission[] {
  const defs: Array<{tier:Tier,title:string,desc:string,reward:(t:Tier)=>RewardSpec}> = [
    { tier:'F', title:'Varredura da Praça', desc:'Ajude a limpar a praça antes do entardecer. Trabalho honesto rende bom respeito.',
      reward:(t)=>({ xp: rngInt(3,6), coinsCopper: rngInt(20,40), drops:[{...CATALOG.herb, qty:1, chance:0.35}] }) },
    { tier:'E', title:'Correio da Aldeia', desc:'Entregue cartas entre comerciantes. Cuidado com cães territoriais.',
      reward:(t)=>({ xp: rngInt(6,10), coinsCopper: rngInt(40,80), drops:[{...CATALOG.fang, qty:1, chance:0.25}] }) },
    { tier:'D', title:'Patrulha da Estrada', desc:'Acompanhe um comboio pequeno até a ponte.',
      reward:(t)=>({ xp: rngInt(10,16), coinsCopper: rngInt(90,140), drops:[{...CATALOG.ore, qty:1, chance:0.2}] }) },
    { tier:'C', title:'Caçada Local', desc:'Eliminar bestas que rondam os campos.',
      reward:(t)=>({ xp: rngInt(16,22), coinsCopper: rngInt(150,220), drops:[{...CATALOG.fang, qty:2, chance:0.3}] }) },
    { tier:'B', title:'Exploração de Ruínas', desc:'Mapeie corredores instáveis e recupere inscrições.',
      reward:(t)=>({ xp: rngInt(22,30), coinsCopper: rngInt(240,320), drops:[{...CATALOG.core, qty:1, chance:0.18}] }) },
    { tier:'A', title:'Escolta Nobre', desc:'Proteja a comitiva até o portão leste, sem arranhar a carruagem.',
      reward:(t)=>({ xp: rngInt(30,42), coinsCopper: rngInt(360,480), drops:[{...CATALOG.core, qty:1, chance:0.25}] }) },
    { tier:'S', title:'Behemoth Menor', desc:'Investigue e afaste uma criatura além do vale.',
      reward:(t)=>({ xp: rngInt(45,65), coinsCopper: rngInt(520,700), drops:[{...CATALOG.core, qty:2, chance:0.22}] }) },
    { tier:'SS', title:'Fenda Arcana', desc:'Fechar rasgo mágico com auxílio do círculo da guilda.',
      reward:(t)=>({ xp: rngInt(70,95), coinsCopper: rngInt(820,1100), drops:[{...CATALOG.core, qty:3, chance:0.25}] }) },
    { tier:'SSS', title:'Dragão Antigo', desc:'Não recomendado a novatos. Se sobreviver, traga as escamas.',
      reward:(t)=>({ xp: rngInt(120,180), coinsCopper: rngInt(1600,2200), drops:[{...CATALOG.core, qty:4, chance:0.3}] }) },
  ];

  return defs.map(d=> ({
    id: `guild:${d.tier}:${d.title}`,
    tier: d.tier,
    title: d.title,
    desc: d.desc,
    durationMs: TIER_SECONDS[d.tier]*1000,
    reward: d.reward(d.tier),
  }));
}

function useRewards(){
  const g:any = useGame();
  const { setState, giveXP, addXP, giveCoins, addCoins } = g;

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
  function awardAll(spec:RewardSpec){
    if(!spec) return;
    if(spec.xp) awardXP(spec.xp);
    if(spec.coinsCopper) awardCopper(spec.coinsCopper);
    spec.drops?.forEach(d=>{ if(roll(d.chance)) awardItem(d.id,d.name,d.icon,d.qty); });
  }
  return { awardAll };
}

function CoinsInline({ copper }:{ copper:number }){
  const c = copperToCoins(copper);
  return (
    <span className="inline-flex items-center gap-2">
      <span title="gold" className="inline-flex items-center gap-1"><img src="/images/items/gold.png" className="w-4 h-4"/>{c.gold}</span>
      <span title="silver" className="inline-flex items-center gap-1"><img src="/images/items/silver.png" className="w-4 h-4"/>{c.silver}</span>
      <span title="bronze" className="inline-flex items-center gap-1"><img src="/images/items/bronze.png" className="w-4 h-4"/>{c.bronze}</span>
      <span title="copper" className="inline-flex items-center gap-1"><img src="/images/items/copper.png" className="w-4 h-4"/>{c.copper}</span>
    </span>
  );
}

export default function GuildaPage(){
  const { state, ensureMemberCard } = useGame() as any;
  const { awardAll } = useRewards();
  const isMember = state?.player?.guild?.isMember ?? false;

  // monta catálogo e filtros
  const allMissions = useMemo(()=> makeMissions(), []);
  const [tierFilter, setTierFilter] = useState<Tier|'ALL'>('ALL');

  const missions = useMemo(()=>{
    return allMissions.filter(m => tierFilter==='ALL' ? true : m.tier===tierFilter);
  }, [allMissions, tierFilter]);

  // controle de execução (1 missão por vez)
  const [activeId, setActiveId] = useState<string|null>(null);
  const [remainingMs, setRemainingMs] = useState<number>(0);
  const [active, setActive] = useState<Mission|null>(null);
  const timerRef = useRef<NodeJS.Timeout|null>(null);

  useEffect(()=>()=>{ if(timerRef.current) clearInterval(timerRef.current as any); },[]);

  function startMission(m:Mission){
    if(!isMember){ try{ ensureMemberCard?.(); } catch{} }
    if(activeId) return;
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
    // aplica recompensas com rolagem de drops
    awardAll(m.reward);
    setActiveId(null);
    setActive(null);
    setRemainingMs(0);
  }

  function format(ms:number){
    const s = Math.ceil(ms/1000);
    return s + 's';
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Guilda</h1>
            {!isMember && <p className="text-sm text-white/70">Você ainda não é membro. Torne-se membro para acessar contratos oficiais.</p>}
          </div>
          {!isMember && (
            <button onClick={()=>{ try{ ensureMemberCard?.(); } catch{}; }}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition">
              Entrar na Guilda
            </button>
          )}
        </div>
      </div>

      {/* filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={()=>setTierFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg border ${tierFilter==='ALL'?'border-amber-400 text-amber-300':'border-slate-700 text-white/80'} bg-slate-900/50`}>
          Todas
        </button>
        {(['F','E','D','C','B','A','S','SS','SSS'] as Tier[]).map(t=>(
          <button key={t} onClick={()=>setTierFilter(t)}
            className={`px-3 py-1.5 rounded-lg border ${tierFilter===t?'border-amber-400 text-amber-300':'border-slate-700 text-white/80'} bg-slate-900/50`}>
            Rank {t}
          </button>
        ))}
      </div>

      {/* grid de missões */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {missions.map(m=>{
          const activeThis = activeId===m.id;
          const disabled = !!activeId && !activeThis;
          const rewardC = m.reward.coinsCopper;
          return (
            <div key={m.id} className="rounded-xl overflow-hidden border border-slate-800 bg-gradient-to-br {TIER_COLORS[m.tier]}">
              <div className={`p-4 bg-gradient-to-br ${TIER_COLORS[m.tier]} text-white`}>
                <div className="text-xs uppercase tracking-widest opacity-80">Rank {m.tier}</div>
                <div className="text-lg font-semibold">{m.title}</div>
                <div className="text-sm opacity-90">{m.desc}</div>
              </div>
              <div className="p-4 space-y-3 bg-slate-950/60">
                <div className="text-xs text-white/70">Duração: {format(m.durationMs)}</div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-amber-500/10 px-2 py-0.5 border border-amber-500/30">+{m.reward.xp} XP</span>
                    <span className="opacity-60">·</span>
                    <CoinsInline copper={rewardC} />
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
                    className={`px-3 py-1.5 rounded-md text-sm ${disabled ? 'bg-slate-700 text-white/40 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500'} transition`}
                    disabled={disabled}
                    onClick={()=> startMission(m)}>
                    {activeThis ? 'Em execução...' : 'Aceitar'}
                  </button>
                </div>
                {activeThis && (
                  <div className="h-2 rounded bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all"
                      style={{ width: `${100 - Math.max(0, (remainingMs/m.durationMs)*100)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
