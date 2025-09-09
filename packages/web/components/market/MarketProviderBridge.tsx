'use client';
import { useEffect } from 'react';
import { useGame } from '@/providers/GameProvider';
export default function MarketProviderBridge(){
  const game = (()=>{ try{ return useGame(); }catch{ return null as any; } })();
  const actions = game?.actions;
  useEffect(()=>{
    function onBuy(e:any){ try{ actions?.market?.buy?.(e.detail.item, e.detail.finalPrice) }catch{} }
    function onCoins(e:any){ try{ actions?.coins?.deduct?.(e.detail.price) }catch{} }
    function onInv(e:any){ try{ actions?.inventory?.add?.(e.detail.item) }catch{} }
    function onSave(e:any){ try{ actions?.save?.autosave?.(e.detail.reason) }catch{} }
    window.addEventListener('market:buy', onBuy as any);
    window.addEventListener('coins:deduct', onCoins as any);
    window.addEventListener('inventory:add', onInv as any);
    window.addEventListener('save:autosave', onSave as any);
    return ()=>{
      window.removeEventListener('market:buy', onBuy as any);
      window.removeEventListener('coins:deduct', onCoins as any);
      window.removeEventListener('inventory:add', onInv as any);
      window.removeEventListener('save:autosave', onSave as any);
    }
  },[actions]);
  return null;
}
