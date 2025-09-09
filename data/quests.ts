import type { Quest } from '@/types_aldor_client';

export const QUESTS: Quest[] = [
  { id:'q1', name:'Caçar Slimes', description:'Limpe o pasto fora da cidade', rewards:{ xp:50, coinsCopper:220 } },
  { id:'q2', name:'Coletar Ervas', description:'Traga 5 ervas curativas', rewards:{ xp:80, coinsCopper:350 } },
  { id:'q3', name:'Rato da Adega', description:'Derrote o rei rato', rewards:{ xp:120, coinsCopper:500 } },
];

export function getQuestById(id: string): Quest | undefined {
  return QUESTS.find(q => q.id === id);
}
