
'use client';

export type PlayerLike = any;
export type MissionLike = any;

function clamp(n:number, min:number, max:number){ return Math.max(min, Math.min(max, n)); }
function pick<T>(v:T|undefined, fb:T){ return (typeof v!=='undefined'? v : fb); }

function calcEffectiveAttack(p:PlayerLike, mission:MissionLike){
  const stats = (p?.stats)||p||{};
  const base = pick(stats.atk||stats.str||stats.strength||0, 0);
  const weap = (p?.equipment?.weapon?.atk) || 0;
  const str = stats.str||stats.força||stats.force||0;
  const agi = stats.agi||stats.destreza||0;
  const int = stats.int||stats.arcano||0;
  const buff = (p?.status?.atk||0);

  let eff = base + weap + Math.floor(str*0.6 + agi*0.2 + int*0.2) + buff;

  // damage model mods
  const dm = mission?.damageModel;
  if (dm?.type==='magico') eff += Math.floor(int*0.6);
  else if (dm?.type==='misto') eff += Math.floor(int*0.3 + str*0.3);

  // env mods (simplificado)
  const weather = p?.world?.weather;
  if (dm?.envMods?.weather?.includes?.(weather)) eff = Math.floor(eff*1.05);

  return Math.max(1, eff);
}

function calcEffectiveDefense(p:PlayerLike, mission:MissionLike){
  const stats = (p?.stats)||p||{};
  const base = pick(stats.def||stats.vit||stats.vigor||0, 0);
  const armor = (p?.equipment?.armor?.def) || 0;
  const agi = stats.agi||stats.destreza||0;
  const vit = stats.vit||stats.vigor||0;
  const buff = (p?.status?.def||0);

  let eff = base + armor + Math.floor(vit*0.6 + agi*0.3) + buff;

  // damage model resist side (mission enemy hits phys/magic - keep simple)
  const dm = mission?.damageModel;
  if (dm?.type==='magico') eff += Math.floor((stats.int||stats.arcano||0)*0.2);

  const terrain = p?.world?.terrain;
  if (dm?.envMods?.terrain?.includes?.(terrain)) eff = Math.floor(eff*1.05);

  return Math.max(0, eff);
}

export function estimateRisk(p:PlayerLike, mission:MissionLike){
  const atk = calcEffectiveAttack(p, mission);
  const def = calcEffectiveDefense(p, mission);
  const enemy = mission?.enemy || { hp: 20, atk: 5, def: 2 };
  // very rough score: player time-to-kill vs enemy time-to-kill
  const pDmgPerHit = Math.max(1, Math.floor(atk - enemy.def*0.7));
  const eDmgPerHit = Math.max(0, Math.floor(enemy.atk - def*0.7));
  const hitsToKillEnemy = Math.ceil(enemy.hp / pDmgPerHit);
  const hitsToKillPlayer = Math.ceil(Math.max(1,(p?.hp||p?.character?.hp||50)) / Math.max(1, eDmgPerHit||1));

  const ratio = hitsToKillEnemy / hitsToKillPlayer; // lower is better
  let label:'Baixo'|'Médio'|'Alto' = 'Médio';
  if (ratio < 0.6) label = 'Baixo';
  if (ratio > 1.2) label = 'Alto';
  return { ratio, label };
}

export function simulateCombat(p:PlayerLike, mission:MissionLike){
  const enemy = mission?.enemy || { hp: 20, atk: 5, def: 2 };
  const critPlayer = clamp((p?.stats?.luck||p?.stats?.sorte||0) * 0.002 + 0.05, 0.05, 0.35);
  const evadePlayer = clamp((p?.stats?.agi||p?.stats?.destreza||0) * 0.002, 0, 0.25);
  let playerHP = (p?.hp||p?.character?.hp||80);
  let enemyHP = enemy.hp;
  const atk = calcEffectiveAttack(p, mission);
  const def = calcEffectiveDefense(p, mission);

  let turns = 0, damageTaken = 0, durabilityLoss = 0, crits = 0, evades = 0;
  while (playerHP>0 && enemyHP>0 && turns<40){
    turns++;
    // player hit
    let pd = Math.max(1, Math.floor(atk - enemy.def*0.6));
    if (Math.random() < critPlayer){ pd = Math.floor(pd*1.6); crits++; }
    // mission resist
    if (mission?.damageModel?.enemyResist?.fisico && (mission.damageModel.type!=='magico')){
      pd = Math.max(1, Math.floor(pd * (1 - mission.damageModel.enemyResist.fisico)));
    }
    if (mission?.damageModel?.enemyResist?.magico && (mission.damageModel.type!=='fisico')){
      pd = Math.max(1, Math.floor(pd * (1 - mission.damageModel.enemyResist.magico)));
    }
    enemyHP -= pd;

    if (enemyHP<=0) break;

    // enemy hit
    if (Math.random() < evadePlayer){ evades++; continue; }
    let ed = Math.max(1, Math.floor(enemy.atk - def*0.4));
    playerHP -= ed; damageTaken += ed;
    durabilityLoss += (ed>0?1:0);
  }

  const win = enemyHP<=0 && playerHP>0;
  return { win, turns, damageTaken, durabilityLoss, crits, evades };
}
