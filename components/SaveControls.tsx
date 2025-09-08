'use client';
import React, { useRef } from 'react';
import { useGame } from '../context/GameProvider';

const formatTime = (t?: number) => t ? new Date(t).toLocaleTimeString() : '—';

export default function SaveControls() {
  const { exportSave, importSave, lastSavedAt, isSaving, resetGame } = useGame() as any;
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm rounded-xl border border-zinc-800/60 p-2 bg-black/30">
      <button className="button" onClick={() => exportSave()}>Exportar Save</button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) importSave(f);
        }}
      />
      <button className="button" onClick={() => inputRef.current?.click()}>Importar Save</button>
      <button className="px-3 py-1 rounded-lg border border-red-700 text-red-300 hover:bg-red-900/30"
        onClick={() => { if (confirm('Tem certeza? Isso zera todo o progresso.')) resetGame(); }}>
        Zerar Jogo
      </button>
      <div className="ml-auto flex items-center gap-2 opacity-80">
        <span>AutoSave:</span>
        <span className={isSaving ? 'animate-pulse text-green-400' : 'text-zinc-400'}>
          {isSaving ? 'salvando…' : 'ok'}
        </span>
        <span className="text-zinc-500">Último: {formatTime(lastSavedAt)}</span>
      </div>
    </div>
  );
}
