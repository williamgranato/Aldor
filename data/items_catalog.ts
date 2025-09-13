// Massive RPG Catalog with stackable support
export interface ItemDef {
  id: string;
  name: string;
  type: 'weapon'|'armor'|'material'|'consumable'|'jewel';
  slot?: string;
  rarity: 'comum'|'incomum'|'raro'|'epico'|'lendario'|'mitico';
  material?: string;
  reqLevel: number;
  durability?: number;
  valueCopper: number;
  weight: number;
  stackable: boolean;
  maxStack?: number;
  bonuses?: Record<string, number>;
  skillBoosts?: Record<string, number>;
  image: string;
  recipe?: { requires: { id: string; qty: number }[]; result: string };
}

export const itemsCatalog: ItemDef[] = [
  {
    id: 'iron_ore',
    name: 'Minério de Ferro',
    type: 'material',
    rarity: 'comum',
    reqLevel: 1,
    valueCopper: 10,
    weight: 1,
    stackable: true,
    maxStack: 100,
    image: '/images/items/materials/iron_ore.png'
  },
  {
    id: 'steel_sword',
    name: 'Espada Longa de Aço',
    type: 'weapon',
    slot: 'main_hand',
    rarity: 'incomum',
    material: 'aço',
    reqLevel: 5,
    durability: 100,
    valueCopper: 200,
    weight: 8,
    stackable: false,
    bonuses: { atk: 12, crit: 2 },
    image: '/images/items/weapons/steel_sword.png',
    recipe: { requires: [ {id: 'steel_ingot', qty:2}, {id: 'tanned_leather', qty:1} ], result: 'steel_sword' }
  },
  {
    id: 'bread',
    name: 'Pão Rústico',
    type: 'consumable',
    rarity: 'comum',
    reqLevel: 1,
    valueCopper: 5,
    weight: 1,
    stackable: true,
    maxStack: 100,
    image: '/images/items/foods/bread.png',
    bonuses: { hp: 10 }
  },
  {
    id: 'health_potion_minor',
    name: 'Poção Menor de Cura',
    type: 'consumable',
    rarity: 'incomum',
    reqLevel: 2,
    valueCopper: 50,
    weight: 1,
    stackable: true,
    maxStack: 100,
    image: '/images/items/consumables/health_potion_minor.png',
    bonuses: { hp: 50 }
  }
  // ... expand with sets, woods, metals, jewels etc.
];