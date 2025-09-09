// components/HeaderLegacy.tsx
'use client';
import Image from 'next/image';
import { useGame } from '@/context/GameProvider_aldor_client';
import { useAuth } from '@/context/AuthProvider_aldor_client';
import { rankColors, rankLabel as rankLabelImported } from '@/utils/rankStyle';
import { CLASS_ICONS, RACE_ICONS } from '@/data/mushoku_expanded';

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

export default function HeaderLegacy(){
  const { state, setHeaderStyle } = useGame();
  const p = state.player;
  const r = (p.adventurerRank as any) || 'Sem Guilda';
  const c = (rankColors && (rankColors as any)[r]) || { text:'text-zinc-100', glow:'', bg:'', ring:'' };
  const rk = (p.character as any).roleKey || 'guerreiro';
  const rc = (p.character as any).raceKey || 'humano';

  return (
    <div className="w-full bg-black/90 border-b border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Aldor" width={36} height={36} className="rounded" />
          <div className="leading-tight">
            <div className="font-semibold text-zinc-100">{p.character?.name || 'Aventureiro'}</div>
            <div className="text-xs text-zinc-300 flex items-center gap-2">
              <span className={`px-1.5 py-0.5 rounded ${c.bg} ${c.text} shadow-md`}>{r}</span>
              <span className="opacity-80">Rank da Guilda:</span>
              <span className="opacity-90">{getRankLabel(r)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" title={p.character?.role || 'Classe'}>
            <Image src={CLASS_ICONS[rk]} alt="Classe" width={18} height={18} />
            <span className="text-sm">{p.character?.role || 'Classe'}</span>
          </div>
          <div className="flex items-center gap-1" title={p.character?.race || 'Raça'}>
            <Image src={RACE_ICONS[rc]} alt="Raça" width={18} height={18} />
            <span className="text-sm">{p.character?.race || 'Raça'}</span>
          </div>
          <button className="text-xs px-2 py-1 rounded border border-zinc-700 hover:bg-zinc-800" onClick={()=>setHeaderStyle('modern')}>Header Novo</button>
        </div>
      </div>
    </div>
  );
}
