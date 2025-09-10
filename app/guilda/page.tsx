'use client';
// app/guilda/page.tsx
import GuildCard from '@/components/GuildCard';
import GuildBoard from '@/components/GuildBoard';
import MissionResultModal from '@/components/MissionResultModal';
import { useGame } from '@/context/GameProvider_aldor_client';

export default function GuildaPage(){
  const { state } = useGame();
  const isMember = state.guild.isMember;
  return (
    <div className="space-y-6">
      {!isMember && (
        <div className="rounded-xl border border-amber-900/40 bg-amber-950/30 p-4">
          <div className="font-semibold text-amber-200 mb-2">Bem-vindo, aventureiro!</div>
          <div className="text-sm opacity-90">Registre-se na Guilda para receber um Cartão de Aventureiro e desbloquear contratos oficiais. Taxa de inscrição: 1 Prata.</div>
        </div>
      )}
      <GuildCard />
      {isMember && <GuildBoard />}
      <MissionResultModal />
    </div>
  );
}