import * as moment from 'moment';
import { Medida, TipoDeBalanca } from '../medidas.domain-model';

export class SolicitacaoDeCadastroDeMedida {
  monstroId: string;
  data: moment.Moment;
  feitaCom: TipoDeBalanca;
  peso?: number;
  gordura?: number;
  gorduraVisceral?: number;
  musculo?: number;
  idadeCorporal?: number;
  metabolismoBasal?: number;
  indiceDeMassaCorporal?: number;

  static toAdd(monstroId: string): SolicitacaoDeCadastroDeMedida {
    return {
      monstroId: monstroId,
      data: moment(new Date(Date.now())),
      feitaCom: TipoDeBalanca.OmronHBF214,
      peso: null,
      gordura: null,
      gorduraVisceral: null,
      musculo: null,
      idadeCorporal: null,
      metabolismoBasal: null,
      indiceDeMassaCorporal: null
    };
  }

  static toEdit(medida: Medida): SolicitacaoDeCadastroDeMedida {
    return {
      monstroId: medida.monstroId,
      data: moment(medida.data),
      feitaCom: medida.feitaCom,
      peso: medida.peso,
      gordura: medida.gordura,
      gorduraVisceral: medida.gorduraVisceral,
      musculo: medida.musculo,
      idadeCorporal: medida.idadeCorporal,
      metabolismoBasal: medida.metabolismoBasal,
      indiceDeMassaCorporal: medida.indiceDeMassaCorporal
    };
  }
}
