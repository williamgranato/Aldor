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
  | 'acessório';

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
  | 'acessório';

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
