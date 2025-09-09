'use client';
import Image from 'next/image';
import { rankColors, RankLetter } from '@/utils/rankStyle';

export default function RankBadge({ rank }: { rank: RankLetter }){
  const c = rankColors[rank] || rankColors['Sem Guilda'];
  const sparkle = (rank==='SS' || rank==='SSS') ? 'shadow-[0_0_24px_rgba(255,215,0,0.45)] ring-1 ring-amber-300/40' : '';
  return (
    <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1 ${c.bg} ${c.text} ${c.shadow} ${sparkle}`}>
      <Image src={`/images/ui/rank/${(rank==='Sem Guilda'?'NG':rank)}.png`} alt={rank} width={14} height={14} />
      {rank}
    </div>
  );
}
