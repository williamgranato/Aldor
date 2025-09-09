'use client';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';
import { generateMarketStock } from '@/utils/marketGen';
import { RARITY_COLORS, RARITY_RING } from '@/data/rarities';
import { useToasts } from '@/components/ToastProvider';
import useClientReady from '@/hooks/useClientReady';

// Deterministic PRNG
function mulberry32(a:number){ return function(){ let t = a += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; } }
function seededShuffle<T>(arr:T[], seed:number){
  const a = [...arr]; const rnd = mulberry32(seed|0);
  for(let i=a.length-1;i>0;i--){ const j = Math.floor(rnd()*(i+1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export default function MercadoPage(){
  const { state, addItem, takeCoins } = useGame();
  const { add } = useToasts();
  const ready = useClientReady();

  const xp = state.player.xp;
  const world:any = (state as any).world || { dateMs: Date.now() };
  const [refresh, setRefresh] = useState(0);

  const stock = useMemo(()=>{
    // seed derivado do dia + refresh para ser estável entre SSR/CSR após mount
    const dayKey = new Date(world.dateMs).toISOString().slice(0,10).replace(/-/g,'');
    const base = generateMarketStock(xp, 24);
    const shuffled = seededShuffle(base, Number(dayKey) + refresh*97);
    return shuffled.slice(0,18);
  }, [xp, world.dateMs, refresh]);

  function buy(entry:any){
    const ok = takeCoins({ copper: entry.priceCopper });
    if(!ok){ add({ type:'error', title:'Saldo insuficiente', message:`Custa ${entry.priceCopper} cobre.`}); return; }
    addItem({ id: entry.id, name: entry.name, type: entry.type, valueCopper: entry.valueCopper, qty:1, attrs: entry.attrs } as any, 1);
    add({ type:'success', title:'Compra efetuada', message:`${entry.name} (${entry.rarity})` });
  }

  if(!ready){
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Mercado</div>
          <div className="text-xs opacity-70">carregando ofertas…</div>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="rounded-xl border border-zinc-800 p-3 bg-zinc-900/40 h-28 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Mercado</div>
        <button className="text-xs rounded border border-zinc-700 px-2 py-1 hover:bg-zinc-800" onClick={()=>setRefresh(r=>r+1)}>Atualizar ofertas</button>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {stock.map((e,i)=>(
          <div key={i} className={`rounded-xl border border-zinc-800 p-3 bg-zinc-900/40 ring-1 ${RARITY_RING[e.rarity]}`}>
            <div className="flex items-center justify-between">
              <div className={`font-medium capitalize ${RARITY_COLORS[e.rarity]}`}>{e.name}</div>
              <div className="text-xs opacity-80 capitalize">{e.rarity}</div>
            </div>
            <div className="text-xs opacity-80">{e.type}</div>
            {e.attrs && (
              <div className="mt-1 text-xs">
                {e.attrs.atk ? <div>ATK +{e.attrs.atk}</div> : null}
                {e.attrs.def ? <div>DEF +{e.attrs.def}</div> : null}
                {e.attrs.hp ? <div>HP +{e.attrs.hp}</div> : null}
                {e.attrs.crit ? <div>CRIT +{e.attrs.crit}</div> : null}
              </div>
            )}
            <div className="mt-2 text-sm flex items-center gap-1">
              <Image src="/images/items/copper.png" alt="Cobre" width={16} height={16} /> {e.priceCopper}
            </div>
            <div className="mt-2">
              <button className="button" onClick={()=>buy(e)}>Comprar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
