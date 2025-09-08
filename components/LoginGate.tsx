'use client';
import React, { useState } from 'react';
import { useGame } from '../context/GameProvider';

export default function LoginGate({ children }: { children: React.ReactNode }) {
  const { state, createCharacter } = useGame();
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('Federação de Asura');
  const [role, setRole] = useState('Aventureiro');

  if (state.player.character) return <>{children}</>;

  return (
    <div className="container my-10 card space-y-4">
      <h2 className="text-xl font-semibold">Criar Personagem</h2>
      <div className="space-y-2">
        <label className="block text-sm">Nome</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700" />
      </div>
      <div className="space-y-2">
        <label className="block text-sm">Origem</label>
        <input value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700" />
      </div>
      <div className="space-y-2">
        <label className="block text-sm">Papel</label>
        <input value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700" />
      </div>
      <button
        disabled={!name.trim()}
        onClick={() => createCharacter({ name: name.trim(), origin, role })}
        className="button disabled:opacity-40"
      >
        Começar Aventura
      </button>
      <p className="text-sm opacity-70">Seu progresso fica salvo automaticamente no navegador (localStorage). Você poderá exportar/importar o save.</p>
    </div>
  );
}
