import { MISSIONS, Mission } from '@/data/missions_catalog';

export function pickDailyMissions(playerRank: string, dayKey: string, world?: { season?:string; weather?:string; }){
  const order = ['F','E','D','C','B','A','S','SS'];
  const pr = order.includes(playerRank) ? playerRank : 'F';
  const idx = order.indexOf(pr);

  const poolBelow = MISSIONS.filter(m=> order.indexOf(m.rank) === Math.max(0, idx-1) );
  const poolEqual = MISSIONS.filter(m=> m.rank===pr );
  const poolAbove = MISSIONS.filter(m=> order.indexOf(m.rank) === Math.min(order.length-1, idx+1) );

  function seededRand(n:number){
    let h = 2166136261 ^ (dayKey.length*16777619);
    for(let i=0;i<dayKey.length;i++){ h ^= dayKey.charCodeAt(i); h = Math.imul(h, 16777619); }
    return Math.abs(h % n);
  }
  function take(pool:Mission[], count:number, seedOffset:number){
    const out:Mission[] = [];
    if(pool.length===0) return out;
    let idx = seededRand(pool.length + seedOffset);
    for(let i=0;i<count;i++){ out.push(pool[idx % pool.length]); idx += 37; }
    return out;
  }
  let list = [
    ...take(poolBelow, 3, 1),
    ...take(poolEqual, 5, 2),
    ...take(poolAbove, 3, 3)
  ];
  // Ajuste sazonal/climático em drops raros (leve)
  const season = world?.season || 'Primavera';
  const weather = world?.weather || 'Ensolarado';
  const boost = (id:string)=>{
    if(season==='Inverno' && id==='pena_fenix') return 2; // mais raro no frio? (metade) — mantemos pequeno
    if(season==='Inverno' && id==='escama_basilisco') return 1.2;
    if(season==='Verão' && id==='escama_basilisco') return 1.4;
    if(weather==='Nevasca' && id==='couro_lobo') return 1.5;
    if(weather==='Chuva' && id==='essencia_ígnea') return 0.8;
    return 1;
  };
  list = list.map(m=> ({
    ...m,
    drops: m.drops.map(d=> ({ ...d, chance: Math.max(1, Math.round(d.chance * boost(d.id))) }))
  }));
  const seen = new Set<string>();
  return list.filter(m=> (seen.has(m.id)?false:(seen.add(m.id),true)));
}
