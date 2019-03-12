export interface ICalculoDeIdade {
  calculaIdade(data: Date): number;
}

export class Tempo {
  inicio: Date;
  fim: Date;
  total: number;
}
