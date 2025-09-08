'use client';
import React from 'react';
import LoginGate from '../../components/LoginGate';
import { useGame } from '../../context/GameProvider';

export default function MercadoPage() {
  const { state, buyItem, sellItem } = useGame();
  const catalog = state.market.catalog;

  return (
    <LoginGate>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Comprar</h2>
          <div className="space-y-2">
            {catalog.map(it => (
              <div key={it.id} className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm opacity-80">Preço: {it.valueCopper} cobre</div>
                </div>
                <button className="button" onClick={() => buyItem(it as any, 1)}>Comprar</button>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Vender</h2>
          <div className="space-y-2">
            {state.player.inventory.length===0 && <div className="opacity-70">Nada para vender.</div>}
            {state.player.inventory.map(it => (
              <div key={it.id} className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium">{it.name} {it.qty?`x${it.qty}`:''}</div>
                  <div className="text-sm opacity-80">Recebe ~{Math.floor((it.valueCopper||0)*0.6)} cobre</div>
                </div>
                <button className="button" onClick={() => sellItem(it.id, 1)}>Vender 1</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LoginGate>
  );
}
