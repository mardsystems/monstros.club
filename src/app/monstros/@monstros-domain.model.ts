import { CalculoDeIdade, Genero } from 'src/app/common/domain.model';

export class Monstro {
  public constructor(
    private _id: string,
    private _nome: string,
    private _genero: Genero,
    private _altura: number,
    private _dataDeNascimento: Date,
    private _calculoDeIdade: CalculoDeIdade
  ) {

  }

  public get id() { return this._id; }

  public get nome() { return this._nome; }

  public get genero() { return this._genero; }

  public get altura() { return this._altura; }

  public get dataDeNascimento() { return this._dataDeNascimento; }

  public get idade(): number {
    if (!this._dataDeNascimento) {
      return null;
    }

    const idade = this._calculoDeIdade.calculaIdade(this._dataDeNascimento);

    return idade;
  }
}
