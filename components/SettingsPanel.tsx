'use client';
import { useGame } from '@/context/GameProvider_aldor_client';

export default function SettingsPanel(){
  const { state, setState } = useGame();
  const prefs = (state.player as any).settings || {};
  const th = prefs.autoPotionThreshold ?? 0.3;
  const onlyLarge = !!prefs.useLargePotions;
  const maxAuto = prefs.maxAutoPotions ?? 2;

  function setPrefs(n:any){
    setState(s=>{
      const P:any = { ...s.player, settings:{ ...(s.player as any).settings, ...n } };
      return { ...s, player:P, updatedAt: Date.now() };
    });
  }

  return (
    <div className="rounded-xl border border-zinc-800 p-3 bg-zinc-900/40">
      <div className="font-semibold mb-2">Preferências</div>
      <div className="space-y-2 text-sm">
        <div>Auto-poção abaixo de: <b>{Math.round(th*100)}%</b> HP</div>
        <input type="range" min={0.1} max={0.7} step={0.05} value={th} onChange={(e)=>setPrefs({ autoPotionThreshold: parseFloat(e.target.value) })} className="w-full" />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={onlyLarge} onChange={(e)=>setPrefs({ useLargePotions: e.target.checked })} />
          Usar apenas poções grandes
        </label>
        <label className="flex items-center gap-2">
          Máx. auto-poções por combate:
          <input type="number" min={0} max={5} value={maxAuto} onChange={(e)=>setPrefs({ maxAutoPotions: parseInt(e.target.value||'0',10) })} className="w-16 bg-zinc-900 border border-zinc-700 rounded px-1 py-0.5" />
        </label>
      </div>
    </div>
  );
}
