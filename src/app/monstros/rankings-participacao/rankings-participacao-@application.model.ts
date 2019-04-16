
export class SolicitacaoDeParticipacaoDeRanking {
  rankingId: string;
  participanteId: string;
  ehAdministrador: boolean;

  static create(rankingId: string): SolicitacaoDeParticipacaoDeRanking {
    return {
      rankingId: rankingId,
      participanteId: null,
      ehAdministrador: false,
    };
  }
}

export interface IParticipacaoDeRanking {
  convidaParticipante(solicitacao: SolicitacaoDeParticipacaoDeRanking): Promise<void>;
}
