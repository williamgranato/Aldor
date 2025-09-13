'use client';
import React from 'react';
import { useMarket } from '@/hooks/useMarket';
import { useGame } from '@/context/GameProvider_aldor_client';
import { Market } from './Market';

function pouchToCopper(p:any){
  if(typeof p === 'number') return Math.max(0, Math.floor(p));
  const g = Math.floor(Math.max(0, p?.gold||0));
  const s = Math.floor(Math.max(0, p?.silver||0));
  const b = Math.floor(Math.max(0, p?.bronze||0));
  const c = Math.floor(Math.max(0, p?.copper||0));
  return g*10000 + s*100 + b*10 + c;
}

export function MarketProviderBridge(){
  const { state, addLootToInventory, giveCoins, touch } = useGame();

  const { items, buy } = useMarket({
    worldDateMs: state.world?.dateMs || Date.now(),
    playerLevel: state.player?.level || 1,
    coins: state.player?.coins || {},
    equipped: state.player?.equipment || {},
    providerActions: { addLootToInventory, giveCoins, touch }
  });

  const canAfford = (price:any)=>{
    const wallet = pouchToCopper(state.player?.coins||{});
    const cost = pouchToCopper(price);
    return wallet >= cost;
  };

  return <Market items={items} buy={buy} canAfford={canAfford}/>;
}
