export class Academia {
  public constructor(
    private _id: string,
    private _nome: string,
    private _logoURL: string,
  ) {

  }

  public get id() { return this._id; }

  public get nome() { return this._nome; }

  public get logoURL() { return this._logoURL; }

  public defineNome(nome: string) {
    this._nome = nome;
  }

  public definelogoURL(logoURL: string) {
    this._logoURL = logoURL;
  }
}
