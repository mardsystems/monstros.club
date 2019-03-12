export class Tempo {
  valor: number;
}

export class Modalidade {
  id: string;
  nome: string;
}

export abstract class Treino {
  id: string;
  data: Date;
  modalidade: Modalidade;
  blocos: string;
  duracao: Tempo;
}

export class TreinoBase extends Treino {
  ativo: boolean;

  ativa(): void {
    this.ativo = true;
  }

  desativa(): void {
    this.ativo = false;
  }
}

export class ExecucaoDeTreino extends Treino {
  base: TreinoBase;

  diferencaExecutada(): number {
    return this.duracao.valor - this.base.duracao.valor;
  }
}
