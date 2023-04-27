interface IVantagem {
  name: string;
  levels: number[];
}

export const perksData: IVantagem[] = [
  { name: "Aparência", levels: [1, 2, 3] },
  { name: "Aptidão Mágica", levels: [1, 2, 3, 4, 5] },
  { name: "Ataque Adicional", levels: [3] },
  { name: "Boa Forma", levels: [1] },
  { name: "Carisma", levels: [1, 2, 3, 4, 5] },
  { name: "Defesas Ampliadas", levels: [1, 2, 3, 4, 5] },
  { name: "Equilíbrio Perfeito", levels: [4] },
  { name: "Memória Eidética", levels: [3] },
  { name: "Mestre de Armas", levels: [3] },
  { name: "Senso de Direção", levels: [1] },
  { name: "Sentidos Aguçados", levels: [1, 2, 3, 4, 5] },
];
