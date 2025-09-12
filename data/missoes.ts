// data/missoes.ts
// Fonte única para missões da Praça (não-combativas).
// Mantém compat: exporta lista e helpers nomeados, não remove nada existente em outros catálogos.

export type Pouch = { gold?: number; silver?: number; bronze?: number; copper?: number };

export type PracaMission = {
  id: string;
  title: string;
  desc: string;
  category: 'praca';
  requiredRank: 'F';
  allowNonMember: true;
  durationMs: number; // base 10s
  rewards: { xp: number; copper?: number; coins?: Pouch };
  drops?: Array<{ id: string; name: string; qty?: number }>;
};

// Base 10s para rank F
const BASE_DURATION = 3_000;

export const PRACA_MISSIONS: PracaMission[] = [
  { id: 'praca:entregar-carta', title: 'Entregar carta', desc: 'Leve uma carta ao bairro vizinho.', category: 'praca', requiredRank: 'F', allowNonMember: true, durationMs: BASE_DURATION, rewards: { xp: 12, copper: 35 } },
  { id: 'praca:varrer', title: 'Varredura da praça', desc: 'Ajude a manter a praça limpa.', category: 'praca', requiredRank: 'F', allowNonMember: true, durationMs: BASE_DURATION, rewards: { xp: 10, copper: 20 } },
  { id: 'praca:ferreiro', title: 'Ajudar o ferreiro', desc: 'Carregue carvão e organize ferramentas.', category: 'praca', requiredRank: 'F', allowNonMember: true, durationMs: BASE_DURATION, rewards: { xp: 18, copper: 60 } },
  { id: 'praca:ervas', title: 'Colher ervas', desc: 'Coletar ervas próximas ao riacho.', category: 'praca', requiredRank: 'F', allowNonMember: true, durationMs: BASE_DURATION, rewards: { xp: 16, copper: 40 }, drops: [{ id: 'herb:common', name: 'Erva comum', qty: 1 }] },
  { id: 'praca:agua-poco', title: 'Levar água do poço', desc: 'Transportar baldes de água para os comerciantes.', category: 'praca', requiredRank: 'F', allowNonMember: true, durationMs: BASE_DURATION, rewards: { xp: 14, copper: 30 } },
  { id: 'praca:limpar-taverna', title: 'Limpeza da taverna', desc: 'Ajude na limpeza após a noite movimentada.', category: 'praca', requiredRank: 'F', allowNonMember: true, durationMs: BASE_DURATION, rewards: { xp: 15, copper: 50 } },
  { id: 'praca:organizar-bancas', title: 'Organizar bancas do mercado', desc: 'Arrumar caixas e toldos das barracas.', category: 'praca', requiredRank: 'F', allowNonMember: true, durationMs: BASE_DURATION, rewards: { xp: 20, copper: 70 } },
  { id: 'praca:entregar-encomenda', title: 'Entregar encomenda', desc: 'Leve um pacote selado até o portão leste.', category: 'praca', requiredRank: 'F', allowNonMember: true, durationMs: BASE_DURATION, rewards: { xp: 18, copper: 55 } },
  { id: 'praca:alimentar-animais', title: 'Alimentar animais', desc: 'Cuide dos animais do curral comunitário.', category: 'praca', requiredRank: 'F', allowNonMember: true, durationMs: BASE_DURATION, rewards: { xp: 12, copper: 25 } },
  { id: 'praca:afiar-facas', title: 'Afiar facas', desc: 'Afiar lâminas para os vendedores de comida.', category: 'praca', requiredRank: 'F', allowNonMember: true, durationMs: BASE_DURATION, rewards: { xp: 22, copper: 80 } },
  { id: 'praca:vigiar-bancas', title: 'Vigiar bancas', desc: 'Ajudar a vigiar as bancas durante o pico.', category: 'praca', requiredRank: 'F', allowNonMember: true, durationMs: BASE_DURATION, rewards: { xp: 20, copper: 65 } },
  { id: 'praca:guiar-viajantes', title: 'Guiar viajantes', desc: 'Acompanhe viajantes até a hospedaria.', category: 'praca', requiredRank: 'F', allowNonMember: true, durationMs: BASE_DURATION, rewards: { xp: 25, copper: 90 } },
  { id: 'praca:ajudar-herborista', title: 'Ajudar herborista', desc: 'Separar folhas e sementes.', category: 'praca', requiredRank: 'F', allowNonMember: true, durationMs: BASE_DURATION, rewards: { xp: 16, copper: 45 } },
  { id: 'praca:fixar-placas', title: 'Fixar placas', desc: 'Instalar placas informativas na praça.', category: 'praca', requiredRank: 'F', allowNonMember: true, durationMs: BASE_DURATION, rewards: { xp: 14, copper: 35 } },
  { id: 'praca:varas-pesca', title: 'Consertar varas de pesca', desc: 'Ajustes simples nas varas dos pescadores.', category: 'praca', requiredRank: 'F', allowNonMember: true, durationMs: BASE_DURATION, rewards: { xp: 18, copper: 55 } },
  { id: 'praca:polir-escudos', title: 'Polir escudos', desc: 'Polimento básico para exposição.', category: 'praca', requiredRank: 'F', allowNonMember: true, durationMs: BASE_DURATION, rewards: { xp: 20, copper: 70 } },
  { id: 'praca:arrumar-biblioteca', title: 'Arrumar biblioteca', desc: 'Organizar pergaminhos e livros.', category: 'praca', requiredRank: 'F', allowNonMember: true, durationMs: BASE_DURATION, rewards: { xp: 22, copper: 85 } },
  { id: 'praca:bordar-bandeiras', title: 'Bordar bandeiras', desc: 'Ajude no bordado de estandartes.', category: 'praca', requiredRank: 'F', allowNonMember: true, durationMs: BASE_DURATION, rewards: { xp: 24, copper: 95 } },
];

export function getPracaMissions(): PracaMission[] {
  return PRACA_MISSIONS;
}
