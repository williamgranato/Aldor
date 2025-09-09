// components/GuildMissionsCards.tsx
'use client';
import Image from 'next/image';
import { useGame } from '@/context/GameProvider_aldor_client';
import { rankColors } from '@/utils/rankStyle';

export default function GuildMissionsCards(){
  const { state, undertakeQuest } = useGame();
  const quests:any[] = state.guild.activeQuests || [];

  return (
    <div className="grid md:grid-cols-2 gap-3">
      {quests.map((q:any)=>{
        const c = rankColors[(q.requiredRank as any) || 'F'];
        return (
          <div key={q.id} className="relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="absolute -left-3 -top-3">
              <Image src={q.icon || '/images/ui/season/quest.png'} alt={q.monster||'Missão'} width={28} height={28} className="rounded-full border border-zinc-700" />
            </div>
            <span className={`absolute right-2 top-2 text-xs px-1.5 py-0.5 rounded ${c.bg} ${c.text}`}>{q.requiredRank}</span>
            <div className="font-semibold">{q.title}</div>
            <div className="text-xs opacity-80 mb-2">{q.description}</div>
            <button onClick={()=>undertakeQuest(q)} className="button">Aceitar</button>
          </div>
        );
      })}
    </div>
  );
}
