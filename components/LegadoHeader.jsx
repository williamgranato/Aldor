"use client";
import Image from "next/image";
import { fmtCoins } from "../lib/currency";

export default function Header({ user, player, day, hour, season, rank }) {
  const coins = fmtCoins(player?.money ?? 0);
  return (
    <header className="bg-zinc-900/70 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border border-zinc-800 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
      <div className="flex flex-col">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 leading-tight">
          Aldória Guilds — {user}
        </h1>
        <p className="text-zinc-300">Dia {day}, {hour}h — {season} · {rank}</p>
      </div>
      <div className="flex flex-col md:items-end gap-2">
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-2"><Image src="/icons/gold.png" width={18} height={18} alt="Ouro"/><span>{coins.gold}</span></div>
          <div className="flex items-center gap-2"><Image src="/icons/silver.png" width={18} height={18} alt="Prata"/><span>{coins.silver}</span></div>
          <div className="flex items-center gap-2"><Image src="/icons/bronze.png" width={18} height={18} alt="Bronze"/><span>{coins.bronze}</span></div>
          <div className="flex items-center gap-2"><Image src="/icons/copper.png" width={18} height={18} alt="Cobre"/><span>{coins.copper}</span></div>
        </div>
      </div>
    </header>
  );
}