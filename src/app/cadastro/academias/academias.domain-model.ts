export class Academia {
  public constructor(
    private _id: string,
    private _nome: string,
    private _logo: string,
  ) {

  }

  public get id() { return this._id; }

  public get nome() { return this._nome; }

  public get logo() { return this._logo; }

  public defineNome(nome: string) {
    this._nome = nome;
  }

  public defineLogo(logo: string) {
    this._logo = logo;
  }
}
