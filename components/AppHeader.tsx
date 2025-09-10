'use client';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { useAuth } from '@/context/AuthProvider_aldor_client';
import SaveManagerModal from '@/components/SaveManagerModal';

const RANK_LABEL: Record<string,string> = {
  'F':'F – Iniciante','E':'E – Aprendiz','D':'D – Operário','C':'C – Veterano',
  'B':'B – Elite','A':'A – Mestre','S':'S – Herói','SS':'SS – Lenda','SSS':'SSS – Mítico','Sem Guilda':'Sem Guilda'
};
const SEASON_ICON: Record<string,string> = { 'Primavera':'🌸','Verão':'☀️','Outono':'🍂','Inverno':'❄️' };
const WEATHER_ICON: Record<string,string> = { 'Ensolarado':'☀️','Nublado':'☁️','Chuva':'🌧️','Neve':'❄️','Vento':'🌬️' };

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
  const { state } = useGame();
  const { logout } = useAuth();
  const player = state.player;
  const world = state.world;
  const season = world?.season || 'Primavera';
  const weather = world?.weather || 'Ensolarado';

  const [mounted,setMounted] = useState(false);
  const [clock,setClock] = useState<number>(0); // evita Date.now() no SSR
  const [showSaveManager,setShowSaveManager] = useState(false); // <<< faltava isso

  useEffect(()=>{
    setMounted(true);
    setClock(Date.now());
    const t=setInterval(()=>setClock(Date.now()),1000);
    return()=>clearInterval(t);
  },[]);

  const rank = player?.adventurerRank || 'Sem Guilda';
  const rankLabel = RANK_LABEL[rank] || rank;

  const xp = player?.xp || 0;
  const level = player?.level || 1;
  const hp = player?.stats?.hp || 0;
  const maxHp = player?.stats?.maxHp || 0;
  const stamina = player?.stamina?.current ?? 0;
  const maxStamina = player?.stamina?.max ?? 200;
  const coins = player?.coins || {gold:0,silver:0,bronze:0,copper:0};

  const staminaPct = useMemo(()=> Math.min(100, Math.max(0, Math.round((stamina / (maxStamina||1))*100))), [stamina,maxStamina]);

  return (
    <div className="w-full border-b border-zinc-800 text-zinc-100 bg-zinc-900/70">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Aldor" width={48} height={48} />
          <div>
            <div className="font-bold text-lg">{player?.character?.name || 'Aventureiro'}</div>
            <div className="text-sm opacity-90">Rank 🏅 {rankLabel} • Nível ⚔️ {level}</div>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center text-xs select-none">
          <div className="font-medium" suppressHydrationWarning>
            ⏰ {mounted ? formatDate(clock) : '—/—/— —:—:—'}
          </div>
          <div className="opacity-90" suppressHydrationWarning>
            {SEASON_ICON[season]} {season} • {WEATHER_ICON[weather]} {weather}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex flex-col gap-1 text-xs">
            <span>XP: {xp}</span>
            <span>HP: {hp}/{maxHp}</span>
            <span className="min-w-[180px]">Stamina: {stamina}/{maxStamina}</span>
            {/* Barra animada de stamina */}
            <div className="relative w-48 h-2.5 rounded-full overflow-hidden bg-zinc-800 ring-1 ring-black/40">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 transition-all duration-700 ease-out"
                style={{ width: `${staminaPct}%` }}
              />
              {/* brilho animado */}
              <div className="absolute inset-0 pointer-events-none mix-blend-screen">
                <div className="w-16 h-full bg-white/20 blur-md animate-pulse" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1"><Image src="/images/items/gold.png" alt="Ouro" width={16} height={16} />{coins.gold||0}</span>
            <span className="flex items-center gap-1"><Image src="/images/items/silver.png" alt="Prata" width={16} height={16} />{coins.silver||0}</span>
            <span className="flex items-center gap-1"><Image src="/images/items/bronze.png" alt="Bronze" width={16} height={16} />{coins.bronze||0}</span>
            <span className="flex items-center gap-1"><Image src="/images/items/copper.png" alt="Cobre" width={16} height={16} />{coins.copper||0}</span>
          </div>
          <button onClick={()=>setShowSaveManager(true)} className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-black text-xs">Trocar Save</button>
          <button onClick={logout} className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-black text-xs">Sair</button>
        </div>
      </div>
      {showSaveManager && <SaveManagerModal onClose={()=>setShowSaveManager(false)} />}
    </div>
  );
}
