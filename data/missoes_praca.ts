// Missões da Praça (iniciantes, fora da guilda)
export function getPracaMissions() {
  return [
    {
      id: 'p1',
      name: 'Ajudar o Ferreiro',
      description: 'O ferreiro precisa de alguém para buscar carvão no depósito próximo.',
      duration: 5000,
      rewards: { xp: 4, coins: { copper: 8 } },
      drops: [{ id: 'coal', name: 'Carvão', image: '/images/items/materials/coal.png', chance: 50 }]
    },
    {
      id: 'p2',
      name: 'Cuidar da Fonte',
      description: 'A fonte central precisa ser limpa. Um trabalho simples, mas necessário.',
      duration: 5000,
      rewards: { xp: 5, coins: { copper: 10 } },
      drops: []
    },
    {
      id: 'p3',
      name: 'Varredura da Praça',
      description: 'Os moradores pediram ajuda para manter a praça limpa.',
      duration: 5000,
      rewards: { xp: 6, coins: { copper: 12 } },
      drops: [{ id: 'apple', name: 'Maçã', image: '/images/items/food/apple.png', chance: 40 }]
    }
  ];
}