export class Monstro {
  public constructor(
    private _displayName: string,
    private _email: string,
    private _photoURL: string,
    private _id: string,
    private _nome: string,
    private _usuario: string,
    private _genero: string,
    private _altura: number,
    private _dataDeNascimento: Date
  ) {

  }

  public get displayName() { return this._displayName; }

  public get email() { return this._email; }

  public get photoURL() { return this._photoURL; }

  public get id() { return this._id; }

  public get nome() { return this._nome; }

  public get usuario() { return this._usuario; }

  public get genero() { return this._genero; }

  public get altura() { return this._altura; }

  public get dataDeNascimento() { return this._dataDeNascimento; }

  defineNome(nome: string) {
    this._nome = nome;
  }
}

export interface SolicitacaoDeCadastroDeMonstro {
  displayName?: string;
  email?: string;
  photoURL?: string;
  nome?: string;
  usuario?: string;
  genero?: string;
  altura?: number;
  dataDeNascimento?: Date;
}
