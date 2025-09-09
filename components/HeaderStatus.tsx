'use client';
import Image from 'next/image';
import { useGame } from '@/context/GameProvider_aldor_client';

export default function HeaderStatus(){
  const { state } = useGame();
  const coins = state.player?.coins || { gold:0, silver:0, bronze:0, copper:0 };
  const player = state.player || { level:1, xp:0 };
  const rank = state.guild?.isMember ? (state.player?.adventurerRank || 'F') : 'Sem Guilda';
  const expNeeded = 100 + player.level * 50;

  const Coin = ({src, alt, value}:{src:string; alt:string; value:number}) => (
    <div className="flex items-center gap-1">
      <Image src={src} alt={alt} width={18} height={18} />
      <span>{value}</span>
    </div>
  );

  return (
    <div className="flex items-center gap-4">
      <div>Nível: {player.level}</div>
      <div>XP: {player.xp} / {expNeeded}</div>
      <div>Rank: {rank}</div>
      <Coin src="/images/items/gold.png" alt="Ouro" value={coins.gold} />
      <Coin src="/images/items/silver.png" alt="Prata" value={coins.silver} />
      <Coin src="/images/items/bronze.png" alt="Bronze" value={coins.bronze} />
      <Coin src="/images/items/copper.png" alt="Cobre" value={coins.copper} />
    </div>
  );
}
