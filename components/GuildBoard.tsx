// components/GuildBoard.tsx
'use client';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { MISSIONS, type Mission } from '@/data/missions_catalog';
import { canPromote, countCompletedAtOrAbove } from '@/utils/rankProgress';

type VMission = Mission & {
  successChance?: number;
  npc?: {name:string, cls:string, bonus:number};
  chainId?: string; chainStep?: number; chainTotal?: number; // contratos em cadeia
};

function riskColor(p:number){
  if(p>=80) return 'text-emerald-400';
  if(p>=55) return 'text-yellow-300';
  if(p>=30) return 'text-orange-400';
  return 'text-red-400';
}

function Pill({ children }:{children: React.ReactNode}){
  return <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/40 border border-amber-900/50">{children}</span>;
}

function ProgressBar({ value }:{value:number}){
  return (
    <div className="w-full h-2 bg-black/40 rounded overflow-hidden ring-1 ring-amber-900/40">
      <div className="h-full bg-amber-400 transition-all duration-200" style={{ width: `${value}%` }} />
    </div>
  );
}

const NAMES = ['Ragna', 'Thorin', 'Elira', 'Kalev', 'Mora', 'Jax', 'Liora', 'Borin'];
const CLASSES = ['Ladino','Mago','Guerreiro','Arqueiro','Clérigo'];

function rollNPC(seed:number){
  const n = NAMES[seed % NAMES.length];
  const c = CLASSES[(seed*7) % CLASSES.length];
  const bonus = (seed % 5) * 2; // 0..8%
  return { name:n, cls:c, bonus };
}

type SortKey = 'rank'|'reward_xp'|'reward_coins'|'risk';
const RANK_ORDER = ['F','E','D','C','B','A','S','SS','SSS'];

export default function GuildBoard(){
  const { state, undertakeQuest } = useGame();
  const [acceptingId, setAcceptingId] = useState<string|null>(null);
  const [progress, setProgress] = useState(0);
  const [sortBy, setSortBy] = useState<SortKey>('rank');
  const [filterRank, setFilterRank] = useState<string|''>('');
  const [lastDeltaHp, setLastDeltaHp] = useState<number>(0);
  const [lastDurabilityHint, setLastDurabilityHint] = useState<boolean>(false);
  const [lastResultMissionId, setLastResultMissionId] = useState<string| null>(null);
  const hpBeforeRef = useRef<number>(state.player.stats.hp);

  // Afinidade com NPC em localStorage (sinergia acumulativa até +15%)
  function loadAffinity(): Record<string, number>{
    if(typeof window==='undefined') return {};
    try{ return JSON.parse(localStorage.getItem('aldor_npc_affinity')||'{}'); }catch{ return {}; }
  }
  function saveAffinity(a: Record<string, number>){
    if(typeof window==='undefined') return;
    localStorage.setItem('aldor_npc_affinity', JSON.stringify(a));
  }
  const [affinity, setAffinity] = useState<Record<string, number>>(loadAffinity());

  useEffect(()=>{ saveAffinity(affinity); }, [affinity]);

  const playerRank = state.player.adventurerRank as string;
  const completed = state.guild.completedQuests?.length || 0;

  // Missão de evento rara (1%)
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
    } as any;
  }, [state.world?.dateMs]);

  // Contratos em cadeia (3 partes). Gerados virtualmente, desbloqueio sequencial por conclusão.
  const chainMissions: VMission[] = useMemo(()=>{
    const base: VMission[] = [
      { id:'chain_wolves_1', title:'Ninho de Lobos I', desc:'Rastreie pegadas e elimine sentinelas.', rank:'E', difficulty:1.0, rewards:{coinsCopper:22, xp:10}, drops:[], chainId:'wolves', chainStep:1, chainTotal:3 },
      { id:'chain_wolves_2', title:'Ninho de Lobos II', desc:'Destrua a matilha externa.', rank:'D', difficulty:1.15, rewards:{coinsCopper:28, xp:14}, drops:[], chainId:'wolves', chainStep:2, chainTotal:3 },
      { id:'chain_wolves_3', title:'Ninho de Lobos III', desc:'Elimine o Alfa. Recompensa épica garantida.', rank:'C', difficulty:1.3, rewards:{coinsCopper:40, xp:22}, drops:[{id:'gema_epica', qty:1, chance:1000} as any], chainId:'wolves', chainStep:3, chainTotal:3 },
    ] as any;
    // Desbloqueio: precisa ter concluído a etapa anterior (pelo id base, ignorando sufixos)
    const done = new Set((state.guild.completedQuests||[]).map(q=> (q.id.split(':')[0])));
    return base.filter(m=>{
      if(m.chainStep===1) return true;
      return done.has(`chain_wolves_${m.chainStep-1}`);
    });
  }, [state.guild.completedQuests]);

  // Cálculo de chance (aproximado)
  const withCalcBase = useMemo(()=>{
    const pr = Math.max(0, RANK_ORDER.indexOf(playerRank));
    const list: VMission[] = [...chainMissions, ...(eventMission?[eventMission]:[]), ...MISSIONS as any];
    return list.map((m, idx)=>{
      const base = 60 + (pr*5) - (Math.round((m.difficulty-1)*40));
      const seedBonus = (m.id.charCodeAt(0)+idx) % 7; // 0..6
      const npc = rollNPC(idx + pr*13);
      // afinidade (até +15%)
      const aff = Math.min(15, affinity[npc.name] || 0);
      const chance = Math.max(5, Math.min(95, base + seedBonus + npc.bonus + aff));
      return { ...m, successChance: chance, npc };
    });
  }, [playerRank, eventMission, chainMissions, affinity]);

  // Filtros + ordenação
  const missionsVM = useMemo(()=>{
    let arr = withCalcBase.slice();
    if(filterRank){
      arr = arr.filter(m=> m.rank === filterRank);
    }
    arr.sort((a,b)=>{
      if(sortBy==='rank') return RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank);
      if(sortBy==='reward_xp') return (b.rewards?.xp||0) - (a.rewards?.xp||0);
      if(sortBy==='reward_coins') return (b.rewards?.coinsCopper||0) - (a.rewards?.coinsCopper||0);
      if(sortBy==='risk') return (b.successChance||0) - (a.successChance||0);
      return 0;
    });
    return arr;
  }, [withCalcBase, sortBy, filterRank]);

  // Aceitar missão com progresso de 5s
  const onAccept = (m: VMission)=>{
    if(acceptingId) return;
    setAcceptingId(m.id);
    setProgress(0);
    setLastResultMissionId(null);
    setLastDeltaHp(0);
    setLastDurabilityHint(false);

    // snapshot de HP antes
    hpBeforeRef.current = state.player.stats.hp;

    const start = Date.now();
    const int = setInterval(()=>{
      const pct = Math.min(100, ((Date.now()-start)/5000)*100);
      setProgress(pct);
    }, 120);

    setTimeout(()=>{
      clearInterval(int);
      // Afinidade: se repetiu NPC, soma +5 (até 15)
      const npcName = m.npc?.name;
      if(npcName){
        setAffinity(prev=>{
          const cur = prev[npcName]||0;
          const nxt = Math.min(15, cur + 5);
          return { ...prev, [npcName]: nxt };
        });
      }

      // Aplica bônus do NPC reduzindo dificuldade via sufixo no ID (parseado em undertakeQuest)
      const mul = Math.max(0.8, 1 + ((100 - (m.successChance||50)) / 400) - (m.npc?.bonus||0)/100 - ((affinity[m.npc?.name||'']||0)/200));
      const qWithMul: any = { ...m, id: `${m.id}:mul:${mul.toFixed(2)}` };
      undertakeQuest(qWithMul as any);

      // Após resolver, comparar HP antes/depois para exibir penalidades visuais
      setTimeout(()=>{
        const hpAfter = state.player.stats.hp; // pode estar stale; em apps reais, usar um seletor do provider
        const delta = hpAfter - hpBeforeRef.current;
        setLastDeltaHp(delta); // negativo = perdeu
        // hint de durabilidade: se perdeu HP e chance < 50, mostre aviso (UI apenas)
        setLastDurabilityHint((m.successChance||0) < 50 && delta < 0);
        setLastResultMissionId(m.id);
      }, 50);

      setAcceptingId(null);
      setProgress(0);
    }, 5000);
  };

  // Rank próximo (usar canPromote + countCompletedAtOrAbove)
  const completedAtOrAbove = countCompletedAtOrAbove(state.guild.completedQuests || [], playerRank as any);
  const promo = canPromote(playerRank as any, completedAtOrAbove);
  const nextRank = promo.ok ? promo.next : null;

  // Histórico recente
  const history = useMemo(()=>{
    const h = (state.guild.completedQuests||[]).slice(-10).reverse();
    return h.map((x)=>{
      const mission = withCalcBase.find(m=>m.id.split(':')[0]===x.id.split(':')[0]);
      return { id:x.id, at:x.at, title: mission?.title || x.id, rank: mission?.rank || '?' };
    });
  }, [state.guild.completedQuests, withCalcBase]);

  return (
    <div className="rounded-2xl border border-amber-900/40 bg-amber-950/30 p-4 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="text-amber-100 font-semibold">Quadro de Contratos</div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <label className="opacity-80">Ordenar:</label>
          <select className="bg-black/40 border border-amber-900/40 rounded px-2 py-1"
            value={sortBy} onChange={e=>setSortBy(e.target.value as SortKey)}>
            <option value="rank">Rank</option>
            <option value="reward_xp">Recompensa (XP)</option>
            <option value="reward_coins">Recompensa (Moedas)</option>
            <option value="risk">Chance de Sucesso</option>
          </select>
          <label className="opacity-80 ml-2">Filtrar Rank:</label>
          <select className="bg-black/40 border border-amber-900/40 rounded px-2 py-1"
            value={filterRank} onChange={e=>setFilterRank(e.target.value)}>
            <option value="">Todos</option>
            {RANK_ORDER.map(r=><option key={r} value={r}>{r}</option>)}
          </select>
          <div className="ml-auto opacity-80">
            Próximo Rank: <span className="font-semibold">{nextRank || '—'}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {missionsVM.map(m=>(
          <div key={m.id} className="rounded-xl border border-amber-800/40 bg-black/20 p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold text-amber-200">{m.title} <span className="text-xs opacity-60">[{m.rank}]</span></div>
                <div className="text-xs opacity-80">{m.desc}</div>
                {m.chainId && (
                  <div className="mt-1 text-[11px] opacity-80"><Pill>Contrato em cadeia {m.chainStep}/{m.chainTotal}</Pill></div>
                )}
              </div>
              <div className={`text-right text-sm ${riskColor(m.successChance||50)}`}>
                {Math.round(m.successChance||50)}%
                <div className="text-xs opacity-60">sucesso</div>
              </div>
            </div>

            {/* Loot preview */}
            {m.drops && m.drops.length>0 && (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                {m.drops.slice(0,4).map((d:any)=>{
                  const src = `/images/items/${d.id}.png`;
                  const pct = Math.round((d.chance||0)/10);
                  return (
                    <div key={d.id} className="flex items-center gap-1 text-[11px] opacity-85">
                      <img src={src} alt={d.id} className="w-5 h-5 object-contain rounded" onError={(e)=>{(e.target as HTMLImageElement).style.display='none';}}/>
                      <span>{d.id}</span><span className="opacity-60">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* NPC + afinidade */}
            <div className="mt-2 text-xs opacity-80 flex items-center gap-3">
              <div>Recompensas: {m.rewards.xp} XP • {m.rewards.coinsCopper}¢</div>
              <div className="ml-auto opacity-80">
                Companheiro: <span className="font-semibold">{m.npc?.name}</span> ({m.npc?.cls}, +{m.npc?.bonus}%)
                {m.npc?.name && (affinity[m.npc.name]||0) > 0 && <span className="ml-2"><Pill>Afinidade +{affinity[m.npc.name]}%</Pill></span>}
              </div>
            </div>

            {acceptingId === m.id ? (
              <div className="mt-3">
                <ProgressBar value={progress} />
                <div className="text-xs mt-1 opacity-75">{Math.round(progress)}% — Executando contrato...</div>
              </div>
            ) : (
              <div className="mt-3 flex items-center justify-between">
                <button onClick={()=>onAccept(m)} className="px-3 py-1.5 rounded bg-amber-500 text-black font-bold hover:bg-amber-400 shadow">
                  Aceitar (5s)
                </button>
                {lastResultMissionId===m.id && (
                  <div className="text-xs">
                    {lastDeltaHp<0 ? (
                      <span className="text-red-400">💔 {lastDeltaHp} HP</span>
                    ) : (
                      <span className="text-emerald-400">✔️ sem dano</span>
                    )}
                    {lastDurabilityHint && <span className="ml-2 text-red-300">🪓 -3% durabilidade</span>}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="text-amber-100 font-semibold mb-2">Histórico recente</div>
        {(state.guild.completedQuests||[]).length === 0 ? (
          <div className="text-xs opacity-70">Nenhuma missão concluída ainda.</div>
        ) : (
          <ul className="text-xs opacity-80 space-y-1">
            {(state.guild.completedQuests||[]).slice(-10).reverse().map((h:any)=> (
              <li key={h.at} className="flex items-center justify-between">
                <span>{new Date(h.at).toLocaleString()} — {h.id.split(':')[0]}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
