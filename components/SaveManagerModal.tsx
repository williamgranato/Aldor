'use client';
import React from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';

export default function SaveManagerModal({ onClose }:{ onClose:()=>void }){
  const g:any = useGame();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-[min(420px,90vw)] rounded-2xl border border-amber-900/50 bg-amber-950/90 p-4 shadow-xl">
        <div className="text-lg font-semibold text-amber-200 mb-2">Deletar Conta</div>
        <div className="text-sm text-amber-100 mb-4">Deseja realmente deletar sua conta? Todo o progresso será perdido.</div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded bg-slate-700 text-white/80">Cancelar</button>
          <button onClick={()=>{ g.resetSave?.(); onClose(); }} className="px-3 py-1 rounded bg-red-700 text-white hover:bg-red-600">Deletar Conta</button>
        </div>
      </div>
    </div>
  );
}
