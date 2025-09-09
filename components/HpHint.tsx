'use client';
import Tooltip from '@/components/Tooltip';
import { useGame } from '@/context/GameProvider_aldor_client';

export default function HpHint({ children }:{ children: React.ReactNode }){
  const { state } = useGame();
  const th = (state.player as any)?.settings?.autoPotionThreshold ?? 0.3;
  return <Tooltip label={`Auto-poção abaixo de ${Math.round(th*100)}%`}>{children}</Tooltip>;
}
