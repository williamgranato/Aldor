// types_aldor_client.ts — restaurado com todos os tipos originais + lastRegenAt opcional em Stamina

export type Rank = 'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'|'SSS';

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
  lastRegenAt?: number;  // timestamp opcional para regeneração automática
};

export type CoinPouch = {
  gold: number;
  silver: number;
  bronze: number;
  copper: number;
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
  id: string;
  character: Character;
  guildRank: number;
  adventurerRank: string;
  xp: number;
  level: number;
  statPoints: number;
  attributes: Record<string, number>;
  stats: Stats;
  stamina: Stamina;
  status: any[];
  coins: CoinPouch;
  inventory: Item[];
  skills: Record<string,any>;
};

export type GuildState = {
  isMember: boolean;
  completedQuests: Quest[];
  activeQuests: Quest[];
  memberCard?: any;
};

export type WorldState = {
  dateMs: number;
};

export type UIState = {
  headerStyle: string;
};

export type GameState = {
  player: PlayerState;
  guild: GuildState;
  world: WorldState;
  ui: UIState;
};
