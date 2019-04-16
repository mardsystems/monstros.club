import * as _ from 'lodash';
import { Exercicio } from 'src/app/cadastro/exercicios/exercicios.domain-model';
import { InjectionToken } from '@angular/core';

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

export const RepositorioDeSeries = new InjectionToken<IRepositorioDeSeries>('RepositorioDeSeries');

export interface IRepositorioDeSeries {
  add(monstroId: string, serie: Serie): Promise<void>;

  update(monstroId: string, serie: Serie): Promise<void>;

  remove(monstroId: string, serieId: string): Promise<void>;
}
