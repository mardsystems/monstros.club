import * as _ from 'lodash';
import { Academia } from '../academias/academias.domain-model';
import { Exercicio } from '../exercicios/exercicios.domain-model';

export class Aparelho {
  private _exercicios: Exercicio[];

  public constructor(
    private _id: string,
    private _codigo: string,
    private _academia: Academia,
    private _imagemURL: string,
    private _timestamp?: number,
    exercicios?: Exercicio[]
  ) {
    if (_timestamp) {
      this._exercicios = exercicios;
    } else {
      this._exercicios = [];
    }
  }

  public get id() { return this._id; }

  public get codigo() { return this._codigo; }

  public get academia() { return this._academia; }

  public get imagemURL() { return this._imagemURL; }

  public get timestamp() { return this._timestamp; }

  public get exercicios() { return this._exercicios; }

  public alteraCodigo(codigo: string) {
    this._codigo = codigo;
  }

  public corrigeAcademia(academia: Academia) {
    this._academia = academia;
  }

  public alteraImagemURL(imagemURL: string) {
    this._imagemURL = imagemURL;
  }

  public adicionaExercicio(exercicio: Exercicio) {
    this._exercicios.push(exercicio);
  }

  public removeExercicio(exercicioId: string) {
    _.remove(this._exercicios, exercicio => exercicio.id === exercicioId);
  }
}
