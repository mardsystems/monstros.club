import * as moment from 'moment';
import { Serie } from '../series.domain-model';

export class SolicitacaoDeCadastroDeSerie {
  monstroId: string;
  data: moment.Moment;
  // feitaCom: TipoDeSerie;
  peso?: number;
  gordura?: number;
  gorduraVisceral?: number;
  musculo?: number;
  idadeCorporal?: number;
  metabolismoBasal?: number;
  indiceDeMassaCorporal?: number;

  static toAdd(monstroId: string): SolicitacaoDeCadastroDeSerie {
    return {
      monstroId: monstroId,
      data: moment(new Date(Date.now())),
      // feitaCom: TipoDeSerie.OmronHBF214,
      peso: null,
      gordura: null,
      gorduraVisceral: null,
      musculo: null,
      idadeCorporal: null,
      metabolismoBasal: null,
      indiceDeMassaCorporal: null
    };
  }

  static toEdit(medida: Serie): SolicitacaoDeCadastroDeSerie {
    return null;

    // return {
    //   monstroId: medida.monstroId,
    //   data: moment(medida.data),
    //   // feitaCom: medida.tipo,
    //   peso: medida.quantidade,
    //   gordura: medida.gordura,
    //   gorduraVisceral: medida.gorduraVisceral,
    //   musculo: medida.musculo,
    //   idadeCorporal: medida.idadeCorporal,
    //   metabolismoBasal: medida.metabolismoBasal,
    //   indiceDeMassaCorporal: medida.indiceDeMassaCorporal
    // };
  }
}
