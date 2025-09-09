// data/items_catalog.ts
export type ItemType = 'consumable' | 'ingredient' | 'resource' | 'armor' | 'weapon' | 'trinket';
export type DropTableEntry = { id: string; qty: number; chance: number }; // chance = 1..10000 (1 = 0.01%)
export type CatalogItem = {
  id: string;
  name: string;
  type: ItemType;
  valueCopper: number;
  desc?: string;
};

export const ITEMS: CatalogItem[] = [
  { id:'erva_simples', name:'Erva Simples', type:'ingredient', valueCopper:4, desc:'Base para poções fracas.' },
  { id:'erva_amarga', name:'Erva Amarga', type:'ingredient', valueCopper:8 },
  { id:'folha_de_mint', name:'Folha de Menta', type:'ingredient', valueCopper:12 },
  { id:'mel_cristal', name:'Mel Cristalizado', type:'ingredient', valueCopper:14 },
  { id:'glandula_veneno', name:'Glândula de Veneno', type:'ingredient', valueCopper:22 },
  { id:'dente_lobo', name:'Dente de Lobo', type:'resource', valueCopper:18 },
  { id:'couro_rato', name:'Couro de Rato', type:'resource', valueCopper:6 },
  { id:'couro_lobo', name:'Couro de Lobo', type:'resource', valueCopper:26 },
  { id:'pena_corvo', name:'Pena de Corvo', type:'resource', valueCopper:10 },
  { id:'minerio_cobre', name:'Minério de Cobre', type:'resource', valueCopper:20 },
  { id:'minerio_ferro', name:'Minério de Ferro', type:'resource', valueCopper:36 },
  { id:'minerio_prata', name:'Minério de Prata', type:'resource', valueCopper:90 },
  { id:'minerio_ouro', name:'Minério de Ouro', type:'resource', valueCopper:140 },
  { id:'po_cintilante', name:'Pó Cintilante', type:'ingredient', valueCopper:24 },
  { id:'essencia_fria', name:'Essência Fria', type:'ingredient', valueCopper:28 },
  { id:'essencia_ígnea', name:'Essência Ígnea', type:'ingredient', valueCopper:32 },
  { id:'raiz_mandrágora', name:'Raiz de Mandrágora', type:'ingredient', valueCopper:48 },
  { id:'poção_hp_pequena', name:'Poção de HP (pequena)', type:'consumable', valueCopper:30, desc:'Restaura 20 HP.' },
  { id:'poção_hp_media', name:'Poção de HP (média)', type:'consumable', valueCopper:80, desc:'Restaura 50 HP.' },
  { id:'poção_antídoto', name:'Poção Antídoto', type:'consumable', valueCopper:55, desc:'Remove veneno.' },

  { id:'adaga_simples', name:'Adaga Simples', type:'weapon', valueCopper:110 },
  { id:'espada_curta', name:'Espada Curta', type:'weapon', valueCopper:180 },
  { id:'clava_madeira', name:'Clava de Madeira', type:'weapon', valueCopper:60 },
  { id:'arco_rudimentar', name:'Arco Rudimentar', type:'weapon', valueCopper:140 },
  { id:'besta_leve', name:'Besta Leve', type:'weapon', valueCopper:220 },

  { id:'armadura_couro', name:'Armadura de Couro', type:'armor', valueCopper:240 },
  { id:'armadura_malha', name:'Cota de Malha', type:'armor', valueCopper:380 },
  { id:'escudo_madeira', name:'Escudo de Madeira', type:'armor', valueCopper:120 },
  { id:'elmo_couro', name:'Elmo de Couro', type:'armor', valueCopper:90 },
  { id:'botas_viagem', name:'Botas de Viagem', type:'armor', valueCopper:70 },

  { id:'anel_bronze', name:'Anel de Bronze', type:'trinket', valueCopper:55 },
  { id:'colar_osso', name:'Colar de Osso', type:'trinket', valueCopper:44 },
  { id:'broche_prata', name:'Broche de Prata', type:'trinket', valueCopper:210 },
  { id:'amuleta_runa', name:'Amuleta Rúnica', type:'trinket', valueCopper:260 },

  { id:'pedra_raro', name:'Pedra Rara', type:'resource', valueCopper:300 },
  { id:'gema_verde', name:'Gema Verde', type:'resource', valueCopper:420 },
  { id:'gema_azul', name:'Gema Azul', type:'resource', valueCopper:460 },
  { id:'gema_roxa', name:'Gema Roxa', type:'resource', valueCopper:520 },
  { id:'gema_dourada', name:'Gema Dourada', type:'resource', valueCopper:800 },

  { id:'escama_basilisco', name:'Escama de Basilisco', type:'resource', valueCopper:900 },
  { id:'garra_grifo', name:'Garra de Grifo', type:'resource', valueCopper:1100 },
  { id:'chifre_minotauro', name:'Chifre de Minotauro', type:'resource', valueCopper:1500 },
  { id:'pena_fenix', name:'Pena de Fênix', type:'resource', valueCopper:2000 },
  { id:'osso_antigo', name:'Osso Antigo', type:'resource', valueCopper:650 },

  { id:'manuscrito_velho', name:'Manuscrito Velho', type:'resource', valueCopper:95 },
  { id:'mapa_tesouro', name:'Mapa de Tesouro', type:'resource', valueCopper:400 },
  { id:'chave_enferrujada', name:'Chave Enferrujada', type:'resource', valueCopper:12 },
  { id:'pergaminho_encanto', name:'Pergaminho de Encantamento', type:'resource', valueCopper:360 },
  { id:'nucleo_monstro', name:'Núcleo de Monstro', type:'resource', valueCopper:520 },
];
