// missions catalog
export const MISSIONS:any[] = [];


// === GUILDA (novas missões com damageModel e inimigos) ===
export type DamageModel = {
  type: 'fisico'|'magico'|'misto',
  enemyResist?: { fisico?: number, magico?: number },
  envMods?: { weather?: string[], night?: boolean, terrain?: string[] }
}

export type GuildEnemy = { hp: number, atk: number, def: number, crit?: number, tags?: string[] }

export type GuildMission = {
  id: string,
  title: string,
  categoria: 'guilda',
  rank: 'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'|'SSS',
  requiredRank: 'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'|'SSS',
  durationMs: number,
  rewards: { xp: number, coins: { copper?: number, bronze?: number, silver?: number, gold?: number }, items?: any[] },
  drops?: any[],
  enemy: GuildEnemy,
  damageModel: DamageModel,
  onHitEffects?: any,
  onFailEffects?: { hpLoss?: number, durabilityLoss?: number, debuff?: string }
}

export const GUILD_MISSIONS: GuildMission[] = [
  {
    id: 'g-f-001',
    title: 'Ratos na Adega',
    categoria: 'guilda',
    rank: 'F',
    requiredRank: 'F',
    durationMs: 10000,
    rewards: { xp: 4, coins: { copper: 8 }, items: [] },
    drops: [{ id:'rat_tail', chance: 0.25 }],
    enemy: { hp: 22, atk: 3, def: 1, tags: ['besta'] },
    damageModel: { type: 'fisico', enemyResist: { fisico: 0.1 }, envMods: { night: true, terrain: ['urbano'] } },
    onFailEffects: { hpLoss: 6, durabilityLoss: 1 }
  },
  {
    id: 'g-e-002',
    title: 'Ladrões na Estrada',
    categoria: 'guilda',
    rank: 'E',
    requiredRank: 'E',
    durationMs: Math.round(10000 * 1.1),
    rewards: { xp: 8, coins: { copper: 18 }, items: [] },
    drops: [{ id:'rough_leather', chance: 0.2 }],
    enemy: { hp: 40, atk: 7, def: 3, tags: ['humanoide'] },
    damageModel: { type: 'fisico', enemyResist: { fisico: 0.2 }, envMods: { terrain: ['estrada'] } },
    onFailEffects: { hpLoss: 12, durabilityLoss: 2 }
  },
  {
    id: 'g-d-003',
    title: 'Espírito na Capela',
    categoria: 'guilda',
    rank: 'D',
    requiredRank: 'D',
    durationMs: Math.round(10000 * 1.2),
    rewards: { xp: 14, coins: { copper: 28 }, items: [] },
    drops: [{ id:'ectoplasm', chance: 0.18 }],
    enemy: { hp: 65, atk: 10, def: 5, tags: ['espirito'] },
    damageModel: { type: 'magico', enemyResist: { magico: 0.15 }, envMods: { night: true, terrain: ['ruinas'] } },
    onFailEffects: { hpLoss: 18, durabilityLoss: 2, debuff: 'medo' }
  }
];

