'use client';
import { useGame } from '@/context/GameProvider_aldor_client';
import { useToasts } from '@/components/ToastProvider';
import RankBadge from '@/components/RankBadge';
import { rankColors } from '@/utils/rankStyle';
import Image from 'next/image';

// OBS: este arquivo é um exemplo de como disparar toasts. Ajuste se sua guilda já tiver outra estrutura de UI.
export default function GuildaPage(){
  const { state, undertakeQuest, completeQuest } = useGame();
  const { add } = useToasts();
  const myRank = state.guild.isMember ? state.player.adventurerRank : 'Sem Guilda';

  function doStart(q:any){
    const out = undertakeQuest(q);
    add({ type: out.win ? 'success' : 'warning', title: out.win?'Missão aceita':'Derrota', message: out.message });
  }

  function doComplete(id:string){
    completeQuest(id);
    add({ type:'success', title:'Missão concluída', message:'Recompensas recebidas.' });
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Guilda</h2>
      <div className="text-sm opacity-70 mb-3">Seu rank: {myRank}</div>
      {/* Aqui você plugaria sua lista de quests */}
      <div className="text-xs opacity-50">Plugue a UI real de missões aqui se já existir.</div>
    </div>
  );
}
