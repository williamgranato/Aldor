'use client';
import { useGame } from '@/context/GameProvider_aldor_client';

/**
 * Hook utilitário que padroniza a aplicação de recompensas (XP e moedas)
 * sem depender do nome das funções existentes no provider.
 * - Usa setState diretamente para alterar player.xp e player.coins.copper
 * - Mantém o autosave por slot (que já observa mudanças de state)
 */
export function useRewards(){
  const { state, setState, giveXP, addXP, giveCoins, addCoins } = (useGame() as any);

  function awardXP(amount: number){
    if (!amount) return;
    // Se o provider tiver função explícita, usa; senão, atualiza via setState (compat)
    if (typeof giveXP === 'function') return giveXP(amount);
    if (typeof addXP === 'function')  return addXP(amount);
    setState((s: any) => ({
      ...s,
      player: { 
        ...s.player,
        xp: (s?.player?.xp ?? 0) + amount
      }
    }));
  }

  function awardCopper(copper: number){
    if (!copper) return;
    if (typeof giveCoins === 'function') return giveCoins({ copper });
    if (typeof addCoins === 'function')  return addCoins({ copper });
    setState((s: any) => ({
      ...s,
      player: {
        ...s.player,
        coins: { copper: ((s?.player?.coins?.copper ?? 0) + copper) }
      }
    }));
  }

  function awardAll(rewards: any){
    if (!rewards) return;
    const xp = rewards?.xp ?? 0;
    const copper = (rewards?.copper ?? 0) + (rewards?.coins?.copper ?? 0);
    if (xp) awardXP(xp);
    if (copper) awardCopper(copper);
  }

  return { awardXP, awardCopper, awardAll };
}
