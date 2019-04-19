import { InjectionToken } from '@angular/core';
import { Repository, Tempo } from 'src/app/common/domain.model';

export class Modalidade {
  id: string;
  nome: string;
}

export class Treino {
  id: string;
  data: Date;
  modalidade: Modalidade;
  // blocos: string;
  duracao: Tempo;
  ativo: boolean;

  ativa(): void {
    this.ativo = true;
  }

  desativa(): void {
    this.ativo = false;
  }
}

export class ExecucaoDeTreino {
  id: string;
  data: Date;
  // blocos: string;
  duracao: Tempo;
  referencia: Treino;

  diferencaExecutada(): number {
    return this.duracao.total - this.referencia.duracao.total;
  }
}

export const REPOSITORIO_DE_TREINOS = new InjectionToken<RepositorioDeTreinos>('REPOSITORIO_DE_TREINOS');

export interface RepositorioDeTreinos extends Repository {
  obtemTreino(id: string): Promise<Treino>;

  add(medida: Treino): Promise<void>;

  update(medida: Treino): Promise<void>;

  remove(medida: Treino): Promise<void>;
}
