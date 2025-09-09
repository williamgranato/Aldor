import { MISSIONS, Mission } from '@/data/missions_catalog';

export function pickDailyMissions(
  playerRank: string,
  dayKey: string,
  world?: { season?: string; weather?: string }
){
  // ... implementação existente (não alterada)
}

// 🔧 Bridge de compatibilidade com o provider:
// Mantém a chamada atual: generateDailyQuests(rank, dayKey, season?, weather?)
// Não remove/renomeia nada — apenas delega para pickDailyMissions.
export function generateDailyQuests(
  playerRank: string,
  dayKey: string,
  season?: string,
  weather?: string
): Mission[] {
  try {
    return pickDailyMissions(playerRank, dayKey, { season, weather });
  } catch {
    // fallback defensivo: retorna lista vazia em caso de erro para não quebrar a UI
    return [];
  }
}
