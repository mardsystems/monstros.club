import { Tempo } from 'src/app/@app-domain.model';

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
