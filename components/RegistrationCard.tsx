'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useGame } from '@/context/GameProvider_aldor_client';

const ORIGINS = ['Federação de Asura','Reino de Shirone','Continente Demoníaco','Millis','Basherant'];
const ROLES = ['Aventureiro','Guerreiro','Mago','Bardo','Alquimista','Caçador'];

export default function RegistrationCard(){
  const { createCharacter } = useGame();
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState(ORIGINS[0]);
  const [role, setRole] = useState(ROLES[0]);

  const canCreate = name.trim().length >= 2;

  function onSubmit(){
    if(!canCreate) return;
    createCharacter({ name: name.trim(), origin, role });
  }

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="absolute -top-4 left-6 z-10">
        <Image src="/images/ui/crest.png" alt="Emblema" width={54} height={54} className="drop-shadow" />
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-3">
        <div className="relative rounded-xl overflow-hidden border border-amber-900/50">
          <Image src="/images/ui/scroll.png" alt="Pergaminho" width={1200} height={600} className="w-full h-auto opacity-95" />
          <div className="absolute inset-0 p-5 sm:p-8 flex flex-col gap-4">
            <div className="text-center">
              <div className="text-xl font-semibold tracking-wide">Registro do Aventureiro</div>
              <div className="text-sm opacity-80">Você está <b>Sem Guilda</b>. Crie seu personagem para começar a jornada.</div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center justify-center">
                <div className="rounded-xl border border-amber-900/50 bg-black/30 p-2">
                  <Image src="/images/avatar.png" alt="Avatar" width={160} height={160} className="rounded-lg" />
                </div>
              </div>

              <div className="md:col-span-2 grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs opacity-80">Nome</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-amber-50/10 border border-amber-900/50 focus:outline-none focus:ring-2 focus:ring-amber-600"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    placeholder="Digite seu nome..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs opacity-80">País de Origem</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg bg-amber-50/10 border border-amber-900/50"
                    value={origin} onChange={(e)=>setOrigin(e.target.value)}
                  >
                    {ORIGINS.map(o=>(<option key={o} value={o}>{o}</option>))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs opacity-80">Classe</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg bg-amber-50/10 border border-amber-900/50"
                    value={role} onChange={(e)=>setRole(e.target.value)}
                  >
                    {ROLES.map(o=>(<option key={o} value={o}>{o}</option>))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs opacity-80">Descrição</label>
                  <textarea
                    className="w-full px-3 py-2 rounded-lg bg-amber-50/10 border border-amber-900/50 min-h-[76px]"
                    placeholder="Um breve histórico do seu aventureiro (opcional)"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2 text-xs opacity-80">
                <Image src="/images/ui/quill.png" alt="Pena" width={16} height={16} />
                <span>Assine o registro para dar início à sua lenda.</span>
              </div>
              <button
                className="px-4 py-2 rounded-lg border border-amber-900/60 bg-amber-800/30 hover:bg-amber-800/60"
                onClick={onSubmit}
                disabled={!canCreate}
              >
                <div className="flex items-center gap-2">
                  <span>Criar Personagem</span>
                  <Image src="/images/ui/seal-red.png" alt="Selo de cera" width={18} height={18} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
