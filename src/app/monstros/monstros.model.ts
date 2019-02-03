import * as moment from 'moment';

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

  defineDisplayName(displayName: string) {
    this._displayName = displayName;
  }

  defineEmail(email: string) {
    this._email = email;
  }

  definePhotoURL(photoURL: string) {
    this._photoURL = photoURL;
  }

  defineNome(nome: string) {
    this._nome = nome;
  }

  defineUsuario(usuario: string) {
    this._usuario = usuario;
  }

  defineGenero(genero: string) {
    this._genero = genero;
  }

  defineAltura(altura: number) {
    this._altura = altura;
  }

  defineDataDeNascimento(dataDeNascimento: Date) {
    this._dataDeNascimento = dataDeNascimento;
  }

  public get idade(): Number {
    const now = new Date(Date.now());

    const calculateYear = now.getFullYear();
    const calculateMonth = now.getMonth();
    const calculateDay = now.getDate();

    const birthYear = this._dataDeNascimento.getFullYear();
    const birthMonth = this._dataDeNascimento.getMonth();
    const birthDay = this._dataDeNascimento.getDate();

    let age = calculateYear - birthYear;
    const ageMonth = calculateMonth - birthMonth;
    const ageDay = calculateDay - birthDay;

    if (ageMonth < 0 || (ageMonth === 0 && ageDay < 0)) {
      age = age - 1;
    }

    return age;
  }
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
  genero?: string;
  altura?: number;
  dataDeNascimento?: moment.Moment;

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
      dataDeNascimento: moment(monstro.dataDeNascimento)
    };
  }
}
