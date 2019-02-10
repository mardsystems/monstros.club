import * as moment from 'moment';
import { ICalculoDeIdade } from '../app.model';

export class Monstro {
  public constructor(
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

export class SolicitacaoDeCadastroDeMonstro {
  isEdit: boolean;
  // Usado apenas na edição.
  id?: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  nome?: string;
  usuario?: string;
  genero?: Genero;
  altura?: number;
  dataDeNascimento?: moment.Moment;
  dataDoUltimoLogin?: moment.Moment;

  static toAdd(): SolicitacaoDeCadastroDeMonstro {
    return {
      isEdit: false
    };
  }

  static toEdit(monstro: Monstro): SolicitacaoDeCadastroDeMonstro {
    return {
      isEdit: true,
      id: monstro.id,
      displayName: monstro.displayName,
      email: monstro.email,
      photoURL: monstro.photoURL,
      nome: monstro.nome,
      usuario: monstro.usuario,
      genero: monstro.genero,
      altura: monstro.altura,
      dataDeNascimento: moment(monstro.dataDeNascimento),
      dataDoUltimoLogin: moment(monstro.dataDoUltimoLogin)
    };
  }
}
