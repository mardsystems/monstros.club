import { InjectionToken } from '@angular/core';

export const PARTICIPACAO_DE_RANKINGS = new InjectionToken<ParticipacaoDeRankings>('PARTICIPACAO_DE_RANKINGS');

export interface ParticipacaoDeRankings {
  convidaParticipante(solicitacao: SolicitacaoDeParticipacaoDeRanking): Promise<void>;

  removeParticipante(rankingId: string, participanteId: string): Promise<void>;
}

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
