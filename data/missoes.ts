// data/missoes.ts
// 3 missões por rank com descrição, inimigos e drops possíveis
import type { Rank, Quest } from '@/types_aldor_client';

export function getPracaMissions(): Quest[] {
  return [
    { id: 'p1', title: 'Ajudar camponeses', desc: 'Auxilie na colheita antes da chuva.', requiredRank: 'F', duration: 4000, rewards: { xp: 5, coinsCopper: 2 } },
    { id: 'p2', title: 'Limpar a praça', desc: 'A praça central precisa de cuidados.', requiredRank: 'F', duration: 5000, rewards: { xp: 6, coinsCopper: 3 } },
    { id: 'p3', title: 'Cuidar da fonte', desc: 'Mantenha a fonte livre de sujeira.', requiredRank: 'F', duration: 6000, rewards: { xp: 7, coinsCopper: 4 } },
  ];
}

export type Mission = Quest & {
  enemies?: { id:string; name:string; hp:number; atk:number; def:number; crit:number }[];
  possibleDrops?: { id:string; chance:number; qty:number; rarity?:'comum'|'incomum'|'raro'|'épico'|'lendário'|'mítico'; name?:string; icon?:string }[];
};

const MISSIONS_POOL: Record<Rank, Mission[]> = {
  F: [
    { id:'f1', title:'Caçar Goblins', desc:'Goblins pilham carroças ao cair da tarde. Expulse-os antes que a rota feche.', requiredRank:'F', duration:5000, rewards:{ xp:10, coinsCopper:5 },
      enemies:[{id:'goblin',name:'Goblin',hp:20,atk:4,def:1,crit:0.05}],
      possibleDrops:[{id:'goblin_tooth',chance:0.30,qty:1,rarity:'comum',name:'Dente de Goblin',icon:'/images/items/fang.png'}] },
    { id:'f2', title:'Ratos na Taverna', desc:'Ratos gigantes tomaram o porão da taverna. O cheiro não ajuda o apetite.', requiredRank:'F', duration:6000, rewards:{ xp:12, coinsCopper:6 },
      enemies:[{id:'rat',name:'Rato Gigante',hp:15,atk:3,def:0,crit:0.02}],
      possibleDrops:[{id:'rat_tail',chance:0.40,qty:1,rarity:'comum',name:'Cauda de Rato',icon:'/images/items/tail.png'}] },
    { id:'f3', title:'Entrega de Mensagem', desc:'Leve um pergaminho lacrado através da mata. Às vezes quem lê morre de curiosidade.', requiredRank:'F', duration:7000, rewards:{ xp:8, coinsCopper:7 },
      enemies:[], possibleDrops:[{id:'coin_pouch',chance:0.20,qty:1,rarity:'incomum',name:'Bolsa de Moedas',icon:'/images/items/pouch.png'}] },
  ],
  E: [
    { id:'e1', title:'Patrulhar Estrada', desc:'Bandidos espreitam viajantes; mostre que a estrada também tem olhos.', requiredRank:'E', duration:9000, rewards:{ xp:18, coinsCopper:15 },
      enemies:[{id:'bandit',name:'Bandido',hp:30,atk:6,def:2,crit:0.05}],
      possibleDrops:[{id:'bandit_mask',chance:0.20,qty:1,rarity:'incomum',name:'Máscara de Bandido',icon:'/images/items/mask.png'}] },
    { id:'e2', title:'Caçada de Lobos', desc:'A alcateia aprendeu os horários da fazenda. Ensine novos hábitos.', requiredRank:'E', duration:8000, rewards:{ xp:16, coinsCopper:12 },
      enemies:[{id:'wolf',name:'Lobo',hp:25,atk:5,def:1,crit:0.03}],
      possibleDrops:[{id:'wolf_pelt',chance:0.30,qty:1,rarity:'comum',name:'Pele de Lobo',icon:'/images/items/pelt.png'}] },
    { id:'e3', title:'Proteger Caravana', desc:'Mercadores carregam especiarias. Bandidos carregam arrependimentos (depois).', requiredRank:'E', duration:9500, rewards:{ xp:20, coinsCopper:17 },
      enemies:[{id:'bandit2',name:'Líder Bandido',hp:35,atk:7,def:2,crit:0.06}],
      possibleDrops:[{id:'merchant_crate',chance:0.10,qty:1,rarity:'raro',name:'Caixote do Mercador',icon:'/images/items/crate.png'}] },
  ],
  D: [
    { id:'d1', title:'Investigar Necromante', desc:'Sussurros surgem das catacumbas. Às vezes os mortos têm voz demais.', requiredRank:'D', duration:12000, rewards:{ xp:30, coinsCopper:25 },
      enemies:[{id:'necromancer',name:'Necromante',hp:40,atk:8,def:3,crit:0.08}],
      possibleDrops:[{id:'dark_scroll',chance:0.15,qty:1,rarity:'raro',name:'Pergaminho Negro',icon:'/images/items/scroll.png'}] },
    { id:'d2', title:'Escoltar Mercadores', desc:'A capital paga bem por seda… e por segurança no caminho.', requiredRank:'D', duration:11000, rewards:{ xp:25, coinsCopper:20 },
      enemies:[{id:'thief',name:'Ladrão',hp:28,atk:6,def:2,crit:0.04}],
      possibleDrops:[{id:'jewel_bag',chance:0.10,qty:1,rarity:'épico',name:'Bolsa de Joias',icon:'/images/items/jewel.png'}] },
    { id:'d3', title:'Caçar Troll', desc:'Um troll cobra pedágio em pontes. Cobrar pedágio de um troll também é válido.', requiredRank:'D', duration:12500, rewards:{ xp:32, coinsCopper:28 },
      enemies:[{id:'troll',name:'Troll',hp:60,atk:10,def:4,crit:0.02}],
      possibleDrops:[{id:'troll_club',chance:0.20,qty:1,rarity:'incomum',name:'Clava de Troll',icon:'/images/items/club.png'}] },
  ],
  // Pode expandir C..SSS depois mantendo o mesmo formato
};

export function getGuildMissions(rank: Rank): Mission[] {
  const order: Rank[] = ['F','E','D','C','B','A','S','SS','SSS'];
  const idx = order.indexOf(rank);
  let list: Mission[] = [];
  for (let i = 0; i <= idx; i++) {
    list = list.concat(MISSIONS_POOL[order[i]] || []);
  }
  return list;
}
