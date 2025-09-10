'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { seasonGradient } from '@/utils/seasonStyle';
import * as missionsData from '@/data/missions';
import * as items from '@/data/items_catalog';

type Rank = 'F'|'E'|'D'|'C'|'A'|'S'|'SS';

const DUR_BY_RANK: Record<Rank, number> = { F:3, E:4, D:5, C:6, A:7, S:10, SS:15 };
const STAMINA_BY_RANK: Record<Rank, number> = { F:5, E:10, D:20, C:40, A:80, S:160, SS:320 };

type Mission = {
  id: string;
  title: string;
  description?: string;
  requiredRank: Rank;
  rewards?: { xp?: number; coinsCopper?: number };
  risk?: number; // 0..3
  drops?: { id: string; chance: number; min?: number; max?: number }[];
};

function clamp(n:number, a:number, b:number){ return Math.max(a, Math.min(b, n)); }
function sigmoid(x:number){ return 1/(1+Math.exp(-x)); }

function estimateChance(player:any, m:Mission, learned:number){
  const attrs = player?.attributes||{};
  const stats = player?.stats||{};
  const gear = (player?.equipped||{}) as any;
  const rankGap = (['F','E','D','C','A','S','SS'] as Rank[]).indexOf((player?.adventurerRank||'F')) - (['F','E','D','C','A','S','SS'] as Rank[]).indexOf(m.requiredRank);
  const scoreP = (attrs.strength||5)+(attrs.agility||5)+(attrs.intelligence||5)+(attrs.vitality||5) + (stats.attack||10)*0.5 + (stats.defense||5)*0.5 + (stats.crit||0.05)*20 + (player?.stamina?.current||0)*0.1 + (stats.hp||100)/(stats.maxHp||100)*10 + rankGap*4;
  const scoreM = (['F','E','D','C','A','S','SS'] as Rank[]).indexOf(m.requiredRank)*10 + (m.risk||0)*5;
  const base = clamp(0.2 + sigmoid((scoreP - scoreM)/10), 0.05, 0.95);
  const learnedBonus = clamp(learned * 0.03, 0, 0.15);
  return clamp(base + learnedBonus, 0.05, 0.98);
}

function copperToCoinsStr(copper:number){
  const gold = Math.floor(copper/10000); copper%=10000;
  const silver = Math.floor(copper/100); const bronze = Math.floor((copper%100)/10); const cop = copper%10;
  const parts:string[]=[];
  if(gold) parts.push(`${gold}g`);
  if(silver) parts.push(`${silver}s`);
  if(bronze) parts.push(`${bronze}b`);
  if(cop) parts.push(`${cop}c`);
  return parts.join(' ')||'0c';
}

function pickDrops(m:Mission){
  const table = m.drops||[];
  const out:{id:string,qty:number}[] = [];
  for(const d of table){
    if(Math.random() < d.chance){
      const qty = Math.max(1, Math.floor((d.min||1) + Math.random()*((d.max||d.min||1) - (d.min||1) + 1)));
      out.push({ id:d.id, qty });
    }
  }
  return out;
}

function missionCatalog(): Mission[]{
  // tenta pegar do data/missions.ts
  const arr: any = (missionsData as any).GUILD_MISSIONS || (missionsData as any).missions || [];
  if(Array.isArray(arr) && arr.length){
    return arr.map((x:any, idx:number)=>({
      id: x.id || `guild:${x.requiredRank||'F'}:${idx}`,
      title: x.title || x.name || `Contrato ${idx+1}`,
      description: x.description || x.desc,
      requiredRank: (x.requiredRank || 'F') as Rank,
      rewards: x.rewards || { xp: x.xp||10, coinsCopper: x.coinsCopper||100 },
      risk: x.risk ?? 1,
      drops: x.drops
    }));
  }
  // fallback mínimo
  return (['F','E','D','C','A','S','SS'] as Rank[]).flatMap((r,ri)=>
    Array.from({length:4}).map((_,i)=>({
      id:`guild:${r}:${i}`,
      title:`Contrato ${r}-${i+1}`,
      description:`Auxiliar um NPC local em uma tarefa do rank ${r}.`,
      requiredRank:r,
      rewards:{ xp: 10+ri*5, coinsCopper: 150*(ri+1) },
      risk: (i%3),
      drops:[
        { id:'pocao_hp_pequena', chance:0.25, min:1, max:2 },
        { id:'ferro_bruto', chance:0.18, min:1, max:1 }
      ]
    }))
  );
}

export default function GuildMissions(){
  const { state, setState } = useGame();
  const world = state.world;
  const grad = seasonGradient?.[world?.season || 'Primavera'] || 'bg-zinc-900';

  const [rankFilter, setRankFilter] = useState<Rank|'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'pay'|'xp'|'drops'>('pay');
  const [loopingId, setLoopingId] = useState<string|null>(null);

  const missions = useMemo(()=>{
    let list = missionCatalog();
    if(rankFilter!=='ALL') list = list.filter(m=>m.requiredRank===rankFilter);
    list = list.slice(0); // clone
    list.sort((a,b)=>{
      if(sortBy==='pay') return (b.rewards?.coinsCopper||0)-(a.rewards?.coinsCopper||0);
      if(sortBy==='xp') return (b.rewards?.xp||0)-(a.rewards?.xp||0);
      const ad=(a.drops?.length||0), bd=(b.drops?.length||0); return bd-ad;
    });
    return list;
  },[rankFilter, sortBy]);

  // aprendizado por missão (persistido no save em guild.learning[missionId])
  const getLearn = (id:string)=> (state as any).guild?.learning?.[id] || 0;

  const acceptOnce = (m:Mission)=>{
    const cost = STAMINA_BY_RANK[m.requiredRank];
    const dur = DUR_BY_RANK[m.requiredRank];
    setState(s=>{
      const cur = (s.player as any).stamina?.current ?? 0;
      if(cur < cost){
        if(typeof window!=='undefined') alert('Sem stamina suficiente.');
        return s;
      }
      const s2:any = { ...s, updatedAt: Date.now() };
      // consome stamina
      s2.player = { ...s.player, stamina: { ...(s.player as any).stamina, current: cur - cost } };
      // avança relógio do mundo (em ms, mas o jogo considera ms -> vamos somar seg*1000)
      const w:any = { ...(s as any).world };
      w.dateMs = (w.dateMs||Date.now()) + dur*1000;
      s2.world = w;

      // calcula chance
      const learned = (s2.guild?.learning?.[m.id]||0);
      const chance = estimateChance(s2.player, m, learned);
      const win = Math.random() < chance;

      // aplica recompensa/penalidade
      const p:any = { ...s2.player };
      if(win){
        p.xp = (p.xp||0) + (m.rewards?.xp||0);
        // moedas
        const c = (p.coins||{gold:0,silver:0,bronze:0,copper:0});
        const cc = (m.rewards?.coinsCopper||0);
        const add = {
          gold: Math.floor(cc/10000),
          silver: Math.floor((cc%10000)/100),
          bronze: Math.floor((cc%100)/10),
          copper: cc%10
        };
        p.coins = { gold:(c.gold||0)+add.gold, silver:(c.silver||0)+add.silver, bronze:(c.bronze||0)+add.bronze, copper:(c.copper||0)+add.copper };
        // drops
        const drops = pickDrops(m);
        if(drops.length){
          const inv = Array.isArray(p.inventory)?[...p.inventory]:[];
          drops.forEach(d=>{
            const cat = (items as any).ITEMS_CATALOG || (items as any).ITEMS || [];
            const base = Array.isArray(cat) ? cat.find((it:any)=> it.id===d.id) : null;
            const item = base ? {...base} : { id:d.id, name:d.id, valueCopper:10, image:'/images/items/unknown.png' };
            const idx = inv.findIndex((it:any)=> it.id===item.id);
            if(idx>=0) inv[idx] = { ...inv[idx], qty: (inv[idx].qty||0) + d.qty };
            else inv.push({ ...item, qty: d.qty });
          });
          p.inventory = inv;
        }
        // aprendizado +
        const g:any = { ...(s2.guild||{}) };
        g.learning = { ...(g.learning||{}), [m.id]: Math.min(5, (g.learning?.[m.id]||0) + 1) };
        // log simples
        const logLine = `✅ ${m.title} — +${m.rewards?.xp||0}xp, +${copperToCoinsStr(m.rewards?.coinsCopper||0)} ${drops.length? ' + drops':''}`;
        g.log = [logLine, ...(g.log||[])].slice(0,50);
        s2.guild = g;
      }else{
        // falha: perder um pouco de HP (10%)
        const hp = (p.stats?.hp||100), max = (p.stats?.maxHp||100);
        const lost = Math.max(1, Math.floor(max*0.1));
        const p2:any = { ...p, stats: { ...(p.stats||{}), hp: Math.max(1, hp - lost) } };
        s2.player = p2;
        const g:any = { ...(s2.guild||{}) };
        g.log = [`❌ ${m.title} — falhou (−${lost} HP)`, ...(g.log||[])].slice(0,50);
        s2.guild = g;
      }
      return s2;
    });
  };

  const loopRef = useRef<ReturnType<typeof setTimeout>|null>(null);
  const runLoop = (m:Mission)=>{
    if(loopRef.current) clearTimeout(loopRef.current);
    setLoopingId(m.id);
    const step = ()=>{
      acceptOnce(m);
      loopRef.current = setTimeout(()=>{
        const cur = (state as any).player?.stamina?.current ?? 0;
        if(cur <= 0){ setLoopingId(null); if(typeof window!=='undefined') alert('Stamina acabou. Loop pausado.'); return; }
        step();
      }, (DUR_BY_RANK[m.requiredRank])*1000);
    };
    step();
  };
  const stopLoop = ()=>{ if(loopRef.current) clearTimeout(loopRef.current); setLoopingId(null); };

  return (
    <div className={`rounded-2xl p-4 border border-amber-800/30 ${grad}`}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-amber-200 font-semibold text-lg">Mural de Contratos</div>
        <div className="flex items-center gap-2 text-xs">
          <label>Rank:</label>
          {(['ALL','F','E','D','C','A','S','SS'] as const).map(r=>(
            <button key={r} onClick={()=>setRankFilter(r as any)} className={`px-2 py-1 rounded border ${rankFilter===r?'border-amber-400 bg-amber-900/40':'border-amber-800 hover:bg-amber-950'}`}>{r}</button>
          ))}
          <label className="ml-3">Ordenar por:</label>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value as any)} className="px-2 py-1 rounded bg-amber-950 border border-amber-800">
            <option value="pay">Pagamento</option>
            <option value="xp">EXP</option>
            <option value="drops">Drops</option>
          </select>
        </div>
      </div>

      <div className="mt-3 grid md:grid-cols-2 gap-3">
        {missions.map(m=>{
          const learned = getLearn(m.id);
          const chance = estimateChance(state.player, m, learned);
          const dur = DUR_BY_RANK[m.requiredRank];
          const cost = STAMINA_BY_RANK[m.requiredRank];
          return (
            <div key={m.id} className="rounded-xl border border-amber-900/40 bg-black/30 p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{m.title} <span className="text-amber-300">[{m.requiredRank}]</span></div>
                <div className="text-xs opacity-80">Sucesso estimado: {Math.round(chance*100)}%</div>
              </div>
              <div className="text-xs opacity-90 mt-1">{m.description||'Contrato de serviço local.'}</div>
              <div className="mt-2 text-xs flex items-center gap-3 flex-wrap">
                <span>⏱ {dur}s</span>
                <span>🧪 Stamina: {cost}</span>
                <span>✨ EXP: {m.rewards?.xp||0}</span>
                <span>💰 {copperToCoinsStr(m.rewards?.coinsCopper||0)}</span>
                {typeof m.risk==='number' && <span>⚠️ Risco: {m.risk}</span>}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button onClick={()=>acceptOnce(m)} className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-black text-sm font-semibold">Aceitar</button>
                {loopingId===m.id
                  ? <button onClick={stopLoop} className="px-2 py-1 rounded border border-amber-600 text-amber-300 text-sm">Parar</button>
                  : <button onClick={()=>runLoop(m)} className="px-2 py-1 rounded border border-amber-600 text-amber-300 text-sm">Loop</button>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
