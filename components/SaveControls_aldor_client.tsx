'use client';
import { useRef } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';

export default function SaveControlsAldor(){
  const fileRef = useRef<HTMLInputElement|null>(null);
  const { state, exportSave, importSave, resetGame, lastSavedAt, isSaving } = useGame();

  function onImportClick(){ fileRef.current?.click(); }
  function onFile(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0];
    if (f) importSave(f);
  }

  function wipeAccount(){
    if (!confirm('Tem certeza? Isso vai DELETAR sua conta local e reiniciar o jogo.')) return;
    // reset state + clear localStorage via provider
    resetGame();
    // força re-render limpo
    setTimeout(()=>{ if (typeof window !== 'undefined') window.location.reload(); }, 50);
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <button className="px-3 py-1 rounded-md border border-zinc-700 hover:bg-zinc-800" onClick={()=>exportSave()}>
        Exportar Save
      </button>
      <button className="px-3 py-1 rounded-md border border-zinc-700 hover:bg-zinc-800" onClick={onImportClick}>
        Importar Save
      </button>
      <input ref={fileRef} type="file" className="hidden" onChange={onFile} />
      <button className="px-3 py-1 rounded-md border border-rose-800 text-rose-300 hover:bg-rose-900/20" onClick={wipeAccount}>
        Zerar Jogo (apagar conta)
      </button>
      <div className="opacity-60">| {isSaving ? 'salvando...' : lastSavedAt ? 'salvo' : 'ok'}</div>
    </div>
  );
}
