import { Academia } from '../academias/academias.domain-model';
import { Exercicio } from '../exercicios/exercicios.domain-model';

export class Aparelho {
  public constructor(
    private _id: string,
    private _codigo: string,
    private _academia: Academia,
    private _exercicios: Exercicio[],
    private _imagemURL: string,
  ) {

  }

  public get id() { return this._id; }

  public get codigo() { return this._codigo; }

  public get academia() { return this._academia; }

  public get imagemURL() { return this._imagemURL; }

  public get exercicios() { return this._exercicios; }

  public alteraCodigo(codigo: string) {
    this._codigo = codigo;
  }

  public corrigeAcademia(academia: Academia) {
    this._academia = academia;
  }

  public alteraExercicios(exercicios: Exercicio[]) {
    this._exercicios = exercicios;
  }

  public alteraImagemURL(imagemURL: string) {
    this._imagemURL = imagemURL;
  }
}
