export class Monstro {
  public constructor(
    public _id: string,
    public _nome: string,
    public _usuario: string,
    public _genero: string,
    public _dataDeNascimento: Date,
    public _altura: number,
    public _foto: string
  ) {

  }

  public get id() { return this._id; }

  public get nome() { return this._nome; }

  public get usuario() { return this._usuario; }

  public get genero() { return this._genero; }

  public get dataDeNascimento() { return this._dataDeNascimento; }

  public get altura() { return this._altura; }

  public get foto() { return this._foto; }
}
