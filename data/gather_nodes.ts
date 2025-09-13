
export type GatherSource = 'forest' | 'mine';

export interface GatherNode {
  id: string;
  name: string;
  source: GatherSource;
  minLevel: number;
  staminaCost: number; // per action
  timeSec: number; // action time
  yields: { itemId: string; min: number; max: number; chance?: number }[];
  image: string;
  description: string;
}

export const GATHER_NODES: GatherNode[] = [
  {
    id: 'forest_green_wood',
    name: 'Bosque de Madeira Verde',
    source: 'forest',
    minLevel: 1,
    staminaCost: 2,
    timeSec: 3,
    image: '/images/items/materials/wood_green.png',
    description: 'Árvores jovens de seiva doce. Madeira leve para arcos simples, cabos e fogueiras.',
    yields: [{ itemId: 'wood_green', min: 1, max: 3, chance: 1 }]
  },
  {
    id: 'forest_seasoned_wood',
    name: 'Mata de Madeira Curada',
    source: 'forest',
    minLevel: 5,
    staminaCost: 3,
    timeSec: 4,
    image: '/images/items/materials/wood_seasoned.png',
    description: 'Madeira curada ao vento. Mais densa e valiosa — boa para lanças e bastões.',
    yields: [{ itemId: 'wood_seasoned', min: 1, max: 3, chance: 1 }]
  },
  {
    id: 'forest_hard_wood',
    name: 'Bosque de Madeira Dura',
    source: 'forest',
    minLevel: 10,
    staminaCost: 4,
    timeSec: 5,
    image: '/images/items/materials/wood_hard.png',
    description: 'Troncos nodosos que desafiam a lâmina. Base para escudos e coronhas resistentes.',
    yields: [{ itemId: 'wood_hard', min: 1, max: 2, chance: 1 }]
  },
  {
    id: 'mine_copper_tin',
    name: 'Veio de Cobre/Estanho',
    source: 'mine',
    minLevel: 6,
    staminaCost: 3,
    timeSec: 3,
    image: '/images/items/materials/copper_ore.png',
    description: 'Veiros rasos de cobre e estanho. Fundidos viram bronze — o metal dos iniciantes.',
    yields: [
      { itemId: 'copper_ore', min: 1, max: 3, chance: 0.6 },
      { itemId: 'tin_ore', min: 1, max: 2, chance: 0.4 }
    ]
  },
  {
    id: 'mine_iron_coal',
    name: 'Filão de Ferro/Carvão',
    source: 'mine',
    minLevel: 12,
    staminaCost: 4,
    timeSec: 4,
    image: '/images/items/materials/iron_ore.png',
    description: 'Poços mais fundos revelam ferro e bolsões de carvão — o caminho para o aço.',
    yields: [
      { itemId: 'iron_ore', min: 1, max: 3, chance: 0.7 },
      { itemId: 'coal', min: 1, max: 2, chance: 0.5 }
    ]
  }
];
