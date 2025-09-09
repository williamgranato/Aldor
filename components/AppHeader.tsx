// components/AppHeader.tsx
'use client';
import { useGame } from '@/context/GameProvider_aldor_client';
import HeaderLegacy from '@/components/HeaderLegacy';
import HeaderModern from '@/components/HeaderModern';

export default function AppHeader(){
  const { state } = useGame();
  const style = ((state as any).ui?.headerStyle) || 'modern';
  return style === 'legacy' ? <HeaderLegacy /> : <HeaderModern />;
}
