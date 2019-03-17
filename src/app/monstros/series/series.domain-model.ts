import { Exercicio } from 'src/app/cadastro/exercicios/exercicios.domain-model';
import { Tempo } from 'src/app/app-common.domain-model';

export class Serie {
  public constructor(
    private _id: string,
    private _nome: string,
    private _ativa: string,
    private _cor: string,
    private _data: Date,
    private _exercicios?: SerieDeExercicio[],
  ) {

  }

  public get id() { return this._id; }

  public get nome() { return this._nome; }

  public get ativa() { return this._ativa; }

  public get cor() { return this._cor; }

  public get data() { return this._data; }

  public get exercicios() { return this._exercicios; }

  public defineNome(nome: string) {
    this._nome = nome;
  }
}

export class SerieDeExercicio {
  public constructor(
    private _id: string, // ExercicioId
    // private _serie: Serie,
    private _exercicio: Exercicio,
    // private _data: Date,
    private _quantidade: number,
    private _repeticoes: number,
    private _carga: number,
    private _assento: string,
    // private _execucoes?: ExecucaoDeSerie[],
  ) {

  }

  public get id() { return this._id; }

  // public get serie() { return this._serie; }

  public get exercicio() { return this._exercicio; }

  // public get data() { return this._data; }

  public get quantidade() { return this._quantidade; }

  public get repeticoes() { return this._repeticoes; }

  public get carga() { return this._carga; }

  public get assento() { return this._assento; }

  // public get execucoes() { return this._execucoes; }

  public defineQuantidade(quantidade: number) {
    this._quantidade = quantidade;
  }
}

export class ExecucaoDeSerie {
  public constructor(
    private _id: string,
    private _referencia: SerieDeExercicio,
    private _data: Date,
    private _repeticoes: number,
    private _carga: number,
    private _assento: string,
    private _sequencia: number,
    private _duracao: Tempo,
    private _academia?: string,
  ) {

  }

  public get id() { return this._id; }

  public get referencia() { return this._referencia; }

  public get data() { return this._data; }

  public get repeticoes() { return this._repeticoes; }

  public get carga() { return this._carga; }

  public get assento() { return this._assento; }

  public get sequencia() { return this._sequencia; }

  public get duracao() { return this._duracao; }

  public get academia() { return this._academia; }

  public defineData(data: Date) {
    this._data = data;
  }
}
