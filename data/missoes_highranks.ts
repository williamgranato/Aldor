// data/missoes_highranks.ts
// Missões para ranks C → SSS (3 por rank), com narrativa, inimigos e drops de maior raridade.
import type { Rank, Quest } from '@/types_aldor_client';

export type Mission = Quest & {
  enemies?: { id:string; name:string; hp:number; atk:number; def:number; crit:number }[];
  possibleDrops?: { id:string; chance:number; qty:number; rarity?:'comum'|'incomum'|'raro'|'épico'|'lendário'|'mítico'; name?:string; icon?:string }[];
};

export const MISSIONS_HIGH_POOL: Record<Rank, Mission[]> = {
  C: [
    { id:'c1', title:'Eco nas Catacumbas', desc:'Câmaras antigas reverberam cânticos esquecidos. O ar vibra com magia residual. Traga um fragmento das runas antes que o eco acorde quem dorme.', requiredRank:'C', duration:14000, rewards:{ xp:42, coinsCopper:36 },
      enemies:[{id:'wight',name:'Espectro Antigo',hp:70,atk:12,def:6,crit:0.08}],
      possibleDrops:[{id:'rune_shard',chance:0.28,qty:1,rarity:'raro',name:'Fragmento Rúnico',icon:'/images/items/rune_shard.png'}] },
    { id:'c2', title:'Forja Submersa', desc:'Uma forja anã afundou sob o pântano. Barras de metal ecoam um cântico de fogo. Recupere uma lingote antes que a lama engula tudo.', requiredRank:'C', duration:15000, rewards:{ xp:45, coinsCopper:40 },
      enemies:[{id:'bog_golem',name:'Golem do Brejo',hp:85,atk:13,def:7,crit:0.05}],
      possibleDrops:[{id:'dwarven_ingot',chance:0.22,qty:1,rarity:'raro',name:'Lingote Anão',icon:'/images/items/ingot.png'}] },
    { id:'c3', title:'Ponte de Cinza', desc:'Uma ponte antiga desaba pouco a pouco. Bandidos cobram pedágio. Mostre a eles que a passagem tem outro preço.', requiredRank:'C', duration:13500, rewards:{ xp:38, coinsCopper:34 },
      enemies:[{id:'highwayman',name:'Salteador',hp:65,atk:11,def:5,crit:0.10}],
      possibleDrops:[{id:'bandit_seal',chance:0.25,qty:1,rarity:'incomum',name:'Selo de Salteador',icon:'/images/items/seal.png'}] },
  ],
  B: [
    { id:'b1', title:'Biblioteca Afogada', desc:'Nas profundezas do lago ergue-se uma torre. Livros suspiram bolhas, clamando por leitores. Recupere um tomo impermeável.', requiredRank:'B', duration:16000, rewards:{ xp:60, coinsCopper:55 },
      enemies:[{id:'drowned_mage',name:'Mago Afogado',hp:95,atk:16,def:8,crit:0.10}],
      possibleDrops:[{id:'waterlogged_tome',chance:0.20,qty:1,rarity:'épico',name:'Tomo Encharcado',icon:'/images/items/tome.png'}] },
    { id:'b2', title:'Caçada ao Basilisco', desc:'Olhos de pedra rondam o cânion. O basilisco escolhe estátuas como coleção. Desfaça a galeria.', requiredRank:'B', duration:17000, rewards:{ xp:66, coinsCopper:60 },
      enemies:[{id:'basilisk',name:'Basilisco',hp:120,atk:18,def:9,crit:0.12}],
      possibleDrops:[{id:'basilisk_scale',chance:0.18,qty:1,rarity:'épico',name:'Escama de Basilisco',icon:'/images/items/scale.png'}] },
    { id:'b3', title:'Vigia do Farol Negro', desc:'Um farol que brilha para dentro do mundo. Sinais escuros guiam navios a rochas. Inverta o rito.', requiredRank:'B', duration:16500, rewards:{ xp:62, coinsCopper:58 },
      enemies:[{id:'shade_keeper',name:'Vigia Sombrio',hp:110,atk:17,def:8,crit:0.10}],
      possibleDrops:[{id:'void_lantern',chance:0.16,qty:1,rarity:'épico',name:'Lanterna do Vazio',icon:'/images/items/lantern.png'}] },
  ],
  A: [
    { id:'a1', title:'Caravana Astral', desc:'Mercadores etéreos cruzam o céu noturno. Assaltantes aprendem a subir. Recupere o tributo sem cair da constelação.', requiredRank:'A', duration:19000, rewards:{ xp:85, coinsCopper:90 },
      enemies:[{id:'sky_raider',name:'Salteador Celeste',hp:140,atk:22,def:10,crit:0.14}],
      possibleDrops:[{id:'star_map',chance:0.16,qty:1,rarity:'lendário',name:'Mapa Estrelar',icon:'/images/items/map.png'}] },
    { id:'a2', title:'Árvore do Relâmpago', desc:'Uma árvore milenar captura trovões e coleciona cicatrizes. Corte um ramo sem acordar o céu.', requiredRank:'A', duration:20000, rewards:{ xp:92, coinsCopper:100 },
      enemies:[{id:'storm_dryad',name:'Dríade da Tempestade',hp:150,atk:24,def:11,crit:0.15}],
      possibleDrops:[{id:'storm_branch',chance:0.14,qty:1,rarity:'lendário',name:'Ramo Tempestuoso',icon:'/images/items/branch.png'}] },
    { id:'a3', title:'Sala dos Espelhos', desc:'Reflexos quebram o aventureiro em versões rivais. Vença quem mais te conhece: você.', requiredRank:'A', duration:18500, rewards:{ xp:88, coinsCopper:95 },
      enemies:[{id:'mirror_clone',name:'Sombra Espelhada',hp:145,atk:23,def:10,crit:0.16}],
      possibleDrops:[{id:'prism_shard',chance:0.12,qty:1,rarity:'lendário',name:'Fragmento Prisma',icon:'/images/items/prism.png'}] },
  ],
  S: [
    { id:'s1', title:'Catedral Invertida', desc:'Uma catedral pendurada sob um abismo canta ao avesso. Corrija o hino antes que o mundo desande.', requiredRank:'S', duration:23000, rewards:{ xp:130, coinsCopper:140 },
      enemies:[{id:'inverted_archon',name:'Arconte Invertido',hp:200,atk:30,def:14,crit:0.18}],
      possibleDrops:[{id:'antiphon_relic',chance:0.10,qty:1,rarity:'mítico',name:'Relíquia Antífona',icon:'/images/items/relic.png'}] },
    { id:'s2', title:'Hidra da Várzea', desc:'Três cabeças disputam quem morde primeiro. Vença a discussão.', requiredRank:'S', duration:24000, rewards:{ xp:138, coinsCopper:150 },
      enemies:[{id:'hydra',name:'Hidra',hp:230,atk:32,def:15,crit:0.16}],
      possibleDrops:[{id:'hydra_venom',chance:0.09,qty:1,rarity:'mítico',name:'Veneno de Hidra',icon:'/images/items/venom.png'}] },
    { id:'s3', title:'Relógio Sem Ponteiros', desc:'O tempo parou numa vila. Reponha o tique-taque antes que as memórias congelem.', requiredRank:'S', duration:22000, rewards:{ xp:125, coinsCopper:135 },
      enemies:[{id:'chronomancer',name:'Cronomante',hp:210,atk:29,def:13,crit:0.20}],
      possibleDrops:[{id:'hourglass_core',chance:0.08,qty:1,rarity:'mítico',name:'Núcleo de Ampulheta',icon:'/images/items/hourglass.png'}] },
  ],
  SS: [
    { id:'ss1', title:'Trono de Neve Negra', desc:'Uma rainha sem inverno reclama tronos alheios. Negocie com o frio.', requiredRank:'SS', duration:27000, rewards:{ xp:170, coinsCopper:190 },
      enemies:[{id:'frost_queen',name:'Rainha Gélida',hp:280,atk:36,def:18,crit:0.20}],
      possibleDrops:[{id:'black_snow',chance:0.07,qty:1,rarity:'mítico',name:'Neve Negra',icon:'/images/items/snow.png'}] },
    { id:'ss2', title:'Ópera das Lâminas', desc:'Espadas cantam duetos mortais num anfiteatro abandonado. Aplausos custam sangue.', requiredRank:'SS', duration:28000, rewards:{ xp:180, coinsCopper:200 },
      enemies:[{id:'blade_maestro',name:'Maestro da Lâmina',hp:300,atk:38,def:18,crit:0.22}],
      possibleDrops:[{id:'maestro_baton',chance:0.06,qty:1,rarity:'mítico',name:'Bastão do Maestro',icon:'/images/items/baton.png'}] },
    { id:'ss3', title:'Colheita Carmesim', desc:'Campos vermelhos colhem os vivos. Interrompa o ciclo.', requiredRank:'SS', duration:26000, rewards:{ xp:165, coinsCopper:185 },
      enemies:[{id:'reaper_host',name:'Enxame Ceifador',hp:290,atk:35,def:17,crit:0.19}],
      possibleDrops:[{id:'crimson_seed',chance:0.07,qty:1,rarity:'mítico',name:'Semente Carmesim',icon:'/images/items/seed.png'}] },
  ],
  SSS: [
    { id:'sss1', title:'Coroa do Vácuo', desc:'Entre galáxias há um trono sem rei. O vácuo gosta de aspirantes.', requiredRank:'SSS', duration:32000, rewards:{ xp:240, coinsCopper:260 },
      enemies:[{id:'void_regent',name:'Regente do Vácuo',hp:360,atk:45,def:22,crit:0.24}],
      possibleDrops:[{id:'crown_fragment',chance:0.05,qty:1,rarity:'mítico',name:'Fragmento da Coroa',icon:'/images/items/crown.png'}] },
    { id:'sss2', title:'Oração das Estrelas Mortas', desc:'Constelações apagadas rezam por retorno. Traduza a súplica.', requiredRank:'SSS', duration:33000, rewards:{ xp:255, coinsCopper:275 },
      enemies:[{id:'fallen_seraph',name:'Serafim Caído',hp:380,atk:48,def:23,crit:0.25}],
      possibleDrops:[{id:'stellar_tears',chance:0.05,qty:1,rarity:'mítico',name:'Lágrimas Estelares',icon:'/images/items/tear.png'}] },
    { id:'sss3', title:'Final do Mundo (Ensaio)', desc:'O fim vem em ensaio geral. A plateia não volta amanhã.', requiredRank:'SSS', duration:34000, rewards:{ xp:270, coinsCopper:290 },
      enemies:[{id:'apex_titan',name:'Titã Apical',hp:420,atk:52,def:24,crit:0.26}],
      possibleDrops:[{id:'end_script',chance:0.04,qty:1,rarity:'mítico',name:'Script do Fim',icon:'/images/items/script.png'}] },
  ],
};

// Helper para mesclar com seu MISSIONS_POOL existente
export function mergeHighRank(pool: Record<Rank, Mission[]|Quest[]>): Record<Rank, Mission[]> {
  const result: any = { ...pool };
  (Object.keys(MISSIONS_HIGH_POOL) as Rank[]).forEach((rk) => {
    const base = (result[rk] || []) as Mission[];
    result[rk] = [...base, ...MISSIONS_HIGH_POOL[rk]];
  });
  return result;
}
