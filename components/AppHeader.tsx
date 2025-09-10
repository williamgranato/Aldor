'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { useAuth } from '@/context/AuthProvider_aldor_client';
import { seasonGradient } from '@/utils/seasonStyle';

const RANK_LABEL: Record<string,string> = {
  'F':'F – Iniciante',
  'E':'E – Aprendiz',
  'D':'D – Operário',
  'C':'C – Veterano',
  'B':'B – Elite',
  'A':'A – Mestre',
  'S':'S – Herói',
  'SS':'SS – Lenda',
  'SSS':'SSS – Mítico',
  'Sem Guilda':'Sem Guilda'
};

const SEASON_BG: Record<string,string> = {
  'Primavera':'/bg/spring.jpg',
  'Verão':'/bg/summer.jpg',
  'Outono':'/bg/autumn.jpg',
  'Inverno':'/bg/winter.jpg',
};

function formatDate(ms:number){
  const d = new Date(ms);
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2,'0');
  const nn = String(d.getMinutes()).padStart(2,'0');
  const ss = String(d.getSeconds()).padStart(2,'0');
  return `${dd}/${mm}/${yyyy} ${hh}:${nn}:${ss}`;
}

export default function AppHeader(){
  const { state, setState } = useGame();
  const { logout } = useAuth();
  const player = state.player;
  const world = state.world;
  const season = world?.season || 'Primavera';
  const weather = world?.weather || 'Ensolarado';

  const [clock,setClock] = useState(Date.now());
  useEffect(()=>{
    const t = setInterval(()=> setClock(Date.now()), 1000);
    return ()=> clearInterval(t);
  },[]);

  const rank = player?.adventurerRank || 'Sem Guilda';
  const rankLabel = RANK_LABEL[rank] || rank;

  const xp = player?.xp || 0;
  const level = player?.level || 1;
  const hp = player?.stats?.hp || 0;
  const maxHp = player?.stats?.maxHp || 0;
  const stamina = player?.stamina?.current || 0;
  const maxStamina = player?.stamina?.max || 0;
  const coins = player?.coins || {gold:0,silver:0,bronze:0,copper:0};

  const bg = SEASON_BG[season] || '/bg/spring.jpg';
  const grad = seasonGradient?.[season] || 'from-zinc-900';

  const handleLogout = ()=>{
    logout();
  };
  const handleSwitchSave = ()=>{
    if(typeof window!=='undefined') alert('Trocar save (implementar seleção de slot)');
  };

  return (
    <div className={`relative w-full border-b border-zinc-800 text-zinc-100`}>
      <div className="absolute inset-0 -z-10">
        <Image src={bg} alt="background" fill className="object-cover opacity-40" />
        <div className={`absolute inset-0 bg-gradient-to-r ${grad} opacity-70`} />
      </div>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Esquerda: Logo + Nome/Rank */}
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Aldor" width={48} height={48} className="rounded-lg ring-1 ring-black/40" />
          <div>
            <div className="font-bold text-lg">{player?.character?.name || 'Aventureiro'}</div>
            <div className="text-sm opacity-90">{rankLabel} • Nível {level}</div>
          </div>
        </div>

        {/* Centro: Relógio, estação e clima */}
        <div className="hidden md:flex flex-col items-center text-xs select-none" suppressHydrationWarning>
          <div className="font-medium">{formatDate(clock)}</div>
          <div className="opacity-90">{season} • {weather}</div>
        </div>

        {/* Direita: status e botões */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex flex-col gap-1 text-xs">
            <span>XP: {xp}</span>
            <span>HP: {hp}/{maxHp}</span>
            <span>Stamina: {stamina}/{maxStamina}</span>
          </div>
          <div className="flex items-center gap-2">
            <span title="Ouro" className="flex items-center gap-1"><Image src="/images/items/gold.png" alt="Ouro" width={16} height={16} />{coins.gold||0}</span>
            <span title="Prata" className="flex items-center gap-1"><Image src="/images/items/silver.png" alt="Prata" width={16} height={16} />{coins.silver||0}</span>
            <span title="Bronze" className="flex items-center gap-1"><Image src="/images/items/bronze.png" alt="Bronze" width={16} height={16} />{coins.bronze||0}</span>
            <span title="Cobre" className="flex items-center gap-1"><Image src="/images/items/copper.png" alt="Cobre" width={16} height={16} />{coins.copper||0}</span>
          </div>
          <button onClick={handleSwitchSave} className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-black text-xs">Trocar Save</button>
          <button onClick={handleLogout} className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-black text-xs">Sair</button>
        </div>
      </div>
    </div>
  );
}
