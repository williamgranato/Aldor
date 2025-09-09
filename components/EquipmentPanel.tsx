'use client';
import { useGame } from '@/context/GameProvider_aldor_client';
import { equipItem, unequip } from '@/utils/equipment';

export default function EquipmentPanel(){
  const { state, setState } = useGame();
  const eq:any = (state.player as any).equipment || {};
  const inv = state.player.inventory || [];

  function doEquip(id:string){ setState(s=> equipItem(s, id)); }
  function doUnequip(slot:'weapon'|'armor'|'trinket'){ setState(s=> unequip(s, slot)); }

  return (
    <div className="rounded-xl border border-zinc-800 p-3 bg-zinc-900/40">
      <div className="font-semibold mb-2">Equipamentos</div>

      <div className="grid md:grid-cols-3 gap-3">
        {(['weapon','armor','trinket'] as const).map(sl=>(
          <div key={sl} className="rounded-lg border border-zinc-800 p-2">
            <div className="text-xs opacity-70 uppercase">{sl}</div>
            <div className="min-h-[2rem]">{eq[sl]?.name || <span className="opacity-60">vazio</span>}</div>
            {eq[sl] && <button className="text-xs rounded border border-zinc-700 px-2 py-1 mt-1" onClick={()=>doUnequip(sl)}>Remover</button>}
          </div>
        ))}
      </div>

      <div className="mt-3 text-sm opacity-80">Inventário (clicar para equipar):</div>
      <div className="grid md:grid-cols-3 gap-2 mt-2">
        {inv.filter((x:any)=>['weapon','armor','trinket'].includes(x.type)).map((x:any, i:number)=>(
          <button key={i} className="rounded border border-zinc-800 px-2 py-1 text-left hover:bg-zinc-900" onClick={()=>doEquip(x.id)}>
            {x.name} {x.qty?`×${x.qty}`:''}
          </button>
        ))}
      </div>
    </div>
  );
}
