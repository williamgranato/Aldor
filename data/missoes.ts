// data/missoes.ts
import type { Rank, Quest } from '@/types_aldor_client';

export function getPracaMissions(): Quest[] {
  return [
    { id: 'p1', title: 'Ajudar camponeses', desc: 'Auxilie na colheita antes da chuva.', requiredRank: 'F', duration: 4000, rewards: { xp: 5, coinsCopper: 2 } },
    { id: 'p2', title: 'Limpar a praça', desc: 'A praça central precisa de cuidados.', requiredRank: 'F', duration: 5000, rewards: { xp: 6, coinsCopper: 3 } },
    { id: 'p3', title: 'Cuidar da fonte', desc: 'Mantenha a fonte livre de sujeira.', requiredRank: 'F', duration: 6000, rewards: { xp: 7, coinsCopper: 4 } },
  ];
}

const MISSIONS_POOL: Record<Rank, Quest[]> = {
  F: [
    { id:'f1', title:'Caçar Goblins', desc:'Grupos de goblins atrapalham caravanas.', requiredRank:'F', duration:5000, rewards:{ xp:10, coinsCopper:5 }, enemies:[{id:'goblin',name:'Goblin',hp:20,atk:4,def:1,crit:0.05}] },
    { id:'f2', title:'Ratos na Taverna', desc:'O porão da taverna está infestado.', requiredRank:'F', duration:6000, rewards:{ xp:12, coinsCopper:6 }, enemies:[{id:'rat',name:'Rato Gigante',hp:15,atk:3,def:0,crit:0.02}] },
    { id:'f3', title:'Entrega de Mensagem', desc:'Leve um pergaminho urgente.', requiredRank:'F', duration:7000, rewards:{ xp:8, coinsCopper:7 }, enemies:[] },
  ],
  E: [
    { id:'e1', title:'Patrulhar Estrada', desc:'Proteja viajantes contra bandidos.', requiredRank:'E', duration:9000, rewards:{ xp:18, coinsCopper:15 }, enemies:[{id:'bandit',name:'Bandido',hp:30,atk:6,def:2,crit:0.05}] },
    { id:'e2', title:'Caçada de Lobos', desc:'A alcateia ataca rebanhos.', requiredRank:'E', duration:8000, rewards:{ xp:16, coinsCopper:12 }, enemies:[{id:'wolf',name:'Lobo',hp:25,atk:5,def:1,crit:0.03}] },
    { id:'e3', title:'Proteger Caravana', desc:'Uma caravana precisa de escolta.', requiredRank:'E', duration:9500, rewards:{ xp:20, coinsCopper:17 }, enemies:[{id:'bandit2',name:'Bandido Líder',hp:35,atk:7,def:2,crit:0.06}] },
  ],
  D: [
    { id:'d1', title:'Investigar Necromante', desc:'Necromante se esconde nas catacumbas.', requiredRank:'D', duration:12000, rewards:{ xp:30, coinsCopper:25 }, enemies:[{id:'necromancer',name:'Necromante',hp:40,atk:8,def:3,crit:0.08}] },
    { id:'d2', title:'Escoltar Mercadores', desc:'Mercadores precisam chegar à capital.', requiredRank:'D', duration:11000, rewards:{ xp:25, coinsCopper:20 }, enemies:[{id:'thief',name:'Ladrão',hp:28,atk:6,def:2,crit:0.04}] },
    { id:'d3', title:'Caçar Troll', desc:'Um troll ameaça a ponte.', requiredRank:'D', duration:12500, rewards:{ xp:32, coinsCopper:28 }, enemies:[{id:'troll',name:'Troll',hp:60,atk:10,def:4,crit:0.02}] },
  ],
  // Adicionar mais ranks conforme necessário (C até SSS)
};

export function getGuildMissions(rank: Rank): Quest[] {
  const pool = MISSIONS_POOL[rank] || [];
  return [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
}
