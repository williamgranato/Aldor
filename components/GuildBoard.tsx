'use client';
import Image from 'next/image';
import { useMemo } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { pickDailyMissions } from '@/utils/dailyQuests_aldor_client';
import { rankColors } from '@/utils/rankStyle';
import { ITEMS } from '@/data/items_catalog';
import { useToasts } from '@/components/ToastProvider';
import { simulateCombat } from '@/utils/combat_aldor_client';

function coinFmt(c:number){ return `${c} cobre`; }

const RANK_STRIPE: Record<string,string> = {
  'F':'bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.04),rgba(255,255,255,0.04) 6px,transparent 6px,transparent 12px)]',
  'E':'bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.06),rgba(255,255,255,0.06) 6px,transparent 6px,transparent 12px)]',
  'D':'bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.08),rgba(255,255,255,0.08) 6px,transparent 6px,transparent 12px)]',
  'C':'bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.10),rgba(255,255,255,0.10) 6px,transparent 6px,transparent 12px)]',
  'B':'bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.12),rgba(255,255,255,0.12) 6px,transparent 6px,transparent 12px)]',
  'A':'bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.14),rgba(255,255,255,0.14) 6px,transparent 6px,transparent 12px)]',
  'S':'bg-[repeating-linear-gradient(45deg,rgba(255,255,200,0.18),rgba(255,255,200,0.18) 6px,transparent 6px,transparent 12px)]',
  'SS':'bg-[repeating-linear-gradient(45deg,rgba(255,230,150,0.20),rgba(255,230,150,0.20) 6px,transparent 6px,transparent 12px)]'
};

export default function GuildBoard(){
  const { state, setState, undertakeQuest } = useGame();
  const { add } = useToasts();
  const w:any = (state as any).world || { dateMs: Date.now(), season:'Primavera', weather:'Ensolarado' };
  const dayKey = new Date(w.dateMs).toISOString().slice(0,10);

  const list = useMemo(()=> pickDailyMissions(state.player.adventurerRank as any, dayKey, { season:w.season, weather:w.weather }), [state.player.adventurerRank, dayKey, w.season, w.weather]);

  const rankColor = (r:string)=> (rankColors as any)[r]?.bg || 'bg-zinc-700';

  function previewDrops(d:any[]){
    return d.slice(0,3).map((x,i)=>{
      const it = ITEMS.find(y=>y.id===x.id);
      const chance = (x.chance/100).toFixed(2)+'%';
      return <div key={i} className="text-xs opacity-90">{it?.name||x.id} <span className="opacity-70">({chance})</span></div>;
    });
  }

  function enemyByRank(r:string){
    const map:any = {
      'F': { name:'Rato Grande', hp:20, attack:5, defense:2 },
      'E': { name:'Lobo', hp:28, attack:7, defense:3 },
      'D': { name:'Goblins', hp:36, attack:9, defense:4 },
      'C': { name:'Basilisco Jovem', hp:50, attack:12, defense:6 },
      'B': { name:'Grifo', hp:70, attack:16, defense:8 },
      'A': { name:'Hidra Menor', hp:90, attack:20, defense:10 },
      'S': { name:'Dragão Jovem', hp:120, attack:26, defense:12 },
      'SS': { name:'Dragão Ancião', hp:160, attack:32, defense:16 }
    };
    return map[r] || map['F'];
  }

  function accept(m:any){
    // Simula um combate curto antes de concluir a missão
    const e = enemyByRank(m.rank);
    const res = simulateCombat(state.player, e, { difficultyMultiplier: m.difficulty, autoPotionThreshold: 0.35 });
    setState(s=> ({ ...s, player: { ...s.player, stats: { ...s.player.stats, hp: Math.max(1, res.php) } }, updatedAt: Date.now() }));
    if(res.win){
      const ok = undertakeQuest({
        id: m.id, title: m.title, requiredRank: m.rank,
        rewards: { coinsCopper: m.rewards.coinsCopper, xp: m.rewards.xp }
      } as any);
      if(ok.win){
        add({ type:'success', title:'Contrato concluído!', message:`${m.title} • Recompensa: ${coinFmt(m.rewards.coinsCopper)} • +${m.rewards.xp} XP` });
      }else{
        add({ type:'error', title:'Falha', message: ok.message || 'Não foi possível registrar a conclusão.' });
      }
    }else{
      // aplica status negativo leve ao perder
      setState(s=>{
        const P:any = { ...s.player };
        const status = [...(P.status||[])];
        status.push({ k:'sangramento', until: Date.now()+60_000 });
        P.status = status;
        return { ...s, player:P, updatedAt: Date.now() };
      });
      add({ type:'error', title:'Derrota', message:`${e.name} foi forte demais. Você retornou ferido.` });
    }
  }

  return (
    <div className="rounded-2xl border border-amber-900/40 bg-gradient-to-b from-zinc-900 via-zinc-900/70 to-zinc-900/40 p-4">
      <div className="mb-3 font-semibold text-amber-200 drop-shadow">Mural de Contratos</div>
      <div className="grid md:grid-cols-2 gap-3">
        {list.map((m:any)=>(
          <div key={m.id} className={`relative overflow-hidden rounded-xl border border-zinc-800 p-3 bg-[url('/images/ui/paper_texture.png')] bg-cover bg-center ${RANK_STRIPE[m.rank]||''}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium drop-shadow">{m.title}</div>
              <span className={`px-1.5 py-0.5 rounded ${rankColor(m.rank)} text-zinc-50 text-xs shadow`}>{m.rank}</span>
            </div>
            <div className="text-sm opacity-90">{m.desc}</div>
            <div className="mt-1 text-xs opacity-80 flex items-center gap-3">
              <span className="flex items-center gap-1"><Image src="/images/ui/status/poison.png" width={14} height={14} alt="veneno"/> risco</span>
              <span className="flex items-center gap-1"><Image src="/images/ui/status/bleed.png" width={14} height={14} alt="sangramento"/> risco</span>
            </div>
            <div className="mt-2 text-sm">
              <div>Recompensa: <b>{coinFmt(m.rewards.coinsCopper)}</b> • +{m.rewards.xp} XP</div>
              <div className="mt-1">Drops possíveis:</div>
              <div className="grid grid-cols-2 gap-x-3">{previewDrops(m.drops)}</div>
            </div>
            <div className="mt-3">
              <button className="button" onClick={()=>accept(m)}>Aceitar Contrato</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
