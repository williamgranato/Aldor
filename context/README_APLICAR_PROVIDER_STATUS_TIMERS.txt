'use client';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { GameState, Item, Quest, CoinPouch, AttributeKey, SaveBlob, RankString, GuildMemberCard } from '../types_aldor_client';
import { loadGame, saveGame, exportSave, importSaveBlob, clearSave, nukeAllSaves } from '../utils/save_aldor_client';
import { coinsToCopper, copperToCoins } from '../utils/money_aldor_client';
import { rankOrder } from '@/utils/rankStyle';
import { simulateCombat, enemyForRank } from '@/utils/combat_aldor_client';

// NOTE: Este arquivo é um delta: adapte manualmente se já tiver o provider. Principais mudanças:
// - garantir que status tenham {type, addedAt, durationMs}
// - loop de limpeza de status expirado
// - quando infligir status no undertakeQuest, setar durationMs (bleed 60s, poison 90s)

// Aplique manualmente as mesmas mudanças no seu provider atual.

