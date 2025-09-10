// utils/lootGen.ts
/** Geração de loot variado por missão.
 * - Usa semente por missionId pra variar mas manter coerência na sessão.
 * - Tiers: comum, incomum, raro, épico, lendário com chances base.
 * - Cada missão recebe 1-2 itens básicos e chance de 0-2 raros.
 */
export type LootRoll = { id: string; qty: number; chance: number }; // chance 0..1000
export type LootResult = { id: string; qty: number }[];

const BASIC_BY_RANK: Record<string, string[]> = {
  F: ['couro', 'erva', 'madeira'],
  E: ['couro', 'minerio_cobre', 'erva'],
  D: ['minerio_ferro', 'couro', 'po_fraco'],
  C: ['minerio_aco', 'po_medio'],
  B: ['gema_comum', 'po_medio'],
  A: ['gema_incomum', 'po_forte'],
  S: ['gema_rara'],
  SS: ['gema_epica'],
  SSS: ['gema_lendaria']
};

const RARE_POOL = [
  { id: 'espada_aco_1m', tier: 'incomum' },
  { id: 'adaga_mithril', tier: 'raro' },
  { id: 'armadura_couro_lendaria', tier: 'lendario' },
  { id: 'elmo_bronze', tier: 'comum' },
  { id: 'escudo_ferro', tier: 'incomum' },
  { id: 'gema_epica', tier: 'epico' }
];

const TIER_CHANCE: Record<string, number> = {
  comum: 800,      // 80%
  incomum: 400,    // 40%
  raro: 200,       // 20%
  epico: 50,       // 5%
  lendario: 10     // 1%
};

function seededRand(seed: number){ let s = seed; return () => (s = (s*9301 + 49297) % 233280) / 233280; }

export function buildLootTable(missionId: string, rank: string = 'F', difficulty: number = 1): LootRoll[] {
  const seed = [...missionId].reduce((a,c)=>a+c.charCodeAt(0), 0) + Math.floor(difficulty*100);
  const rnd = seededRand(seed);
  const basics = (BASIC_BY_RANK[rank] || BASIC_BY_RANK['F']).slice(0, 2 + Math.floor(rnd()*1)); // 1-2 básicos
  const table: LootRoll[] = basics.map(id => ({ id, qty: 1 + Math.floor(rnd()*2), chance: 700 })); // 70% base

  // adicionar raros (0-2)
  const rareCount = Math.floor(rnd()*3); // 0..2
  for(let i=0;i<rareCount;i++){
    const pick = RARE_POOL[Math.floor(rnd()*RARE_POOL.length)];
    const chance = Math.max(10, Math.min(1000, Math.floor((TIER_CHANCE[pick.tier] || 200) * (1/difficulty))));
    table.push({ id: pick.id, qty: 1, chance });
  }
  return table;
}

export function rollLoot(table: LootRoll[]): LootResult {
  const out: LootResult = [];
  for(const d of table){
    const r = Math.floor(Math.random()*1000);
    if(r < d.chance) out.push({ id: d.id, qty: d.qty });
  }
  return out;
}
