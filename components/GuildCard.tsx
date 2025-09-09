// components/GuildCard.tsx
'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useGame } from '@/context/GameProvider_aldor_client';
import { MT_REGIONS, MT_CLASSES, MT_RACES, CLASS_ICONS, RACE_ICONS } from '@/data/mushoku_expanded';

export default function GuildCard(){
  const { state, createGuildCard } = useGame();
  const isMember = state.guild.isMember;
  const card:any = (state.guild as any).memberCard;

  const [name, setName] = useState(state.player.character.name || '');
  const [origin, setOrigin] = useState('');
  const [roleKey, setRoleKey] = useState(MT_CLASSES[0].key as any);
  const [raceKey, setRaceKey] = useState(MT_RACES[0].key as any);
  const [msg, setMsg] = useState('');

  useEffect(()=>{
    if (state.player?.character?.name) setName(state.player.character.name);
  }, [state.player?.character?.name]);

  const roleLabel = useMemo(()=> MT_CLASSES.find(c=>c.key===roleKey)?.label || '', [roleKey]);
  const raceLabel = useMemo(()=> MT_RACES.find(r=>r.key===raceKey)?.label || '', [raceKey]);

  const onCreate = ()=>{
    const ok = createGuildCard({ name: name.trim(), origin, role: roleLabel, roleKey, race: raceLabel, raceKey });
    if(!ok){ setMsg('Saldo insuficiente para a taxa de inscrição (1 prata).'); }
  };

  if(isMember && card){
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="text-sm opacity-80 mb-2">Cartão do Aventureiro</div>
        <div className="grid md:grid-cols-2 gap-3 items-center">
          <div><b>Nome:</b> {card.name}</div>
          <div><b>Origem:</b> {card.origin}</div>
          <div className="flex items-center gap-2">
            <b>Classe:</b> <Image src={CLASS_ICONS[roleKey] || '/images/ui/classes/guerreiro.png'} alt="Classe" width={18} height={18} /> {card.role}
          </div>
          <div className="flex items-center gap-2">
            <b>Raça:</b> <Image src={RACE_ICONS[raceKey] || '/images/ui/races/humano.png'} alt="Raça" width={18} height={18} /> {card.race || raceLabel}
          </div>
          <div><b>Rank:</b> {card.rank}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">Inscrição na Guilda</div>
        <div className="text-sm flex items-center gap-1" title="Taxa de inscrição">
          <span>Taxa:</span>
          <Image src="/images/items/silver.png" alt="Prata" width={18} height={18} />
          <b>1</b>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        <div>
          <label className="text-xs opacity-80">Nome</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1" />
        </div>
        <div>
          <label className="text-xs opacity-80">Origem (Reino • Cidade)</label>
          <select value={origin} onChange={e=>setOrigin(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1">
            <option value="" disabled>Selecione uma cidade</option>
            {MT_REGIONS.map(r=>(
              <optgroup key={r.continente} label={r.continente}>
                {r.grupos.map(g=> g.cidades.map(c=>(
                  <option key={`${g.reino}-${c}`} value={`${g.reino} • ${c}`}>{g.reino} • {c}</option>
                )))}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs opacity-80">Classe</label>
          <div className="flex items-center gap-2">
            <Image src={CLASS_ICONS[roleKey] || '/images/ui/classes/guerreiro.png'} alt="Classe" width={20} height={20} />
            <select value={roleKey} onChange={e=>setRoleKey(e.target.value as any)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1">
              {MT_CLASSES.map(c=>(<option key={c.key} value={c.key as any}>{c.label}</option>))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs opacity-80">Raça</label>
          <div className="flex items-center gap-2">
            <Image src={RACE_ICONS[raceKey] || '/images/ui/races/humano.png'} alt="Raça" width={20} height={20} />
            <select value={raceKey} onChange={e=>setRaceKey(e.target.value as any)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1">
              {MT_RACES.map(r=>(<option key={r.key} value={r.key as any}>{r.label}</option>))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button onClick={onCreate} className="button">Criar Cartão</button>
        {msg && <div className="text-xs text-rose-300">{msg}</div>}
      </div>
    </div>
  );
}
