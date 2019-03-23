import * as moment from 'moment';
import { Serie } from '../series.domain-model';

export class SolicitacaoDeCadastroDeSerie {
  monstroId: string;
  nome: string;
  cor: string;
  ativa?: boolean;
  data?: moment.Moment;

  static toAdd(monstroId: string): SolicitacaoDeCadastroDeSerie {
    return {
      monstroId: monstroId,
      nome: null,
      cor: null,
      ativa: null,
      data: moment(new Date(Date.now())),
    };
  }

  static toEdit(monstroId: string, serie: Serie): SolicitacaoDeCadastroDeSerie {
    return {
      monstroId: monstroId,
      nome: serie.nome,
      cor: serie.cor,
      ativa: serie.ativa,
      data: moment(serie.data),
    };
  }
}
