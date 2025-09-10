'use client';
import React from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';

export default function SaveManagerModal({ onClose }:{onClose:()=>void}){
  const { slot, setSlot, clearSlot } = useGame();
  const slots = [1,2,3,4,5];

  const renderSlot = (s:number)=>{
    const raw = typeof window!=='undefined' ? localStorage.getItem('aldor_save_slot_'+s) : null;
    if(!raw){
      return (
        <div key={s} className="p-2 border rounded bg-zinc-900/70">
          <div>Slot {s}: vazio</div>
          <button onClick={()=>{setSlot(s); onClose();}} className="px-2 py-1 bg-amber-600 text-black rounded mt-1">Criar novo</button>
        </div>
      );
    }
    const data = JSON.parse(raw);
    return (
      <div key={s} className="p-2 border rounded bg-zinc-900/70">
        <div>Slot {s}: {data.player?.character?.name} (Nível {data.player?.level}, Rank {data.player?.adventurerRank})</div>
        <div className="mt-1 flex gap-2">
          <button onClick={()=>{setSlot(s); onClose();}} className="px-2 py-1 bg-green-600 text-black rounded">Carregar</button>
          <button onClick={()=>{clearSlot(s); onClose();}} className="px-2 py-1 bg-red-600 text-black rounded">Excluir</button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-4 rounded-xl space-y-2 w-96">
        <h2 className="text-lg font-bold mb-2">Gerenciar Saves</h2>
        {slots.map(s=>renderSlot(s))}
        <button onClick={onClose} className="mt-3 px-3 py-1 bg-gray-600 rounded">Fechar</button>
      </div>
    </div>
  );
}
