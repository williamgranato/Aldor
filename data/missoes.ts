export function getGuildMissions(rank:string){
  const missions:any = {
    F:[
      { id:'f1', name:'Caçar Ratos', description:'Elimine ratos da taverna.', rank:'F', difficulty:5, cost:5, rewards:{ xp:5, coins:{ copper:10 } }, drops:[{id:'goblin_tooth',name:'Dente de Goblin',image:'/images/items/goblin_tooth.png',chance:30}] },
      { id:'f2', name:'Entregar Carta', description:'Leve uma carta até a vila vizinha.', rank:'F', difficulty:5, cost:5, rewards:{ xp:6, coins:{ copper:5, bronze:1 } }, drops:[] },
      { id:'f3', name:'Proteger Fazenda', description:'Ajude o fazendeiro contra ladrões.', rank:'F', difficulty:8, cost:5, rewards:{ xp:8, coins:{ bronze:2 } }, drops:[{id:'apple',name:'Maçã',image:'/images/items/apple.png',chance:50}] }
    ],
    E:[
      { id:'e1', name:'Caçar Lobos', description:'Derrote lobos na floresta.', rank:'E', difficulty:12, cost:6, rewards:{ xp:12, coins:{ bronze:5 } }, drops:[{id:'wolf_pelt',name:'Pele de Lobo',image:'/images/items/wolf_pelt.png',chance:40}] },
      { id:'e2', name:'Explorar Ruínas', description:'Investigue ruínas antigas.', rank:'E', difficulty:14, cost:6, rewards:{ xp:14, coins:{ bronze:3, silver:1 } }, drops:[{id:'ancient_coin',name:'Moeda Antiga',image:'/images/items/ancient_coin.png',chance:25}] },
      { id:'e3', name:'Escoltar Mercador', description:'Proteja o mercador até a cidade.', rank:'E', difficulty:15, cost:6, rewards:{ xp:15, coins:{ silver:1 } }, drops:[{id:'leather',name:'Couro',image:'/images/items/leather.png',chance:35}] }
    ],
    D:[
      { id:'d1', name:'Derrotar Bandidos', description:'Acabe com a gangue de bandidos.', rank:'D', difficulty:18, cost:7, rewards:{ xp:20, coins:{ silver:2 } }, drops:[{id:'dagger',name:'Adaga Enferrujada',image:'/images/items/dagger.png',chance:20}] },
      { id:'d2', name:'Investigar Caverna', description:'Explore a caverna escura.', rank:'D', difficulty:20, cost:7, rewards:{ xp:22, coins:{ silver:2, bronze:5 } }, drops:[{id:'bat_wing',name:'Asa de Morcego',image:'/images/items/bat_wing.png',chance:30}] },
      { id:'d3', name:'Patrulhar Estrada', description:'Mantenha a estrada segura.', rank:'D', difficulty:22, cost:7, rewards:{ xp:24, coins:{ silver:3 } }, drops:[{id:'iron_sword',name:'Espada de Ferro',image:'/images/items/iron_sword.png',chance:15}] }
    ]
    // Pode-se expandir para C,B,A,S da mesma forma
  };
  return missions[rank] || missions['F'];
}
