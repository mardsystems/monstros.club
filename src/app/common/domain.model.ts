import { InjectionToken } from '@angular/core';

export const CALCULO_DE_IDADE = new InjectionToken<CalculoDeIdade>('CALCULO_DE_IDADE');

export interface CalculoDeIdade {
  calculaIdade(data: Date, dataFim?: Date): number;
}

export class Tempo {
  inicio: Date;
  fim: Date;
  total: number;
}

export enum Genero {
  Masculino = 'Masculino',
  Feminino = 'Feminino'
}

export const CONST_TIMESTAMP_FALSO = 1;

export interface Repository {
  createId(): string;
}
