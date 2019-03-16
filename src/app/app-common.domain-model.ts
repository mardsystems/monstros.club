export interface ICalculoDeIdade {
  calculaIdade(data: Date, dataFim?: Date): number;
}

export class Tempo {
  inicio: Date;
  fim: Date;
  total: number;
}
