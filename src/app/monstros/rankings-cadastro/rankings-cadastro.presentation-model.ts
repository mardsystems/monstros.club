import { Monstro } from '../monstros.domain-model';
import { Ranking } from '../rankings/rankings.domain-model';
import { SolicitacaoDeCadastroDeRanking } from './rankings-cadastro.application-model';

export class RankingViewModel extends SolicitacaoDeCadastroDeRanking {
  isEdit: boolean;
  id?: string; // Usado apenas na edição.
  proprietario: Monstro;

  static toAddViewModel(proprietario: Monstro): RankingViewModel {
    const solicitacao = SolicitacaoDeCadastroDeRanking.toAdd(proprietario.id);

    return {
      isEdit: false,
      id: null,
      nome: solicitacao.nome,
      proprietario: proprietario,
      proprietarioId: solicitacao.proprietarioId,
      dataDeCriacao: solicitacao.dataDeCriacao,
      feitoCom: solicitacao.feitoCom,
    };
  }

  static toEditViewModel(proprietario: Monstro, ranking: Ranking): RankingViewModel {
    const solicitacao = SolicitacaoDeCadastroDeRanking.toEdit(ranking);

    return {
      isEdit: true,
      id: ranking.id,
      nome: solicitacao.nome,
      proprietario: proprietario,
      proprietarioId: solicitacao.proprietarioId,
      dataDeCriacao: solicitacao.dataDeCriacao,
      feitoCom: solicitacao.feitoCom,
    };
  }
}
