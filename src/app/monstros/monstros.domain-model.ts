import { ICalculoDeIdade } from '../app.model';

export class Monstro {
  public constructor(
    private _admin: boolean,
    private _displayName: string,
    private _email: string,
    private _photoURL: string,
    private _id: string,
    private _nome: string,
    private _usuario: string,
    private _genero: Genero,
    private _altura: number,
    private _dataDeNascimento: Date,
    private _dataDoUltimoLogin: Date,
    private _calculoDeIdade: ICalculoDeIdade
  ) {

  }

  public get admin() { return this._admin; }

  public get displayName() { return this._displayName; }

  public get email() { return this._email; }

  public get photoURL() { return this._photoURL; }

  public get id() { return this._id; }

  public get nome() { return this._nome; }

  public get usuario() { return this._usuario; }

  public get genero() { return this._genero; }

  public get altura() { return this._altura; }

  public get dataDeNascimento() { return this._dataDeNascimento; }

  public get dataDoUltimoLogin() { return this._dataDoUltimoLogin; }

  public defineDisplayName(displayName: string) {
    this._displayName = displayName;
  }

  public defineEmail(email: string) {
    this._email = email;
  }

  public definePhotoURL(photoURL: string) {
    this._photoURL = photoURL;
  }

  public defineNome(nome: string) {
    this._nome = nome;
  }

  public defineUsuario(usuario: string) {
    this._usuario = usuario;
  }

  public defineGenero(genero: Genero) {
    this._genero = genero;
  }

  public defineAltura(altura: number) {
    this._altura = altura;
  }

  public defineDataDeNascimento(dataDeNascimento: Date) {
    this._dataDeNascimento = dataDeNascimento;
  }

  public defineDataDoUltimoLogin(dataDoUltimoLogin: Date) {
    this._dataDoUltimoLogin = dataDoUltimoLogin;
  }

  public get idade(): number {
    if (!this._dataDeNascimento) {
      return -1;
    }

    const idade = this._calculoDeIdade.calculaIdade(this._dataDeNascimento);

    return idade;
  }
}

export enum Genero {
  Masculino = 'Masculino',
  Feminino = 'Feminino'
}

export class AdaptadorParaUserInfo {

}
