'use client';
import React from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { estimateRisk, simulateCombat } from '@/utils/combat_sim';
import { GUILD_MISSIONS } from '@/src/data/missions';

const ORDER: Array<'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'|'SSS'> = ['F','E','D','C','B','A','S','SS','SSS'];

function coinStr(c:{copper?:number, bronze?:number, silver?:number, gold?:number}={}){
  const cpr = (c.copper||0) + (c.bronze||0);
  const parts:string[] = [];
  if (c.gold) parts.push(`${c.gold} ouro`);
  if (c.silver) parts.push(`${c.silver} prata`);
  if (cpr) parts.push(`${cpr} cobre`);
  return parts.join(' + ') || '0';
}

export default function GuildBoard(){
  const { state, addXP, giveCoins, addWorldTime, ADD_WORLD_TIME, advanceTime, setState } = useGame() as any;

  // rank do jogador
  const pr: any = state?.player?.adventurerRank || 'F';
  const pi = Math.max(0, ORDER.indexOf(pr));
  const allowed = new Set([ORDER[Math.max(0,pi-1)], ORDER[pi], ORDER[Math.min(ORDER.length-1, pi+1)]]);

  // lista filtrada (somente guilda)
  const full = (Array.isArray((GUILD_MISSIONS as any)) ? (GUILD_MISSIONS as any) : []);
  const list = full.filter((m:any)=> m?.categoria==='guilda' && (allowed.has(m.rank) || allowed.has(m.requiredRank)));

  const [activeId, setActiveId] = React.useState<string|null>(null);
  const [endAt, setEndAt] = React.useState<number|null>(null);
  const [modal, setModal] = React.useState<any|null>(null);

  function calcDuration(m:any){
    if (m?.durationMs) return m.durationMs;
    const ri = Math.max(0, ORDER.indexOf(m?.rank || m?.requiredRank || 'F'));
    return Math.round(10000 * (1 + ri*0.1)); // base +10% por rank
  }

  function accept(m:any){
    if (activeId) return;
    const dur = calcDuration(m);
    setActiveId(m.id);
    setEndAt(Date.now() + dur);
  }

  function conclude(m:any){
    if (!activeId || activeId!==m.id) return;
    const result = simulateCombat(state?.player, m);
    const ok = !!result?.win;

    if (ok){
      try { if (m?.rewards?.xp) addXP?.(m.rewards.xp); } catch {}
      try {
        const coins = m?.rewards?.coins || {};
        const copper = (coins.copper||0) + (coins.bronze||0);
        if (copper>0) giveCoins?.({ copper });
      } catch {}
      // items/drops: apenas informativo por enquanto
    } else {
      // efeitos de falha básicos (hpLoss)
      const hpLoss = m?.onFailEffects?.hpLoss || 0;
      if (hpLoss>0 && state?.player?.character){
        const hp = Math.max(1, (state.player.character.hp||80) - hpLoss);
        setState((s:any)=> ({ ...s, player: { ...s.player, character: { ...s.player.character, hp } }, updatedAt: Date.now() }));
      }
    }

    // Avançar relógio do mundo
    try {
      const ms = calcDuration(m);
      if (typeof addWorldTime==='function') addWorldTime(ms);
      else if (typeof (ADD_WORLD_TIME as any)==='function') (ADD_WORLD_TIME as any)(ms);
      else if (typeof advanceTime==='function') advanceTime(ms);
    } catch {}

    setModal({ ok, m, result });
    setActiveId(null);
    setEndAt(null);
  }

  return (
    <div className="rounded-2xl border border-amber-900/40 bg-gradient-to-b from-zinc-900 via-zinc-900/70 to-zinc-900/40 p-4">
      <div className="mb-3 font-semibold text-amber-200 drop-shadow">Mural de Contratos</div>
      <div className="grid md:grid-cols-2 gap-3">
        {list.map((m:any)=>{
          const risk = estimateRisk(state?.player, m);
          const remaining = endAt && activeId===m.id ? Math.max(0, endAt - Date.now()) : 0;
          return (
            <div key={m.id} className={`relative overflow-hidden rounded-xl border border-zinc-800 p-3 bg-[url('/images/ui/paper_texture.png')] bg-cover bg-center`}>
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium drop-shadow">{m.title}</div>
                <div className="text-xs px-2 py-0.5 rounded bg-black/30 ring-1 ring-black/40">Risco: {risk.label}</div>
              </div>
              <div className="text-xs text-amber-200/90 mb-1">Rank necessário: {m.requiredRank || m.rank}</div>
              <div className="mt-1 text-sm">
                <div>Recompensas: <b>+{m.rewards?.xp||0} XP</b> • {coinStr(m.rewards?.coins)}</div>
                {m.drops?.length ? <div className="mt-1 text-xs text-white/80">Drops: {m.drops.map((d:any)=>d.id).join(', ')}</div> : null}
              </div>
              <div className="mt-2 flex gap-2">
                {activeId!==m.id && !activeId && (
                  <button onClick={()=>accept(m)} className="px-3 py-1 rounded border border-slate-600 hover:bg-slate-800">Aceitar</button>
                )}
                {activeId===m.id && (
                  <>
                    <button onClick={()=>conclude(m)} className="px-3 py-1 rounded border border-emerald-700 text-emerald-300 hover:bg-emerald-900/30">Concluir</button>
                    <div className="text-xs text-white/60">{Math.ceil(remaining/1000)}s</div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-5">
            <div className="text-lg font-semibold mb-2">{modal.ok ? 'Sucesso!' : 'Falha'}</div>
            <div className="text-sm text-white/80 mb-4">
              {modal.ok ? 'Missão concluída com êxito.' : 'A missão falhou. Alguns efeitos negativos foram aplicados.'}
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={()=>setModal(null)} className="px-3 py-1 rounded border border-slate-600 hover:bg-slate-800">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
