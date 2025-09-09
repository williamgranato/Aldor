'use client';
import { useMemo } from 'react';
import { useGameV2State } from '../hooks/useGameV2State';
import { useGame } from '@/context/GameProvider_aldor_client';

export default function AuctionHouse(){
  const { state } = useGameV2State();
  const { buyItem, sellItem } = useGame();

  // Compat: alguns projetos antigos tinham state.auction
  // Se não existir, usamos o catálogo do mercado como "ofertas" básicas
  const catalog = state.market?.catalog || [];
  const offers = useMemo(() => {
    const legacy = (state as any).auction;
    if (Array.isArray(legacy) && legacy.length) return legacy;
    return catalog.map((it:any) => ({
      id: it.id,
      item: it.name,
      qty: 1,
      priceCopper: it.valueCopper || 0,
      _fromCatalog: true,
    }));
  }, [state, catalog]);

  function handleBuy(offer:any){
    if (offer._fromCatalog){
      const it = catalog.find((i:any) => i.id === offer.id);
      if (it) buyItem(it, 1);
    } else {
      // caso no futuro exista leilão real
      const it = catalog.find((i:any) => i.name === offer.item) || { id: offer.id, name: offer.item, valueCopper: offer.priceCopper };
      buyItem(it as any, 1);
    }
  }

  function handleSell(invItem:any){
    if (!invItem) return;
    sellItem(invItem.id, 1);
  }

  return (
    <div className="space-y-4">
      <div className="text-xl font-semibold">Casa de Leilões</div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-black/30 p-3">
          <div className="font-semibold mb-2">Ofertas</div>
          <div className="grid gap-2">
            {offers.length === 0 && <div className="opacity-70">Nenhuma oferta disponível.</div>}
            {offers.map((a:any)=>(
              <div key={a.id} className="rounded-2xl border border-zinc-800 bg-black/30 p-3 flex items-center justify-between">
                <div>
                  <div className="font-bold">{a.item} ×{a.qty}</div>
                  <div className="text-sm opacity-70">{a.priceCopper} cobre</div>
                </div>
                <button className="button" onClick={()=>handleBuy(a)}>Comprar</button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-black/30 p-3">
          <div className="font-semibold mb-2">Seu inventário</div>
          <div className="grid gap-2">
            {state.player?.inventory?.length ? state.player.inventory.map((it:any)=>(
              <div key={it.id} className="rounded-2xl border border-zinc-800 bg-black/30 p-3 flex items-center justify-between">
                <div>
                  <div className="font-bold">{it.name} ×{it.qty||1}</div>
                  <div className="text-sm opacity-70">Venda: ~{Math.floor((it.valueCopper||0)*0.6)} cobre</div>
                </div>
                <button className="button" onClick={()=>handleSell(it)}>Vender 1</button>
              </div>
            )) : <div className="opacity-70">Inventário vazio.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
