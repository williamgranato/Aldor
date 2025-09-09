'use client';
import Link from 'next/link';
import React from 'react';

export default function Main(){
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <Link href="/guilda" className="rounded-xl border border-zinc-800 bg-black/30 p-4 text-center hover:bg-zinc-800/30">Guilda</Link>
        <Link href="/mercado" className="rounded-xl border border-zinc-800 bg-black/30 p-4 text-center hover:bg-zinc-800/30">Mercado</Link>
        <Link href="/personagem" className="rounded-xl border border-zinc-800 bg-black/30 p-4 text-center hover:bg-zinc-800/30">Personagem</Link>
        <Link href="/praca" className="rounded-xl border border-amber-900/60 bg-amber-900/10 p-4 text-center hover:bg-amber-900/30">Praça</Link>
      </div>
      <div className="text-sm opacity-70">Dica: se ainda estiver Sem Guilda, visite a <b>Praça</b> para fazer tarefas e juntar bronze.</div>
    </div>
  );
}
