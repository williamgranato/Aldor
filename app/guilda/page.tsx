'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Shield, ScrollText } from 'lucide-react';
import { useGame } from '@/context/GameProvider_aldor_client';
import MissionCard from '@/components/guild/MissionCard';
import MissionResultModal from '@/components/guild/MissionResultModal';

type Rank = 'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'|'SSS';
const ORDER: Rank[] = ['F','E','D','C','B','A','S','SS','SSS'];
function rankThreshold(r:Rank){
  const steps = Math.max(0, ORDER.indexOf(r)-ORDER.indexOf('F'));
  return 10 * Math.pow(2, steps);
}
function randomMission(rank:Rank){
  const baseXp = { F:10,E:20,D:40,C:60,B:90,A:120,S:180,SS:260,SSS:400 }[rank] || 10;
  const baseCu = { F:20,E:40,D:80,C:120,B:160,A:220,S:300,SS:420,SSS:600 }[rank] || 20;
  return {
    id: 'm'+Math.random().toString(36).slice(2),
    name: `Contrato ${rank}`,
    rank,
    description: `Um pedido adequado a aventureiros de rank ${rank}.`,
    duration: 3000,
    rewards: { xp: baseXp, copper: baseCu }
  };
}

export default function GuildPage(){
  const { state, giveCoins, spendStamina, ensureMemberCard, completeGuildMission } = useGame();
  const isMember = state.guild.isMember;
  const rank = (state.guild.memberCard?.rank || 'F') as Rank;

  // contador de progresso para o rank atual
  const doneAtRank = (state.guild.completedQuests||[]).filter((q:any)=>q.rank===rank).length;
  const needAtRank = rankThreshold(rank);

  const [showModal, setShowModal] = useState(!isMember);
  const [missions, setMissions] = useState<any[]>([]);
  const [active, setActive] = useState<string|null>(null);
  const [loop, setLoop] = useState<Record<string,boolean>>({});
  const staminaCost = 5;

  useEffect(()=>{ // gerar missões do rank atual e vizinhos
    const idx = Math.max(0, ORDER.indexOf(rank));
    const pool: Rank[] = [ORDER[Math.max(0,idx-1)], ORDER[idx], ORDER[Math.min(ORDER.length-1,idx+1)]] as Rank[];
    const ms = Array.from({length:9}).map((_,i)=>randomMission(pool[i%pool.length]));
    setMissions(ms);
  },[rank]);

  function registerGuild(){
    // cobrar 1 prata (100 cobre)
    const silverToCopper = 100;
    if(state.player.coins.silver<=0 && state.player.coins.copper < silverToCopper){
      alert('Saldo insuficiente: precisa de 1 prata.');
      return;
    }
    // subtrai 1 prata preferindo prata; se não tiver, cobre suficiente
    if(state.player.coins.silver>0){
      giveCoins({ silver: -1 as any });
    }else{
      giveCoins({ copper: -silverToCopper as any });
    }
    ensureMemberCard();
    setShowModal(false);
  }

  function startMission(m:any){
    if(active) return;
    if(!spendStamina(staminaCost)){ alert('Stamina insuficiente. Descanse na taverna!'); return; }
    setActive(m.id);
    setTimeout(()=>finishMission(m), m.duration);
  }
  function finishMission(m:any){
    completeGuildMission(m.rank);
    if(m.rewards?.copper) giveCoins({copper: m.rewards.copper});
    setActive(null);
    // loop se ligado e ainda houver stamina
    if(loop[m.id]){
      setTimeout(()=>startMission(m), 200);
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Modal de registro */}
      {showModal && !isMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={()=>setShowModal(false)} />
          <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} className="relative w-[min(620px,92vw)] rounded-2xl p-6 bg-amber-950/80 border border-amber-800/50 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <ScrollText className="w-6 h-6 text-amber-300"/>
              <div className="text-lg font-semibold text-amber-100">Bem-vindo à Guilda dos Aventureiros</div>
            </div>
            <p className="text-sm text-amber-200/90 leading-relaxed">
              Para se registrar, é necessário doar <b>1 prata</b>. Com o registro, você recebe seu <b>cartão oficial</b> e acesso aos contratos.
              O caminho de ranks funciona assim: complete <b>10 missões de rank F</b> para subir a <b>E</b>, depois <b>20</b> para chegar a <b>D</b>, <b>40</b> para <b>C</b>… sempre dobrando.
              Recompensas também melhoram a cada rank. Sem stamina? Visite a <b>taverna</b> para descansar. E se quiser otimizar, ative o <b>modo Loop</b> nas missões: seu aventureiro repete a tarefa até a stamina acabar.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>setShowModal(false)} className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700">Cancelar</button>
              <button onClick={registerGuild} className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 flex items-center gap-2"><Coins className="w-4 h-4"/> Registrar na Guilda — <span className="font-semibold">1 prata</span></button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header da guilda com progresso de rank */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-900/40 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-amber-300"/>
          <div>
            <div className="font-semibold">Rank atual: <span className="text-amber-200">{rank}</span></div>
            <div className="text-xs opacity-80">Progresso: {doneAtRank} / {needAtRank} missões</div>
          </div>
        </div>
        <div className="w-64 h-2 bg-slate-700 rounded overflow-hidden">
          <motion.div initial={{width:0}} animate={{width: `${Math.min(100, (doneAtRank/needAtRank)*100)}%`}} className="h-full bg-gradient-to-r from-amber-400 to-amber-600"/>
        </div>
      </div>

      {/* Lista de missões */}
      <div className="grid md:grid-cols-2 gap-3">
        {missions.map(m=>(
          <MissionCard key={m.id}
            mission={m}
            onAccept={()=>startMission(m)}
            onLoopToggle={()=>setLoop(s=>({...s,[m.id]:!s[m.id]}))}
            looping={!!loop[m.id]}
            active={active===m.id}
          />
        ))}
      </div>

      <MissionResultModal open={false} success onClose={()=>{}} />
    </div>
  );
}
