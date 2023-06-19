interface IPerks {
  name: string;
  levels: number[];
}
interface IFlaws {
  name: string;
  levels: number[];
}

interface ISkills {
  name: string;
  attRelative: {
    attribute: string;
    difficulty: string;
  }
}

interface ISpells {
  name: string;
  level: number;
}

export const perksData: IPerks[] = [
  { name: "Aparência", levels: [1, 2, 3] },
  { name: "Ambidestria", levels: [1] },
  { name: "Aptidão Mágica", levels: [1, 2, 3, 4, 5] },
  { name: "Ataque Adicional", levels: [3] },
  { name: "Boa Forma", levels: [1] },
  { name: "Carisma", levels: [1, 2, 3, 4, 5] },
  { name: "Defesas Ampliadas", levels: [1, 2, 3, 4, 5] },
  { name: "Dobra", levels: [5] },
  { name: "Equilíbrio Perfeito", levels: [4] },
  { name: "Memória Eidética", levels: [3] },
  { name: "Mestre de Armas", levels: [3] },
  { name: "Senso de Direção", levels: [1] },
  { name: "Sentidos Aguçados", levels: [1, 2, 3, 4, 5] },
];

export const flawsData: IFlaws[] = [
  { name: "Alcoolismo", levels: [2, 3] },
  { name: "Altruísmo", levels: [1] },
  { name: "Aparência", levels: [1, 2, 3, 4, 5] },
  { name: "Avareza", levels: [2] },
  { name: "Cegueira", levels: [5] },
  { name: "Cleptomania", levels: [2] },
  { name: "Cobiça", levels: [2] },
  { name: "Código de Honra", levels: [1, 2, 3]},
  { name: "Covardia", levels: [2] },
  { name: "Duro de Ouvido", levels: [2] },
  { name: "Excesso de confiança", levels: [1] },
  { name: "Fácil de Decifrar", levels: [2] },
  { name: "Fanatismo", levels: [2] },
  { name: "Fobias", levels: [1, 2 ,3] },
  { name: "Fora de Forma", levels: [1] },
  { name: "Gagueira", levels: [2] },
  { name: "Gula", levels: [1] },
  { name: "Honestidade", levels: [2] },
  { name: "Incapaz de Falar", levels: [2] },
  { name: "Insensível", levels: [1] },
  { name: "Maneta (uma mão)", levels: [2] },
  { name: "Maneta (um braço)", levels: [3] },
  { name: "Megalomania", levels: [2] },
  { name: "Obsessão", levels: [1, 2] },
  { name: "Senso do Dever", levels: [1, 2, 3] },
  { name: "Surdez", levels: [3] },
  { name: "Timidez", levels: [1, 2, 3] },
  { name: "Veracidade", levels: [1] },
  { name: "Vício", levels: [1, 2, 3] },
];

export const skillsData: ISkills[] = [
  {
    name: "Mobilidade",
    attRelative: {
      attribute: "des",
      difficulty: "d",
    }
  },
  {
    name: "Armas Brancas",
    attRelative: {
      attribute: "des",
      difficulty: "d",
    }
  },
  {
    name: "Armas de Alcance",
    attRelative: {
      attribute: "des",
      difficulty: "d",
    }
  },
  {
    name: "Combate Desarmado",
    attRelative: {
      attribute: "des",
      difficulty: "m",
    }
  },
  {
    name: "Sobrevivência",
    attRelative: {
      attribute: "int",
      difficulty: "d",
    }
  },
  {
    name: "Socialização",
    attRelative: {
      attribute: "int",
      difficulty: "d",
    }
  },
  {
    name: "Ciências Mágicas",
    attRelative: {
      attribute: "int",
      difficulty: "md",
    }
  },
  {
    name: "Ciências Mundanas",
    attRelative: {
      attribute: "int",
      difficulty: "md",
    }
  },
  {
    name: "Defesa Ativa",
    attRelative: {
      attribute: "des",
      difficulty: "d",
    }
  },
  {
    name: "Ofícios",
    attRelative: {
      attribute: "int",
      difficulty: "d",
    }
  },
  {
    name: "Furtividade",
    attRelative: {
      attribute: "des",
      difficulty: "d",
    }
  },
  {
    name: "Condução",
    attRelative: {
      attribute: "des",
      difficulty: "m",
    }
  },
  {
    name: "Medicina",
    attRelative: {
      attribute: "int",
      difficulty: "md",
    }
  },
]

export const spellsData: ISpells[] = [
  { name: "Purificar Ar", level: 1 },
  { name: "Criar Ar", level: 1 },
  { name: "Criar Fogo", level: 1 },
  { name: "Coceira", level: 1 },
  { name: "Sentir Inimigos", level: 1 },
  { name: "Moldar Terra", level: 1 },
  { name: "Lufada de Vento", level: 2 },
  { name: "Controlar Animal", level: 2 },
  { name: "Cura Maior", level: 2 },
  { name: "Força", level: 2 },
  { name: "Graciosidade", level: 2 },
  { name: "Vigor", level: 2 },
  { name: "Veracidade", level: 2 },
  { name: "Bênção dos Idiomas", level: 2 },
  { name: "Bênção da Literatura", level: 2 },
  { name: "Ciclone", level: 3 },
  { name: "Falar com Animais", level: 3 },
  { name: "Metamorfose", level: 3 },
  { name: "Reflexos em Combate", level: 3 },
  { name: "Paralisia Total", level: 3 },
  { name: "Leitura da Mente", level: 3 },
  { name: "Telepatia", level: 3 },
  { name: "Metamorfose Parcial", level: 4 },
  { name: "Possessão Feral", level: 4 },
  { name: "Metamorfose Maior", level: 5 },
  { name: "Terremoto", level: 5 },
]

// Continuar nas magias de fogo
