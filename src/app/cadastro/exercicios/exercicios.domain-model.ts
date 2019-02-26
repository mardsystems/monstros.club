export class Exercicio {
  public constructor(
    private _id: string,
    private _nome: string,
    private _musculatura: string,
    private _maquina: string,
  ) {

  }

  public get id() { return this._id; }

  public get nome() { return this._nome; }

  public get musculatura() { return this._musculatura; }

  public get maquina() { return this._maquina; }

  public defineNome(nome: string) {
    this._nome = nome;
  }

  public defineMusculatura(musculatura: string) {
    this._musculatura = musculatura;
  }

  public defineMaquina(maquina: string) {
    this._maquina = maquina;
  }
}
