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
      nome: solicitacao.nome,
      cor: solicitacao.cor,
      ativa: solicitacao.ativa,
      monstro: monstro,
      monstroId: solicitacao.monstroId,
      data: solicitacao.data,
    };
  }

  static toEditViewModel(monstro: Monstro, medida: Serie): CadastroDeSerieViewModel {
    const solicitacao = SolicitacaoDeCadastroDeSerie.toEdit(monstro.id, medida);

    return {
      isEdit: true,
      id: medida.id,
      nome: solicitacao.nome,
      cor: solicitacao.cor,
      ativa: solicitacao.ativa,
      monstro: monstro,
      monstroId: solicitacao.monstroId,
      data: solicitacao.data,
    };
  }
}
