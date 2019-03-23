import { Tempo } from 'src/app/app-common.domain-model';
import { Academia } from 'src/app/cadastro/academias/academias.domain-model';
import { Aparelho } from 'src/app/cadastro/aparelhos/aparelhos.domain-model';
import { Exercicio } from 'src/app/cadastro/exercicios/exercicios.domain-model';

export class Serie {
  public constructor(
    private _id: string,
    private _nome: string,
    private _cor: string,
    private _ativa?: boolean,
    private _data?: Date,
    private _exercicios?: SerieDeExercicio[],
  ) {

  }

  public get id() { return this._id; }

  public get nome() { return this._nome; }

  public get cor() { return this._cor; }

  public get ativa() { return this._ativa; }

  public get data() { return this._data; }

  public get exercicios() { return this._exercicios; }

  public corrigeNome(nome: string) {
    this._nome = nome;
  }

  public corrigeCor(cor: string) {
    this._cor = cor;
  }

  public reativa() {
    this._ativa = true;
  }

  public desativa() {
    this._ativa = false;
  }

  public corrigeData(data: Date) {
    this._data = data;
  }
}

export class SerieDeExercicio {
  public constructor(
    private _id: string, // ExercicioId
    // private _serie: Serie,
    private _exercicio: Exercicio,
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

  public get quantidade() { return this._quantidade; }

  public get repeticoes() { return this._repeticoes; }

  public get carga() { return this._carga; }

  public get assento() { return this._assento; }

  // public get execucoes() { return this._execucoes; }

  public corrigeQuantidade(quantidade: number) {
    this._quantidade = quantidade;
  }
}

export class ExecucaoDeSerie {
  public constructor(
    private _id: string,
    private _serie: Serie,
    private _dia: Date,
    private _numero: number,
    private _feitaNa?: Academia,
    private _exercicios?: ExecucaoDeExercicio[],
  ) {

  }

  public get id() { return this._id; }

  public get serie() { return this._serie; }

  public get dia() { return this._dia; }

  public get numero() { return this._numero; }

  public get duracao() { return null; }

  public get feitaNa() { return this._feitaNa; }

  public get exercicios() { return this._exercicios; }

  public corrigeDia(dia: Date) {
    this._dia = dia;
  }
}

export class ExecucaoDeExercicio {
  public constructor(
    private _id: string,
    private _referencia: SerieDeExercicio,
    private _data: Date,
    private _repeticoes: number,
    private _carga: number,
    private _assento: string,
    private _sequencia: number,
    private _duracao: Tempo,
    private _feitoCom?: Aparelho,
  ) {

  }

  public get id() { return this._id; }

  public get referencia() { return this._referencia; }

  public get repeticoes() { return this._repeticoes; }

  public get carga() { return this._carga; }

  public get assento() { return this._assento; }

  public get sequencia() { return this._sequencia; }

  public get duracao() { return this._duracao; }

  public get feitoCom() { return this._feitoCom; }

  public inicia() {

  }

  public finaliza() {
    this._repeticoes++;
  }
}
