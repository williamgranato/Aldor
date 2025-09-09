'use client';
import React from 'react';
import { seasonGradient, weatherEmoji, Season } from '@/utils/seasonStyle';
import { useGame } from '@/context/GameProvider_aldor_client';

function fmtDate(d: Date){
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function TopStatusBar(){
  const { state } = useGame();
  // Espera: state.world = { dateMs, season, weather, temperatureC }
  const world:any = (state as any).world || {};
  const date = world.dateMs ? new Date(world.dateMs) : new Date();
  const season = (world.season || 'Primavera') as Season;
  const weather = world.weather || 'Ensolarado';
  const t = (typeof world.temperatureC === 'number' ? world.temperatureC : 22);

  return (
    <div className={`w-full border-b border-zinc-800 ${seasonGradient[season]}`}>
      <div className="max-w-5xl mx-auto px-4 py-1 flex items-center justify-between text-xs">
        <div className="opacity-90">📅 {fmtDate(date)}</div>
        <div className="opacity-90">🌿 {season}</div>
        <div className="opacity-90">{weatherEmoji[weather]} {weather} • 🌡️ {t}°C</div>
      </div>
    </div>
  );
}
