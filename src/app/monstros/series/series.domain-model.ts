import { Tempo } from 'src/app/app-common.domain-model';
import { Academia } from 'src/app/cadastro/academias/academias.domain-model';
import { Aparelho } from 'src/app/cadastro/aparelhos/aparelhos.domain-model';
import { Exercicio } from 'src/app/cadastro/exercicios/exercicios.domain-model';
import * as _ from 'lodash';

export class Serie {
  private _exercicios?: SerieDeExercicio[];

  public constructor(
    private _id: string,
    private _nome: string,
    private _cor: string,
    private _ativa: boolean,
    private _data: Date,
    private _timestamp?: number,
    exercicios?: SerieDeExercicio[],
  ) {
    if (_timestamp) {
      this._exercicios = exercicios;
    } else {
      const agora = new Date(Date.now());

      this._ativa = true;

      this._data = agora;

      this._exercicios = [];
    }
  }

  public get id() { return this._id; }

  public get nome() { return this._nome; }

  public get cor() { return this._cor; }

  public get ativa() { return this._ativa; }

  public get data() { return this._data; }

  public get exercicios() { return this._exercicios; }

  public get timestamp() { return this._timestamp; }

  public corrigeNome(nome: string) {
    this._nome = nome;
  }

  public ajustaCor(cor: string) {
    this._cor = cor;
  }

  public desativa() {
    this._ativa = false;
  }

  public reativa() {
    this._ativa = true;
  }

  public corrigeData(data: Date) {
    this._data = data;
  }

  public adicionaExercicio(exercicio: Exercicio, quantidade: number, repeticoes: number, carga: number, nota: string) {
    const maxById = _.maxBy(this._exercicios, 'id');

    let nextId: number;

    if (maxById === undefined) {
      nextId = 1;
    } else {
      nextId = maxById.id + 1;
    }

    const serieDeExercicio = new SerieDeExercicio(
      nextId,
      nextId,
      exercicio,
      quantidade,
      repeticoes,
      carga,
      nota
    );

    this._exercicios.push(serieDeExercicio);
  }

  public obtemSerieDeExercicio(id: number): SerieDeExercicio {
    const serieDeExercicio = _.find(this._exercicios, { id: id });

    return serieDeExercicio;
  }

  public removeSerieDeExercicio(id: number) {
    _.remove(this._exercicios, serieDeExercicio => serieDeExercicio.id === id);
  }
}

export class SerieDeExercicio {
  public constructor(
    private _id: number,
    private _sequencia: number,
    private _exercicio: Exercicio,
    private _quantidade: number,
    private _repeticoes: number,
    private _carga: number,
    private _nota: string,
  ) {

  }

  public get id() { return this._id; }

  public get sequencia() { return this._sequencia; }

  public get exercicio() { return this._exercicio; }

  public get quantidade() { return this._quantidade; }

  public get repeticoes() { return this._repeticoes; }

  public get carga() { return this._carga; }

  public get nota() { return this._nota; }

  public alteraSequencia(sequencia: number) {
    this._sequencia = sequencia;
  }

  public acertaExercicio(exercicio: Exercicio) {
    this._exercicio = exercicio;
  }

  public corrigeQuantidade(quantidade: number) {
    this._quantidade = quantidade;
  }

  public ajustaRepeticoes(repeticoes: number) {
    this._repeticoes = repeticoes;
  }

  public ajustaCarga(carga: number) {
    this._carga = carga;
  }

  public atualizaNota(nota: string) {
    this._nota = nota;
  }
}

export class ExecucaoDeSerie {
  private _exercicios?: ExecucaoDeExercicio[];

  public constructor(
    private _id: string,
    private _serie: Serie,
    private _dia: Date,
    private _numero: number,
    private _feitaNa?: Academia,
    private _timestamp?: number,
    exercicios?: ExecucaoDeExercicio[],
  ) {
    if (_timestamp) {
      this._exercicios = exercicios;
    } else {
      this._exercicios = [];
    }
  }

  public get id() { return this._id; }

  public get serie() { return this._serie; }

  public get dia() { return this._dia; }

  public get numero() { return this._numero; }

  public get duracao() { return null; }

  public get feitaNa() { return this._feitaNa; }

  public get exercicios() { return this._exercicios; }

  public get timestamp() { return this._timestamp; }

  public corrigeDia(dia: Date) {
    this._dia = dia;
  }

  public alteraNumero(numero: number) {
    this._numero = numero;
  }

  public adicionaExercicio(referencia: SerieDeExercicio, repeticoes: number, carga: number, nota: string) {
    const maxById = _.maxBy(this._exercicios, 'id');

    let nextId: number;

    if (maxById === undefined) {
      nextId = 1;
    } else {
      nextId = maxById.id + 1;
    }

    const execucaoDeExercicio = new ExecucaoDeExercicio(
      nextId,
      nextId,
      referencia,
      repeticoes,
      carga,
      nota
    );

    this._exercicios.push(execucaoDeExercicio);
  }

  public obtemExecucaoDeExercicio(id: number): ExecucaoDeExercicio {
    const execucaoDeExercicio = _.find(this._exercicios, { id: id });

    return execucaoDeExercicio;
  }

  public removeExecucaoDeExercicio(id: number) {
    _.remove(this._exercicios, execucaoDeExercicio => execucaoDeExercicio.id === id);
  }
}

export class ExecucaoDeExercicio {
  public constructor(
    private _id: number,
    private _sequencia: number,
    private _referencia: SerieDeExercicio,
    private _repeticoes: number,
    private _carga: number,
    private _nota: string,
    private _feitoCom?: Aparelho,
    private _duracao?: Tempo,
  ) {
    if (!_duracao) {
      this._duracao = new Tempo();
    }
  }

  public get id() { return this._id; }

  public get sequencia() { return this._sequencia; }

  public get referencia() { return this._referencia; }

  public get repeticoes() { return this._repeticoes; }

  public get carga() { return this._carga; }

  public get nota() { return this._nota; }

  public get duracao() { return this._duracao; }

  public get feitoCom() { return this._feitoCom; }

  public alteraSequencia(sequencia: number) {
    this._sequencia = sequencia;
  }

  public ajustaRepeticoes(repeticoes: number) {
    this._repeticoes = repeticoes;
  }

  public ajustaCarga(carga: number) {
    this._carga = carga;
  }

  public atualizaNota(nota: string) {
    this._nota = nota;
  }

  public inicia() {
    const agora = new Date(Date.now());

    this._duracao.inicio = agora;
  }

  public finaliza() {
    const agora = new Date(Date.now());

    this._duracao.fim = agora;
  }
}
