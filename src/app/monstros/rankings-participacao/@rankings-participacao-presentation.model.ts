import { Ranking } from '../rankings/@rankings-domain.model';
import { SolicitacaoDeParticipacaoDeRanking } from './@rankings-participacao-application.model';

export class ParticipacaoViewModel extends SolicitacaoDeParticipacaoDeRanking {
  ranking: Ranking;

  static toViewModel(ranking: Ranking): ParticipacaoViewModel {
    const solicitacao = SolicitacaoDeParticipacaoDeRanking.create(ranking.id);

    return {
      ranking: ranking,
      rankingId: solicitacao.rankingId,
      participanteId: solicitacao.participanteId,
      ehAdministrador: solicitacao.ehAdministrador,
    };
  }
}
