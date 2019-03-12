export class Tempo {
  valor: number;
}

export class Modalidade {
  id: string;
  nome: string;
}

export class TreinoBase {
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

export class Treino {
  id: string;
  data: Date;
  // blocos: string;
  duracao: Tempo;
  base: TreinoBase;

  diferencaExecutada(): number {
    return this.duracao.valor - this.base.duracao.valor;
  }
}
