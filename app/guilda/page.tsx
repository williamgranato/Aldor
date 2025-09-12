'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Shield, ScrollText } from 'lucide-react';
import { useGame } from '@/context/GameProvider_aldor_client';
import MissionCard from '@/components/guild/MissionCard';
import MissionResultModal from '@/components/guild/MissionResultModal';
import { rollLootForRank } from '@/utils/loot';

type Rank = 'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'|'SSS';
const ORDER: Rank[] = ['F','E','D','C','B','A','S','SS','SSS'];
function rankThreshold(r:Rank){ const steps = Math.max(0, ORDER.indexOf(r)-ORDER.indexOf('F')); return 10 * Math.pow(2, steps); }

const TEMPLATES: Record<Rank, {title:string, story:string}[]> = {
  F: [
    { title:'Caçe Ratos', story:'Uma dona de casa desesperada enfrenta uma infestação. Precisa-se de coragem, vassouras e… pouco nojo.' },
    { title:'Entregar Pão Quente', story:'O forno queima, o padeiro grita. Leve pães à praça antes que esfriem — ou que ele exploda.' },
    { title:'Espantar Gansos', story:'Gansos territoriais tomaram o lago. Traga diplomacia, ou uma vara comprida.' },
  ],
  E: [
    { title:'Patrulha Noturna', story:'Sussurros nas vielas. Faça ronda e devolva o silêncio às ruas.' },
    { title:'Ervas para o Alquimista', story:'Ervas raras brotam na orla da floresta. Colha sem virar almoço de javalis.' },
  ],
  D: [
    { title:'Rastreamento de Lobo Solitário', story:'Um lobo velho ronda fazendas. Descubra seu rastro e afaste-o das criações.' },
    { title:'Minas Desmoronadas', story:'Mineiros presos. Remova pedras, acalme corações.' },
  ],
  C: [
    { title:'Caravana em Perigo', story:'Mercadores temem emboscadas. Escolte na estrada antiga.' },
    { title:'Criptas Antigas', story:'Portas rangem, segredos dormem. E algo mais também.' },
  ],
  B: [{ title:'A Torre do Mago', story:'Um experimento vazou. Contenha cristais instáveis e frases pretensiosas.' }],
  A: [{ title:'A Sombra do Conde', story:'Nobres pedem discrição. Investigue sem acender tochas demais.' }],
  S: [{ title:'O Dragão Azul', story:'Ruge nas montanhas. Negocie tributo… ou fuja com estilo.' }],
  SS:[{ title:'O Círculo de Runas', story:'Quatro altares, um véu fino entre mundos. Não tropece no apocalipse.' }],
  SSS:[{ title:'Eco do Fim', story:'Quando o mundo sussurra, cada passo é história. E seu nome, rascunho de lenda.' }],
};
function creativeMission(rank:Rank){
  const pool = TEMPLATES[rank] || TEMPLATES.F;
  const pick = pool[Math.floor(Math.random()*pool.length)];
  const baseXp = { F:12,E:24,D:45,C:70,B:110,A:160,S:240,SS:340,SSS:500 }[rank] || 12;
  const baseCu = { F:25,E:50,D:90,C:140,B:200,A:280,S:380,SS:520,SSS:720 }[rank] || 25;
  return { id:'m'+Math.random().toString(36).slice(2), title:pick.title, story:pick.story, name:`Contrato ${rank}`, rank, duration:3000, rewards:{ xp:baseXp, copper:baseCu } };
}

export default function GuildPage(){
  const { state, giveCoins, giveXP, spendStamina, ensureMemberCard, completeGuildMission, addLootToInventory } = useGame();
  const isMember = state.guild.isMember && !!state.guild.memberCard?.rank;
  const rank = (state.guild.memberCard?.rank || 'F') as Rank;

  const [showModal, setShowModal] = useState(!isMember);
  const [missions, setMissions] = useState<any[]>([]);
  const [active, setActive] = useState<string|null>(null);
  const [loop, setLoop] = useState<Record<string,boolean>>({});
  const [result,setResult]=useState<{open:boolean; success:boolean; xp:number; copper:number; title:string; drops:any[]}>({open:false,success:true,xp:0,copper:0,title:'',drops:[]});
  const staminaCost = 5;

  useEffect(()=>{
    const idx = Math.max(0, ORDER.indexOf(rank));
    const pool: Rank[] = [ORDER[Math.max(0,idx-1)], ORDER[idx], ORDER[Math.min(ORDER.length-1,idx+1)]] as Rank[];
    const ms = Array.from({length:9}).map((_,i)=>creativeMission(pool[i%pool.length]));
    setMissions(ms);
  },[rank]);

  function registerGuild(){
    const silverToCopper = 100;
    const hasSilver = state.player.coins.silver>0;
    const hasCopper = state.player.coins.copper>=silverToCopper;
    if(!hasSilver && !hasCopper){
      alert('Saldo insuficiente: é necessário 1 prata (ou 100 cobres).');
      return;
    }
    if(hasSilver){ giveCoins({ silver: -1 as any }); }
    else { giveCoins({ copper: -silverToCopper as any }); }
    ensureMemberCard();
    setShowModal(false);
  }

  function startMission(m:any){
    if(active || !isMember) return;
    const ok = spendStamina(staminaCost);
    if(!ok){ alert('Stamina insuficiente. Descanse na taverna!'); return; }
    setActive(m.id);
    setTimeout(()=>finishMission(m), m.duration);
  }
  function finishMission(m:any){
    const copper = m.rewards?.copper||0;
    const xp = m.rewards?.xp||0;
    const drops = rollLootForRank(m.rank);
    if(copper) giveCoins({copper});
    if(xp) giveXP(xp);
    if(drops?.length) addLootToInventory(drops);
    completeGuildMission(m.rank, { xp, copper, drops, title: m.title||m.name });
    setActive(null);
    setResult({open:true, success:true, xp, copper, title: m.title||m.name, drops});
    if(loop[m.id]) setTimeout(()=>startMission(m), 200);
  }

  return (
    <div className="p-4 space-y-4">
      {showModal && !isMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={()=>setShowModal(false)} />
          <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} className="relative w-[min(640px,92vw)] rounded-2xl p-6 bg-amber-950/80 border border-amber-800/50 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <ScrollText className="w-6 h-6 text-amber-300"/>
              <div className="text-lg font-semibold text-amber-100">Bem-vindo à Guilda dos Aventureiros</div>
            </div>
            <p className="text-sm text-amber-200/90 leading-relaxed">
              Para se registrar, é necessário doar <b>1 prata</b>. Com o registro, você recebe seu <b>cartão oficial</b> e acesso aos contratos.<br/>
              <b>Progressão de Ranks</b>: complete <b>10 missões de rank F</b> para subir a <b>E</b>, depois <b>20</b> para <b>D</b>, <b>40</b> para <b>C</b>… sempre dobrando. As <b>recompensas melhoram</b> a cada avanço.<br/>
              <b>Stamina</b>: cada missão custa <b>5</b>. Você recupera <b>+1 a cada 5s</b>, e pode <b>descansar na taverna</b> para voltar inteiro.<br/>
              <b>Modo Loop</b>: ative o <b>Loop</b> numa missão e seu aventureiro repetirá o contrato <i>até a stamina acabar</i> — uma engrenagem de coragem girando sem parar.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>setShowModal(false)} className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700">Cancelar</button>
              <button onClick={registerGuild} className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 flex items-center gap-2"><Coins className="w-4 h-4"/> Registrar na Guilda — <span className="font-semibold">1 prata</span></button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-900/40 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-amber-300"/>
          <div>
            <div className="font-semibold">Rank atual: <span className="text-amber-200">{isMember?rank:'Sem Guilda'}</span></div>
            {isMember && <div className="text-xs opacity-80">Progresso: {(state.guild.completedQuests||[]).filter((q:any)=>q.rank===rank).length} / {rankThreshold(rank)} missões</div>}
          </div>
        </div>
        {isMember && (
          <div className="w-64 h-2 bg-slate-700 rounded overflow-hidden">
            <motion.div initial={{width:0}} animate={{width: `${Math.min(100, ((state.guild.completedQuests||[]).filter((q:any)=>q.rank===rank).length/rankThreshold(rank))*100)}%`}} className="h-full bg-gradient-to-r from-amber-400 to-amber-600"/>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {missions.map(m=>(
          <MissionCard key={m.id}
            mission={m}
            onAccept={()=>startMission(m)}
            onLoopToggle={()=>setLoop(s=>({...s,[m.id]:!s[m.id]}))}
            looping={!!loop[m.id]}
            active={active===m.id}
            disabled={!isMember}
          />
        ))}
      </div>

      {isMember && (state.guild.completedQuests?.length>0) && (
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
          <div className="text-sm font-semibold">Histórico de Missões</div>
          <div className="space-y-1 max-h-64 overflow-auto pr-1">
            {state.guild.completedQuests.slice(0,15).map((q:any)=> (
              <div key={q.id} className="text-xs opacity-90 flex items-center justify-between">
                <div>{new Date(q.at).toLocaleTimeString()} — <b>{q.title||('Missão '+q.rank)}</b> <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-amber-800/40 border border-amber-700/40">{q.rank}</span></div>
                <div className="flex gap-2">
                  {q.xp? <span title="XP">+{q.xp} XP</span>:null}
                  {q.copper? <span title="Cobre">+{q.copper} cobre</span>:null}
                  {Array.isArray(q.drops)&&q.drops.length>0? (
                    <div className="flex gap-1 flex-wrap">
                      {q.drops.map((d:any)=>(
                        <div key={d.id} className={'w-8 h-8 rounded-md ring-2 bg-black/40 p-0.5 flex items-center justify-center ' + (d.rarity==='mítico'?'ring-amber-400': d.rarity==='lendário'?'ring-orange-400': d.rarity==='épico'?'ring-violet-400': d.rarity==='raro'?'ring-blue-400': d.rarity==='incomum'?'ring-emerald-400':'ring-gray-400')} title={(d.name||'Item') + (d.rarity? ' — '+d.rarity : '')}>
                          <img src={(d.icon?.startsWith('/')? d.icon : '/'+(d.icon||'')) || '/images/items/unknown.png'} className="w-full h-full object-contain" />
                        </div>
                      ))}
                    </div>
                  ):null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <MissionResultModal open={result.open} success={result.success} xp={result.xp} copper={result.copper} title={result.title} drops={result.drops} onClose={()=>setResult(s=>({...s,open:false}))} />
    </div>
  );
}
