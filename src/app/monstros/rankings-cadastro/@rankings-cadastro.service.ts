import { Inject, Injectable } from '@angular/core';
import { RepositorioDeMonstros, REPOSITORIO_DE_MONSTROS } from 'src/app/cadastro/monstros/@monstros-domain.model';
import { UnitOfWork, UNIT_OF_WORK } from 'src/app/common/transactions.model';
import { TipoDeBalanca } from '../medidas/@medidas-domain.model';
import { Ranking, RepositorioDeRankings, REPOSITORIO_DE_RANKINGS } from '../rankings/@rankings-domain.model';
import { CadastroDeRankings, SolicitacaoDeCadastroDeRanking } from './@rankings-cadastro-application.model';

@Injectable()
export class RankingsCadastroService implements CadastroDeRankings {
  constructor(
    @Inject(UNIT_OF_WORK)
    private unitOfWork: UnitOfWork,
    @Inject(REPOSITORIO_DE_RANKINGS)
    private repositorioDeRankings: RepositorioDeRankings,
    @Inject(REPOSITORIO_DE_MONSTROS)
    private repositorioDeMonstros: RepositorioDeMonstros,
  ) { }

  async cadastraRanking(solicitacao: SolicitacaoDeCadastroDeRanking): Promise<void> {
    await this.unitOfWork.beginTransaction();

    try {
      const rankingId = this.repositorioDeRankings.createId();

      const proprietario = await this.repositorioDeMonstros.obtemMonstro(solicitacao.proprietarioId);

      //

      const ranking = new Ranking(
        rankingId,
        solicitacao.nome,
        proprietario,
        solicitacao.proprietarioId,
        solicitacao.feitoCom as TipoDeBalanca
      );


      //

      await this.repositorioDeRankings.add(ranking);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }

  async atualizaRanking(rankingId: string, solicitacao: SolicitacaoDeCadastroDeRanking): Promise<void> {
    await this.unitOfWork.beginTransaction();

    try {
      const ranking = await this.repositorioDeRankings.obtemRanking(rankingId);

      //

      ranking.defineNome(solicitacao.nome);


      //

      await this.repositorioDeRankings.update(ranking);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }

  async excluiRanking(rankingId: string): Promise<void> {
    await this.unitOfWork.beginTransaction();

    try {
      const ranking = await this.repositorioDeRankings.obtemRanking(rankingId);

      //

      await this.repositorioDeRankings.remove(ranking);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }
}
