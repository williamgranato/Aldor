'use client';
import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameProvider_aldor_client';

export default function DebugOverlay(){
  const { state } = useGame();
  const [visible,setVisible] = useState(false);

  useEffect(()=>{
    const onKey = (e:KeyboardEvent)=>{ if(e.key==='F9') setVisible(v=>!v); };
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  const completed = state.guild?.completedQuests?.length || 0;
  return (
    <div className="fixed bottom-2 right-2 text-xs z-50 pointer-events-auto">
      <button onClick={()=>setVisible(!visible)} className="bg-zinc-800 text-white px-2 py-1 rounded shadow">
        {visible?'Fechar Debug (F9)':'Abrir Debug (F9)'}
      </button>
      {visible && (
        <div className="mt-2 p-2 bg-black/80 text-green-300 rounded max-h-72 overflow-y-auto w-72 shadow-xl backdrop-blur">
          <div><strong>Player ID:</strong> {state.player?.id||'—'}</div>
          <div><strong>Rank:</strong> {String(state.player?.adventurerRank||'—')}</div>
          <div><strong>Contratos concl.:</strong> {completed}</div>
          <div className="mt-1"><strong>Afinidade Missões</strong>
            <pre className="whitespace-pre-wrap">{JSON.stringify((state.player as any)?.missionAffinity||{}, null, 2)}</pre>
          </div>
          <div className="mt-1"><strong>Afinidade NPC</strong>
            <pre className="whitespace-pre-wrap">{JSON.stringify((state.player as any)?.npcAffinity||{}, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
