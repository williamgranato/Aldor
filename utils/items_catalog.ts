// utils/items_catalog.ts
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type ItemMeta = {
  id: string;
  name: string;
  rarity: Rarity;
  desc: string;
  type?: 'weapon'|'armor'|'material'|'potion'|'gem'|'tool'|'misc';
  durabilityMax?: number;
  icon?: string; // optional override
  valueCopper?: number;
};

export const ITEMS: Record<string, ItemMeta> = {
  couro: { id:'couro', name:'Couro Curtido', rarity:'common', type:'material', desc:'Couro de fera, útil para armaduras leves.', valueCopper: 35 },
  erva: { id:'erva', name:'Erva Silvestre', rarity:'common', type:'potion', desc:'Base para poções frágeis.', valueCopper: 12 },
  madeira: { id:'madeira', name:'Madeira Rústica', rarity:'common', type:'material', desc:'Tábuas toscas para cabos e reforços.', valueCopper: 15 },
  minerio_cobre: { id:'minerio_cobre', name:'Minério de Cobre', rarity:'common', type:'material', desc:'Ligas simples e condução arcana básica.', valueCopper: 22 },
  minerio_ferro: { id:'minerio_ferro', name:'Minério de Ferro', rarity:'uncommon', type:'material', desc:'Forja armas e escudos de respeito.', valueCopper: 55 },
  minerio_aco: { id:'minerio_aco', name:'Liga de Aço', rarity:'uncommon', type:'material', desc:'Aço tratado, resistente e confiável.', valueCopper: 90 },
  po_fraco: { id:'po_fraco', name:'Pó Alquímico Fraco', rarity:'common', type:'potion', desc:'Catalisador básico para poções simples.', valueCopper: 28 },
  po_medio: { id:'po_medio', name:'Pó Alquímico Médio', rarity:'uncommon', type:'potion', desc:'Catalisador estável para misturas decentes.', valueCopper: 65 },
  po_forte: { id:'po_forte', name:'Pó Alquímico Forte', rarity:'rare', type:'potion', desc:'Garante potência e explosão de sabor—literalmente.', valueCopper: 145 },
  gema_comum: { id:'gema_comum', name:'Gema Opaca', rarity:'common', type:'gem', desc:'Bonita, mas meio tímida.', valueCopper: 30 },
  gema_incomum: { id:'gema_incomum', name:'Gema Brilhante', rarity:'uncommon', type:'gem', desc:'Reflete luz como água em dia claro.', valueCopper: 90 },
  gema_rara: { id:'gema_rara', name:'Gema Rara', rarity:'rare', type:'gem', desc:'Ares nobres e bolso pesado.', valueCopper: 220 },
  gema_epica: { id:'gema_epica', name:'Coração da Aurora', rarity:'epic', type:'gem', desc:'Pulsa energia antiga em silêncio.', valueCopper: 820 },
  gema_lendaria: { id:'gema_lendaria', name:'Lágrima do Dragão', rarity:'legendary', type:'gem', desc:'Dizem conter o último sonho de um draco.', valueCopper: 2500 },

  espada_aco_1m: { id:'espada_aco_1m', name:'Espada de Aço (1M)', rarity:'uncommon', type:'weapon', desc:'Lâmina balanceada para quem sabe o que faz.', durabilityMax: 120, valueCopper: 600 },
  adaga_mithril: { id:'adaga_mithril', name:'Adaga de Mithril', rarity:'rare', type:'weapon', desc:'Leve, fria e mortal; perfeita para golpes rápidos.', durabilityMax: 100, valueCopper: 950 },
  armadura_couro_lendaria: { id:'armadura_couro_lendaria', name:'Armadura de Couro Lendária', rarity:'legendary', type:'armor', desc:'Couro runado que sussurra coragem ao ouvido.', durabilityMax: 180, valueCopper: 3200 },
  elmo_bronze: { id:'elmo_bronze', name:'Elmo de Bronze', rarity:'common', type:'armor', desc:'Protege a cabeça e o ego (em partes).', durabilityMax: 80, valueCopper: 200 },
  escudo_ferro: { id:'escudo_ferro', name:'Escudo de Ferro', rarity:'uncommon', type:'armor', desc:'Trinca flecha e segura porrada.', durabilityMax: 140, valueCopper: 700 },
};

export function getItemMeta(id: string): ItemMeta {
  return ITEMS[id] || { id, name: id, rarity:'common', desc:'—', type:'misc', valueCopper: 0 };
}

export function rarityClass(r: Rarity): string {
  switch(r){
    case 'common': return 'text-zinc-200';
    case 'uncommon': return 'text-emerald-300';
    case 'rare': return 'text-sky-300';
    case 'epic': return 'text-fuchsia-300';
    case 'legendary': return 'text-amber-300';
  }
}
