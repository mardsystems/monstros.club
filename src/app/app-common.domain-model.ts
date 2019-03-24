export interface ICalculoDeIdade {
  calculaIdade(data: Date, dataFim?: Date): number;
}

export class Tempo {
  inicio: Date;
  fim: Date;
  total: number;
}

export const CONST_TIMESTAMP_FALSO = 1;
