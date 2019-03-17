import { Ranking } from '../rankings.domain-model';
import { SolicitacaoDeParticipacaoDeRanking } from '../cadastro/cadastro.application-model';

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
