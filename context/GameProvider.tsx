'use client';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { GameState, Item, Quest, CoinPouch, AttributeKey, SaveBlob } from '../types';
import { loadGame, saveGame, exportSave, importSaveBlob, clearSave } from '../utils/save';
import { clamp, coinsToCopper, copperToCoins } from '../utils/money';

type GameContextType = {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
  createCharacter: (payload: { name: string; origin?: string; role?: string }) => void;
  resetGame: () => void;
  addXP: (amount: number) => void;
  levelUpIfNeeded: () => void;
  bumpAttribute: (attr: AttributeKey, delta: number) => void;
  giveCoins: (pouch: Partial<CoinPouch>) => void;
  takeCoins: (pouch: Partial<CoinPouch>) => boolean;
  addItem: (item: Item, qty?: number) => void;
  removeItem: (itemId: string, qty?: number) => boolean;
  buyItem: (item: Item, qty?: number) => boolean;
  sellItem: (itemId: string, qty?: number) => boolean;
  startQuest: (quest: Quest) => void;
  completeQuest: (questId: string) => void;
  exportSave: () => void;
  importSave: (file: File) => Promise<void>;
  lastSavedAt?: number;
  isSaving: boolean;
};

const defaultState: GameState = {
  version: 1,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  player: {
    character: null,
    guildRank: 1,
    xp: 0,
    level: 1,
    attributes: { strength: 1, agility: 1, intelligence: 1, vitality: 1, luck: 0 },
    coins: { gold: 0, silver: 0, bronze: 0, copper: 0 },
    inventory: [],
    skills: {},
  },
  guild: {
    completedQuests: [],
    activeQuests: [],
  },
  market: {
    catalog: [
      { id: 'potion_small', name: 'Poção Pequena', type: 'consumable', rarity: 'common', valueCopper: 50 },
      { id: 'herb_mandrake', name: 'Mandrágora', type: 'ingredient', rarity: 'uncommon', valueCopper: 120 },
      { id: 'ore_iron', name: 'Minério de Ferro', type: 'resource', rarity: 'common', valueCopper: 80 },
      { id: 'armor_leather', name: 'Armadura de Couro', type: 'armor', rarity: 'common', valueCopper: 900 },
      { id: 'sword_rusty', name: 'Espada Enferrujada', type: 'weapon', rarity: 'common', valueCopper: 650 },
    ],
  },
};

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<GameState>(defaultState);
  const [isHydrated, setIsHydrated] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    try {
      const loaded = loadGame<GameState>();
      if (loaded) {
        if (!loaded.version) loaded.version = 1;
        setState((prev) => ({ ...prev, ...loaded }));
      }
    } catch (e) {
      console.warn('[GameProvider] failed to load save', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      try {
        setIsSaving(true);
        const payload: SaveBlob = { ...state, updatedAt: Date.now() };
        saveGame(payload);
        setLastSavedAt(Date.now());
      } catch (e) {
        console.error('[GameProvider] autosave error', e);
      } finally {
        setIsSaving(false);
      }
    }, 600);
    return () => { if (saveTimer.current) window.clearTimeout(saveTimer.current); };
  }, [state, isHydrated]);

  const createCharacter: GameContextType['createCharacter'] = ({ name, origin, role }) => {
    setState((s) => ({
      ...s,
      player: {
        ...s.player,
        character: { id: 'hero', name, origin: origin || 'Desconhecido', role: role || 'Aventureiro' },
      },
      updatedAt: Date.now(),
    }));
  };

  const resetGame = () => {
    setState(defaultState);
    clearSave();
  };

  const levelUpIfNeeded = () => {
    setState((s) => {
      let { xp, level } = s.player;
      const xpForNext = (lvl: number) => Math.floor(100 * Math.pow(1.2, lvl - 1));
      let did = False as any;
      // fix TypeScript expect boolean
      did = false;
      while (xp >= xpForNext(level)) {
        xp -= xpForNext(level);
        level += 1;
        did = true;
      }
      if (!did) return s;
      return { ...s, player: { ...s.player, xp, level }, updatedAt: Date.now() };
    });
  };

  const addXP = (amount: number) => {
    setState((s) => ({
      ...s,
      player: { ...s.player, xp: Math.max(0, s.player.xp + Math.floor(amount)) },
      updatedAt: Date.now(),
    }));
    setTimeout(levelUpIfNeeded, 0);
  };

  const bumpAttribute = (attr, delta) => {
    setState((s) => ({
      ...s,
      player: {
        ...s.player,
        attributes: { ...s.player.attributes, [attr]: clamp((s.player.attributes as any)[attr] + delta, 0, 999) },
      },
      updatedAt: Date.now(),
    } as any));
  };

  const giveCoins = (pouch: Partial<CoinPouch>) => {
    setState((s) => {
      const total = coinsToCopper({
        gold: (s.player.coins.gold || 0) + (pouch.gold || 0),
        silver: (s.player.coins.silver || 0) + (pouch.silver || 0),
        bronze: (s.player.coins.bronze || 0) + (pouch.bronze || 0),
        copper: (s.player.coins.copper || 0) + (pouch.copper || 0),
      });
      return { ...s, player: { ...s.player, coins: copperToCoins(total) }, updatedAt: Date.now() };
    });
  };

  const takeCoins = (pouch: Partial<CoinPouch>) => {
    let success = false;
    setState((s) => {
      const have = coinsToCopper(s.player.coins);
      const cost = coinsToCopper({
        gold: pouch.gold || 0, silver: pouch.silver || 0, bronze: pouch.bronze || 0, copper: pouch.copper || 0,
      });
      if (have < cost) return s;
      success = true;
      return { ...s, player: { ...s.player, coins: copperToCoins(have - cost) }, updatedAt: Date.now() };
    });
    return success;
  };

  const addItem = (item: Item, qty: number = 1) => {
    setState((s) => {
      const inv = [...s.player.inventory];
      const idx = inv.findIndex((i) => i.id === item.id);
      if (idx >= 0) inv[idx] = { ...inv[idx], qty: (inv[idx].qty || 0) + qty };
      else inv.push({ ...item, qty });
      return { ...s, player: { ...s.player, inventory: inv }, updatedAt: Date.now() };
    });
  };

  const removeItem = (itemId: string, qty: number = 1) => {
    let success = false;
    setState((s) => {
      const inv = [...s.player.inventory];
      const idx = inv.findIndex((i) => i.id === itemId);
      if (idx < 0) return s;
      const newQty = (inv[idx].qty || 0) - qty;
      if (newQty < 0) return s;
      success = true;
      if (newQty === 0) inv.splice(idx, 1);
      else inv[idx] = { ...inv[idx], qty: newQty };
      return { ...s, player: { ...s.player, inventory: inv }, updatedAt: Date.now() };
    });
    return success;
  };

  const buyItem = (item: Item, qty: number = 1) => {
    const costCopper = (item.valueCopper || 0) * qty;
    const ok = takeCoins(copperToCoins(costCopper));
    if (!ok) return false;
    addItem(item, qty);
    return true;
  };

  const sellItem = (itemId: string, qty: number = 1) => {
    setState((s) => {
      const inv = [...s.player.inventory];
      const idx = inv.findIndex((i) => i.id === itemId);
      if (idx < 0) return s;
      const item = inv[idx];
      const sellQty = Math.min(item.qty || 1, qty);
      const value = Math.floor((item.valueCopper || 0) * 0.6) * sellQty;
      const newQty = (item.qty || 0) - sellQty;
      if (newQty <= 0) inv.splice(idx, 1); else inv[idx] = { ...item, qty: newQty };
      const total = coinsToCopper(s.player.coins) + value;
      return { ...s, player: { ...s.player, coins: copperToCoins(total), inventory: inv }, updatedAt: Date.now() };
    });
    return true;
  };

  const startQuest = (quest: Quest) => {
    setState((s) => {
      if (s.guild.activeQuests.some(q => q.id === quest.id)) return s;
      return { ...s, guild: { ...s.guild, activeQuests: [...s.guild.activeQuests, quest] }, updatedAt: Date.now() };
    });
  };

  const completeQuest = (questId: string) => {
    setState((s) => {
      const q = s.guild.activeQuests.find(q => q.id === questId);
      if (!q) return s;
      const rest = s.guild.activeQuests.filter(q => q.id !== questId);
      const rewardsCopper = q.rewards?.coinsCopper || 0;
      const xp = q.rewards?.xp || 0;
      const newCoins = copperToCoins(coinsToCopper(s.player.coins) + rewardsCopper);
      const completed = [...s.guild.completedQuests, { id: q.id, at: Date.now() }];
      return {
        ...s,
        player: { ...s.player, coins: newCoins, xp: s.player.xp + xp },
        guild: { ...s.guild, activeQuests: rest, completedQuests: completed },
        updatedAt: Date.now(),
      };
    });
    setTimeout(levelUpIfNeeded, 0);
  };

  const value = useMemo<GameContextType>(() => ({
    state, setState,
    createCharacter, resetGame,
    addXP, levelUpIfNeeded,
    bumpAttribute,
    giveCoins, takeCoins,
    addItem, removeItem,
    buyItem, sellItem,
    startQuest, completeQuest,
    exportSave: () => exportSave(state),
    importSave: async (file: File) => {
      const blob = await importSaveBlob(file);
      setState(blob);
    },
    lastSavedAt, isSaving,
  }), [state, lastSavedAt, isSaving]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within <GameProvider/>');
  return ctx;
}
