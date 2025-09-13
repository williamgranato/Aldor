export type GatheringResource = {
  group: 'wood' | 'ore';
  name: string;
  itemId: string;         // id no items_catalog
  reqLevel: number;
  timeMs: number;
  staminaCost: number;
  qtyMin: number;
  qtyMax: number;
  image: string;          // caminho em /public/images/items/materials/*
  desc: string;
  bonusItemId?: string;
  bonusChance?: number;   // 0..1
};

// Progressão sugerida: Madeira (1-5), Ferro (6-20), Aço (21-30), Mithril (31-45), Adamantita (46-60)
export const GATHERING_RESOURCES: GatheringResource[] = [
  // WOOD
  { group: 'wood', name: 'Lenha Verde', itemId: 'wood_green', reqLevel: 1, timeMs: 3000, staminaCost: 2, qtyMin: 1, qtyMax: 3, image: '/images/items/materials/wood_green.png', desc: 'Galhos jovens, bons para iniciantes.' },
  { group: 'wood', name: 'Pinheiro', itemId: 'wood_pine', reqLevel: 3, timeMs: 3500, staminaCost: 3, qtyMin: 1, qtyMax: 3, image: '/images/items/materials/wood_pine.png', desc: 'Madeira resinosa, fácil de trabalhar.', bonusItemId: 'resin', bonusChance: 0.15 },
  { group: 'wood', name: 'Carvalho', itemId: 'wood_oak', reqLevel: 5, timeMs: 4000, staminaCost: 4, qtyMin: 1, qtyMax: 2, image: '/images/items/materials/wood_oak.png', desc: 'Densa e confiável para armas simples.' },

  // ORE
  { group: 'ore', name: 'Minério de Ferro', itemId: 'ore_iron', reqLevel: 6, timeMs: 4500, staminaCost: 4, qtyMin: 1, qtyMax: 3, image: '/images/items/materials/ore_iron.png', desc: 'A espinha dorsal da metalurgia comum.' },
  { group: 'ore', name: 'Minério de Aço-Bruto', itemId: 'ore_steel', reqLevel: 21, timeMs: 6000, staminaCost: 6, qtyMin: 1, qtyMax: 2, image: '/images/items/materials/ore_steel.png', desc: 'Liga instável que exige forja apurada.' },
  { group: 'ore', name: 'Mithril', itemId: 'ore_mithril', reqLevel: 31, timeMs: 7000, staminaCost: 7, qtyMin: 1, qtyMax: 2, image: '/images/items/materials/ore_mithril.png', desc: 'Leve como pena, afiado como promessa.' },
  { group: 'ore', name: 'Adamantita Bruta', itemId: 'ore_adamant', reqLevel: 46, timeMs: 8000, staminaCost: 9, qtyMin: 1, qtyMax: 2, image: '/images/items/materials/ore_adamant.png', desc: 'Dura como o destino dos heróis.' }
];
