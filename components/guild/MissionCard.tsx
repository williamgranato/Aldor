'use client';
import React from 'react';
import { ShieldAlert, Clock } from 'lucide-react';
import { copperToCoins } from '@/utils/money_aldor_client';
import * as itemsCatalog from '@/data/items_catalog';

export type Tier = 'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'|'SSS';
export type Mission = {
  id:string;
  tier:Tier;
  title:string;
  desc:string;
  durationMs:number;
  reward:{ xp:number; coinsCopper:number; drops?: Array<{id:string, qty:number, chance:number}> };
};

const TIER_COLORS: Record<Tier, string> = {
  F:'from-zinc-800 to-zinc-700',E:'from-emerald-800 to-emerald-700',
  D:'from-sky-800 to-sky-700',C:'from-indigo-800 to-indigo-700',
  B:'from-violet-800 to-violet-700',A:'from-fuchsia-800 to-fuchsia-700',
  S:'from-amber-800 to-amber-700',SS:'from-rose-800 to-rose-700',
  SSS:'from-red-900 to-red-700',
};

const RISK_BY_TIER: Record<Tier, number> = { F:10, E:20, D:30, C:40, B:50, A:60, S:70, SS:80, SSS:90 };
function riskForTier(t:Tier){ return RISK_BY_TIER[t] ?? 30; }

export default function MissionCard({
  mission, disabled, active, progressPct, onAccept
}:{ mission:Mission, disabled:boolean, active:boolean, progressPct:number, onAccept:()=>void }){
  const coins = copperToCoins(mission.reward.coinsCopper);
  return (
    <div className="rounded-xl overflow-hidden border bg-slate-950/60 border-slate-800 ring-1 ring-inset ring-transparent hover:ring-amber-400/30 transition-shadow shadow-lg hover:shadow-amber-500/10">
      <div className={`p-4 bg-gradient-to-br ${TIER_COLORS[mission.tier]} text-white`}>
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-widest opacity-90">Rank {mission.tier}</div>
        </div>
        <div className="text-lg font-semibold">{mission.title}</div>
        <div className="text-sm opacity-90">{mission.desc}</div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-white/70">
          <div className="inline-flex items-center gap-1"><Clock className="w-4 h-4" /> Duração: {Math.ceil(mission.durationMs/1000)}s</div>
          <div className="inline-flex items-center gap-1"><ShieldAlert className="w-4 h-4" /> Risco: {riskForTier(mission.tier)}%</div>
        </div>
        <div className="mt-1 h-1 w-full rounded-full bg-slate-800/80" data-risk>
          <div className="h-1 rounded-full bg-gradient-to-r from-amber-600/80 to-red-600/80" style={{width: riskForTier(mission.tier)+'%'}} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 border border-amber-500/30">+{mission.reward.xp} XP</span>
            <span className="opacity-60">·</span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1"><img src="/images/items/gold.png" className="w-4 h-4"/>{coins.gold}</span>
              <span className="inline-flex items-center gap-1"><img src="/images/items/silver.png" className="w-4 h-4"/>{coins.silver}</span>
              <span className="inline-flex items-center gap-1"><img src="/images/items/bronze.png" className="w-4 h-4"/>{coins.bronze}</span>
              <span className="inline-flex items-center gap-1"><img src="/images/items/copper.png" className="w-4 h-4"/>{coins.copper}</span>
            </span>
          </div>
        </div>

        {!!mission.reward.drops?.length && (
          <div className="text-xs text-white/80">
            <div className="mb-1 opacity-80">Possíveis drops</div>
            <div className="flex flex-wrap gap-2">
              {mission.reward.drops!.map((d, i)=>{
                // nome correto via catálogo
                const anyCatalog:any = itemsCatalog;
                const it = anyCatalog[d.id] || { name: 'Item desconhecido' };
                return (
                  <div key={mission.id + ':drop:' + i} className="flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1">
                    <img src={`/images/items/${d.id}.png`} alt={it.name} className="w-4 h-4 object-contain" />
                    <span>{it.name}</span>
                    <span className="opacity-70">x{d.qty}</span>
                    <span className="opacity-70">({Math.round((d.chance||0)*100)}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1.5 rounded-md text-sm transition ${disabled ? 'bg-slate-700 text-white/40 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500'}`}
            disabled={disabled}
            onClick={onAccept}
          >
            {active ? 'Em execução...' : 'Aceitar'}
          </button>
        </div>

        {active && (
          <div className="h-2 rounded bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}
