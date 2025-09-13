// data/items_catalog.ts
// Catálogo completo de itens para Aldor Idle

export type Item = {
  id: string;
  name: string;
  type: string;
  rarity: string;
  reqLevel?: number;
  valueCopper: number;
  weight: number;
  stackable: boolean;
  maxStack?: number;
  slot?: string;
  material?: string;
  durability?: number;
  atk?: number;
  def?: number;
  crit?: number;
  bonuses?: Record<string, number>;
  image: string;
};

export const ITEMS: Item[] = [
  // === Minérios ===
  { id:'ore_copper', name:'Minério de Cobre', type:'material', rarity:'comum', reqLevel:1, valueCopper:2, weight:2, stackable:true, maxStack:100, image:'/images/items/materials/ore_copper.png' },
  { id:'ore_iron', name:'Minério de Ferro', type:'material', rarity:'comum', reqLevel:5, valueCopper:4, weight:2, stackable:true, maxStack:100, image:'/images/items/materials/ore_iron.png' },
  { id:'ore_tin', name:'Minério de Estanho', type:'material', rarity:'comum', reqLevel:4, valueCopper:3, weight:2, stackable:true, maxStack:100, image:'/images/items/materials/ore_tin.png' },
  { id:'ore_silver', name:'Minério de Prata', type:'material', rarity:'incomum', reqLevel:10, valueCopper:8, weight:2, stackable:true, maxStack:100, image:'/images/items/materials/ore_silver.png' },
  { id:'ore_gold', name:'Minério de Ouro', type:'material', rarity:'raro', reqLevel:15, valueCopper:15, weight:2, stackable:true, maxStack:100, image:'/images/items/materials/ore_gold.png' },
  { id:'ore_mithril', name:'Minério de Mithril', type:'material', rarity:'raro', reqLevel:20, valueCopper:25, weight:2, stackable:true, maxStack:100, image:'/images/items/materials/ore_mithril.png' },
  { id:'ore_adamantite', name:'Minério de Adamantina', type:'material', rarity:'épico', reqLevel:25, valueCopper:40, weight:2, stackable:true, maxStack:100, image:'/images/items/materials/ore_adamantite.png' },
  { id:'ore_orichalcum', name:'Minério de Oricalco', type:'material', rarity:'lendário', reqLevel:30, valueCopper:60, weight:2, stackable:true, maxStack:100, image:'/images/items/materials/ore_orichalcum.png' },
  { id:'ore_coal', name:'Carvão', type:'material', rarity:'comum', reqLevel:1, valueCopper:1, weight:1, stackable:true, maxStack:100, image:'/images/items/materials/ore_coal.png' },
  { id:'gem_quartz', name:'Quartzo', type:'material', rarity:'incomum', reqLevel:8, valueCopper:10, weight:1, stackable:true, maxStack:50, image:'/images/items/materials/gem_quartz.png' },
  { id:'gem_sapphire', name:'Safira', type:'material', rarity:'raro', reqLevel:12, valueCopper:20, weight:1, stackable:true, maxStack:50, image:'/images/items/materials/gem_sapphire.png' },
  { id:'gem_ruby', name:'Rubi', type:'material', rarity:'raro', reqLevel:14, valueCopper:25, weight:1, stackable:true, maxStack:50, image:'/images/items/materials/gem_ruby.png' },
  { id:'gem_emerald', name:'Esmeralda', type:'material', rarity:'épico', reqLevel:18, valueCopper:35, weight:1, stackable:true, maxStack:50, image:'/images/items/materials/gem_emerald.png' },
  { id:'gem_diamond', name:'Diamante', type:'material', rarity:'lendário', reqLevel:22, valueCopper:60, weight:1, stackable:true, maxStack:50, image:'/images/items/materials/gem_diamond.png' },

  // === Madeiras ===
  { id:'wood_oak', name:'Madeira de Carvalho', type:'material', rarity:'comum', reqLevel:1, valueCopper:2, weight:1, stackable:true, maxStack:100, image:'/images/items/materials/wood_oak.png' },
  { id:'wood_pine', name:'Madeira de Pinheiro', type:'material', rarity:'comum', reqLevel:2, valueCopper:2, weight:1, stackable:true, maxStack:100, image:'/images/items/materials/wood_pine.png' },
  { id:'wood_green', name:'Madeira Verde', type:'material', rarity:'comum', reqLevel:3, valueCopper:2, weight:1, stackable:true, maxStack:100, image:'/images/items/materials/wood_green.png' },
  { id:'wood_seasoned', name:'Madeira Curada', type:'material', rarity:'comum', reqLevel:5, valueCopper:4, weight:1, stackable:true, maxStack:100, image:'/images/items/materials/wood_seasoned.png' },
  { id:'wood_teak', name:'Madeira de Teca', type:'material', rarity:'incomum', reqLevel:10, valueCopper:6, weight:1, stackable:true, maxStack:100, image:'/images/items/materials/wood_teak.png' },
  { id:'wood_ebony', name:'Madeira de Ébano', type:'material', rarity:'raro', reqLevel:15, valueCopper:10, weight:1, stackable:true, maxStack:100, image:'/images/items/materials/wood_ebony.png' },

  // === Fibras ===
  { id:'fiber_cotton', name:'Algodão', type:'material', rarity:'comum', reqLevel:1, valueCopper:2, weight:1, stackable:true, maxStack:100, image:'/images/items/materials/fiber_cotton.png' },
  { id:'fiber_flax', name:'Linho', type:'material', rarity:'comum', reqLevel:2, valueCopper:2, weight:1, stackable:true, maxStack:100, image:'/images/items/materials/fiber_flax.png' },
  { id:'fiber_silk', name:'Seda', type:'material', rarity:'incomum', reqLevel:10, valueCopper:8, weight:1, stackable:true, maxStack:100, image:'/images/items/materials/fiber_silk.png' },
  { id:'fiber_hemp', name:'Cânhamo', type:'material', rarity:'incomum', reqLevel:12, valueCopper:6, weight:1, stackable:true, maxStack:100, image:'/images/items/materials/fiber_hemp.png' },
  { id:'fiber_jute', name:'Juta', type:'material', rarity:'comum', reqLevel:3, valueCopper:3, weight:1, stackable:true, maxStack:100, image:'/images/items/materials/fiber_jute.png' },

  // === Couros ===
  { id:'leather_raw', name:'Couro Cru', type:'material', rarity:'comum', reqLevel:1, valueCopper:2, weight:1, stackable:true, maxStack:100, image:'/images/items/materials/leather_raw.png' },
  { id:'leather_thin', name:'Couro Fino', type:'material', rarity:'comum', reqLevel:3, valueCopper:3, weight:1, stackable:true, maxStack:100, image:'/images/items/materials/leather_thin.png' },
  { id:'leather_thick', name:'Couro Grosso', type:'material', rarity:'incomum', reqLevel:6, valueCopper:5, weight:1, stackable:true, maxStack:100, image:'/images/items/materials/leather_thick.png' },
  { id:'leather_hardened', name:'Couro Endurecido', type:'material', rarity:'incomum', reqLevel:10, valueCopper:8, weight:1, stackable:true, maxStack:100, image:'/images/items/materials/leather_hardened.png' },
  { id:'leather_reinforced', name:'Couro Reforçado', type:'material', rarity:'raro', reqLevel:15, valueCopper:12, weight:1, stackable:true, maxStack:100, image:'/images/items/materials/leather_reinforced.png' },
  { id:'leather_cured', name:'Couro Curtido', type:'material', rarity:'raro', reqLevel:18, valueCopper:15, weight:1, stackable:true, maxStack:100, image:'/images/items/materials/leather_cured.png' },
  { id:'leather_exotic', name:'Couro Exótico', type:'material', rarity:'épico', reqLevel:22, valueCopper:20, weight:1, stackable:true, maxStack:100, image:'/images/items/materials/leather_exotic.png' },
  { id:'leather_draconic', name:'Couro Dracônico', type:'material', rarity:'lendário', reqLevel:28, valueCopper:40, weight:1, stackable:true, maxStack:100, image:'/images/items/materials/leather_draconic.png' },


  // === Armas básicas (exemplos) ===
  { id:'club_wood', name:'Clava de Madeira', type:'arma', slot:'mão_principal', rarity:'comum', material:'madeira', reqLevel:1, durability:50, weight:3, valueCopper:5, atk:4, crit:0,stackable:false, image:'/images/items/weapons/club_wood.png' },
  { id:'staff_basic', name:'Cajado Simples', type:'arma', slot:'mão_principal', rarity:'comum', material:'madeira', reqLevel:2, durability:50, weight:4, valueCopper:6, atk:5, crit:1,stackable:false, image:'/images/items/weapons/staff_basic.png' },
  { id:'sword_short', name:'Espada Curta', type:'arma', slot:'mão_principal', rarity:'comum', material:'ferro', reqLevel:4, durability:80, weight:5, valueCopper:10, atk:8, crit:1,stackable:false, image:'/images/items/weapons/sword_short.png' },
  { id:'sword_long', name:'Espada Longa', type:'arma', slot:'mão_principal', rarity:'incomum', material:'aço', reqLevel:6, durability:100, weight:8, valueCopper:20, atk:12, crit:2,stackable:false, image:'/images/items/weapons/sword_long.png' },
  { id:'dagger_iron', name:'Adaga de Ferro', type:'arma', slot:'mão_principal', rarity:'comum', material:'ferro', reqLevel:3, durability:60, weight:2, valueCopper:8, atk:6, crit:3,stackable:false, image:'/images/items/weapons/dagger_iron.png' },

  // === Armaduras básicas (exemplos) ===
  { id:'armor_cloth_linen', name:'Túnica de Linho', type:'armadura', slot:'peito', rarity:'comum', material:'fibra', reqLevel:1, durability:40, weight:2, valueCopper:5, def:2,stackable:false, image:'/images/items/armor/armor_cloth_linen.png' },
  { id:'armor_leather_basic', name:'Armadura de Couro', type:'armadura', slot:'peito', rarity:'comum', material:'couro', reqLevel:3, durability:60, weight:5, valueCopper:10, def:4,stackable:false, image:'/images/items/armor/armor_leather_basic.png' },
  { id:'armor_iron_chest', name:'Peitoral de Ferro', type:'armadura', slot:'peito', rarity:'incomum', material:'ferro', reqLevel:6, durability:100, weight:10, valueCopper:20, def:8,stackable:false, image:'/images/items/armor/armor_iron_chest.png' },

  // === Joias ===
  { id:'ring_silver', name:'Anel de Prata', type:'acessório', slot:'anel', rarity:'incomum', reqLevel:5, valueCopper:15, weight:1, stackable:false, image:'/images/items/jewelry/ring_silver.png' },
  { id:'ring_gold', name:'Anel de Ouro', type:'acessório', slot:'anel', rarity:'raro', reqLevel:10, valueCopper:25, weight:1, stackable:false, image:'/images/items/jewelry/ring_gold.png' },

  // === Comidas ===
  { id:'food_bread', name:'Pão', type:'comida', rarity:'comum', valueCopper:2, weight:1, stackable:true, maxStack:20, image:'/images/items/food/bread.png' },
  { id:'food_roast_chicken', name:'Frango Assado', type:'comida', rarity:'incomum', valueCopper:12, weight:2, stackable:true, maxStack:10, image:'/images/items/food/roast_chicken.png' },
  { id:'food_stew_beef', name:'Ensopado de Carne', type:'comida', rarity:'incomum', valueCopper:8, weight:2, stackable:true, maxStack:10, image:'/images/items/food/stew_beef.png' },
  { id:'food_grilled_pork', name:'Porco Grelhado', type:'comida', rarity:'incomum', valueCopper:10, weight:2, stackable:true, maxStack:10, image:'/images/items/food/grilled_pork.png' },
  { id:'food_berry_pie', name:'Torta de Frutas Silvestres', type:'comida', rarity:'raro', valueCopper:15, weight:1, stackable:true, maxStack:10, image:'/images/items/food/berry_pie.png' },
  { id:'food_goat_cheese', name:'Queijo de Cabra', type:'comida', rarity:'incomum', valueCopper:7, weight:1, stackable:true, maxStack:10, image:'/images/items/food/goat_cheese.png' },
  { id:'food_flatbread', name:'Pão Sírio', type:'comida', rarity:'comum', valueCopper:3, weight:1, stackable:true, maxStack:20, image:'/images/items/food/flatbread.png' },
  { id:'food_mushroom_soup', name:'Sopa de Cogumelos', type:'comida', rarity:'incomum', valueCopper:6, weight:1, stackable:true, maxStack:10, image:'/images/items/food/mushroom_soup.png' },
  { id:'food_roasted_potato', name:'Batata Assada', type:'comida', rarity:'comum', valueCopper:4, weight:1, stackable:true, maxStack:20, image:'/images/items/food/roasted_potato.png' },
  { id:'food_honey_mead', name:'Hidromel', type:'comida', rarity:'incomum', valueCopper:9, weight:1, stackable:true, maxStack:10, image:'/images/items/food/honey_mead.png' },
  { id:'food_cabbage_rolls', name:'Charuto de Repolho', type:'comida', rarity:'incomum', valueCopper:7, weight:1, stackable:true, maxStack:10, image:'/images/items/food/cabbage_rolls.png' },
  { id:'food_fruit_salad', name:'Salada de Frutas', type:'comida', rarity:'comum', valueCopper:5, weight:1, stackable:true, maxStack:10, image:'/images/items/food/fruit_salad.png' },


  // === Poções ===
  { id:'potion_health_small', name:'Poção de Vida Menor', type:'consumível', rarity:'comum', valueCopper:10, weight:1, stackable:true, maxStack:10, image:'/images/items/potions/health_small.png' },
  { id:'potion_health_large', name:'Poção de Vida Grande', type:'consumível', rarity:'incomum', valueCopper:25, weight:1, stackable:true, maxStack:10, image:'/images/items/potions/health_large.png' },
  { id:'potion_stamina', name:'Poção de Stamina', type:'consumível', rarity:'incomum', valueCopper:20, weight:1, stackable:true, maxStack:10, image:'/images/items/potions/stamina.png' },

  // === Extras ===
  { id:'rune_fire', name:'Runa de Fogo', type:'runa', rarity:'raro', valueCopper:30, weight:1, stackable:true, maxStack:10, image:'/images/items/runes/fire.png' },
  { id:'rune_ice', name:'Runa de Gelo', type:'runa', rarity:'raro', valueCopper:30, weight:1, stackable:true, maxStack:10, image:'/images/items/runes/ice.png' },
  { id:'rune_wind', name:'Runa de Vento', type:'runa', rarity:'raro', valueCopper:30, weight:1, stackable:true, maxStack:10, image:'/images/items/runes/wind.png' },
  { id:'essence_magic', name:'Essência Mágica', type:'material', rarity:'épico', valueCopper:50, weight:1, stackable:true, maxStack:20, image:'/images/items/materials/essence_magic.png' },
  { id:'soul_fragment', name:'Fragmento de Alma', type:'material', rarity:'épico', valueCopper:60, weight:1, stackable:true, maxStack:20, image:'/images/items/materials/soul_fragment.png' },
  { id:'crystal_dust', name:'Pó de Cristal', type:'material', rarity:'raro', valueCopper:40, weight:1, stackable:true, maxStack:20, image:'/images/items/materials/crystal_dust.png' },
  { id:'guild_medal', name:'Medalha da Guilda', type:'missão', rarity:'comum', valueCopper:0, weight:0, stackable:true, maxStack:10, image:'/images/items/quest/guild_medal.png' },
  { id:'hunt_contract', name:'Contrato de Caçada', type:'missão', rarity:'comum', valueCopper:0, weight:0, stackable:true, maxStack:10, image:'/images/items/quest/hunt_contract.png' },
  { id:'ancient_map', name:'Mapa Antigo', type:'missão', rarity:'raro', valueCopper:0, weight:0, stackable:true, maxStack:5, image:'/images/items/quest/ancient_map.png' },
  { id:'tool_pickaxe', name:'Picareta de Ferro', type:'ferramenta', rarity:'comum', valueCopper:10, weight:5, stackable:false, image:'/images/items/tools/pickaxe.png' },
  { id:'tool_axe', name:'Machado de Madeira', type:'ferramenta', rarity:'comum', valueCopper:6, weight:4, stackable:false, image:'/images/items/tools/axe.png' },
  { id:'tool_scythe', name:'Foice de Ferro', type:'ferramenta', rarity:'comum', valueCopper:8, weight:4, stackable:false, image:'/images/items/tools/scythe.png' }
];
