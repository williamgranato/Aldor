// types_aldor_client.ts

export type CoinPouch = {
  gold: number;
  silver: number;
  bronze: number;
  copper: number;
};

export type Rank = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface Stamina {
  current: number;
  max: number;
  lastRegenAt: number;
  lastRefillDay?: number;
}

export interface Stats {
  hp: number;
  maxHp: number;
  atk?: number;
  def?: number;
  attack?: number;
  defense?: number;
  crit?: number;
  lastRegenHpAt?: number;
}

export interface Character {
  id: string;
  name: string;
  class?: string;
  race?: string;
  role?: string;
  origin?: string;
  avatar?: string;
}

export interface Quest {
  id: string;
  name: string;
  description?: string;
  rewards?: any;
}

export interface GuildState {
  isMember: boolean;
  completedQuests: Quest[];
  activeQuests: Quest[];
  missionAffinity: Record<string, number>;
  memberCard?: any;
}

export interface WorldState {
  dateMs: number;
  season: string;
  weather: string;
  temperature: number;
}

export interface PlayerState {
  id: string;
  name: string;
  character: Character;
  guildRank?: number;
  adventurerRank?: string;
  xp: number;
  level: number;
  statPoints: number;
  attributes: Record<string, number>;
  stats: Stats;
  stamina: Stamina;
  status: any[];
  coins: CoinPouch;
  inventory: any[];
  skills: Record<string, any>;
  equipment?: Record<string, any>;
  settings?: { autoPotionThreshold?: number };
}

export interface GameState {
  slotId?: string;
  player: PlayerState;
  world: WorldState;
  guild?: GuildState;
  market?: Record<string, any[]>;
}
