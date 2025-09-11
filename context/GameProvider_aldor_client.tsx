'use client';
import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext<any>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<any>({ player: { xp: 0, coins: { copper: 0 } } });

  function giveCoins(amount: { copper: number }){
    setState((s:any)=>({
      ...s,
      player: { ...s.player, coins: { copper: (s?.player?.coins?.copper ?? 0) + (amount?.copper ?? 0) } }
    }));
  }

  function giveXP(amount: number){
    setState((s:any)=>({
      ...s,
      player: { ...s.player, xp: (s?.player?.xp ?? 0) + (amount ?? 0) }
    }));
  }

  function ensureMemberCard(){
    setState((s:any)=>{
      const pid = s?.player?.id || s?.player?.playerId || s?.playerId || 'player';
      const prevGuild = s?.player?.guild ?? {};
      const nextGuild = {
        ...prevGuild,
        isMember: true,
        memberCardId: prevGuild?.memberCardId ?? `guildcard:${pid}`,
        memberSince: prevGuild?.memberSince ?? Date.now()
      };
      return { ...s, player: { ...s.player, guild: nextGuild } };
    });
  }

  return (
    <GameContext.Provider value={{ state, setState, giveCoins, giveXP, ensureMemberCard }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(){ return useContext(GameContext); }
