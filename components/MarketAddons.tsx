'use client';
import React, { useMemo, useState } from 'react';
import { generateFlashOffers, applyReputationDiscount, haggle, ReputationEntry } from '@/data/market_addons';
import { getItemImagePath } from '@/utils/images';

type Props = {
  catalog: any[];
  merchantId?: string;
  carisma?: number;
  reputationList?: ReputationEntry[];
  onBuy?: (itemId: string, priceCopper: number, merchantId: string) => void;
  onReputation?: (merchantId: string, delta: number) => void;
};

export default function MarketAddons({ catalog, merchantId = 'mercador_geral', carisma = 0, reputationList = [], onBuy, onReputation }: Props){
  const [offerIdx, setOfferIdx] = useState<number|null>(null);
  const rep = reputationList.find(r => r.merchantId === merchantId)?.value || 0;

  const offers = useMemo(()=> generateFlashOffers(new Date(), catalog as any, merchantId), [catalog, merchantId]);

  const buy = (idx: number, price: number)=>{
    const off = offers[idx];
    onBuy?.(off.item.id, price, merchantId);
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl p-3 border border-white/10 bg-white/5">
        <h3 className="font-semibold text-lg">Ofertas-relâmpago</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
          {offers.map((o, i)=>{
            const repPrice = applyReputationDiscount(o.priceCopper, rep);
            return (
              <div key={i} className="rounded-xl p-3 border border-white/10 bg-black/20">
                <div className="flex items-center gap-3">
                  <img src={getItemImagePath(o.item.image)} alt={o.item.name} className="w-12 h-12 object-contain rounded" />
                  <div className="flex-1">
                    <div className="text-sm opacity-80">{o.item.name}</div>
                    <div className="text-xs opacity-60 line-through">{o.originalPriceCopper}¢</div>
                    <div className="text-base font-semibold">{repPrice}¢ <span className="text-xs opacity-70">(-{o.discountPct}% + rep)</span></div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                  <span>Estoque: {o.stock}</span>
                  <span>Expira: {new Date(o.expiresAt).toLocaleTimeString()}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500" onClick={()=> buy(i, repPrice)}>Comprar</button>
                  <button className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500" onClick={()=> setOfferIdx(i)}>Pechinchar</button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {offerIdx !== null && (
        <HaggleModal
          key={offerIdx}
          basePrice={applyReputationDiscount(offers[offerIdx].priceCopper, rep)}
          onClose={()=> setOfferIdx(null)}
          onResult={(res)=>{
            onReputation?.(merchantId, res.deltaRep);
            buy(offerIdx!, res.priceCopper);
            setOfferIdx(null);
          }}
          carisma={carisma}
          merchantId={merchantId}
        />
      )}
    </div>
  );
}

function HaggleModal({ basePrice, onClose, onResult, carisma=0 }: { basePrice: number; carisma?: number; merchantId: string; onClose: ()=>void; onResult: (r: { priceCopper: number; deltaRep: number; success: boolean })=>void; }){
  const [loading, setLoading] = useState(false);
  const [outcome, setOutcome] = useState<{success:boolean; priceCopper:number; deltaRep:number; roll:number; threshold:number} | null>(null);
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md rounded-2xl p-4 bg-zinc-900 border border-white/10">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Pechincha</h4>
          <button className="text-sm opacity-70 hover:opacity-100" onClick={onClose}>Fechar</button>
        </div>
        <p className="text-sm opacity-80 mt-2">Preço base atual: <b>{basePrice}¢</b></p>
        {!outcome && (
          <button
            className="mt-3 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
            disabled={loading}
            onClick={()=>{
              setLoading(true);
              const r = haggle(basePrice, carisma, 0);
              setOutcome(r as any);
              setLoading(false);
            }}
          >
            Tentar negociar
          </button>
        )}
        {outcome && (
          <div className="mt-3 text-sm">
            <div>Resultado: {outcome.success ? 'Sucesso' : 'Falha'}</div>
            <div>Novo preço: <b>{outcome.priceCopper}¢</b></div>
            <div className="opacity-60">roll={outcome.roll.toFixed(3)} vs thr={outcome.threshold.toFixed(3)}</div>
            <button className="mt-3 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500" onClick={()=> onResult(outcome)}>Confirmar compra</button>
          </div>
        )}
      </div>
    </div>
  );
}
