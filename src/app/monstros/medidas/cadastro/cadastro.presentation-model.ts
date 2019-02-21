import { Monstro } from '../../monstros.model';
import {
  IMedidaDeGordura,
  IMedidaDeGorduraVisceral,
  IMedidaDeIndiceDeMassaCorporal,
  IMedidaDeMusculo,
  Medida,
} from '../medidas.domain-model';
import { SolicitacaoDeCadastroDeMedida } from './cadastro.application-model';

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
