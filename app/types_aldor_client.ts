export type RankString = 'Sem Guilda'|'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'|'SSS';
export type AttributeKey = 'strength'|'agility'|'intelligence'|'vitality'|'luck';

export type Character = {
  id: string;
  name: string;
  origin: string;
  role: string;
};

export type PlayerStats = {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  crit: number; // 0..1
};

export type StatusEffect = {
  type: 'bleed'|'poison';
  addedAt: number;
  durationMs?: number;
};

export type Stamina = {
  current: number;
  max: number;
  lastRefillDay: number;
};

export type CoinPouch = { gold:number; silver:number; bronze:number; copper:number };

export type ItemRarity = 'common'|'uncommon'|'rare'|'epic'|'legendary';
export type ItemType = 'consumable'|'ingredient'|'resource'|'armor'|'weapon'|'trinket'|'material';

export type Item = {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  valueCopper?: number;
  qty?: number;
};

export type Quest = {
  id: string;
  title: string;
  description?: string;
  requiredRank?: RankString;
  rewards?: { coinsCopper?: number; xp?: number };
};

export type GuildMemberCard = {
  name: string;
  origin: string;
  role: string;
  rank: Exclude<RankString,'Sem Guilda'>;
};

export type GuildState = {
  isMember: boolean;
  memberCard?: GuildMemberCard;
  completedQuests: Array<{id:string; at:number}>;
  activeQuests: Quest[];
  missionAffinity?: Record<string, number>;
};

export type PlayerState = {
  character: Character|null;
  guildRank: number;
  adventurerRank: Exclude<RankString,'Sem Guilda'> | 'Sem Guilda';
  xp: number;
  level: number;
  statPoints?: number;
  attributes: Record<AttributeKey, number>;
  stats: PlayerStats;
  stamina: Stamina;
  status: StatusEffect[];
  coins: CoinPouch;
  inventory: Item[];
  skills: Record<string, number>;
};

export type MarketState = {
  catalog: Item[];
};

export type GameState = {
  version: number;
  createdAt: number;
  updatedAt: number;
  player: PlayerState;
  guild: GuildState;
  market: MarketState;
};

export type SaveBlob = GameState;
