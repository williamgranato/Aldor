import { RankLetter } from '@/utils/rankStyle';

export type MemberQuest = {
  id: string;
  name: string;
  description: string;
  rewards: { xp: number; coinsCopper: number };
  requiredRank: Exclude<RankLetter,'Sem Guilda'>;
};

export const MEMBER_QUESTS: MemberQuest[] = [
  { id: 'mq1', name: 'Caçar Slimes', description: 'Limpe o pasto fora da cidade', rewards:{ xp: 50, coinsCopper: 220 }, requiredRank: 'F' },
  { id: 'mq2', name: 'Coletar Ervas', description: 'Traga 5 ervas curativas', rewards:{ xp: 70, coinsCopper: 310 }, requiredRank: 'F' },
  { id: 'mq3', name: 'Rato da Adega', description: 'Derrote o rei rato', rewards:{ xp: 120, coinsCopper: 500 }, requiredRank: 'E' },
  { id: 'mq4', name: 'Patrulha no Bosque', description: 'Investigue ruídos ao norte', rewards:{ xp: 180, coinsCopper: 720 }, requiredRank: 'D' },
  { id: 'mq5', name: 'Escolta de Caravana', description: 'Proteja a caravana até a próxima vila', rewards:{ xp: 260, coinsCopper: 1100 }, requiredRank: 'C' },
  { id: 'mq6', name: 'Ninho de Lobos', description: 'Elimine a alcateia próxima', rewards:{ xp: 360, coinsCopper: 1500 }, requiredRank: 'B' },
  { id: 'mq7', name: 'Grifo Enraivecido', description: 'Acalme ou afaste o grifo do penhasco', rewards:{ xp: 520, coinsCopper: 2200 }, requiredRank: 'A' },
  { id: 'mq8', name: 'Quimera', description: 'Investigar criatura híbrida ao sul', rewards:{ xp: 800, coinsCopper: 3600 }, requiredRank: 'S' },
  { id: 'mq9', name: 'Contrato Real', description: 'Missão especial do palácio', rewards:{ xp: 1200, coinsCopper: 5200 }, requiredRank: 'SS' },
  { id: 'mq10', name: 'Dragão Ancião', description: 'Derrote o dragão do vale cinzento', rewards:{ xp: 2000, coinsCopper: 9000 }, requiredRank: 'SSS' },
];
