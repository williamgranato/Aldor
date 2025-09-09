// types_aldor_client.ts
export type Rank = 'Sem Guilda' | 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

export type AttributeKey = 'strength' | 'agility' | 'intelligence' | 'vitality' | 'luck';

export type CoinPouch = {
  gold: number;
  silver: number;
  bronze: number;
  copper: number;
};

export type Character = {
  id: string;
  name: string;
  origin: string;
  role: string;
  race: string;
  /** chaves usadas para resolver ícones com precisão */
  roleKey?: string;  // ex.: 'guerreiro', 'mago_rei'
  raceKey?: string;  // ex.: 'humano', 'elfo'
};

export type Stats = {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  crit: number; // 0..1
};

export type Stamina = {
  current: number;
  max: number;
  lastRefillDay: number; // yyyymmdd numérico ou ms, conforme uso
};

export type ItemType = 'consumable' | 'ingredient' | 'resource' | 'armor' | 'weapon' | 'trinket';

export type Item = {
  id: string;
  name: string;
  type: ItemType;
  valueCopper?: number;
  qty?: number;
};

export type Quest = {
  id: string;
  title: string;
  desc?: string;
  requiredRank?: Rank;
  rewards?: {
    xp?: number;
    coinsCopper?: number;
    items?: Item[];
  };
};

export type PlayerState = {
  character: Character;
  guildRank: number;
  adventurerRank: Rank | string;
  xp: number;
  level: number;
  statPoints: number;
  attributes: Record<AttributeKey, number>;
  stats: Stats;
  stamina: Stamina;
  status: any[];
  coins: CoinPouch;
  inventory: Item[];
  skills: Record<string, any>;
};

export type GuildState = {
  isMember: boolean;
  completedQuests: { id: string; at: number }[];
  activeQuests: Quest[];
  memberCard?: {
    name: string;
    origin: string;
    role: string;
    roleKey?: string;
    race?: string;
    raceKey?: string;
    rank: Rank;
  };
};

export type MarketState = {
  catalog: any[];
};

export type GameState = {
  version: number;
  createdAt: number;
  updatedAt: number;
  player: PlayerState;
  guild: GuildState;
  market: MarketState;
  world?: any;
  ui?: { headerStyle: 'legacy' | 'modern' };
};

export type SaveBlob = GameState;
