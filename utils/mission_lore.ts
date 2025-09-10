// utils/mission_lore.ts
export const MISSION_LORE: Record<string, string> = {
  'lobos_1': 'Feras famintas rondam as fazendas — o luar revela olhos amarelos na relva.',
  'lobos_2': 'Os uivos ecoam no vale; o matilha já provou sangue humano.',
  'lobos_3': 'No covil, crânios roídos e ossos. Hora de pôr fim ao Ninho.',
  'ratos_taverna': 'O porão da taverna virou parque dos roedores. O taverneiro suplica: “sem ratos, sem vinho!”',
  'escolta_caravana': 'Mercadorias valiosas cortam estradas traiçoeiras. Lâminas curiosas espreitam nos barrancos.'
};

export function getMissionLore(id: string, fallbackRank?: string): string {
  const core = id.split(':')[0];
  if (MISSION_LORE[core]) return MISSION_LORE[core];
  // fallback rápido e imersivo
  const rank = fallbackRank || 'F';
  return `Contrato de rank ${rank}. O destino sussurra perigo — e moedas.`;
}
