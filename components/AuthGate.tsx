'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider_aldor_client';
import { useGame } from '@/context/GameProvider_aldor_client';

function fmtDate(ms:number){ try{ const d=new Date(ms); return d.toLocaleString(); }catch{ return String(ms);} }

export default function AuthGate(){
  const { user, currentSlotId, createUser, login, logout, listSlots, loadSlot, saveSlot, deleteSlot, createNewCharacter, exportSlot } = useAuth();
  useGame(); // mantém compat com hooks de jogo; não usamos diretamente aqui

  const [mode, setMode] = useState<'login'|'signup'|'slots'|'hidden'>(!user ? 'login' : (currentSlotId ? 'hidden' : 'slots'));
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [newName, setNewName] = useState('');

  // Sincroniza modo com sessão (corrige F5)
  useEffect(()=>{
    if (user && currentSlotId) setMode('hidden');
    else if (user && !currentSlotId) setMode('slots');
    else setMode('login');
  }, [user?.id, currentSlotId]);

  const needAuth = !user;
  const needSlot = !!user && !currentSlotId;
  const show = (mode !== 'hidden') && (needAuth || needSlot);
  if (!show) return null;

  const slots = listSlots();

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-gradient-to-b from-slate-900 to-slate-800 p-6 shadow-xl">
        {!user && (mode==='login' || mode==='signup') && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{mode==='login' ? 'Entrar' : 'Criar conta'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={u} onChange={e=>setU(e.target.value)} placeholder="Usuário" className="bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2" />
              <input value={p} onChange={e=>setP(e.target.value)} type="password" placeholder="Senha" className="bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2" />
            </div>
            <div className="flex gap-2">
              {mode==='login' ? (
                <>
                  <button onClick={async()=>{ const ok=await login(u,p); if(ok) setMode('slots'); }} className="px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-700">Entrar</button>
                  <button onClick={()=>setMode('signup')} className="px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-700">Criar conta</button>
                </>
              ) : (
                <>
                  <button onClick={async()=>{ const created = await createUser(u,p); if(created) setMode('slots'); }} className="px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-700">Criar</button>
                  <button onClick={()=>setMode('login')} className="px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-700">Já tenho conta</button>
                </>
              )}
            </div>
          </div>
        )}

        {user && mode==='slots' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Escolher Personagem</h2>
              <div className="text-sm text-white/60">Usuário: <b>{user.username}</b></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {([1,2,3,4,5] as const).map(id=>{
                const sl = slots.find(s=>s.id===id);
                if (!sl) return (
                  <div key={id} className="rounded-xl border border-slate-700 p-4 bg-slate-900/50">
                    <div className="text-white/60 text-sm mb-2">Slot {id}</div>
                    <button onClick={async()=>{ const name = prompt('Nome do personagem', newName || 'Aventureiro') || 'Aventureiro'; setNewName(name); const r = await createNewCharacter(name); if(r.ok){ saveSlot(id as any, name); setMode('hidden'); } }} className="px-3 py-2 rounded-lg border border-slate-600 hover:bg-slate-700 w-full">Criar novo</button>
                  </div>
                );
                return (
                  <div key={id} className="rounded-xl border border-slate-700 p-4 bg-slate-900/50 space-y-2">
                    <div className="text-white/60 text-sm">Slot {id}</div>
                    <div className="text-lg font-medium">{sl.name || 'Personagem'}</div>
                    <div className="text-xs text-white/50">Atualizado: {fmtDate(sl.updatedAt)}</div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <button onClick={()=>{ loadSlot(id as any); setMode('hidden'); }} className="px-3 py-2 rounded-lg border border-slate-600 hover:bg-slate-700">Continuar</button>
                      <button onClick={()=>{ const n=prompt('Novo nome', sl.name||''); if(n) saveSlot(id as any, n); }} className="px-3 py-2 rounded-lg border border-slate-600 hover:bg-slate-700">Renomear</button>
                      <button onClick={()=> exportSlot(id as any)} className="px-3 py-2 rounded-lg border border-slate-600 hover:bg-slate-700">Exportar</button>
                      <button onClick={()=>{ if(confirm('Apagar este slot?')) deleteSlot(id as any); }} className="px-3 py-2 rounded-lg border border-rose-700 text-rose-300 hover:bg-rose-900/30">Apagar</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="text-white/60 text-xs">Dica: o jogo faz autosave depois de eventos-chave.</div>
              <button onClick={()=>{ logout(); setMode('login'); }} className="px-3 py-2 rounded-lg border border-slate-600 hover:bg-slate-700">Sair</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
