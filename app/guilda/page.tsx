'use client';
import React, { useEffect, useState } from 'react';
import { ScrollText, Award, Landmark, Users, Star, Zap, Shield, CheckCircle2, XCircle } from 'lucide-react';
import { useGame } from '@/context/GameProvider_aldor_client';
import MissionCard from '@/components/guild/MissionCard';
import { getGuildMissions } from '@/data/missoes';
import { useToasts } from '@/components/ToastProvider';

type Rank = 'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'|'SSS';

const REPUTATION_TITLES = [
  'Forasteiro','Conhecido','Aliado','Companheiro','Protetor da Vila',
  'Campeão Regional','Herói Local','Defensor de Aldoria','Lenda Viva','Símbolo Eterno'
];

export default function GuildPage(){
  const { state, spendStamina, giveXP, giveCoins, completeGuildMission, addLootToInventory, ensureMemberCard } = useGame();
  const { add } = useToasts();
  const [missions,setMissions] = useState<any[]>([]);
  const [rankFilter,setRankFilter] = useState<string>('Todos');

  const rank: Rank = (state.guild?.memberCard?.rank || 'F') as Rank;
  const isMember = !!state.guild?.isMember;

  useEffect(()=>{
    setMissions(getGuildMissions(rank));
  },[rank]);

  const reputationTitle = ()=>{
    const rep = state.guild?.reputation || 0;
    const step = Math.min(REPUTATION_TITLES.length-1, Math.floor(rep/100));
    return REPUTATION_TITLES[step];
  };

  // chance de sucesso baseada nos atributos
  const successChance = (mission:any)=>{
    const stats = state.player.stats || {};
    const atk = stats.atk || 0;
    const def = stats.defense || 0;
    const hp = stats.maxHp || 0;
    const shield = stats.shield || 0;
    const df = mission.difficulty || 10;
    let chanceBase = 50 + ((atk*0.4 + def*0.3 + (hp/10)*0.2 + shield*0.1) - df);
    // Afinidade: se o provider tiver histórico por missão, poderemos ler aqui; por ora sem afinidade adicional
    let chanceFinal = Math.max(5, Math.min(100, chanceBase));
    return chanceFinal;
  };

  const handleMission = (mission:any)=>{
    const cost = mission.cost || 5;
    if(state.player.stamina.current < cost){
      add({ type:'error', title:'Sem Stamina', message:'Você não tem stamina suficiente!' });
      return;
    }

    // rola sucesso
    const roll = Math.random()*100;
    const chance = successChance(mission);
    let success = roll <= chance;

    // stamina sempre consumida quando a missão é executada
    spendStamina(cost);

    let coinsGained:any = {};
    let lootGained:any[] = [];
    let xpGained = 0;

    if(success){
      xpGained = mission.rewards?.xp || 0;
      if(xpGained) giveXP(xpGained);

      if(mission.rewards?.coins){
        giveCoins(mission.rewards.coins);
        coinsGained = mission.rewards.coins;
      }

      if(mission.drops){
        mission.drops.forEach((d:any)=>{
          const dropRoll = Math.random()*100;
          if(dropRoll <= (d.chance||50)){
            addLootToInventory(d);
            lootGained.push(d);
          }
        });
      }

      completeGuildMission(mission);
    }

    // toast
    const lootText = lootGained.length? (' | Loot: '+lootGained.map(l=>l.name).join(', ')) : '';
    add({
      type: success? 'success':'error',
      title: success? `Missão concluída` : `Missão falhou`,
      message: `${mission.name} • Chance ${chance.toFixed(1)}% • XP ${xpGained}${Object.keys(coinsGained).length? ' • Coins '+JSON.stringify(coinsGained):''}${lootText}`
    });
  };

  const filtered = rankFilter==='Todos'? missions : missions.filter(m=> m.rank===rankFilter);
  const completed = state.guild?.completedQuests?.length || 0;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 min-h-screen text-white">
      {/* Introdução */}
      <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Users className="w-6 h-6 text-emerald-400"/> Guilda de Aventureiros
        </h2>
        <p className="opacity-70 text-sm">Local onde heróis se unem para enfrentar desafios, ganhar recompensas e aumentar sua reputação.</p>
        {!isMember && (
          <button onClick={ensureMemberCard} className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold">
            Tornar-se Membro
          </button>
        )}
      </div>

      {/* Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl p-4 bg-sky-500/20 border border-sky-500/30 flex flex-col gap-1">
          <div className="flex items-center gap-1 text-sm opacity-80"><Shield className="w-4 h-4"/> Rank Atual</div>
          <div className="font-bold">Rank {rank}</div>
        </div>
        <div className="rounded-xl p-4 bg-emerald-500/20 border border-emerald-500/30 flex flex-col gap-1">
          <div className="flex items-center gap-1 text-sm opacity-80"><ScrollText className="w-4 h-4"/> Missões completas</div>
          <div className="font-bold">{completed}</div>
        </div>
        <div className="rounded-xl p-4 bg-amber-500/20 border border-amber-500/30 flex flex-col gap-1">
          <div className="flex items-center gap-1 text-sm opacity-80"><Star className="w-4 h-4"/> Reputação</div>
          <div className="font-bold">{reputationTitle()}</div>
        </div>
        <div className="rounded-xl p-4 bg-red-500/20 border border-red-500/30 flex flex-col gap-1">
          <div className="flex items-center gap-1 text-sm opacity-80"><Zap className="w-4 h-4"/> Stamina</div>
          <div className="font-bold">{state.player.stamina.current ?? 0}/{state.player.stamina.max ?? 0}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {['Todos','F','E','D','C','B','A','S'].map(r=>(
          <button key={r} onClick={()=>setRankFilter(r)}
            className={`px-3 py-1 rounded ${rankFilter===r?'bg-emerald-600':'bg-gray-700 hover:bg-gray-600'}`}>
            {r}
          </button>
        ))}
      </div>

      {/* Missões */}
      <div className="rounded-2xl p-6 bg-white/5 border border-white/10 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-emerald-400"/> Missões
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((m,i)=>(
            <MissionCard 
              key={i} 
              mission={m} 
              onComplete={()=>handleMission(m)} 
              canStart={()=> (state.player.stamina.current ?? 0) >= (m.cost || 5)}
              successChance={successChance}
            />
          ))}
        </div>
      </div>

      {/* Histórico */}
      <div className="rounded-2xl p-6 bg-white/5 border border-white/10 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400"/> Histórico
        </h3>
        <div className="space-y-2 text-sm">
          {(state.guild?.log||[]).map((entry:any,idx:number)=>(
            <div key={idx} className="p-2 rounded bg-black/30 border border-white/10 flex items-center gap-2">
              {String(entry).toLowerCase().includes('falhou') ? <XCircle className="w-4 h-4 text-red-400"/> : <CheckCircle2 className="w-4 h-4 text-emerald-400"/>}
              {entry}
            </div>
          ))}
          {(!state.guild?.log || state.guild?.log.length===0) && (
            <div className="text-gray-400">Nenhum registro ainda.</div>
          )}
        </div>
      </div>
    </div>
  );
}
