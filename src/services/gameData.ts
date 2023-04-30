interface IPerks {
  name: string;
  levels: number[];
}
interface IFlaws {
  name: string;
  levels: number[];
}

export const perksData: IPerks[] = [
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

export const flawsData: IFlaws[] = [
  { name: "Alcoolismo", levels: [2, 3] },
  { name: "Altruísmo", levels: [1] },
  { name: "Aparência", levels: [1, 2, 3, 4, 5] },
  { name: "Avareza", levels: [2] },
  { name: "Cegueira", levels: [5] },
  { name: "Cleptomania", levels: [2] },
  { name: "Cobiça", levels: [2] },
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
