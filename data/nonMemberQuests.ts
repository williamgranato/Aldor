export type NonMemberQuest = { id: string; name: string; description: string; rewardBronze: number; xp?: number };

export const NON_MEMBER_QUESTS: NonMemberQuest[] = [
  { id: 'nm1', name: 'Varre as Docas', description: 'Ajude a limpar as docas da cidade.', rewardBronze: 3, xp: 10 },
  { id: 'nm2', name: 'Mensageiro Local', description: 'Entregue uma carta ao ferreiro.', rewardBronze: 4, xp: 12 },
  { id: 'nm3', name: 'Caça a Ratos', description: 'Livre a adega dos ratos.', rewardBronze: 5, xp: 15 },
  { id: 'nm4', name: 'Colheita de Ervas', description: 'Recolha ervas nas planícies.', rewardBronze: 6, xp: 14 },
  { id: 'nm5', name: 'Patrulha do Portão', description: 'Auxilie a guarda por uma hora.', rewardBronze: 7, xp: 18 },
  { id: 'nm6', name: 'Entrega ao Alquimista', description: 'Leve frascos ao laboratório.', rewardBronze: 5, xp: 16 },
  { id: 'nm7', name: 'Aparar o Jardim', description: 'Ajude a aparar os jardins do templo.', rewardBronze: 8, xp: 12 },
  { id: 'nm8', name: 'Coleta de Lenha', description: 'Recolha toras na floresta próxima.', rewardBronze: 9, xp: 20 },
  { id: 'nm9', name: 'Limpeza do Mercado', description: 'Organize bancas e varra o chão.', rewardBronze: 4, xp: 10 },
  { id: 'nm10', name: 'Guardar Caravana', description: 'Acompanhe uma caravana curta.', rewardBronze: 10, xp: 25 },
];
