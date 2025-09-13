// data/gathering_catalog.ts
// Catálogo de recursos de coleta (Floresta e Minas).
// Não invade o items_catalog.ts: apenas define metadados de coleta e
// referencia IDs de item já/serão cadastrados no catálogo principal.
//
// As imagens são esperadas em: /public/images/items/materials/*

export type Biome = "forest" | "mine";

export interface GatheringResource {
  id: string;              // id do item no items_catalog (ex.: "wood_oak", "ore_iron")
  biome: Biome;            // "forest" | "mine"
  name: string;            // Nome visível
  description: string;     // Texto imersivo
  reqLevel: number;        // Nível mínimo do jogador para liberar o card
  timeMs: number;          // Tempo por tentativa de coleta
  staminaCost: number;     // Custo de stamina por tentativa
  qtyMin: number;          // Quantidade mínima dropada
  qtyMax: number;          // Quantidade máxima dropada
  image: string;           // Caminho da imagem em /public/images/items/materials
  bonusItemId?: string;    // ID de bônus (ex.: "resin")
  bonusChance?: number;    // 0..1
  skill: "woodcutting" | "mining"; // Qual skill recebe XP
  xpSkill: number;         // XP de skill por coleta
  xpPlayer: number;        // XP geral do player por coleta (se integrado ao provider)
}

export const FOREST_RESOURCES: GatheringResource[] = [
  {
    id: "wood_green",
    biome: "forest",
    name: "Lenha Verde",
    description:
      "Ramos recém-cortados, úmidos e cheirosos. Ótimos para as primeiras fogueiras e pequenos artesanatos.",
    reqLevel: 1,
    timeMs: 2200,
    staminaCost: 3,
    qtyMin: 1,
    qtyMax: 3,
    image: "/images/items/materials/wood_green.png",
    skill: "woodcutting",
    xpSkill: 8,
    xpPlayer: 4,
  },
  {
    id: "wood_pine",
    biome: "forest",
    name: "Pinheiro Resinoso",
    description:
      "Troncos leves e perfumados. As veias de resina estalam ao toque da lâmina — perfeitos para iniciantes cuidadosos.",
    reqLevel: 3,
    timeMs: 2600,
    staminaCost: 4,
    qtyMin: 1,
    qtyMax: 3,
    image: "/images/items/materials/wood_pine.png",
    bonusItemId: "resin",
    bonusChance: 0.18,
    skill: "woodcutting",
    xpSkill: 10,
    xpPlayer: 5,
  },
  {
    id: "wood_oak",
    biome: "forest",
    name: "Carvalho Antigo",
    description:
      "Denso e teimoso. O anel de crescimento conta histórias mais antigas que a cidade — madeiramento de respeito.",
    reqLevel: 5,
    timeMs: 3200,
    staminaCost: 5,
    qtyMin: 1,
    qtyMax: 2,
    image: "/images/items/materials/wood_oak.png",
    skill: "woodcutting",
    xpSkill: 14,
    xpPlayer: 7,
  },
];

export const MINE_RESOURCES: GatheringResource[] = [
  {
    id: "ore_iron",
    biome: "mine",
    name: "Veio de Ferro",
    description:
      "Mineral comum, mas essencial. Martelos cantam nas galerias quando o ferro aparece.",
    reqLevel: 6,
    timeMs: 2800,
    staminaCost: 5,
    qtyMin: 1,
    qtyMax: 2,
    image: "/images/items/materials/ore_iron.png",
    skill: "mining",
    xpSkill: 12,
    xpPlayer: 6,
  },
  {
    id: "ore_steel",
    biome: "mine",
    name: "Aço-Bruto",
    description:
      "Liga embrionária, rara em estado natural. Dá lâminas honestas a quem sabe tratá-la.",
    reqLevel: 21,
    timeMs: 3600,
    staminaCost: 6,
    qtyMin: 1,
    qtyMax: 2,
    image: "/images/items/materials/ore_steel.png",
    skill: "mining",
    xpSkill: 16,
    xpPlayer: 8,
  },
  {
    id: "ore_mithril",
    biome: "mine",
    name: "Mithril Brando",
    description:
      "Metal claro, quase sussurra. Em mãos hábeis, vira armaduras tão leves quanto promessa.",
    reqLevel: 31,
    timeMs: 4200,
    staminaCost: 7,
    qtyMin: 1,
    qtyMax: 2,
    image: "/images/items/materials/ore_mithril.png",
    skill: "mining",
    xpSkill: 20,
    xpPlayer: 10,
  },
  {
    id: "ore_adamant",
    biome: "mine",
    name: "Adamantita Bruta",
    description:
      "Dura feito teimosia de ancião. Ferramentas vacilam; coração não pode.",
    reqLevel: 46,
    timeMs: 5200,
    staminaCost: 8,
    qtyMin: 1,
    qtyMax: 2,
    image: "/images/items/materials/ore_adamant.png",
    skill: "mining",
    xpSkill: 26,
    xpPlayer: 13,
  },
];

export const GATHERING_RESOURCES: GatheringResource[] = [
  ...FOREST_RESOURCES,
  ...MINE_RESOURCES,
];
