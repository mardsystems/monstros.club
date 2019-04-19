import { Inject, Injectable } from '@angular/core';
import { RepositorioDeMonstros, REPOSITORIO_DE_MONSTROS } from 'src/app/cadastro/monstros/@monstros-domain.model';
import { UnitOfWork, UNIT_OF_WORK } from 'src/app/common/transactions.model';
import { RepositorioDeRankings, REPOSITORIO_DE_RANKINGS } from '../rankings/@rankings-domain.model';
import { ParticipacaoDeRankings, SolicitacaoDeParticipacaoDeRanking } from './@rankings-participacao-application.model';

@Injectable()
export class RankingsParticipacaoService implements ParticipacaoDeRankings {
  constructor(
    @Inject(UNIT_OF_WORK)
    private unitOfWork: UnitOfWork,
    @Inject(REPOSITORIO_DE_RANKINGS)
    private repositorioDeRankings: RepositorioDeRankings,
    @Inject(REPOSITORIO_DE_MONSTROS)
    private repositorioDeMonstros: RepositorioDeMonstros,
  ) { }

  async convidaParticipante(solicitacao: SolicitacaoDeParticipacaoDeRanking): Promise<void> {
    await this.unitOfWork.beginTransaction();

    try {
      const ranking = await this.repositorioDeRankings.obtemRanking(solicitacao.rankingId);

      const monstro = await this.repositorioDeMonstros.obtemMonstro(solicitacao.participanteId);

      //

      const participante = monstro; // solicitacao.participanteId;

      const agora = new Date(Date.now());

      ranking.adicionaParticipante(participante, agora, solicitacao.ehAdministrador);

      //

      await this.repositorioDeRankings.update(ranking);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }

  async removeParticipante(rankingId: string, participanteId: string): Promise<void> {
    await this.unitOfWork.beginTransaction();

    try {
      const ranking = await this.repositorioDeRankings.obtemRanking(rankingId);

      const monstro = await this.repositorioDeMonstros.obtemMonstro(participanteId);

      //

      const participante = monstro; // solicitacao.participanteId;

      ranking.removeParticipante(participante.id);

      //

      await this.repositorioDeRankings.update(ranking);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }
}
