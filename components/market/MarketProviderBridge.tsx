'use client';
import React from 'react';
import { useDailyMarket } from '@/hooks/useDailyMarket';
import { useGame } from '@/context/GameProvider_aldor_client';
import { Market } from './Market';

export function MarketProviderBridge(){
  const { state, addLootToInventory, giveCoins, touch } = useGame();
  const { items, buy } = useDailyMarket({
    worldDateMs: state.world?.dateMs || Date.now(),
    playerLevel: state.player?.level || 1,
    coins: state.player?.coins || {},
    equipped: state.player?.equipment || {},
    slotId: state.slotId,
    season: state.world?.season,
    weather: state.world?.weather,
    temperature: state.world?.temperature,
    providerActions: { addLootToInventory, giveCoins, touch }
  });

  return <Market items={items} buy={buy}/>;
}
