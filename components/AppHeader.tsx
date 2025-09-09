// components/AppHeader.tsx
'use client';
import { useGame } from '@/context/GameProvider_aldor_client';
import HeaderLegacy from '@/components/HeaderLegacy';
import HeaderModern from '@/components/HeaderModern';


function HeaderAuthControls(){
  try {
    const { user, currentSlotId, logout, selectSlot } = useAuth() as any;
    if (!user) return null;
    return (
      <div className="flex items-center gap-2">
        <button onClick={()=> selectSlot(null)} className="px-2 py-1 text-xs rounded-md border border-slate-600 hover:bg-slate-800" title="Trocar slot / save">Trocar save</button>
        <button onClick={()=> logout()} className="px-2 py-1 text-xs rounded-md border border-rose-700 text-rose-300 hover:bg-rose-900/30" title="Sair do jogo">Sair</button>
      </div>
    );
  } catch { return null; }
}

export default function AppHeader(){
  const { state } = useGame();
  const style = ((state as any).ui?.headerStyle) || 'modern';
  return style === 'legacy' ? <HeaderLegacy /> : <HeaderModern />;
}
