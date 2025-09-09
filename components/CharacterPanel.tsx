'use client';
import Image from 'next/image';
import Tooltip from '@/components/Tooltip';
import { useGame } from '@/context/GameProvider_aldor_client';
import { rankColors, rankLabel as rankLabelImported } from '@/utils/rankStyle';

const FALLBACK_RANK_LABEL: Record<string,string> = {
  'Sem Guilda':'Sem filiação',
  'F':'Iniciante','E':'Aprendiz','D':'Operário','C':'Veterano','B':'Elite','A':'Mestre','S':'Herói','SS':'Lenda','SSS':'Mítico'
};
function rankLabel(r:string){
  const anyRL:any = rankLabelImported;
  if(typeof anyRL==='function'){ try { return anyRL(r) || FALLBACK_RANK_LABEL[r] || r; } catch { return FALLBACK_RANK_LABEL[r] || r; } }
  if(typeof anyRL==='object' && anyRL) return anyRL[r] || FALLBACK_RANK_LABEL[r] || r;
  return FALLBACK_RANK_LABEL[r] || r;
}
function clamp(n:number, a:number, b:number){ return Math.max(a, Math.min(b, n)); }

export default function CharacterPanel(){
  const { state } = useGame();
  const p = state.player;
  const coins = p.coins || { gold:0, silver:0, bronze:0, copper:0 };
  const lvl = p.level || 1;
  const xp = p.xp || 0;
  const xpNeeded = 100 + lvl * 50;
  const xpPct = clamp(Math.round((xp / xpNeeded) * 100), 0, 100);
  const r = (p.adventurerRank as any) || 'Sem Guilda';
  const c = (rankColors as any)?.[r] || { text:'text-zinc-50', bg:'bg-zinc-800', ring:'ring-zinc-700' };

  const attrs = p.attributes || {};

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-r from-purple-900/40 via-fuchsia-900/30 to-indigo-900/30 ring-1 ring-white/5">
      {/* ornamento */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_200px_at_-10%_-20%,rgba(255,255,255,0.08),transparent)]" />
      <div className="flex items-center gap-4 p-4">
        <div className="shrink-0">
          <Image src="/images/avatar.png" alt="Avatar" width={88} height={88} className="rounded-xl ring-1 ring-black/40" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-lg font-semibold text-zinc-50 truncate">{p.character?.name || 'Aventureiro'}</div>
            <span className={`text-xs px-2 py-0.5 rounded ${c.bg} ${c.text} shadow`}>{r}</span>
            <span className="text-xs text-zinc-300">({rankLabel(r)})</span>
          </div>
          <div className="mt-1 text-sm text-zinc-200 flex items-center gap-4 flex-wrap">
            <div>Nível: <b>{lvl}</b></div>
            <div>XP: <b>{xp}</b> / {xpNeeded}</div>
          </div>
          <div className="mt-2 h-2 w-full rounded bg-zinc-800/60 overflow-hidden ring-1 ring-black/30">
            <div className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200" style={{ width: `${xpPct}%` }} />
          </div>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-zinc-200">
            <div className="rounded-lg bg-black/20 border border-zinc-800 p-2">Força: <b>{attrs.strength||0}</b></div>
            <div className="rounded-lg bg-black/20 border border-zinc-800 p-2">Agilidade: <b>{attrs.agility||0}</b></div>
            <div className="rounded-lg bg-black/20 border border-zinc-800 p-2">Vitalidade: <b>{attrs.vitality||0}</b></div>
            <div className="rounded-lg bg-black/20 border border-zinc-800 p-2">Sorte: <b>{attrs.luck||0}</b></div>
          </div>
        </div>
        <div className="shrink-0">
          <div className="rounded-xl bg-black/30 border border-zinc-800 p-3 text-sm text-zinc-100">
            <div className="font-medium mb-1 text-zinc-200">Carteira</div>
            <div className="space-y-1">
              <Tooltip label="Ouro"><div className="flex items-center gap-2"><Image src="/images/items/gold.png" alt="Ouro" width={18} height={18} /> {coins.gold||0}</div></Tooltip>
              <Tooltip label="Prata"><div className="flex items-center gap-2"><Image src="/images/items/silver.png" alt="Prata" width={18} height={18} /> {coins.silver||0}</div></Tooltip>
              <Tooltip label="Bronze"><div className="flex items-center gap-2"><Image src="/images/items/bronze.png" alt="Bronze" width={18} height={18} /> {coins.bronze||0}</div></Tooltip>
              <Tooltip label="Cobre"><div className="flex items-center gap-2"><Image src="/images/items/copper.png" alt="Cobre" width={18} height={18} /> {coins.copper||0}</div></Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
