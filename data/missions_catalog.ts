// data/missions_catalog.ts
import type { DropTableEntry } from './items_catalog';
export type Mission = { id:string; title:string; desc:string; rank:'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'; difficulty:number; rewards:{coinsCopper:number; xp:number}; drops: DropTableEntry[] };
export const MISSIONS: Mission[] = [
  {
    "id": "f_1",
    "title": "Caçar Ratos #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "F",
    "difficulty": 1.0,
    "rewards": {
      "coinsCopper": 11,
      "xp": 6
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "f_2",
    "title": "Caçar Ratos #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "F",
    "difficulty": 1.0,
    "rewards": {
      "coinsCopper": 8,
      "xp": 4
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "f_3",
    "title": "Caçar Ratos #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "F",
    "difficulty": 1.0,
    "rewards": {
      "coinsCopper": 16,
      "xp": 9
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "f_4",
    "title": "Limpar Galpão #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "F",
    "difficulty": 1.0,
    "rewards": {
      "coinsCopper": 15,
      "xp": 9
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "f_5",
    "title": "Limpar Galpão #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "F",
    "difficulty": 1.0,
    "rewards": {
      "coinsCopper": 15,
      "xp": 9
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "f_6",
    "title": "Limpar Galpão #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "F",
    "difficulty": 1.0,
    "rewards": {
      "coinsCopper": 12,
      "xp": 7
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "f_7",
    "title": "Entregar Carta #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "F",
    "difficulty": 1.0,
    "rewards": {
      "coinsCopper": 11,
      "xp": 6
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "f_8",
    "title": "Entregar Carta #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "F",
    "difficulty": 1.0,
    "rewards": {
      "coinsCopper": 10,
      "xp": 6
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "f_9",
    "title": "Entregar Carta #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "F",
    "difficulty": 1.0,
    "rewards": {
      "coinsCopper": 21,
      "xp": 12
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "f_10",
    "title": "Patrulha Leve #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "F",
    "difficulty": 1.0,
    "rewards": {
      "coinsCopper": 9,
      "xp": 5
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "f_11",
    "title": "Patrulha Leve #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "F",
    "difficulty": 1.0,
    "rewards": {
      "coinsCopper": 8,
      "xp": 4
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "f_12",
    "title": "Patrulha Leve #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "F",
    "difficulty": 1.0,
    "rewards": {
      "coinsCopper": 10,
      "xp": 6
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "f_13",
    "title": "Coletar Ervas #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "F",
    "difficulty": 1.0,
    "rewards": {
      "coinsCopper": 14,
      "xp": 8
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "f_14",
    "title": "Coletar Ervas #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "F",
    "difficulty": 1.0,
    "rewards": {
      "coinsCopper": 15,
      "xp": 9
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "f_15",
    "title": "Coletar Ervas #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "F",
    "difficulty": 1.0,
    "rewards": {
      "coinsCopper": 24,
      "xp": 14
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "e_16",
    "title": "Caçar Lobos #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "E",
    "difficulty": 1.1,
    "rewards": {
      "coinsCopper": 25,
      "xp": 15
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "e_17",
    "title": "Caçar Lobos #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "E",
    "difficulty": 1.1,
    "rewards": {
      "coinsCopper": 59,
      "xp": 35
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "e_18",
    "title": "Caçar Lobos #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "E",
    "difficulty": 1.1,
    "rewards": {
      "coinsCopper": 36,
      "xp": 21
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "e_19",
    "title": "Escolta de Aldeão #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "E",
    "difficulty": 1.1,
    "rewards": {
      "coinsCopper": 58,
      "xp": 34
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "e_20",
    "title": "Escolta de Aldeão #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "E",
    "difficulty": 1.1,
    "rewards": {
      "coinsCopper": 50,
      "xp": 30
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "e_21",
    "title": "Escolta de Aldeão #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "E",
    "difficulty": 1.1,
    "rewards": {
      "coinsCopper": 38,
      "xp": 22
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "e_22",
    "title": "Investigar Ruídos #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "E",
    "difficulty": 1.1,
    "rewards": {
      "coinsCopper": 52,
      "xp": 31
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "e_23",
    "title": "Investigar Ruídos #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "E",
    "difficulty": 1.1,
    "rewards": {
      "coinsCopper": 41,
      "xp": 24
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "e_24",
    "title": "Investigar Ruídos #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "E",
    "difficulty": 1.1,
    "rewards": {
      "coinsCopper": 24,
      "xp": 14
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "e_25",
    "title": "Recoletar Couros #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "E",
    "difficulty": 1.1,
    "rewards": {
      "coinsCopper": 34,
      "xp": 20
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "e_26",
    "title": "Recoletar Couros #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "E",
    "difficulty": 1.1,
    "rewards": {
      "coinsCopper": 51,
      "xp": 30
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "e_27",
    "title": "Recoletar Couros #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "E",
    "difficulty": 1.1,
    "rewards": {
      "coinsCopper": 45,
      "xp": 27
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "e_28",
    "title": "Varrer Ruínas Pequenas #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "E",
    "difficulty": 1.1,
    "rewards": {
      "coinsCopper": 41,
      "xp": 24
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "e_29",
    "title": "Varrer Ruínas Pequenas #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "E",
    "difficulty": 1.1,
    "rewards": {
      "coinsCopper": 33,
      "xp": 19
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "e_30",
    "title": "Varrer Ruínas Pequenas #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "E",
    "difficulty": 1.1,
    "rewards": {
      "coinsCopper": 37,
      "xp": 22
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      }
    ]
  },
  {
    "id": "d_31",
    "title": "Expulsar Bandidos #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "D",
    "difficulty": 1.2,
    "rewards": {
      "coinsCopper": 108,
      "xp": 64
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "d_32",
    "title": "Expulsar Bandidos #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "D",
    "difficulty": 1.2,
    "rewards": {
      "coinsCopper": 81,
      "xp": 48
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "d_33",
    "title": "Expulsar Bandidos #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "D",
    "difficulty": 1.2,
    "rewards": {
      "coinsCopper": 66,
      "xp": 39
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "d_34",
    "title": "Exterminar Goblins #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "D",
    "difficulty": 1.2,
    "rewards": {
      "coinsCopper": 65,
      "xp": 39
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "d_35",
    "title": "Exterminar Goblins #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "D",
    "difficulty": 1.2,
    "rewards": {
      "coinsCopper": 84,
      "xp": 50
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "d_36",
    "title": "Exterminar Goblins #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "D",
    "difficulty": 1.2,
    "rewards": {
      "coinsCopper": 66,
      "xp": 39
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "d_37",
    "title": "Escolta de Caravana #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "D",
    "difficulty": 1.2,
    "rewards": {
      "coinsCopper": 82,
      "xp": 49
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "d_38",
    "title": "Escolta de Caravana #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "D",
    "difficulty": 1.2,
    "rewards": {
      "coinsCopper": 114,
      "xp": 68
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "d_39",
    "title": "Escolta de Caravana #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "D",
    "difficulty": 1.2,
    "rewards": {
      "coinsCopper": 82,
      "xp": 49
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "d_40",
    "title": "Mineração de Prata #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "D",
    "difficulty": 1.2,
    "rewards": {
      "coinsCopper": 98,
      "xp": 58
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "d_41",
    "title": "Mineração de Prata #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "D",
    "difficulty": 1.2,
    "rewards": {
      "coinsCopper": 76,
      "xp": 45
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "d_42",
    "title": "Mineração de Prata #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "D",
    "difficulty": 1.2,
    "rewards": {
      "coinsCopper": 111,
      "xp": 66
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "d_43",
    "title": "Caça ao Corvo #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "D",
    "difficulty": 1.2,
    "rewards": {
      "coinsCopper": 62,
      "xp": 37
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "d_44",
    "title": "Caça ao Corvo #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "D",
    "difficulty": 1.2,
    "rewards": {
      "coinsCopper": 106,
      "xp": 63
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "d_45",
    "title": "Caça ao Corvo #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "D",
    "difficulty": 1.2,
    "rewards": {
      "coinsCopper": 89,
      "xp": 53
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "c_46",
    "title": "Batalha em Catacumbas #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "C",
    "difficulty": 1.4,
    "rewards": {
      "coinsCopper": 188,
      "xp": 112
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "c_47",
    "title": "Batalha em Catacumbas #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "C",
    "difficulty": 1.4,
    "rewards": {
      "coinsCopper": 135,
      "xp": 81
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "c_48",
    "title": "Batalha em Catacumbas #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "C",
    "difficulty": 1.4,
    "rewards": {
      "coinsCopper": 168,
      "xp": 100
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "c_49",
    "title": "Caçar Basiliscos Jovens #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "C",
    "difficulty": 1.4,
    "rewards": {
      "coinsCopper": 130,
      "xp": 78
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "c_50",
    "title": "Caçar Basiliscos Jovens #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "C",
    "difficulty": 1.4,
    "rewards": {
      "coinsCopper": 190,
      "xp": 114
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "c_51",
    "title": "Caçar Basiliscos Jovens #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "C",
    "difficulty": 1.4,
    "rewards": {
      "coinsCopper": 157,
      "xp": 94
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "c_52",
    "title": "Guarda de Portão #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "C",
    "difficulty": 1.4,
    "rewards": {
      "coinsCopper": 200,
      "xp": 120
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "c_53",
    "title": "Guarda de Portão #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "C",
    "difficulty": 1.4,
    "rewards": {
      "coinsCopper": 199,
      "xp": 119
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "c_54",
    "title": "Guarda de Portão #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "C",
    "difficulty": 1.4,
    "rewards": {
      "coinsCopper": 166,
      "xp": 99
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "c_55",
    "title": "Expedição a Floresta densa #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "C",
    "difficulty": 1.4,
    "rewards": {
      "coinsCopper": 193,
      "xp": 115
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "c_56",
    "title": "Expedição a Floresta densa #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "C",
    "difficulty": 1.4,
    "rewards": {
      "coinsCopper": 144,
      "xp": 86
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "c_57",
    "title": "Expedição a Floresta densa #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "C",
    "difficulty": 1.4,
    "rewards": {
      "coinsCopper": 210,
      "xp": 126
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "c_58",
    "title": "Investigar Pântano #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "C",
    "difficulty": 1.4,
    "rewards": {
      "coinsCopper": 128,
      "xp": 76
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "c_59",
    "title": "Investigar Pântano #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "C",
    "difficulty": 1.4,
    "rewards": {
      "coinsCopper": 125,
      "xp": 75
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "c_60",
    "title": "Investigar Pântano #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "C",
    "difficulty": 1.4,
    "rewards": {
      "coinsCopper": 204,
      "xp": 122
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      }
    ]
  },
  {
    "id": "b_61",
    "title": "Eliminar Licantropos #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "B",
    "difficulty": 1.6,
    "rewards": {
      "coinsCopper": 278,
      "xp": 166
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      }
    ]
  },
  {
    "id": "b_62",
    "title": "Eliminar Licantropos #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "B",
    "difficulty": 1.6,
    "rewards": {
      "coinsCopper": 294,
      "xp": 176
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      }
    ]
  },
  {
    "id": "b_63",
    "title": "Eliminar Licantropos #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "B",
    "difficulty": 1.6,
    "rewards": {
      "coinsCopper": 240,
      "xp": 144
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      }
    ]
  },
  {
    "id": "b_64",
    "title": "Caça ao Grifo #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "B",
    "difficulty": 1.6,
    "rewards": {
      "coinsCopper": 279,
      "xp": 167
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      }
    ]
  },
  {
    "id": "b_65",
    "title": "Caça ao Grifo #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "B",
    "difficulty": 1.6,
    "rewards": {
      "coinsCopper": 245,
      "xp": 147
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      }
    ]
  },
  {
    "id": "b_66",
    "title": "Caça ao Grifo #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "B",
    "difficulty": 1.6,
    "rewards": {
      "coinsCopper": 317,
      "xp": 190
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      }
    ]
  },
  {
    "id": "b_67",
    "title": "Proteger Pesquisa Mágica #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "B",
    "difficulty": 1.6,
    "rewards": {
      "coinsCopper": 291,
      "xp": 174
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      }
    ]
  },
  {
    "id": "b_68",
    "title": "Proteger Pesquisa Mágica #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "B",
    "difficulty": 1.6,
    "rewards": {
      "coinsCopper": 336,
      "xp": 201
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      }
    ]
  },
  {
    "id": "b_69",
    "title": "Proteger Pesquisa Mágica #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "B",
    "difficulty": 1.6,
    "rewards": {
      "coinsCopper": 313,
      "xp": 187
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      }
    ]
  },
  {
    "id": "b_70",
    "title": "Destruir Ninho de Monstros #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "B",
    "difficulty": 1.6,
    "rewards": {
      "coinsCopper": 261,
      "xp": 156
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      }
    ]
  },
  {
    "id": "b_71",
    "title": "Destruir Ninho de Monstros #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "B",
    "difficulty": 1.6,
    "rewards": {
      "coinsCopper": 314,
      "xp": 188
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      }
    ]
  },
  {
    "id": "b_72",
    "title": "Destruir Ninho de Monstros #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "B",
    "difficulty": 1.6,
    "rewards": {
      "coinsCopper": 310,
      "xp": 186
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      }
    ]
  },
  {
    "id": "b_73",
    "title": "Patrulha Fronteiriça #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "B",
    "difficulty": 1.6,
    "rewards": {
      "coinsCopper": 273,
      "xp": 163
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      }
    ]
  },
  {
    "id": "b_74",
    "title": "Patrulha Fronteiriça #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "B",
    "difficulty": 1.6,
    "rewards": {
      "coinsCopper": 288,
      "xp": 172
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      }
    ]
  },
  {
    "id": "b_75",
    "title": "Patrulha Fronteiriça #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "B",
    "difficulty": 1.6,
    "rewards": {
      "coinsCopper": 238,
      "xp": 142
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      }
    ]
  },
  {
    "id": "a_76",
    "title": "Caçar Hidra Menor #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "A",
    "difficulty": 1.9,
    "rewards": {
      "coinsCopper": 535,
      "xp": 321
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      }
    ]
  },
  {
    "id": "a_77",
    "title": "Caçar Hidra Menor #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "A",
    "difficulty": 1.9,
    "rewards": {
      "coinsCopper": 542,
      "xp": 325
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      }
    ]
  },
  {
    "id": "a_78",
    "title": "Caçar Hidra Menor #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "A",
    "difficulty": 1.9,
    "rewards": {
      "coinsCopper": 423,
      "xp": 253
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      }
    ]
  },
  {
    "id": "a_79",
    "title": "Investigar Forte Abandonado #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "A",
    "difficulty": 1.9,
    "rewards": {
      "coinsCopper": 516,
      "xp": 309
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      }
    ]
  },
  {
    "id": "a_80",
    "title": "Investigar Forte Abandonado #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "A",
    "difficulty": 1.9,
    "rewards": {
      "coinsCopper": 442,
      "xp": 265
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      }
    ]
  },
  {
    "id": "a_81",
    "title": "Investigar Forte Abandonado #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "A",
    "difficulty": 1.9,
    "rewards": {
      "coinsCopper": 421,
      "xp": 252
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      }
    ]
  },
  {
    "id": "a_82",
    "title": "Subjugar Elemental #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "A",
    "difficulty": 1.9,
    "rewards": {
      "coinsCopper": 498,
      "xp": 298
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      }
    ]
  },
  {
    "id": "a_83",
    "title": "Subjugar Elemental #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "A",
    "difficulty": 1.9,
    "rewards": {
      "coinsCopper": 477,
      "xp": 286
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      }
    ]
  },
  {
    "id": "a_84",
    "title": "Subjugar Elemental #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "A",
    "difficulty": 1.9,
    "rewards": {
      "coinsCopper": 449,
      "xp": 269
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      }
    ]
  },
  {
    "id": "a_85",
    "title": "Rota de Comércio Perigosa #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "A",
    "difficulty": 1.9,
    "rewards": {
      "coinsCopper": 543,
      "xp": 325
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      }
    ]
  },
  {
    "id": "a_86",
    "title": "Rota de Comércio Perigosa #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "A",
    "difficulty": 1.9,
    "rewards": {
      "coinsCopper": 556,
      "xp": 333
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      }
    ]
  },
  {
    "id": "a_87",
    "title": "Rota de Comércio Perigosa #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "A",
    "difficulty": 1.9,
    "rewards": {
      "coinsCopper": 522,
      "xp": 313
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      }
    ]
  },
  {
    "id": "a_88",
    "title": "Eliminar Culto Sombrio #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "A",
    "difficulty": 1.9,
    "rewards": {
      "coinsCopper": 436,
      "xp": 261
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      }
    ]
  },
  {
    "id": "a_89",
    "title": "Eliminar Culto Sombrio #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "A",
    "difficulty": 1.9,
    "rewards": {
      "coinsCopper": 555,
      "xp": 333
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      }
    ]
  },
  {
    "id": "a_90",
    "title": "Eliminar Culto Sombrio #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "A",
    "difficulty": 1.9,
    "rewards": {
      "coinsCopper": 463,
      "xp": 277
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      }
    ]
  },
  {
    "id": "s_91",
    "title": "Caçar Dragão Jovem #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "S",
    "difficulty": 2.3,
    "rewards": {
      "coinsCopper": 588,
      "xp": 352
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "s_92",
    "title": "Caçar Dragão Jovem #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "S",
    "difficulty": 2.3,
    "rewards": {
      "coinsCopper": 677,
      "xp": 406
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "s_93",
    "title": "Caçar Dragão Jovem #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "S",
    "difficulty": 2.3,
    "rewards": {
      "coinsCopper": 576,
      "xp": 345
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "s_94",
    "title": "Intervir em Guerra de Clãs #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "S",
    "difficulty": 2.3,
    "rewards": {
      "coinsCopper": 721,
      "xp": 432
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "s_95",
    "title": "Intervir em Guerra de Clãs #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "S",
    "difficulty": 2.3,
    "rewards": {
      "coinsCopper": 765,
      "xp": 459
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "s_96",
    "title": "Intervir em Guerra de Clãs #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "S",
    "difficulty": 2.3,
    "rewards": {
      "coinsCopper": 697,
      "xp": 418
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "s_97",
    "title": "Proteger Nobreza em Viagem #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "S",
    "difficulty": 2.3,
    "rewards": {
      "coinsCopper": 593,
      "xp": 355
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "s_98",
    "title": "Proteger Nobreza em Viagem #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "S",
    "difficulty": 2.3,
    "rewards": {
      "coinsCopper": 668,
      "xp": 400
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "s_99",
    "title": "Proteger Nobreza em Viagem #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "S",
    "difficulty": 2.3,
    "rewards": {
      "coinsCopper": 850,
      "xp": 510
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "s_100",
    "title": "Limpar Ruínas Antigas #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "S",
    "difficulty": 2.3,
    "rewards": {
      "coinsCopper": 721,
      "xp": 432
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "s_101",
    "title": "Limpar Ruínas Antigas #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "S",
    "difficulty": 2.3,
    "rewards": {
      "coinsCopper": 668,
      "xp": 400
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "s_102",
    "title": "Limpar Ruínas Antigas #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "S",
    "difficulty": 2.3,
    "rewards": {
      "coinsCopper": 895,
      "xp": 537
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "s_103",
    "title": "Selar Portal #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "S",
    "difficulty": 2.3,
    "rewards": {
      "coinsCopper": 815,
      "xp": 489
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "s_104",
    "title": "Selar Portal #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "S",
    "difficulty": 2.3,
    "rewards": {
      "coinsCopper": 762,
      "xp": 457
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "s_105",
    "title": "Selar Portal #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "S",
    "difficulty": 2.3,
    "rewards": {
      "coinsCopper": 889,
      "xp": 533
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "ss_106",
    "title": "Abater Dragão Ancião #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "SS",
    "difficulty": 2.8,
    "rewards": {
      "coinsCopper": 1134,
      "xp": 680
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "ss_107",
    "title": "Abater Dragão Ancião #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "SS",
    "difficulty": 2.8,
    "rewards": {
      "coinsCopper": 973,
      "xp": 583
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "ss_108",
    "title": "Abater Dragão Ancião #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "SS",
    "difficulty": 2.8,
    "rewards": {
      "coinsCopper": 1035,
      "xp": 621
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "ss_109",
    "title": "Eliminar General Demoníaco #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "SS",
    "difficulty": 2.8,
    "rewards": {
      "coinsCopper": 971,
      "xp": 582
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "ss_110",
    "title": "Eliminar General Demoníaco #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "SS",
    "difficulty": 2.8,
    "rewards": {
      "coinsCopper": 1026,
      "xp": 615
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "ss_111",
    "title": "Eliminar General Demoníaco #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "SS",
    "difficulty": 2.8,
    "rewards": {
      "coinsCopper": 1281,
      "xp": 768
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "ss_112",
    "title": "Expedição ao Abismo #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "SS",
    "difficulty": 2.8,
    "rewards": {
      "coinsCopper": 1187,
      "xp": 712
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "ss_113",
    "title": "Expedição ao Abismo #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "SS",
    "difficulty": 2.8,
    "rewards": {
      "coinsCopper": 1175,
      "xp": 705
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "ss_114",
    "title": "Expedição ao Abismo #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "SS",
    "difficulty": 2.8,
    "rewards": {
      "coinsCopper": 1034,
      "xp": 620
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "ss_115",
    "title": "Selar Calamidade #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "SS",
    "difficulty": 2.8,
    "rewards": {
      "coinsCopper": 1282,
      "xp": 769
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "ss_116",
    "title": "Selar Calamidade #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "SS",
    "difficulty": 2.8,
    "rewards": {
      "coinsCopper": 1199,
      "xp": 719
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "ss_117",
    "title": "Selar Calamidade #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "SS",
    "difficulty": 2.8,
    "rewards": {
      "coinsCopper": 1119,
      "xp": 671
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "ss_118",
    "title": "Defender Cidade contra Cerco #1",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "SS",
    "difficulty": 2.8,
    "rewards": {
      "coinsCopper": 1359,
      "xp": 815
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "ss_119",
    "title": "Defender Cidade contra Cerco #2",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "SS",
    "difficulty": 2.8,
    "rewards": {
      "coinsCopper": 1198,
      "xp": 718
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  },
  {
    "id": "ss_120",
    "title": "Defender Cidade contra Cerco #3",
    "desc": "Missão gerada da guilda. Risco proporcional ao rank. Prepare-se adequadamente.",
    "rank": "SS",
    "difficulty": 2.8,
    "rewards": {
      "coinsCopper": 1104,
      "xp": 662
    },
    "drops": [
      {
        "id": "erva_simples",
        "qty": 1,
        "chance": 800
      },
      {
        "id": "couro_rato",
        "qty": 1,
        "chance": 600
      },
      {
        "id": "minerio_prata",
        "qty": 1,
        "chance": 120
      },
      {
        "id": "gema_azul",
        "qty": 1,
        "chance": 70
      },
      {
        "id": "garra_grifo",
        "qty": 1,
        "chance": 40
      },
      {
        "id": "pena_fenix",
        "qty": 1,
        "chance": 20
      }
    ]
  }
];
