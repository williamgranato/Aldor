export type PlayerStats = { hp:number; maxHp:number; attack:number; defense:number; crit:number };
export type Enemy = { name:string; hp:number; attack:number; defense:number; crit?:number };

export function enemyForRank(r:string): Enemy{
  const map:any = {
    'F': { name:'Rato Grande', hp:20, attack:5, defense:2 },
    'E': { name:'Lobo', hp:28, attack:7, defense:3 },
    'D': { name:'Goblins', hp:36, attack:9, defense:4 },
    'C': { name:'Basilisco Jovem', hp:50, attack:12, defense:6 },
    'B': { name:'Grifo', hp:70, attack:16, defense:8 },
    'A': { name:'Hidra Menor', hp:90, attack:20, defense:10 },
    'S': { name:'Dragão Jovem', hp:120, attack:26, defense:12 },
    'SS': { name:'Dragão Ancião', hp:160, attack:32, defense:16 },
    'SSS': { name:'Soberano de Mitras', hp:220, attack:40, defense:20 }
  };
  return map[r] || map['F'];
}

export function computeEffectiveStats(p:any){
  const base: PlayerStats = {
    hp: p.stats?.hp ?? 30,
    maxHp: p.stats?.maxHp ?? 30,
    attack: p.stats?.attack ?? 5,
    defense: p.stats?.defense ?? 2,
    crit: p.stats?.crit ?? 0.05
  };
  const A = p.attributes || {};
  base.attack += Math.floor((A.strength||0) * 0.8);
  base.defense += Math.floor((A.vitality||0) * 0.6);
  base.maxHp += Math.floor((A.vitality||0) * 2);
  base.crit += Math.min(0.5, (A.luck||0) * 0.002);

  const inv = p.inventory || [];
  // If equipment slots exist, prefer them; else sum all inventory attrs
  const equip = (p as any).equipment || {};
  const acc = (list:any[])=>{ for(const it of list){ const a = (it as any)?.attrs||{}; if(a.atk) base.attack += a.atk; if(a.def) base.defense += a.def; if(a.hp) base.maxHp += a.hp; if(a.crit) base.crit += a.crit; } };
  const eqList = [equip.weapon, equip.armor, equip.trinket].filter(Boolean);
  if(eqList.length>0) acc(eqList); else acc(inv);

  base.crit = Math.max(0, Math.min(0.75, base.crit));
  base.hp = Math.min(p.stats?.hp ?? base.maxHp, base.maxHp);
  return base;
}

function rand(seed:number){ let s=seed|0; return ()=> (s = (s*1664525+1013904223)|0, (s>>>0)/4294967296); }

export function simulateCombat(p:any, e:Enemy, opts?: { difficultyMultiplier?: number, seed?: number }){
  const eff = computeEffectiveStats(p);
  const mul = Math.max(0.25, opts?.difficultyMultiplier ?? 1);
  let php = eff.hp;
  let ehp = Math.round((e.hp||20) * mul);
  const rng = rand((opts?.seed ?? Date.now()) & 0x7fffffff);

  const patk = Math.max(1, Math.round(eff.attack));
  const pdef = Math.max(0, Math.round(eff.defense));
  const pcrt = Math.max(0, Math.min(0.75, eff.crit));

  const eatk = Math.max(1, Math.round(((e.attack||5) * mul)));
  const edef = Math.max(0, Math.round(((e.defense||2) * mul)));
  const ecrt = Math.max(0, Math.min(0.5, e.crit ?? 0.05));

  const log:string[] = [];

  for(let turn=1; turn<=50 && php>0 && ehp>0; turn++){
    const pCrit = rng() < pcrt;
    const pDmg = Math.max(1, patk - Math.floor(edef/2));
    const pd = pCrit ? Math.round(pDmg*1.7) : pDmg;
    ehp -= pd;
    log.push(`Você atacou (${pCrit?'CRIT':''}) por ${pd}. HP inimigo: ${Math.max(0,ehp)}.`);
    if(ehp<=0) break;

    const eCrit = rng() < ecrt;
    const eDmg = Math.max(1, eatk - Math.floor(pdef/2));
    const ed = eCrit ? Math.round(eDmg*1.5) : eDmg;
    php -= ed;
    log.push(`Inimigo atingiu (${eCrit?'CRIT':''}) por ${ed}. Seu HP: ${Math.max(0,php)}.`);
  }

  return { win: ehp<=0 && php>0, php: Math.max(0,php), ehp: Math.max(0,ehp), log };
}

// Legacy wrapper for older provider expectations (hpLost/xpBonus/potions)
export function simulateCombatLegacy(p:any, e:Enemy, opts?: { difficultyMultiplier?: number, potions?: number }){
  const base = simulateCombat(p, e, { difficultyMultiplier: opts?.difficultyMultiplier });
  const hpLost = Math.max(0, (p.stats?.hp ?? 30) - base.php);
  const xpBonus = base.win ? Math.round((opts?.difficultyMultiplier ?? 1) * 3) : 0;
  return { ...base, hpLost, xpBonus };
}
