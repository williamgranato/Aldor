// /data/items_catalog.ts
// Fonte canônica de itens do Aldor Idle
// Mantém compatibilidade: exporta `ITEMS` como antes, mas amplia o schema com campos opcionais.
// Sem dependências novas.

/** Tipos base **/
export type Rarity = 'comum' | 'incomum' | 'raro' | 'épico' | 'lendário';
export type ItemType =
  | 'arma'
  | 'armadura'
  | 'poção'
  | 'joia'
  | 'gema'
  | 'material'
  | 'acessório'
  | 'comida';

export type DamageKind = 'físico' | 'mágico' | 'misto';

export type Slot =
  | 'cabeça'
  | 'ombros'
  | 'peito'
  | 'mãos'
  | 'cintura'
  | 'pernas'
  | 'pés'
  | 'mão_principal'
  | 'mão_secundária'
  | 'anel_1'
  | 'anel_2'
  | 'amuleto'
  | 'manto'
  | 'acessório'
  | 'comida';

export type MaterialBase =
  | 'couro'
  | 'tecido'
  | 'escamas'
  | 'placas'
  | 'madeira_nobre'
  | 'ferro'
  | 'aço'
  | 'mithril'
  | 'adamantita'
  | 'fibras_arcanas'
  | 'resina'
  | 'runa';

export type BonusMap = Partial<{
  STR: number;
  AGI: number;
  INT: number;
  VIT: number;
  LUCK: number;
  ATQ: number;
  DEF: number;
  CRIT: number;     // chance %
  DODGE: number;    // chance %
  HP: number;       // valor plano
  HP_PCT: number;   // % máx
  MITIGATION_PCT: number; // % leve
}>;

export interface GemSpec {
  id: string;
  name: string;
  rarity: Rarity;
  bonuses: BonusMap;
  image: string;
}

export interface SetBonusSpec {
  setId: string;
  name: string;
  pieces: number; // N peças requeridas para este bônus
  bonuses: BonusMap;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  slot?: Slot;
  rarity: Rarity;
  material?: MaterialBase;
  reqLevel: number;
  durability?: number;   // 0-100 padrão; armas/armaduras
  weight?: number;
  valueCopper: number;   // preço base em cobre
  atk?: number;
  def?: number;
  crit?: number;
  dodge?: number;
  bonuses?: BonusMap;
  sockets?: number;      // 0-3
  setId?: string;
  image: string;         // relativo a /public/images/items/*
}

/** Regras de preço: base por material × tipo × raridade × (1 + 0.05·reqLevel) */
const MATERIAL_BASE: Record<MaterialBase, number> = {
  couro: 8,
  tecido: 7,
  escamas: 14,
  placas: 22,
  madeira_nobre: 10,
  ferro: 12,
  aço: 18,
  mithril: 40,
  adamantita: 70,
  fibras_arcanas: 16,
  resina: 6,
  runa: 25,
};

const TYPE_FACTOR: Record<ItemType, number> = {
  arma: 2.0,
  armadura: 1.8,
  poção: 0.6,
  joia: 1.4,
  gema: 1.2,
  material: 0.4,
  acessório: 1.0,
  comida: 50
};

const RARITY_FACTOR: Record<Rarity, number> = {
  comum: 1.0,
  incomum: 1.4,
  raro: 2.0,
  épico: 3.0,
  lendário: 4.5,
};

export function computePriceCopper(input: {
  material?: MaterialBase;
  type: ItemType;
  rarity: Rarity;
  reqLevel: number;
  baseOverride?: number; // permite fixar valor específico
}): number {
  if (input.baseOverride != null) return Math.max(1, Math.floor(input.baseOverride));
  const m = input.material ? MATERIAL_BASE[input.material] : 6;
  const tf = TYPE_FACTOR[input.type] ?? 1;
  const rf = RARITY_FACTOR[input.rarity] ?? 1;
  const levelMul = 1 + 0.05 * input.reqLevel;
  return Math.max(1, Math.floor(m * tf * rf * levelMul));
}

/** Catálogo de gemas (sockets) */
export const GEMS: GemSpec[] = [
  { id: 'gem_rubi_comum', name: 'Rubi Bruto', rarity: 'comum', bonuses: { ATQ: 2 }, image: 'gems/ruby_1.png' },
  { id: 'gem_rubi_lend', name: 'Rubi Lendário', rarity: 'lendário', bonuses: { ATQ: 12, CRIT: 3 }, image: 'gems/ruby_5.png' },
  { id: 'gem_safira_comum', name: 'Safira Bruta', rarity: 'comum', bonuses: { DEF: 2 }, image: 'gems/sapphire_1.png' },
  { id: 'gem_safira_lend', name: 'Safira Lendária', rarity: 'lendário', bonuses: { DEF: 12, MITIGATION_PCT: 2 }, image: 'gems/sapphire_5.png' },
  { id: 'gem_esmeralda', name: 'Esmeralda', rarity: 'épico', bonuses: { AGI: 4, DODGE: 2 }, image: 'gems/emerald_4.png' },
  { id: 'gem_ametista', name: 'Ametista', rarity: 'épico', bonuses: { INT: 4, CRIT: 2 }, image: 'gems/amethyst_4.png' },
  { id: 'gem_topazio', name: 'Topázio', rarity: 'raro', bonuses: { LUCK: 3, CRIT: 1 }, image: 'gems/topaz_3.png' },
  { id: 'gem_diamante', name: 'Diamante', rarity: 'lendário', bonuses: { HP_PCT: 3, MITIGATION_PCT: 2 }, image: 'gems/diamond_5.png' },
];

/** Bônus de Conjuntos (sets) — exemplo mínimo viável */
export const SET_BONUSES: SetBonusSpec[] = [
  { setId: 'vigia_ruinas_2p', name: 'Vigia das Ruínas (2p)', pieces: 2, bonuses: { DEF: 4 } },
  { setId: 'vigia_ruinas_4p', name: 'Vigia das Ruínas (4p)', pieces: 4, bonuses: { ATQ: 6 } },
  { setId: 'vigia_ruinas_6p', name: 'Vigia das Ruínas (6p)', pieces: 6, bonuses: { CRIT: 3 } },

  { setId: 'arcanista_fronteira_2p', name: 'Arcanista da Fronteira (2p)', pieces: 2, bonuses: { INT: 4 } },
  { setId: 'arcanista_fronteira_4p', name: 'Arcanista da Fronteira (4p)', pieces: 4, bonuses: { ATQ: 4 } },
  { setId: 'arcanista_fronteira_6p', name: 'Arcanista da Fronteira (6p)', pieces: 6, bonuses: { CRIT: 3, INT: 3 } },

  { setId: 'guardiao_placas_2p', name: 'Guardião de Placas (2p)', pieces: 2, bonuses: { DEF: 6 } },
  { setId: 'guardiao_placas_4p', name: 'Guardião de Placas (4p)', pieces: 4, bonuses: { MITIGATION_PCT: 2 } },
  { setId: 'guardiao_placas_6p', name: 'Guardião de Placas (6p)', pieces: 6, bonuses: { HP_PCT: 4 } },
];

/** Catálogo principal — ITEMS (amostras representativas e escaláveis) */
export const ITEMS: Item[] = [
  // Materiais (craft)
  { id: 'mat_couro_curtido', name: 'Couro Curtido', type: 'material', rarity: 'comum', material: 'couro', reqLevel: 1, valueCopper: computePriceCopper({ type:'material', rarity:'comum', reqLevel:1, material:'couro' }), image: 'materials/tanned_leather.png' },
  { id: 'mat_madeira_nobre', name: 'Madeira Nobre', type: 'material', rarity: 'comum', material: 'madeira_nobre', reqLevel: 1, valueCopper: computePriceCopper({ type:'material', rarity:'comum', reqLevel:1, material:'madeira_nobre' }), image: 'materials/hardwood.png' },
  { id: 'mat_lingote_ferro', name: 'Lingote de Ferro', type: 'material', rarity: 'comum', material: 'ferro', reqLevel: 2, valueCopper: computePriceCopper({ type:'material', rarity:'comum', reqLevel:2, material:'ferro' }), image: 'materials/iron_ingot.png' },
  { id: 'mat_lingote_aco', name: 'Lingote de Aço', type: 'material', rarity: 'incomum', material: 'aço', reqLevel: 5, valueCopper: computePriceCopper({ type:'material', rarity:'incomum', reqLevel:5, material:'aço' }), image: 'materials/steel_ingot.png' },
  { id: 'mat_mithril', name: 'Lingote de Mithril', type: 'material', rarity: 'raro', material: 'mithril', reqLevel: 10, valueCopper: computePriceCopper({ type:'material', rarity:'raro', reqLevel:10, material:'mithril' }), image: 'materials/mithril_ingot.png' },
  { id: 'mat_adamantita', name: 'Lingote de Adamantita', type: 'material', rarity: 'épico', material: 'adamantita', reqLevel: 16, valueCopper: computePriceCopper({ type:'material', rarity:'épico', reqLevel:16, material:'adamantita' }), image: 'materials/adamantite_ingot.png' },
  { id: 'mat_fibras_arcanas', name: 'Fibras Arcanas', type: 'material', rarity: 'raro', material: 'fibras_arcanas', reqLevel: 8, valueCopper: computePriceCopper({ type:'material', rarity:'raro', reqLevel:8, material:'fibras_arcanas' }), image: 'materials/arcane_fibers.png' },
  { id: 'mat_resina', name: 'Resina Antiga', type: 'material', rarity: 'comum', material: 'resina', reqLevel: 1, valueCopper: computePriceCopper({ type:'material', rarity:'comum', reqLevel:1, material:'resina' }), image: 'materials/resin.png' },
  { id: 'mat_runa', name: 'Runa Neutra', type: 'material', rarity: 'incomum', material: 'runa', reqLevel: 6, valueCopper: computePriceCopper({ type:'material', rarity:'incomum', reqLevel:6, material:'runa' }), image: 'materials/rune.png' },

  // Poções
  { id: 'poc_hp_pequena', name: 'Poção de Vida (Pequena)', type: 'poção', rarity: 'comum', reqLevel: 1, valueCopper: computePriceCopper({ type:'poção', rarity:'comum', reqLevel:1 }), image: 'potions/hp_small.png', bonuses: { HP: 30 } },
  { id: 'poc_hp_media', name: 'Poção de Vida (Média)', type: 'poção', rarity: 'incomum', reqLevel: 4, valueCopper: computePriceCopper({ type:'poção', rarity:'incomum', reqLevel:4 }), image: 'potions/hp_medium.png', bonuses: { HP: 80 } },
  { id: 'poc_hp_grande', name: 'Poção de Vida (Grande)', type: 'poção', rarity: 'raro', reqLevel: 8, valueCopper: computePriceCopper({ type:'poção', rarity:'raro', reqLevel:8 }), image: 'potions/hp_large.png', bonuses: { HP: 180 } },
  { id: 'tonico_agi', name: 'Tônico Ágil (60s)', type: 'poção', rarity: 'raro', reqLevel: 8, valueCopper: computePriceCopper({ type:'poção', rarity:'raro', reqLevel:8 }), image: 'potions/agi_tonic.png', bonuses: { AGI: 4 } },

  // Joias (sem ATQ/DEF direto)
  { id: 'anel_sorte', name: 'Anel de Sorte', type: 'joia', slot: 'anel_1', rarity: 'raro', reqLevel: 6, valueCopper: computePriceCopper({ type: 'joia', rarity: 'raro', reqLevel: 6 }), image: 'jewels/ring_luck.png', bonuses: { LUCK: 4, CRIT: 1 } },
  { id: 'amuleto_arcanista', name: 'Amuleto do Arcanista', type: 'joia', slot: 'amuleto', rarity: 'épico', reqLevel: 10, valueCopper: computePriceCopper({ type: 'joia', rarity: 'épico', reqLevel: 10 }), image: 'jewels/amulet_arcane.png', bonuses: { INT: 5, CRIT: 2 } },

  // Armas 1M
  { id: 'espada_aco_1m', name: 'Espada Longa de Aço', type: 'arma', slot: 'mão_principal', rarity: 'incomum', material: 'aço', reqLevel: 6, durability: 100, weight: 8, valueCopper: computePriceCopper({ type:'arma', rarity:'incomum', reqLevel:6, material:'aço' }), atk: 12, crit: 2, sockets: 1, image: 'weapons/sword_steel.png' },
  { id: 'adaga_mithril', name: 'Adaga de Mithril', type: 'arma', slot: 'mão_principal', rarity: 'raro', material: 'mithril', reqLevel: 10, durability: 90, weight: 3, valueCopper: computePriceCopper({ type:'arma', rarity:'raro', reqLevel:10, material:'mithril' }), atk: 10, crit: 5, bonuses: { AGI: 2 }, sockets: 1, image: 'weapons/dagger_mithril.png' },
  { id: 'cetro_arcano', name: 'Cetro Arcano', type: 'arma', slot: 'mão_principal', rarity: 'épico', material: 'fibras_arcanas', reqLevel: 12, durability: 80, weight: 4, valueCopper: computePriceCopper({ type:'arma', rarity:'épico', reqLevel:12, material:'fibras_arcanas' }), atk: 9, crit: 3, bonuses: { INT: 4 }, sockets: 2, image: 'weapons/scepter_arcane.png' },

  // Armas 2M (bloqueiam escudo)
  { id: 'lanca_adamantita_2m', name: 'Lança de Adamantita', type: 'arma', slot: 'mão_principal', rarity: 'épico', material: 'adamantita', reqLevel: 16, durability: 110, weight: 12, valueCopper: computePriceCopper({ type:'arma', rarity:'épico', reqLevel:16, material:'adamantita' }), atk: 20, crit: 4, sockets: 2, image: 'weapons/spear_adamantite.png' },
  { id: 'arco_composto', name: 'Arco Composto', type: 'arma', slot: 'mão_principal', rarity: 'raro', material: 'madeira_nobre', reqLevel: 9, durability: 85, weight: 6, valueCopper: computePriceCopper({ type:'arma', rarity:'raro', reqLevel:9, material:'madeira_nobre' }), atk: 13, crit: 3, bonuses: { AGI: 2 }, sockets: 1, image: 'weapons/bow_composite.png' },

  // Escudo (mão secundária)
  { id: 'escudo_placas', name: 'Escudo de Placas', type: 'armadura', slot: 'mão_secundária', rarity: 'raro', material: 'placas', reqLevel: 10, durability: 120, weight: 14, valueCopper: computePriceCopper({ type:'armadura', rarity:'raro', reqLevel:10, material:'placas' }), def: 14, bonuses: { DODGE: -1 }, sockets: 1, image: 'armors/shield_plate.png' },

  // Armaduras (leve/média/pesada)
  { id: 'capuz_couro', name: 'Capuz de Couro', type: 'armadura', slot: 'cabeça', rarity: 'comum', material: 'couro', reqLevel: 1, durability: 60, weight: 2, valueCopper: computePriceCopper({ type:'armadura', rarity:'comum', reqLevel:1, material:'couro' }), def: 3, image: 'armors/leather_hood.png' },
  { id: 'peitoral_escamas', name: 'Peitoral de Escamas', type: 'armadura', slot: 'peito', rarity: 'incomum', material: 'escamas', reqLevel: 6, durability: 100, weight: 10, valueCopper: computePriceCopper({ type:'armadura', rarity:'incomum', reqLevel:6, material:'escamas' }), def: 10, sockets: 1, image: 'armors/scale_chest.png' },
  { id: 'armadura_placas', name: 'Armadura de Placas', type: 'armadura', slot: 'peito', rarity: 'épico', material: 'placas', reqLevel: 14, durability: 150, weight: 18, valueCopper: computePriceCopper({ type:'armadura', rarity:'épico', reqLevel:14, material:'placas' }), def: 18, bonuses: { DODGE: -2 }, sockets: 2, setId: 'guardiao_placas', image: 'armors/plate_chest.png' },

  // Acessórios
  { id: 'manto_cinzento', name: 'Manto Cinzento', type: 'acessório', slot: 'manto', rarity: 'incomum', reqLevel: 4, valueCopper: computePriceCopper({ type:'acessório', rarity:'incomum', reqLevel:4 }), image: 'armors/cloak_gray.png', bonuses: { DODGE: 1 } },
  { id: 'cinto_utilidades', name: 'Cinto de Utilidades', type: 'acessório', slot: 'cintura', rarity: 'raro', reqLevel: 8, valueCopper: computePriceCopper({ type:'acessório', rarity:'raro', reqLevel:8 }), image: 'armors/belt_utility.png', bonuses: { AGI: 2, LUCK: 1 } },
];

/** Utilidades de equipamentos e stats (mínimo viável) */
export interface CharacterBase {
  STR: number; AGI: number; INT: number; VIT: number; LUCK: number;
  ATQ: number; DEF: number; CRIT: number; DODGE: number; HP: number;
}

export interface SkillsBonus { // agregados já calculados do seu sistema de skills
  bonuses: BonusMap;
}

export interface EquippedState {
  // por slot: itemId e gemIds encaixadas
  [slot: string]: { itemId: string; gemIds?: string[]; durability?: number } | undefined;
}

// regra de slot: arma 2M ocupa principal+secundária (precisa ser checada externamente)
export function isTwoHanded(item: Item): boolean {
  return ['lanca', 'arco', 'foice', 'martelo_2m'].some(k => item.id.includes(k)) || (item.weight ?? 0) >= 11;
}

// agrega bônus de item + gemas
export function aggregateItemBonuses(item: Item, gemIds: string[] | undefined): BonusMap {
  const out: BonusMap = {};
  const add = (src?: BonusMap) => {
    if (!src) return;
    for (const k of Object.keys(src) as (keyof BonusMap)[]) {
      const val = src[k];
      if (val == null) continue;
      (out as any)[k] = ((out as any)[k] ?? 0) + (val as number);
    }
  };
  add(item.bonuses);
  if (gemIds && gemIds.length) {
    for (const gid of gemIds) {
      const g = GEMS.find(x => x.id === gid);
      if (g) add(g.bonuses);
    }
  }
  if (item.atk) out.ATQ = (out.ATQ ?? 0) + item.atk;
  if (item.def) out.DEF = (out.DEF ?? 0) + item.def;
  if (item.crit) out.CRIT = (out.CRIT ?? 0) + item.crit;
  if (item.dodge) out.DODGE = (out.DODGE ?? 0) + item.dodge;
  return out;
}

// bônus de set: soma por contagem de peças instaladas
export function aggregateSetBonuses(equipped: EquippedState): BonusMap {
  const counts: Record<string, number> = {};
  for (const s of Object.values(equipped)) {
    if (!s) continue;
    const it = ITEMS.find(i => i.id === s.itemId);
    if (it?.setId) {
      counts[it.setId] = (counts[it.setId] ?? 0) + 1;
    }
  }
  const out: BonusMap = {};
  const add = (src?: BonusMap) => {
    if (!src) return;
    for (const k of Object.keys(src) as (keyof BonusMap)[]) {
      const val = src[k];
      if (val == null) continue;
      (out as any)[k] = ((out as any)[k] ?? 0) + (val as number);
    }
  };
  for (const [setId, c] of Object.entries(counts)) {
    for (const sb of SET_BONUSES) {
      if (!sb.setId.startsWith(setId)) continue; // grupos 2p/4p/6p do mesmo set
      if (c >= sb.pieces) add(sb.bonuses);
    }
  }
  return out;
}

export interface EffectiveBreakdown {
  total: number;
  base: number;
  itens: number;
  skills: number;
}

export interface EffectiveStats {
  ATQ: EffectiveBreakdown;
  DEF: EffectiveBreakdown;
  HP: EffectiveBreakdown;
  CRIT: EffectiveBreakdown;
  DODGE: EffectiveBreakdown;
  bonuses: BonusMap; // mapa agregado final (para tooltips)
}

/** Recalcula ATQ/DEF/CRIT/DODGE/HP: Base + Itens (incl. sets/gemas) + Skills */
export function computeEffectiveStats(base: CharacterBase, equipped: EquippedState, skills: SkillsBonus): EffectiveStats {
  // soma dos itens
  const itemAgg: BonusMap = {};
  const add = (dst: BonusMap, src: BonusMap) => {
    for (const k of Object.keys(src) as (keyof BonusMap)[]) {
      const val = src[k];
      if (val == null) continue;
      (dst as any)[k] = ((dst as any)[k] ?? 0) + (val as number);
    }
  };
  for (const [slot, s] of Object.entries(equipped)) {
    if (!s) continue;
    const item = ITEMS.find(i => i.id === s.itemId);
    if (!item) continue;
    const gems = s.gemIds ?? [];
    add(itemAgg, aggregateItemBonuses(item, gems));
  }
  // sets
  add(itemAgg, aggregateSetBonuses(equipped));
  // skills
  const skillAgg = skills?.bonuses ?? {};

  const breakdown = (baseVal: number, key: keyof BonusMap): EffectiveBreakdown => {
    const i = (itemAgg as any)[key] ?? 0;
    const sk = (skillAgg as any)[key] ?? 0;
    const total = Math.max(0, Math.floor(baseVal + i + sk));
    return { total, base: baseVal, itens: i, skills: sk };
  };

  const HP_pct = ((itemAgg.HP_PCT ?? 0) + (skillAgg.HP_PCT ?? 0));
  const baseHP = base.HP;
  const hpItemsFlat = (itemAgg.HP ?? 0) + (skillAgg.HP ?? 0);
  const hpTotal = Math.floor((baseHP + hpItemsFlat) * (1 + HP_pct / 100));

  return {
    ATQ: breakdown(base.ATQ, 'ATQ'),
    DEF: breakdown(base.DEF, 'DEF'),
    CRIT: breakdown(base.CRIT, 'CRIT'),
    DODGE: breakdown(base.DODGE, 'DODGE'),
    HP: { total: hpTotal, base: baseHP, itens: hpItemsFlat, skills: Math.floor(baseHP * (HP_pct / 100)) },
    bonuses: { ...itemAgg, ...skillAgg },
  };
}

/** Regras de durabilidade: perda maior em falha */
export function applyDurabilityLoss(equipped: EquippedState, outcome: 'sucesso' | 'falha', durabilityLossBase: number) {
  const mult = outcome === 'falha' ? 1.5 : 1.0;
  for (const [slot, s] of Object.entries(equipped)) {
    if (!s) continue;
    const it = ITEMS.find(i => i.id === s.itemId);
    if (!it?.durability) continue;
    const loss = Math.ceil(durabilityLossBase * mult * (it.type === 'arma' ? 1.2 : 1.0));
    s.durability = Math.max(0, Math.min((s.durability ?? it.durability ?? 100) - loss, it.durability ?? 100));
  }
}

/** Helper: custo de encaixe/remoção de gema */
export function socketCost(action: 'encaixar'|'remover', item: Item, gem: GemSpec): number {
  const base = computePriceCopper({ type: 'gema', rarity: gem.rarity, reqLevel: Math.max(1, item.reqLevel) });
  return action === 'encaixar' ? Math.floor(base * 0.25) : Math.floor(base * 0.5);
}


// === ITENS GERADOS AUTOMATICAMENTE ===
export const EXTRA_ITEMS: Item[] = [
{
  id: 'arma_0',
  name: 'Arco de Tecido',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'lendário',
  material: 'tecido',
  reqLevel: 27,
  durability: 100,
  weight: 9,
  valueCopper: 429,
  atk: 7,
  crit: 5,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_1',
  name: 'Martelo de Tecido',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'épico',
  material: 'tecido',
  reqLevel: 37,
  durability: 100,
  weight: 8,
  valueCopper: 247,
  atk: 37,
  crit: 4,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_2',
  name: 'Arco de Adamantita',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'épico',
  material: 'adamantita',
  reqLevel: 1,
  durability: 100,
  weight: 9,
  valueCopper: 156,
  atk: 16,
  crit: 0,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_3',
  name: 'Adaga de Fibras_Arcanas',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'comum',
  material: 'fibras_arcanas',
  reqLevel: 7,
  durability: 100,
  weight: 12,
  valueCopper: 494,
  atk: 24,
  crit: 4,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_4',
  name: 'Espada de Aço',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'comum',
  material: 'aço',
  reqLevel: 17,
  durability: 100,
  weight: 10,
  valueCopper: 134,
  atk: 12,
  crit: 6,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_5',
  name: 'Espada de Tecido',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'épico',
  material: 'tecido',
  reqLevel: 23,
  durability: 100,
  weight: 9,
  valueCopper: 225,
  atk: 38,
  crit: 1,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_6',
  name: 'Espada de Ferro',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'raro',
  material: 'ferro',
  reqLevel: 7,
  durability: 100,
  weight: 12,
  valueCopper: 154,
  atk: 13,
  crit: 8,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_7',
  name: 'Cajado de Ferro',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'épico',
  material: 'ferro',
  reqLevel: 38,
  durability: 100,
  weight: 11,
  valueCopper: 244,
  atk: 33,
  crit: 3,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_8',
  name: 'Arco de Mithril',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'épico',
  material: 'mithril',
  reqLevel: 21,
  durability: 100,
  weight: 11,
  valueCopper: 270,
  atk: 6,
  crit: 10,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_9',
  name: 'Martelo de Couro',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'raro',
  material: 'couro',
  reqLevel: 25,
  durability: 100,
  weight: 7,
  valueCopper: 352,
  atk: 24,
  crit: 9,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_10',
  name: 'Lança de Ferro',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'incomum',
  material: 'ferro',
  reqLevel: 17,
  durability: 100,
  weight: 4,
  valueCopper: 471,
  atk: 6,
  crit: 8,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_11',
  name: 'Lança de Tecido',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'épico',
  material: 'tecido',
  reqLevel: 25,
  durability: 100,
  weight: 9,
  valueCopper: 440,
  atk: 35,
  crit: 10,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_12',
  name: 'Cajado de Adamantita',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'raro',
  material: 'adamantita',
  reqLevel: 25,
  durability: 100,
  weight: 5,
  valueCopper: 295,
  atk: 24,
  crit: 5,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_13',
  name: 'Espada de Couro',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'comum',
  material: 'couro',
  reqLevel: 23,
  durability: 100,
  weight: 9,
  valueCopper: 200,
  atk: 10,
  crit: 0,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_14',
  name: 'Foice de Couro',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'comum',
  material: 'couro',
  reqLevel: 4,
  durability: 100,
  weight: 7,
  valueCopper: 142,
  atk: 15,
  crit: 1,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_15',
  name: 'Lança de Tecido',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'comum',
  material: 'tecido',
  reqLevel: 17,
  durability: 100,
  weight: 11,
  valueCopper: 303,
  atk: 10,
  crit: 5,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_16',
  name: 'Clava de Mithril',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'comum',
  material: 'mithril',
  reqLevel: 35,
  durability: 100,
  weight: 10,
  valueCopper: 475,
  atk: 38,
  crit: 5,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_17',
  name: 'Martelo de Ferro',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'épico',
  material: 'ferro',
  reqLevel: 3,
  durability: 100,
  weight: 4,
  valueCopper: 368,
  atk: 11,
  crit: 1,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_18',
  name: 'Machado de Mithril',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'épico',
  material: 'mithril',
  reqLevel: 12,
  durability: 100,
  weight: 9,
  valueCopper: 425,
  atk: 24,
  crit: 10,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_19',
  name: 'Arco de Adamantita',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'épico',
  material: 'adamantita',
  reqLevel: 2,
  durability: 100,
  weight: 7,
  valueCopper: 74,
  atk: 13,
  crit: 10,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_20',
  name: 'Clava de Mithril',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'raro',
  material: 'mithril',
  reqLevel: 9,
  durability: 100,
  weight: 8,
  valueCopper: 307,
  atk: 17,
  crit: 10,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_21',
  name: 'Foice de Tecido',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'lendário',
  material: 'tecido',
  reqLevel: 20,
  durability: 100,
  weight: 5,
  valueCopper: 194,
  atk: 16,
  crit: 0,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_22',
  name: 'Foice de Adamantita',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'épico',
  material: 'adamantita',
  reqLevel: 5,
  durability: 100,
  weight: 7,
  valueCopper: 227,
  atk: 35,
  crit: 10,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_23',
  name: 'Lança de Mithril',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'incomum',
  material: 'mithril',
  reqLevel: 17,
  durability: 100,
  weight: 11,
  valueCopper: 119,
  atk: 5,
  crit: 1,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_24',
  name: 'Machado de Couro',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'lendário',
  material: 'couro',
  reqLevel: 7,
  durability: 100,
  weight: 6,
  valueCopper: 285,
  atk: 23,
  crit: 8,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_25',
  name: 'Machado de Ferro',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'raro',
  material: 'ferro',
  reqLevel: 3,
  durability: 100,
  weight: 3,
  valueCopper: 151,
  atk: 9,
  crit: 8,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_26',
  name: 'Clava de Aço',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'épico',
  material: 'aço',
  reqLevel: 39,
  durability: 100,
  weight: 4,
  valueCopper: 369,
  atk: 12,
  crit: 9,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_27',
  name: 'Cajado de Tecido',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'lendário',
  material: 'tecido',
  reqLevel: 32,
  durability: 100,
  weight: 9,
  valueCopper: 51,
  atk: 40,
  crit: 4,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_28',
  name: 'Machado de Aço',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'incomum',
  material: 'aço',
  reqLevel: 35,
  durability: 100,
  weight: 9,
  valueCopper: 264,
  atk: 6,
  crit: 2,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_29',
  name: 'Espada de Aço',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'raro',
  material: 'aço',
  reqLevel: 2,
  durability: 100,
  weight: 8,
  valueCopper: 454,
  atk: 16,
  crit: 2,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_30',
  name: 'Arco de Fibras_Arcanas',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'comum',
  material: 'fibras_arcanas',
  reqLevel: 8,
  durability: 100,
  weight: 4,
  valueCopper: 439,
  atk: 13,
  crit: 9,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_31',
  name: 'Lança de Fibras_Arcanas',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'lendário',
  material: 'fibras_arcanas',
  reqLevel: 25,
  durability: 100,
  weight: 5,
  valueCopper: 316,
  atk: 11,
  crit: 1,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_32',
  name: 'Lança de Tecido',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'épico',
  material: 'tecido',
  reqLevel: 7,
  durability: 100,
  weight: 4,
  valueCopper: 180,
  atk: 37,
  crit: 7,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_33',
  name: 'Foice de Aço',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'raro',
  material: 'aço',
  reqLevel: 9,
  durability: 100,
  weight: 4,
  valueCopper: 235,
  atk: 26,
  crit: 7,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_34',
  name: 'Lança de Mithril',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'épico',
  material: 'mithril',
  reqLevel: 23,
  durability: 100,
  weight: 3,
  valueCopper: 332,
  atk: 25,
  crit: 10,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_35',
  name: 'Espada de Adamantita',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'comum',
  material: 'adamantita',
  reqLevel: 7,
  durability: 100,
  weight: 5,
  valueCopper: 202,
  atk: 23,
  crit: 9,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_36',
  name: 'Arco de Adamantita',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'raro',
  material: 'adamantita',
  reqLevel: 5,
  durability: 100,
  weight: 7,
  valueCopper: 306,
  atk: 5,
  crit: 4,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_37',
  name: 'Machado de Adamantita',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'lendário',
  material: 'adamantita',
  reqLevel: 8,
  durability: 100,
  weight: 3,
  valueCopper: 230,
  atk: 36,
  crit: 7,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_38',
  name: 'Foice de Aço',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'incomum',
  material: 'aço',
  reqLevel: 38,
  durability: 100,
  weight: 5,
  valueCopper: 178,
  atk: 7,
  crit: 1,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_39',
  name: 'Lança de Aço',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'comum',
  material: 'aço',
  reqLevel: 8,
  durability: 100,
  weight: 5,
  valueCopper: 303,
  atk: 23,
  crit: 0,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_40',
  name: 'Adaga de Mithril',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'lendário',
  material: 'mithril',
  reqLevel: 30,
  durability: 100,
  weight: 5,
  valueCopper: 195,
  atk: 39,
  crit: 9,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_41',
  name: 'Arco de Ferro',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'lendário',
  material: 'ferro',
  reqLevel: 21,
  durability: 100,
  weight: 10,
  valueCopper: 443,
  atk: 5,
  crit: 10,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_42',
  name: 'Lança de Couro',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'raro',
  material: 'couro',
  reqLevel: 26,
  durability: 100,
  weight: 7,
  valueCopper: 398,
  atk: 33,
  crit: 1,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_43',
  name: 'Cajado de Fibras_Arcanas',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'incomum',
  material: 'fibras_arcanas',
  reqLevel: 28,
  durability: 100,
  weight: 6,
  valueCopper: 207,
  atk: 29,
  crit: 4,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_44',
  name: 'Lança de Fibras_Arcanas',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'raro',
  material: 'fibras_arcanas',
  reqLevel: 12,
  durability: 100,
  weight: 8,
  valueCopper: 381,
  atk: 40,
  crit: 1,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_45',
  name: 'Clava de Couro',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'raro',
  material: 'couro',
  reqLevel: 32,
  durability: 100,
  weight: 10,
  valueCopper: 175,
  atk: 25,
  crit: 9,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_46',
  name: 'Adaga de Mithril',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'épico',
  material: 'mithril',
  reqLevel: 3,
  durability: 100,
  weight: 11,
  valueCopper: 326,
  atk: 10,
  crit: 7,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_47',
  name: 'Adaga de Ferro',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'comum',
  material: 'ferro',
  reqLevel: 13,
  durability: 100,
  weight: 10,
  valueCopper: 334,
  atk: 23,
  crit: 10,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_48',
  name: 'Martelo de Aço',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'raro',
  material: 'aço',
  reqLevel: 25,
  durability: 100,
  weight: 11,
  valueCopper: 343,
  atk: 36,
  crit: 7,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_49',
  name: 'Machado de Fibras_Arcanas',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'épico',
  material: 'fibras_arcanas',
  reqLevel: 24,
  durability: 100,
  weight: 6,
  valueCopper: 228,
  atk: 10,
  crit: 2,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_50',
  name: 'Martelo de Mithril',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'lendário',
  material: 'mithril',
  reqLevel: 39,
  durability: 100,
  weight: 7,
  valueCopper: 441,
  atk: 34,
  crit: 0,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_51',
  name: 'Cajado de Ferro',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'raro',
  material: 'ferro',
  reqLevel: 15,
  durability: 100,
  weight: 12,
  valueCopper: 273,
  atk: 10,
  crit: 0,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_52',
  name: 'Machado de Ferro',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'lendário',
  material: 'ferro',
  reqLevel: 37,
  durability: 100,
  weight: 7,
  valueCopper: 130,
  atk: 19,
  crit: 3,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_53',
  name: 'Arco de Mithril',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'comum',
  material: 'mithril',
  reqLevel: 31,
  durability: 100,
  weight: 10,
  valueCopper: 470,
  atk: 29,
  crit: 5,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_54',
  name: 'Lança de Couro',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'lendário',
  material: 'couro',
  reqLevel: 33,
  durability: 100,
  weight: 3,
  valueCopper: 395,
  atk: 13,
  crit: 7,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_55',
  name: 'Lança de Mithril',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'comum',
  material: 'mithril',
  reqLevel: 30,
  durability: 100,
  weight: 11,
  valueCopper: 216,
  atk: 12,
  crit: 7,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_56',
  name: 'Adaga de Ferro',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'comum',
  material: 'ferro',
  reqLevel: 33,
  durability: 100,
  weight: 11,
  valueCopper: 138,
  atk: 6,
  crit: 9,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_57',
  name: 'Martelo de Aço',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'comum',
  material: 'aço',
  reqLevel: 1,
  durability: 100,
  weight: 8,
  valueCopper: 402,
  atk: 31,
  crit: 3,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_58',
  name: 'Espada de Tecido',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'incomum',
  material: 'tecido',
  reqLevel: 4,
  durability: 100,
  weight: 12,
  valueCopper: 261,
  atk: 26,
  crit: 0,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_59',
  name: 'Cajado de Mithril',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'comum',
  material: 'mithril',
  reqLevel: 12,
  durability: 100,
  weight: 11,
  valueCopper: 493,
  atk: 6,
  crit: 2,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_60',
  name: 'Clava de Fibras_Arcanas',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'lendário',
  material: 'fibras_arcanas',
  reqLevel: 9,
  durability: 100,
  weight: 5,
  valueCopper: 82,
  atk: 8,
  crit: 3,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_61',
  name: 'Martelo de Adamantita',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'raro',
  material: 'adamantita',
  reqLevel: 13,
  durability: 100,
  weight: 6,
  valueCopper: 250,
  atk: 38,
  crit: 6,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_62',
  name: 'Martelo de Ferro',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'lendário',
  material: 'ferro',
  reqLevel: 15,
  durability: 100,
  weight: 10,
  valueCopper: 329,
  atk: 6,
  crit: 7,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_63',
  name: 'Adaga de Mithril',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'incomum',
  material: 'mithril',
  reqLevel: 36,
  durability: 100,
  weight: 12,
  valueCopper: 276,
  atk: 36,
  crit: 5,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_64',
  name: 'Martelo de Tecido',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'comum',
  material: 'tecido',
  reqLevel: 18,
  durability: 100,
  weight: 11,
  valueCopper: 306,
  atk: 22,
  crit: 4,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_65',
  name: 'Lança de Tecido',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'lendário',
  material: 'tecido',
  reqLevel: 29,
  durability: 100,
  weight: 9,
  valueCopper: 198,
  atk: 23,
  crit: 3,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_66',
  name: 'Clava de Mithril',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'lendário',
  material: 'mithril',
  reqLevel: 24,
  durability: 100,
  weight: 3,
  valueCopper: 310,
  atk: 11,
  crit: 8,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_67',
  name: 'Clava de Fibras_Arcanas',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'incomum',
  material: 'fibras_arcanas',
  reqLevel: 26,
  durability: 100,
  weight: 12,
  valueCopper: 332,
  atk: 8,
  crit: 1,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_68',
  name: 'Clava de Ferro',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'incomum',
  material: 'ferro',
  reqLevel: 33,
  durability: 100,
  weight: 5,
  valueCopper: 345,
  atk: 36,
  crit: 5,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'arma_69',
  name: 'Adaga de Aço',
  type: 'arma',
  slot: 'mão_principal',
  rarity: 'épico',
  material: 'aço',
  reqLevel: 29,
  durability: 100,
  weight: 3,
  valueCopper: 143,
  atk: 21,
  crit: 2,
  image: '/images/items/weapons/placeholder.png'
},
{
  id: 'armadura_0',
  name: 'Calças de Couro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'raro',
  material: 'couro',
  reqLevel: 15,
  durability: 100,
  weight: 5,
  valueCopper: 443,
  def: 16,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_1',
  name: 'Peitoral de Mithril',
  type: 'armadura',
  slot: 'peito',
  rarity: 'incomum',
  material: 'mithril',
  reqLevel: 37,
  durability: 100,
  weight: 11,
  valueCopper: 342,
  def: 16,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_2',
  name: 'Capacete de Couro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'incomum',
  material: 'couro',
  reqLevel: 30,
  durability: 100,
  weight: 20,
  valueCopper: 314,
  def: 35,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_3',
  name: 'Botas de Adamantita',
  type: 'armadura',
  slot: 'peito',
  rarity: 'comum',
  material: 'adamantita',
  reqLevel: 28,
  durability: 100,
  weight: 9,
  valueCopper: 496,
  def: 19,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_4',
  name: 'Escudo de Ferro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'comum',
  material: 'ferro',
  reqLevel: 27,
  durability: 100,
  weight: 16,
  valueCopper: 135,
  def: 8,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_5',
  name: 'Manto de Tecido',
  type: 'armadura',
  slot: 'peito',
  rarity: 'épico',
  material: 'tecido',
  reqLevel: 40,
  durability: 100,
  weight: 5,
  valueCopper: 129,
  def: 34,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_6',
  name: 'Capacete de Aço',
  type: 'armadura',
  slot: 'peito',
  rarity: 'épico',
  material: 'aço',
  reqLevel: 6,
  durability: 100,
  weight: 11,
  valueCopper: 193,
  def: 13,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_7',
  name: 'Botas de Couro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'incomum',
  material: 'couro',
  reqLevel: 34,
  durability: 100,
  weight: 11,
  valueCopper: 225,
  def: 13,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_8',
  name: 'Peitoral de Mithril',
  type: 'armadura',
  slot: 'peito',
  rarity: 'comum',
  material: 'mithril',
  reqLevel: 1,
  durability: 100,
  weight: 13,
  valueCopper: 74,
  def: 16,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_9',
  name: 'Capacete de Couro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'épico',
  material: 'couro',
  reqLevel: 22,
  durability: 100,
  weight: 18,
  valueCopper: 434,
  def: 6,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_10',
  name: 'Peitoral de Fibras_Arcanas',
  type: 'armadura',
  slot: 'peito',
  rarity: 'comum',
  material: 'fibras_arcanas',
  reqLevel: 26,
  durability: 100,
  weight: 12,
  valueCopper: 60,
  def: 26,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_11',
  name: 'Peitoral de Fibras_Arcanas',
  type: 'armadura',
  slot: 'peito',
  rarity: 'comum',
  material: 'fibras_arcanas',
  reqLevel: 7,
  durability: 100,
  weight: 17,
  valueCopper: 63,
  def: 7,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_12',
  name: 'Botas de Mithril',
  type: 'armadura',
  slot: 'peito',
  rarity: 'raro',
  material: 'mithril',
  reqLevel: 28,
  durability: 100,
  weight: 19,
  valueCopper: 387,
  def: 18,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_13',
  name: 'Escudo de Fibras_Arcanas',
  type: 'armadura',
  slot: 'peito',
  rarity: 'raro',
  material: 'fibras_arcanas',
  reqLevel: 9,
  durability: 100,
  weight: 9,
  valueCopper: 146,
  def: 21,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_14',
  name: 'Botas de Adamantita',
  type: 'armadura',
  slot: 'peito',
  rarity: 'raro',
  material: 'adamantita',
  reqLevel: 15,
  durability: 100,
  weight: 20,
  valueCopper: 336,
  def: 8,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_15',
  name: 'Botas de Adamantita',
  type: 'armadura',
  slot: 'peito',
  rarity: 'raro',
  material: 'adamantita',
  reqLevel: 38,
  durability: 100,
  weight: 19,
  valueCopper: 468,
  def: 19,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_16',
  name: 'Peitoral de Mithril',
  type: 'armadura',
  slot: 'peito',
  rarity: 'épico',
  material: 'mithril',
  reqLevel: 7,
  durability: 100,
  weight: 12,
  valueCopper: 222,
  def: 26,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_17',
  name: 'Luvas de Adamantita',
  type: 'armadura',
  slot: 'peito',
  rarity: 'épico',
  material: 'adamantita',
  reqLevel: 15,
  durability: 100,
  weight: 6,
  valueCopper: 471,
  def: 15,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_18',
  name: 'Peitoral de Tecido',
  type: 'armadura',
  slot: 'peito',
  rarity: 'raro',
  material: 'tecido',
  reqLevel: 21,
  durability: 100,
  weight: 20,
  valueCopper: 397,
  def: 25,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_19',
  name: 'Cinto de Aço',
  type: 'armadura',
  slot: 'peito',
  rarity: 'incomum',
  material: 'aço',
  reqLevel: 23,
  durability: 100,
  weight: 5,
  valueCopper: 187,
  def: 35,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_20',
  name: 'Cinto de Mithril',
  type: 'armadura',
  slot: 'peito',
  rarity: 'lendário',
  material: 'mithril',
  reqLevel: 22,
  durability: 100,
  weight: 11,
  valueCopper: 108,
  def: 26,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_21',
  name: 'Calças de Aço',
  type: 'armadura',
  slot: 'peito',
  rarity: 'épico',
  material: 'aço',
  reqLevel: 16,
  durability: 100,
  weight: 15,
  valueCopper: 282,
  def: 23,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_22',
  name: 'Peitoral de Fibras_Arcanas',
  type: 'armadura',
  slot: 'peito',
  rarity: 'comum',
  material: 'fibras_arcanas',
  reqLevel: 32,
  durability: 100,
  weight: 17,
  valueCopper: 453,
  def: 22,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_23',
  name: 'Cinto de Adamantita',
  type: 'armadura',
  slot: 'peito',
  rarity: 'épico',
  material: 'adamantita',
  reqLevel: 24,
  durability: 100,
  weight: 12,
  valueCopper: 95,
  def: 8,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_24',
  name: 'Cinto de Tecido',
  type: 'armadura',
  slot: 'peito',
  rarity: 'raro',
  material: 'tecido',
  reqLevel: 1,
  durability: 100,
  weight: 10,
  valueCopper: 427,
  def: 32,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_25',
  name: 'Luvas de Aço',
  type: 'armadura',
  slot: 'peito',
  rarity: 'raro',
  material: 'aço',
  reqLevel: 21,
  durability: 100,
  weight: 20,
  valueCopper: 481,
  def: 16,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_26',
  name: 'Luvas de Mithril',
  type: 'armadura',
  slot: 'peito',
  rarity: 'incomum',
  material: 'mithril',
  reqLevel: 33,
  durability: 100,
  weight: 13,
  valueCopper: 462,
  def: 32,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_27',
  name: 'Luvas de Mithril',
  type: 'armadura',
  slot: 'peito',
  rarity: 'comum',
  material: 'mithril',
  reqLevel: 22,
  durability: 100,
  weight: 15,
  valueCopper: 151,
  def: 5,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_28',
  name: 'Calças de Aço',
  type: 'armadura',
  slot: 'peito',
  rarity: 'raro',
  material: 'aço',
  reqLevel: 31,
  durability: 100,
  weight: 19,
  valueCopper: 464,
  def: 12,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_29',
  name: 'Calças de Couro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'incomum',
  material: 'couro',
  reqLevel: 21,
  durability: 100,
  weight: 13,
  valueCopper: 343,
  def: 16,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_30',
  name: 'Escudo de Ferro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'comum',
  material: 'ferro',
  reqLevel: 11,
  durability: 100,
  weight: 8,
  valueCopper: 241,
  def: 28,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_31',
  name: 'Manto de Mithril',
  type: 'armadura',
  slot: 'peito',
  rarity: 'incomum',
  material: 'mithril',
  reqLevel: 20,
  durability: 100,
  weight: 8,
  valueCopper: 86,
  def: 10,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_32',
  name: 'Peitoral de Ferro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'raro',
  material: 'ferro',
  reqLevel: 17,
  durability: 100,
  weight: 17,
  valueCopper: 279,
  def: 25,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_33',
  name: 'Manto de Tecido',
  type: 'armadura',
  slot: 'peito',
  rarity: 'incomum',
  material: 'tecido',
  reqLevel: 22,
  durability: 100,
  weight: 20,
  valueCopper: 273,
  def: 11,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_34',
  name: 'Cinto de Mithril',
  type: 'armadura',
  slot: 'peito',
  rarity: 'raro',
  material: 'mithril',
  reqLevel: 27,
  durability: 100,
  weight: 13,
  valueCopper: 462,
  def: 12,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_35',
  name: 'Manto de Ferro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'épico',
  material: 'ferro',
  reqLevel: 22,
  durability: 100,
  weight: 13,
  valueCopper: 428,
  def: 12,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_36',
  name: 'Peitoral de Mithril',
  type: 'armadura',
  slot: 'peito',
  rarity: 'lendário',
  material: 'mithril',
  reqLevel: 13,
  durability: 100,
  weight: 14,
  valueCopper: 367,
  def: 28,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_37',
  name: 'Calças de Adamantita',
  type: 'armadura',
  slot: 'peito',
  rarity: 'épico',
  material: 'adamantita',
  reqLevel: 8,
  durability: 100,
  weight: 19,
  valueCopper: 304,
  def: 7,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_38',
  name: 'Peitoral de Adamantita',
  type: 'armadura',
  slot: 'peito',
  rarity: 'lendário',
  material: 'adamantita',
  reqLevel: 10,
  durability: 100,
  weight: 15,
  valueCopper: 94,
  def: 31,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_39',
  name: 'Peitoral de Couro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'comum',
  material: 'couro',
  reqLevel: 24,
  durability: 100,
  weight: 20,
  valueCopper: 268,
  def: 16,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_40',
  name: 'Escudo de Aço',
  type: 'armadura',
  slot: 'peito',
  rarity: 'comum',
  material: 'aço',
  reqLevel: 38,
  durability: 100,
  weight: 14,
  valueCopper: 300,
  def: 16,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_41',
  name: 'Manto de Mithril',
  type: 'armadura',
  slot: 'peito',
  rarity: 'lendário',
  material: 'mithril',
  reqLevel: 1,
  durability: 100,
  weight: 6,
  valueCopper: 465,
  def: 6,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_42',
  name: 'Manto de Adamantita',
  type: 'armadura',
  slot: 'peito',
  rarity: 'épico',
  material: 'adamantita',
  reqLevel: 2,
  durability: 100,
  weight: 9,
  valueCopper: 261,
  def: 30,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_43',
  name: 'Escudo de Mithril',
  type: 'armadura',
  slot: 'peito',
  rarity: 'lendário',
  material: 'mithril',
  reqLevel: 34,
  durability: 100,
  weight: 16,
  valueCopper: 370,
  def: 9,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_44',
  name: 'Cinto de Tecido',
  type: 'armadura',
  slot: 'peito',
  rarity: 'incomum',
  material: 'tecido',
  reqLevel: 39,
  durability: 100,
  weight: 7,
  valueCopper: 297,
  def: 15,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_45',
  name: 'Manto de Adamantita',
  type: 'armadura',
  slot: 'peito',
  rarity: 'raro',
  material: 'adamantita',
  reqLevel: 18,
  durability: 100,
  weight: 11,
  valueCopper: 456,
  def: 31,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_46',
  name: 'Cinto de Fibras_Arcanas',
  type: 'armadura',
  slot: 'peito',
  rarity: 'lendário',
  material: 'fibras_arcanas',
  reqLevel: 7,
  durability: 100,
  weight: 17,
  valueCopper: 271,
  def: 33,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_47',
  name: 'Peitoral de Ferro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'incomum',
  material: 'ferro',
  reqLevel: 28,
  durability: 100,
  weight: 9,
  valueCopper: 299,
  def: 23,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_48',
  name: 'Botas de Tecido',
  type: 'armadura',
  slot: 'peito',
  rarity: 'épico',
  material: 'tecido',
  reqLevel: 25,
  durability: 100,
  weight: 7,
  valueCopper: 173,
  def: 23,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_49',
  name: 'Calças de Tecido',
  type: 'armadura',
  slot: 'peito',
  rarity: 'raro',
  material: 'tecido',
  reqLevel: 15,
  durability: 100,
  weight: 15,
  valueCopper: 88,
  def: 7,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_50',
  name: 'Capacete de Mithril',
  type: 'armadura',
  slot: 'peito',
  rarity: 'comum',
  material: 'mithril',
  reqLevel: 17,
  durability: 100,
  weight: 14,
  valueCopper: 402,
  def: 25,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_51',
  name: 'Luvas de Fibras_Arcanas',
  type: 'armadura',
  slot: 'peito',
  rarity: 'épico',
  material: 'fibras_arcanas',
  reqLevel: 30,
  durability: 100,
  weight: 7,
  valueCopper: 222,
  def: 24,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_52',
  name: 'Luvas de Couro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'incomum',
  material: 'couro',
  reqLevel: 28,
  durability: 100,
  weight: 9,
  valueCopper: 64,
  def: 9,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_53',
  name: 'Cinto de Couro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'raro',
  material: 'couro',
  reqLevel: 28,
  durability: 100,
  weight: 5,
  valueCopper: 447,
  def: 8,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_54',
  name: 'Calças de Aço',
  type: 'armadura',
  slot: 'peito',
  rarity: 'lendário',
  material: 'aço',
  reqLevel: 34,
  durability: 100,
  weight: 13,
  valueCopper: 316,
  def: 19,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_55',
  name: 'Calças de Ferro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'comum',
  material: 'ferro',
  reqLevel: 28,
  durability: 100,
  weight: 6,
  valueCopper: 434,
  def: 14,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_56',
  name: 'Cinto de Mithril',
  type: 'armadura',
  slot: 'peito',
  rarity: 'incomum',
  material: 'mithril',
  reqLevel: 18,
  durability: 100,
  weight: 12,
  valueCopper: 450,
  def: 34,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_57',
  name: 'Cinto de Aço',
  type: 'armadura',
  slot: 'peito',
  rarity: 'épico',
  material: 'aço',
  reqLevel: 17,
  durability: 100,
  weight: 5,
  valueCopper: 215,
  def: 33,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_58',
  name: 'Cinto de Ferro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'incomum',
  material: 'ferro',
  reqLevel: 25,
  durability: 100,
  weight: 12,
  valueCopper: 70,
  def: 9,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_59',
  name: 'Peitoral de Fibras_Arcanas',
  type: 'armadura',
  slot: 'peito',
  rarity: 'épico',
  material: 'fibras_arcanas',
  reqLevel: 20,
  durability: 100,
  weight: 7,
  valueCopper: 393,
  def: 29,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_60',
  name: 'Peitoral de Couro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'incomum',
  material: 'couro',
  reqLevel: 12,
  durability: 100,
  weight: 15,
  valueCopper: 129,
  def: 15,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_61',
  name: 'Peitoral de Couro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'lendário',
  material: 'couro',
  reqLevel: 7,
  durability: 100,
  weight: 10,
  valueCopper: 166,
  def: 5,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_62',
  name: 'Peitoral de Ferro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'épico',
  material: 'ferro',
  reqLevel: 6,
  durability: 100,
  weight: 12,
  valueCopper: 163,
  def: 26,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_63',
  name: 'Escudo de Couro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'incomum',
  material: 'couro',
  reqLevel: 7,
  durability: 100,
  weight: 18,
  valueCopper: 368,
  def: 10,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_64',
  name: 'Peitoral de Mithril',
  type: 'armadura',
  slot: 'peito',
  rarity: 'comum',
  material: 'mithril',
  reqLevel: 20,
  durability: 100,
  weight: 16,
  valueCopper: 167,
  def: 22,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_65',
  name: 'Botas de Mithril',
  type: 'armadura',
  slot: 'peito',
  rarity: 'raro',
  material: 'mithril',
  reqLevel: 18,
  durability: 100,
  weight: 9,
  valueCopper: 146,
  def: 31,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_66',
  name: 'Peitoral de Couro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'raro',
  material: 'couro',
  reqLevel: 7,
  durability: 100,
  weight: 5,
  valueCopper: 201,
  def: 20,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_67',
  name: 'Cinto de Couro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'épico',
  material: 'couro',
  reqLevel: 25,
  durability: 100,
  weight: 20,
  valueCopper: 97,
  def: 25,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_68',
  name: 'Escudo de Mithril',
  type: 'armadura',
  slot: 'peito',
  rarity: 'lendário',
  material: 'mithril',
  reqLevel: 9,
  durability: 100,
  weight: 20,
  valueCopper: 237,
  def: 24,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'armadura_69',
  name: 'Capacete de Couro',
  type: 'armadura',
  slot: 'peito',
  rarity: 'incomum',
  material: 'couro',
  reqLevel: 29,
  durability: 100,
  weight: 16,
  valueCopper: 133,
  def: 9,
  image: '/images/items/armors/placeholder.png'
},
{
  id: 'comida_0',
  name: 'Erva Exótica Especial',
  type: 'comida',
  rarity: 'comum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 71,
  bonuses: { HP: 78 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_1',
  name: 'Carne Seca Especial',
  type: 'comida',
  rarity: 'lendário',
  reqLevel: 1,
  weight: 1,
  valueCopper: 44,
  bonuses: { HP: 29 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_2',
  name: 'Torta Especial',
  type: 'comida',
  rarity: 'incomum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 95,
  bonuses: { HP: 173 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_3',
  name: 'Pão Especial',
  type: 'comida',
  rarity: 'comum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 64,
  bonuses: { HP: 196 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_4',
  name: 'Fruta Mágica Especial',
  type: 'comida',
  rarity: 'raro',
  reqLevel: 1,
  weight: 1,
  valueCopper: 32,
  bonuses: { HP: 159 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_5',
  name: 'Pão Especial',
  type: 'comida',
  rarity: 'incomum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 92,
  bonuses: { HP: 196 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_6',
  name: 'Mel Especial',
  type: 'comida',
  rarity: 'épico',
  reqLevel: 1,
  weight: 1,
  valueCopper: 13,
  bonuses: { HP: 140 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_7',
  name: 'Mel Especial',
  type: 'comida',
  rarity: 'comum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 87,
  bonuses: { HP: 88 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_8',
  name: 'Torta Especial',
  type: 'comida',
  rarity: 'lendário',
  reqLevel: 1,
  weight: 1,
  valueCopper: 64,
  bonuses: { HP: 74 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_9',
  name: 'Sopa Especial',
  type: 'comida',
  rarity: 'lendário',
  reqLevel: 1,
  weight: 1,
  valueCopper: 93,
  bonuses: { HP: 113 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_10',
  name: 'Carne Seca Especial',
  type: 'comida',
  rarity: 'comum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 65,
  bonuses: { HP: 51 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_11',
  name: 'Pão Especial',
  type: 'comida',
  rarity: 'incomum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 37,
  bonuses: { HP: 154 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_12',
  name: 'Carne Seca Especial',
  type: 'comida',
  rarity: 'épico',
  reqLevel: 1,
  weight: 1,
  valueCopper: 63,
  bonuses: { HP: 115 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_13',
  name: 'Queijo Especial',
  type: 'comida',
  rarity: 'lendário',
  reqLevel: 1,
  weight: 1,
  valueCopper: 41,
  bonuses: { HP: 128 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_14',
  name: 'Erva Exótica Especial',
  type: 'comida',
  rarity: 'lendário',
  reqLevel: 1,
  weight: 1,
  valueCopper: 87,
  bonuses: { HP: 178 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_15',
  name: 'Torta Especial',
  type: 'comida',
  rarity: 'lendário',
  reqLevel: 1,
  weight: 1,
  valueCopper: 23,
  bonuses: { HP: 97 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_16',
  name: 'Erva Exótica Especial',
  type: 'comida',
  rarity: 'lendário',
  reqLevel: 1,
  weight: 1,
  valueCopper: 95,
  bonuses: { HP: 84 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_17',
  name: 'Carne Seca Especial',
  type: 'comida',
  rarity: 'comum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 97,
  bonuses: { HP: 155 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_18',
  name: 'Queijo Especial',
  type: 'comida',
  rarity: 'épico',
  reqLevel: 1,
  weight: 1,
  valueCopper: 38,
  bonuses: { HP: 141 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_19',
  name: 'Mel Especial',
  type: 'comida',
  rarity: 'lendário',
  reqLevel: 1,
  weight: 1,
  valueCopper: 49,
  bonuses: { HP: 79 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_20',
  name: 'Sopa Especial',
  type: 'comida',
  rarity: 'épico',
  reqLevel: 1,
  weight: 1,
  valueCopper: 70,
  bonuses: { HP: 170 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_21',
  name: 'Ensopado Especial',
  type: 'comida',
  rarity: 'lendário',
  reqLevel: 1,
  weight: 1,
  valueCopper: 46,
  bonuses: { HP: 135 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_22',
  name: 'Queijo Especial',
  type: 'comida',
  rarity: 'épico',
  reqLevel: 1,
  weight: 1,
  valueCopper: 64,
  bonuses: { HP: 191 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_23',
  name: 'Ensopado Especial',
  type: 'comida',
  rarity: 'lendário',
  reqLevel: 1,
  weight: 1,
  valueCopper: 93,
  bonuses: { HP: 86 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_24',
  name: 'Carne Seca Especial',
  type: 'comida',
  rarity: 'épico',
  reqLevel: 1,
  weight: 1,
  valueCopper: 62,
  bonuses: { HP: 180 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_25',
  name: 'Torta Especial',
  type: 'comida',
  rarity: 'raro',
  reqLevel: 1,
  weight: 1,
  valueCopper: 84,
  bonuses: { HP: 78 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_26',
  name: 'Erva Exótica Especial',
  type: 'comida',
  rarity: 'épico',
  reqLevel: 1,
  weight: 1,
  valueCopper: 67,
  bonuses: { HP: 43 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_27',
  name: 'Pão Especial',
  type: 'comida',
  rarity: 'lendário',
  reqLevel: 1,
  weight: 1,
  valueCopper: 88,
  bonuses: { HP: 198 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_28',
  name: 'Sopa Especial',
  type: 'comida',
  rarity: 'incomum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 47,
  bonuses: { HP: 34 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_29',
  name: 'Carne Seca Especial',
  type: 'comida',
  rarity: 'épico',
  reqLevel: 1,
  weight: 1,
  valueCopper: 82,
  bonuses: { HP: 43 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_30',
  name: 'Torta Especial',
  type: 'comida',
  rarity: 'raro',
  reqLevel: 1,
  weight: 1,
  valueCopper: 70,
  bonuses: { HP: 95 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_31',
  name: 'Carne Seca Especial',
  type: 'comida',
  rarity: 'lendário',
  reqLevel: 1,
  weight: 1,
  valueCopper: 77,
  bonuses: { HP: 117 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_32',
  name: 'Fruta Mágica Especial',
  type: 'comida',
  rarity: 'raro',
  reqLevel: 1,
  weight: 1,
  valueCopper: 15,
  bonuses: { HP: 174 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_33',
  name: 'Fruta Mágica Especial',
  type: 'comida',
  rarity: 'incomum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 24,
  bonuses: { HP: 127 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_34',
  name: 'Fruta Mágica Especial',
  type: 'comida',
  rarity: 'lendário',
  reqLevel: 1,
  weight: 1,
  valueCopper: 15,
  bonuses: { HP: 125 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_35',
  name: 'Fruta Mágica Especial',
  type: 'comida',
  rarity: 'raro',
  reqLevel: 1,
  weight: 1,
  valueCopper: 60,
  bonuses: { HP: 133 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_36',
  name: 'Erva Exótica Especial',
  type: 'comida',
  rarity: 'incomum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 70,
  bonuses: { HP: 152 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_37',
  name: 'Erva Exótica Especial',
  type: 'comida',
  rarity: 'incomum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 22,
  bonuses: { HP: 36 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_38',
  name: 'Pão Especial',
  type: 'comida',
  rarity: 'épico',
  reqLevel: 1,
  weight: 1,
  valueCopper: 68,
  bonuses: { HP: 106 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_39',
  name: 'Torta Especial',
  type: 'comida',
  rarity: 'lendário',
  reqLevel: 1,
  weight: 1,
  valueCopper: 88,
  bonuses: { HP: 180 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_40',
  name: 'Queijo Especial',
  type: 'comida',
  rarity: 'incomum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 14,
  bonuses: { HP: 64 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_41',
  name: 'Ensopado Especial',
  type: 'comida',
  rarity: 'raro',
  reqLevel: 1,
  weight: 1,
  valueCopper: 67,
  bonuses: { HP: 105 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_42',
  name: 'Pão Especial',
  type: 'comida',
  rarity: 'comum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 67,
  bonuses: { HP: 55 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_43',
  name: 'Sopa Especial',
  type: 'comida',
  rarity: 'lendário',
  reqLevel: 1,
  weight: 1,
  valueCopper: 58,
  bonuses: { HP: 50 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_44',
  name: 'Fruta Mágica Especial',
  type: 'comida',
  rarity: 'comum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 76,
  bonuses: { HP: 82 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_45',
  name: 'Torta Especial',
  type: 'comida',
  rarity: 'lendário',
  reqLevel: 1,
  weight: 1,
  valueCopper: 23,
  bonuses: { HP: 43 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_46',
  name: 'Erva Exótica Especial',
  type: 'comida',
  rarity: 'raro',
  reqLevel: 1,
  weight: 1,
  valueCopper: 47,
  bonuses: { HP: 181 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_47',
  name: 'Fruta Mágica Especial',
  type: 'comida',
  rarity: 'lendário',
  reqLevel: 1,
  weight: 1,
  valueCopper: 62,
  bonuses: { HP: 86 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_48',
  name: 'Sopa Especial',
  type: 'comida',
  rarity: 'épico',
  reqLevel: 1,
  weight: 1,
  valueCopper: 82,
  bonuses: { HP: 33 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_49',
  name: 'Erva Exótica Especial',
  type: 'comida',
  rarity: 'comum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 95,
  bonuses: { HP: 162 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_50',
  name: 'Ensopado Especial',
  type: 'comida',
  rarity: 'incomum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 8,
  bonuses: { HP: 68 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_51',
  name: 'Fruta Mágica Especial',
  type: 'comida',
  rarity: 'incomum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 44,
  bonuses: { HP: 190 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_52',
  name: 'Erva Exótica Especial',
  type: 'comida',
  rarity: 'épico',
  reqLevel: 1,
  weight: 1,
  valueCopper: 84,
  bonuses: { HP: 136 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_53',
  name: 'Erva Exótica Especial',
  type: 'comida',
  rarity: 'raro',
  reqLevel: 1,
  weight: 1,
  valueCopper: 78,
  bonuses: { HP: 58 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_54',
  name: 'Sopa Especial',
  type: 'comida',
  rarity: 'comum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 98,
  bonuses: { HP: 96 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_55',
  name: 'Erva Exótica Especial',
  type: 'comida',
  rarity: 'raro',
  reqLevel: 1,
  weight: 1,
  valueCopper: 74,
  bonuses: { HP: 99 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_56',
  name: 'Queijo Especial',
  type: 'comida',
  rarity: 'comum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 15,
  bonuses: { HP: 75 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_57',
  name: 'Mel Especial',
  type: 'comida',
  rarity: 'incomum',
  reqLevel: 1,
  weight: 1,
  valueCopper: 87,
  bonuses: { HP: 38 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_58',
  name: 'Pão Especial',
  type: 'comida',
  rarity: 'épico',
  reqLevel: 1,
  weight: 1,
  valueCopper: 15,
  bonuses: { HP: 199 },
  image: '/images/items/foods/placeholder.png'
},
{
  id: 'comida_59',
  name: 'Mel Especial',
  type: 'comida',
  rarity: 'lendário',
  reqLevel: 1,
  weight: 1,
  valueCopper: 22,
  bonuses: { HP: 140 },
  image: '/images/items/foods/placeholder.png'
}
];


// Merge EXTRA_ITEMS com ITEMS existente
;(ITEMS as Item[]).push(...EXTRA_ITEMS);
