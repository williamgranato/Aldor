'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollText, Award, Users, Star, Zap, Shield, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameProvider_aldor_client';
import MissionList from '@/components/guild/MissionList';
import { useToasts } from '@/components/ToastProvider';

type Rank = 'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'|'SSS';
const RANKS: Rank[] = ['F','E','D','C','B','A','S','SS','SSS'];
const RANK_REQ: Record<Rank,number> = {F:10,E:20,D:40,C:80,B:160,A:320,S:640,SS:1280,SSS:Infinity as any};

const REPUTATION_TITLES = [
  'Forasteiro','Conhecido','Aliado','Companheiro','Protetor da Vila',
  'Campeão Regional','Herói Local','Defensor de Aldoria','Lenda Viva','Símbolo Eterno'
];

const rarityColor = (r:string)=>{
  switch(r){
    case 'incomum': return 'border-green-500';
    case 'raro': return 'border-blue-500';
    case 'épico': return 'border-purple-500';
    case 'lendário': return 'border-orange-500';
    case 'mítico': return 'border-yellow-400';
    default: return 'border-gray-400';
  }
};

const coinImg = (k:string)=>{
  const key = k.toLowerCase();
  if(key.includes('gold')) return '/images/items/gold.png';
  if(key.includes('silver')) return '/images/items/silver.png';
  if(key.includes('bronze')) return '/images/items/bronze.png';
  if(key.includes('copper')||key.includes('cooper')) return '/images/items/copper.png';
  return '/images/items/coin.png';
};

export default function GuildPage(){
  const { state, spendStamina, giveXP, giveCoins, completeGuildMission, addLootToInventory, ensureMemberCard, changeHP } = useGame();
  const { add } = useToasts();
  const [missions,setMissions] = useState<any[]>([]);
  const [rankFilter,setRankFilter] = useState<string>('Todos');

  const rank = (state.guild?.memberCard?.rank || 'F') as Rank;
  const isMember = !!state.guild?.isMember;
  const affinity = state.guild?.missionAffinity || {};

  useEffect(()=>{ setMissions(getGuildMissions(rank)); },[rank]);

  const completedThisRank = useMemo(()=> (state.guild?.completedQuests||[]).filter((q:any)=>q.success && q.rank===rank).length ,[state.guild?.completedQuests,rank]);
  const totalCompleted = (state.guild?.completedQuests||[]).filter((q:any)=>q.success).length;
  const req = RANK_REQ[rank]; const pct = Math.min(100,Math.floor((completedThisRank/req)*100));

  const reputationTitle = ()=>{
    const count = totalCompleted;
    if(count<10) return REPUTATION_TITLES[0];
    if(count<30) return REPUTATION_TITLES[1];
    if(count<60) return REPUTATION_TITLES[2];
    if(count<100) return REPUTATION_TITLES[3];
    if(count<150) return REPUTATION_TITLES[4];
    if(count<250) return REPUTATION_TITLES[5];
    if(count<400) return REPUTATION_TITLES[6];
    if(count<600) return REPUTATION_TITLES[7];
    if(count<1000) return REPUTATION_TITLES[8];
    return REPUTATION_TITLES[9];
  };

  const successChance = (mission:any)=>{
    const s = state.player.stats||{};
    let base = 70 + ((s.atk||0)*0.4 + (s.defense||0)*0.3 + ((s.maxHp||0)/10)*0.2 + (s.shield||0)*0.1 - (mission.difficulty||5));
    if(rank!=='F') base -= 10;
    const affBonus = Math.min(15,(affinity[mission.id]||0)*0.1);
    const curHp = s.hp || s.maxHp || 100;
    const maxHp = s.maxHp || 100;
    const hpPenalty = (1 - (curHp/maxHp)) * 20;
    return Math.max(5,Math.min(100,base+affBonus-hpPenalty));
  };

  const handleMission=(mission:any)=>{
    const cost=mission.cost||5;
    if((state.player.stamina?.current??0)<cost){ add({type:'error',title:'Sem Stamina',message:'Você não tem stamina suficiente!'}); return;}
    spendStamina(cost);
    const chance=successChance(mission); const roll=Math.random()*100; const success=roll<=chance;
    let xp=0; let coins:any={}; let loot:any[]=[];
    if(success){ xp=mission.rewards?.xp||0; if(xp) giveXP(xp); if(mission.rewards?.coins){giveCoins(mission.rewards.coins);coins=mission.rewards.coins;} if(mission.drops){mission.drops.forEach((d:any)=>{ if(Math.random()*100<=(d.chance||50)){ addLootToInventory([d]); loot.push(d);} });} }
    else { const maxHp=state.player.stats?.maxHp||100; changeHP(-Math.floor(maxHp*0.1)); }
    completeGuildMission(mission,success,{xp,coins,drops:loot,chance});
    const lootStr=loot.length?' • Loot: '+loot.map(l=>l.name).join(', '):'';
    const coinsStr=Object.entries(coins).filter(([,v])=>v>0).map(([k,v])=>`${v} ${k}`).join(', ');
    add({type:success?'success':'error',title:success?'Missão concluída':'Missão falhou',message:`[Rank ${mission.rank}] ${mission.name} • Chance ${chance.toFixed(1)}% • XP ${xp}${coinsStr?' • '+coinsStr:''}${lootStr}`});
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 min-h-screen text-white">
      {/* Intro */}
      <div className="rounded-2xl p-6 bg-white/5 border border-white/10 shadow-lg">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Users className="w-6 h-6 text-emerald-400"/> Guilda de Aventureiros</h2>
        <p className="opacity-70 text-sm">Local onde heróis se unem para enfrentar desafios, ganhar recompensas e aumentar sua reputação.</p>
        {!isMember && <button onClick={ensureMemberCard} className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded">Tornar-se Membro</button>}
      </div>

      {/* Status */}
      <div className="rounded-2xl p-6 bg-white/5 border border-white/10 shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded bg-sky-500/20 border border-sky-500/30"><div className="text-xs opacity-70 flex items-center gap-1"><Shield className="w-4 h-4"/> Rank</div><div className="font-bold">{rank}</div></div>
          <div className="p-3 rounded bg-emerald-500/20 border border-emerald-500/30"><div className="text-xs opacity-70 flex items-center gap-1"><ScrollText className="w-4 h-4"/> Missões</div><div className="font-bold">{totalCompleted}</div></div>
          <div className="p-3 rounded bg-amber-500/20 border border-amber-500/30"><div className="text-xs opacity-70 flex items-center gap-1"><Star className="w-4 h-4"/> Reputação</div><div className="font-bold" title="Sua reputação cresce conforme completa missões.">{reputationTitle()}</div></div>
          <div className="p-3 rounded bg-red-500/20 border border-red-500/30"><div className="text-xs opacity-70 flex items-center gap-1"><Zap className="w-4 h-4"/> Stamina</div><div className="font-bold">{state.player.stamina.current}/{state.player.stamina.max}</div></div>
        </div>
        <div className="mt-3"><div className="flex justify-between text-xs opacity-70"><span>{completedThisRank}/{req} neste rank</span><span>Próx: {RANKS[Math.min(RANKS.indexOf(rank)+1,RANKS.length-1)]}</span></div><div className="h-2 bg-black/40 rounded"><div className="h-2 bg-emerald-500" style={{width:pct+'%'}}/></div></div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">{['Todos',...RANKS].map(r=>(<button key={r} onClick={()=>setRankFilter(r)} className={`px-3 py-1 rounded ${rankFilter===r?'bg-emerald-600':'bg-gray-700 hover:bg-gray-600'}`}>{r}</button>))}</div>

      {/* Missões */}
      <div className="rounded-2xl p-6 bg-white/5 border border-white/10 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><ScrollText className="w-5 h-5 text-emerald-400"/> Missões</h3>
        <MissionList missions={rankFilter==='Todos'?missions:missions.filter(m=>m.rank===rankFilter)} onMissionComplete={handleMission} canStart={()=> (state.player.stamina.current??0)>0} successChance={successChance}/>
      </div>

      {/* Histórico */}
      <div className="rounded-2xl p-6 bg-white/5 border border-white/10 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-yellow-400"/> Histórico</h3>
        <div className="space-y-2 text-sm">
          {(state.guild?.completedQuests||[]).map((e:any,i:number)=>(
            <motion.div key={i} initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="p-2 rounded bg-black/30 border border-white/10 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {e.success?<CheckCircle2 className="w-4 h-4 text-emerald-400"/>:<XCircle className="w-4 h-4 text-red-400"/>}
                <span>[{e.rank}] {e.mission?.name}</span>
                {e.rewards?.xp?<span>• {e.rewards.xp} XP</span>:null}
                {e.rewards?.coins?(
                  <div className="flex items-center gap-2">
                    {Object.entries(e.rewards.coins).filter(([,v])=>v>0).map(([k,v])=>(
                      <div key={k} className="flex items-center gap-1">
                        <img src={coinImg(k)} alt={k} className="w-4 h-4"/><span>{v}</span>
                      </div>
                    ))}
                  </div>
                ):null}
                {e.rewards?.chance?<span>• {Number(e.rewards.chance).toFixed(1)}%</span>:null}
              </div>
              {e.rewards?.drops?.length?(
                <div className="flex flex-wrap gap-2 ml-6">
                  {e.rewards.drops.map((d:any,idx:number)=>(
                    <div key={idx} className={`flex items-center gap-1 px-2 py-1 rounded border ${rarityColor(d.rarity||'')}`} title={`${d.name} (${d.rarity||'comum'})`}>
                      {d.image && <img src={d.image} alt={d.name} className="w-4 h-4"/>}
                      <span>{d.name}</span>
                    </div>
                  ))}
                </div>
              ):null}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
