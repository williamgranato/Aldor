// data/mushoku_expanded.ts
export type MTClassKey =
  | 'guerreiro' | 'espada' | 'lanceiro' | 'arqueiro'
  | 'mago_novato' | 'mago_intermediario' | 'mago_avancado'
  | 'mago_santo' | 'mago_rei' | 'mago_imperial' | 'mago_divino'
  | 'clerigo' | 'druida' | 'invocador' | 'bardo' | 'alquimista' | 'domador';

export type MTRaceKey =
  | 'humano' | 'fera' | 'elfo' | 'anão' | 'demi_humano' | 'demonio' | 'dragao' | 'homunculus';

export const CLASS_ICONS: Record<MTClassKey, string> = {
  guerreiro:'/images/ui/classes/guerreiro.png',  espada:'/images/ui/classes/espada.png',
  lanceiro:'/images/ui/classes/lanceiro.png',    arqueiro:'/images/ui/classes/arqueiro.png',
  mago_novato:'/images/ui/classes/mago_novato.png',
  mago_intermediario:'/images/ui/classes/mago_intermediario.png',
  mago_avancado:'/images/ui/classes/mago_avancado.png',
  mago_santo:'/images/ui/classes/mago_santo.png',
  mago_rei:'/images/ui/classes/mago_rei.png',   mago_imperial:'/images/ui/classes/mago_imperial.png',
  mago_divino:'/images/ui/classes/mago_divino.png',
  clerigo:'/images/ui/classes/clerigo.png',     druida:'/images/ui/classes/druida.png',
  invocador:'/images/ui/classes/invocador.png', bardo:'/images/ui/classes/bardo.png',
  alquimista:'/images/ui/classes/alquimista.png', domador:'/images/ui/classes/domador.png',
};

export const RACE_ICONS: Record<MTRaceKey, string> = {
  humano:'/images/ui/races/humano.png', fera:'/images/ui/races/fera.png',
  elfo:'/images/ui/races/elfo.png', anão:'/images/ui/races/anao.png',
  demi_humano:'/images/ui/races/demi_humano.png', demonio:'/images/ui/races/demonio.png',
  dragao:'/images/ui/races/dragao.png', homunculus:'/images/ui/races/homunculus.png',
};

export const MT_CLASSES = [
  { key:'guerreiro', label:'Guerreiro' },
  { key:'espada', label:'Espadachim' },
  { key:'lanceiro', label:'Lanceiro' },
  { key:'arqueiro', label:'Arqueiro' },
  { key:'mago_novato', label:'Mago (Principiante)' },
  { key:'mago_intermediario', label:'Mago (Intermediário)' },
  { key:'mago_avancado', label:'Mago (Avançado)' },
  { key:'mago_santo', label:'Mago (Santo)' },
  { key:'mago_rei', label:'Mago (Rei)' },
  { key:'mago_imperial', label:'Mago (Imperial)' },
  { key:'mago_divino', label:'Mago (Divino)' },
  { key:'clerigo', label:'Clérigo' },
  { key:'druida', label:'Druida' },
  { key:'invocador', label:'Invocador' },
  { key:'bardo', label:'Bardo' },
  { key:'alquimista', label:'Alquimista' },
  { key:'domador', label:'Domador' },
];

export const MT_RACES = [
  { key:'humano', label:'Humano' },
  { key:'fera', label:'Fera' },
  { key:'elfo', label:'Elfo' },
  { key:'anão', label:'Anão' },
  { key:'demi_humano', label:'Demi-Humano' },
  { key:'demonio', label:'Demônio' },
  { key:'dragao', label:'Dragão' },
  { key:'homunculus', label:'Homúnculo' },
];

export const MT_REGIONS = [
  { continente:'Continente Central (Asura)', grupos:[
    { reino:'Reino de Asura', cidades:['Capital Real de Asura','Distrito de Fittoa','Distrito de Roa','Distrito de Buina'] },
    { reino:'Reino de Shirone', cidades:['Shirone (Capital)','Shirone Baixa'] },
    { reino:'Reino de Sanakia', cidades:['Sanakia (Capital)'] },
    { reino:'Reino de Kikka', cidades:['Kikka (Capital)'] },
    { reino:'Reino de Biheiril', cidades:['Biheiril (Capital)'] },
  ]},
  { continente:'Continente Demoníaco', grupos:[
    { reino:'Reino Demoníaco', cidades:['Riikarisu (Rikarisu)','Kurasuma','Estrada das Cinzas'] },
  ]},
  { continente:'Continente Millis', grupos:[
    { reino:'Santo Reino de Millis', cidades:['Cidade Sagrada de Millishion','Porto Oeste','Porto Leste'] },
  ]},
  { continente:'Continente das Bestas / Grande Floresta', grupos:[
    { reino:'Tribo da Grande Floresta', cidades:['Aldeias da Grande Floresta','Posto Fronteiriço do Norte'] },
  ]},
  { continente:'Reino do Rei Dragão', grupos:[
    { reino:'Reino do Rei Dragão', cidades:['Capital Dracônica','Passo das Montanhas do Dragão Azul'] },
  ]},
  { continente:'Zona de Conflito', grupos:[
    { reino:'Zona de Conflito', cidades:['Fronte do Leste','Fronte do Oeste'] },
  ]},
  { continente:'Regiões de Estudo/Magia', grupos:[
    { reino:'Universidade de Magia de Ranoa', cidades:['Sharia (Cidade Universitária)'] },
  ]},
];
