import * as moment from 'moment';
import { Monstro } from '../../monstros.model';
import {
  IMedidaDeGordura,
  IMedidaDeGorduraVisceral,
  IMedidaDeIndiceDeMassaCorporal,
  IMedidaDeMusculo,
  Medida,
  TipoDeBalanca
} from '../medidas.model';

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

export class CadastroDeMedidaViewModel extends SolicitacaoDeCadastroDeMedida
  implements IMedidaDeGordura, IMedidaDeGorduraVisceral, IMedidaDeMusculo, IMedidaDeIndiceDeMassaCorporal {
  isEdit: boolean;
  id?: string; // Usado apenas na edição.
  monstro: Monstro;

  static toAddViewModel(monstro: Monstro): CadastroDeMedidaViewModel {
    const solicitacao = SolicitacaoDeCadastroDeMedida.toAdd(monstro.id);

    return {
      isEdit: false,
      id: null,
      monstro: monstro,
      monstroId: solicitacao.monstroId,
      data: solicitacao.data,
      feitaCom: solicitacao.feitaCom,
      peso: solicitacao.peso,
      gordura: solicitacao.gordura,
      gorduraVisceral: solicitacao.gorduraVisceral,
      musculo: solicitacao.musculo,
      idadeCorporal: solicitacao.idadeCorporal,
      metabolismoBasal: solicitacao.metabolismoBasal,
      indiceDeMassaCorporal: solicitacao.indiceDeMassaCorporal
    };
  }

  static toEditViewModel(monstro: Monstro, medida: Medida): CadastroDeMedidaViewModel {
    const solicitacao = SolicitacaoDeCadastroDeMedida.toEdit(medida);

    return {
      isEdit: true,
      id: medida.id,
      monstro: monstro,
      monstroId: solicitacao.monstroId,
      data: solicitacao.data,
      feitaCom: solicitacao.feitaCom,
      peso: solicitacao.peso,
      gordura: solicitacao.gordura,
      gorduraVisceral: solicitacao.gorduraVisceral,
      musculo: solicitacao.musculo,
      idadeCorporal: solicitacao.idadeCorporal,
      metabolismoBasal: solicitacao.metabolismoBasal,
      indiceDeMassaCorporal: solicitacao.indiceDeMassaCorporal
    };
  }
}
