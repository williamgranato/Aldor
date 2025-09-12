export function getGuildMissions(rank:string){
  const missions:any = {
    F:[
      { id:'f1', name:'Caçar Ratos', description:'A taverna da cidade está infestada de ratos. O dono pede sua ajuda para eliminar as pragas e restaurar a ordem no local.', rank:'F', difficulty:2, cost:5, rewards:{ xp:5, coins:{ copper:10 } }, drops:[{id:'goblin_tooth',name:'Dente de Goblin',image:'/images/items/goblin_tooth.png',chance:30}] },
      { id:'f2', name:'Entregar Carta', description:'Um mensageiro precisa que você leve uma carta importante até a vila vizinha. A estrada é curta, mas perigos podem surgir.', rank:'F', difficulty:3, cost:5, rewards:{ xp:6, coins:{ copper:5, bronze:1 } }, drops:[] },
      { id:'f3', name:'Proteger Fazenda', description:'Um fazendeiro teme ataques de ladrões. Passe a noite em sua fazenda e ajude a manter o local seguro contra invasores.', rank:'F', difficulty:4, cost:5, rewards:{ xp:8, coins:{ bronze:2 } }, drops:[{id:'apple',name:'Maçã',image:'/images/items/apple.png',chance:50}] }
    ],
    E:[
      { id:'e1', name:'Caçar Lobos', description:'A floresta próxima está cheia de lobos famintos. Derrote-os antes que ataquem os viajantes.', rank:'E', difficulty:10, cost:6, rewards:{ xp:12, coins:{ bronze:5 } }, drops:[{id:'wolf_pelt',name:'Pele de Lobo',image:'/images/items/wolf_pelt.png',chance:40}] },
      { id:'e2', name:'Explorar Ruínas', description:'Ruínas antigas escondem segredos e perigos. Investigue o local e descubra o que está enterrado no passado.', rank:'E', difficulty:12, cost:6, rewards:{ xp:14, coins:{ bronze:3, silver:1 } }, drops:[{id:'ancient_coin',name:'Moeda Antiga',image:'/images/items/ancient_coin.png',chance:25}] },
      { id:'e3', name:'Escoltar Mercador', description:'Um mercador precisa de proteção até a cidade vizinha. Inimigos podem emboscar no caminho.', rank:'E', difficulty:14, cost:6, rewards:{ xp:15, coins:{ silver:1 } }, drops:[{id:'leather',name:'Couro',image:'/images/items/leather.png',chance:35}] }
    ],
    D:[
      { id:'d1', name:'Derrotar Bandidos', description:'Uma gangue de bandidos está aterrorizando viajantes. Acabe com eles e devolva a segurança à estrada.', rank:'D', difficulty:18, cost:7, rewards:{ xp:20, coins:{ silver:2 } }, drops:[{id:'dagger',name:'Adaga Enferrujada',image:'/images/items/dagger.png',chance:20}] },
      { id:'d2', name:'Investigar Caverna', description:'Uma caverna escura exala sons estranhos. Explore o local e descubra a origem do mistério.', rank:'D', difficulty:20, cost:7, rewards:{ xp:22, coins:{ silver:2, bronze:5 } }, drops:[{id:'bat_wing',name:'Asa de Morcego',image:'/images/items/bat_wing.png',chance:30}] },
      { id:'d3', name:'Patrulhar Estrada', description:'A estrada comercial está em risco de ataques. Patrulhe o caminho e mantenha os mercadores seguros.', rank:'D', difficulty:22, cost:7, rewards:{ xp:24, coins:{ silver:3 } }, drops:[{id:'iron_sword',name:'Espada de Ferro',image:'/images/items/iron_sword.png',chance:15}] }
    ]
  };
  return missions[rank] || missions['F'];
}
