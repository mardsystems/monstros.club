import { Monstro } from '../../monstros.domain-model';
import {
  Serie,
} from '../series.domain-model';
import { SolicitacaoDeCadastroDeSerie } from './cadastro.application-model';

export class CadastroDeSerieViewModel extends SolicitacaoDeCadastroDeSerie {
  isEdit: boolean;
  id?: string; // Usado apenas na edição.
  monstro: Monstro;

  static toAddViewModel(monstro: Monstro): CadastroDeSerieViewModel {
    const solicitacao = SolicitacaoDeCadastroDeSerie.toAdd(monstro.id);

    return {
      isEdit: false,
      id: null,
      monstro: monstro,
      monstroId: solicitacao.monstroId,
      data: solicitacao.data,
      // feitaCom: solicitacao.feitaCom,
      peso: solicitacao.peso,
      gordura: solicitacao.gordura,
      gorduraVisceral: solicitacao.gorduraVisceral,
      musculo: solicitacao.musculo,
      idadeCorporal: solicitacao.idadeCorporal,
      metabolismoBasal: solicitacao.metabolismoBasal,
      indiceDeMassaCorporal: solicitacao.indiceDeMassaCorporal
    };
  }

  static toEditViewModel(monstro: Monstro, medida: Serie): CadastroDeSerieViewModel {
    const solicitacao = SolicitacaoDeCadastroDeSerie.toEdit(medida);

    return {
      isEdit: true,
      id: medida.id,
      monstro: monstro,
      monstroId: solicitacao.monstroId,
      data: solicitacao.data,
      // feitaCom: solicitacao.feitaCom,
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
