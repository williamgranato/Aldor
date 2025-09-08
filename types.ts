export type AttributeKey = 'strength' | 'agility' | 'intelligence' | 'vitality' | 'luck';

export type CoinPouch = {
  gold: number;
  silver: number;
  bronze: number;
  copper: number;
};

export type Item = {
  id: string;
  name: string;
  type: 'consumable' | 'ingredient' | 'resource' | 'armor' | 'weapon' | 'trinket';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  valueCopper?: number;
  qty?: number;
};

export type Quest = {
  id: string;
  name: string;
  description?: string;
  durationSec?: number;
  rewards?: { xp?: number; coinsCopper?: number; items?: Item[] };
};

export type Character = {
  id: string;
  name: string;
  origin?: string;
  role?: string;
};

export type GameState = {
  version: number;
  createdAt: number;
  updatedAt: number;
  player: {
    character: Character | null;
    guildRank: number;
    xp: number;
    level: number;
    attributes: Record<AttributeKey, number>;
    coins: CoinPouch;
    inventory: Item[];
    skills: Record<string, number>;
  };
  guild: {
    completedQuests: { id: string; at: number }[];
    activeQuests: Quest[];
  };
  market: {
    catalog: Item[];
  };
};

export type SaveBlob = GameState;
