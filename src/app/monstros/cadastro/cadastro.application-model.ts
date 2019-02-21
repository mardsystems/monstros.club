import * as moment from 'moment';
import { Genero, Monstro } from '../monstros.domain-model';

export class SolicitacaoDeCadastroDeMonstro {
  isEdit: boolean;
  // Usado apenas na edição.
  id?: string;
  admin?: boolean;
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
      admin: monstro.admin,
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
