'use client';
import Image from 'next/image';
import { useMemo } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { useAuth } from '@/context/AuthProvider_aldor_client';
import { rankColors, rankLabel as rankLabelImported } from '@/utils/rankStyle';
import { CLASS_ICONS, RACE_ICONS } from '@/data/mushoku_expanded';
import Tooltip from '@/components/Tooltip';
import StatusBadges from '@/components/StatusBadges';

const FALLBACK_RANK_LABEL: Record<string,string> = {
  'Sem Guilda': 'Sem filiação',
  'F':'Iniciante','E':'Aprendiz','D':'Operário','C':'Veterano','B':'Elite','A':'Mestre','S':'Herói','SS':'Lenda','SSS':'Mítico'
};

function getRankLabel(r: string){
  const anyRL: any = rankLabelImported;
  if(typeof anyRL === 'function'){
    try { return anyRL(r) || FALLBACK_RANK_LABEL[r] || r; } catch { return FALLBACK_RANK_LABEL[r] || r; }
  }
  if(typeof anyRL === 'object' && anyRL){
    return anyRL[r] || FALLBACK_RANK_LABEL[r] || r;
  }
  return FALLBACK_RANK_LABEL[r] || r;
}

function formatDate(ms:number){
  const d = new Date(ms);
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

const seasonGrad: Record<string,string> = {
  'Primavera':'from-emerald-800/70 via-emerald-700/50 to-emerald-600/30',
  'Verão':'from-amber-800/70 via-amber-700/50 to-amber-600/30',
  'Outono':'from-orange-800/70 via-orange-700/50 to-orange-600/30',
  'Inverno':'from-sky-800/70 via-sky-700/50 to-sky-600/30',
};

export default function HeaderModern(){
  const { state } = useGame();
  const p = state.player;
  const r = (p.adventurerRank as any) || 'Sem Guilda';
  const c = (rankColors && (rankColors as any)[r]) || { text:'text-zinc-100', glow:'', bg:'', ring:'' };
  const rk = (p.character as any).roleKey || 'guerreiro';
  const rc = (p.character as any).raceKey || 'humano';

  const w:any = (state as any).world || { dateMs: Date.now(), season:'Primavera', weather:'Ensolarado', temperatureC:22 };
  const dateStr = formatDate(w.dateMs);
  const season = w.season; const weather = w.weather; const temp = w.temperatureC;

  const coins = p.coins || { gold:0, silver:0, bronze:0, copper:0 };

  const wrapGrad = useMemo(()=>{
    const g = seasonGrad[season] || 'from-zinc-900/80 via-zinc-800/60 to-zinc-700/40';
    return `bg-gradient-to-r ${g}`;
  },[season]);

  return (
    <div className={`w-full ${wrapGrad} backdrop-blur border-b border-zinc-800`}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Esquerda: Logo + Nome + Rank e Classe/Raça */}
        <div className="flex items-center gap-3 min-w-0">
          <Image src="/images/logo.png" alt="Aldor" width={44} height={44} className="rounded-xl ring-1 ring-black/40" />
          <div className="leading-tight min-w-0">
            <div className="font-semibold text-zinc-100 flex items-center gap-2 flex-wrap drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]">
              <span className="truncate">{p.character?.name || 'Aventureiro'}</span>
              <span className={`px-1.5 py-0.5 rounded ${c.bg} ${c.text} shadow-md`}>{r}</span>
              <span className="opacity-80 hidden md:inline">({getRankLabel(r)})</span>
            </div>
            <div className="text-xs text-zinc-200 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1" title={p.character?.role || 'Classe'}>
                <Image src={CLASS_ICONS[rk]} alt="Classe" width={16} height={16} /> {p.character?.role || 'Classe'}
              </span>
              <span className="flex items-center gap-1" title={p.character?.race || 'Raça'}>
                <Image src={RACE_ICONS[rc]} alt="Raça" width={16} height={16} /> {p.character?.race || 'Raça'}
              </span>
              <StatusBadges />
            </div>
          </div>
        </div>

        {/* Centro: Data • Estação • Clima • Temperatura */}
        <div className="hidden md:flex items-center gap-3">
          <div className="text-sm text-zinc-100/90">{dateStr}</div>
          <div className="rounded px-2 py-0.5 text-xs bg-black/20 ring-1 ring-black/30 shadow-inner">
            <span className="font-medium">{season}</span>
            <span className="mx-2 opacity-70">•</span>
            <span>{weather}</span>
            <span className="mx-1">•</span>
            <span>{temp}°C</span>
          </div>
        </div>

        {/* Direita: Carteira com Tooltips */}

          {/* Sessão: Trocar save / Sair */}
          {(() => { try {
            const { user, logout, selectSlot } = useAuth() as any;
            if (!user) return null;
            return (
              <div className="flex items-center gap-2 ml-2">
                <button onClick={()=> selectSlot(null)} className="px-2 py-1 text-xs rounded-md border border-slate-600 hover:bg-slate-800">Trocar save</button>
                <button onClick={()=> logout()} className="px-2 py-1 text-xs rounded-md border border-rose-700 text-rose-300 hover:bg-rose-900/30">Sair</button>
              </div>
            );
          } catch { return null; } })()}
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-sm">
            <Tooltip label="Ouro"><span className="flex items-center gap-1"><Image src="/images/items/gold.png" alt="Ouro" width={18} height={18} /> {coins.gold||0}</span></Tooltip>
            <Tooltip label="Prata"><span className="flex items-center gap-1"><Image src="/images/items/silver.png" alt="Prata" width={18} height={18} /> {coins.silver||0}</span></Tooltip>
            <Tooltip label="Bronze"><span className="flex items-center gap-1"><Image src="/images/items/bronze.png" alt="Bronze" width={18} height={18} /> {coins.bronze||0}</span></Tooltip>
            <Tooltip label="Cobre"><span className="flex items-center gap-1"><Image src="/images/items/copper.png" alt="Cobre" width={18} height={18} /> {coins.copper||0}</span></Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
