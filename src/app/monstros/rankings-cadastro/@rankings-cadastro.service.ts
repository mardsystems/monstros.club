import { Injectable } from '@angular/core';
import { first, tap } from 'rxjs/operators';
import { MonstrosFirebaseService } from 'src/app/cadastro/monstros/@monstros-firebase.service';
import { LogService } from 'src/app/common/common.service';
import { TipoDeBalanca } from '../medidas/@medidas-domain.model';
import { Ranking } from '../rankings/@rankings-domain.model';
import { RankingsFirebaseService } from '../rankings/@rankings-firebase.service';
import { ICadastroDeRanking, SolicitacaoDeCadastroDeRanking } from './@rankings-cadastro-application.model';

@Injectable({
  providedIn: 'root'
})
export class RankingsCadastroService
  implements ICadastroDeRanking {

  constructor(
    private repositorioDeMonstros: MonstrosFirebaseService,
    private repositorioDeRankings: RankingsFirebaseService,
    private log: LogService
  ) { }

  cadastraRanking(solicitacao: SolicitacaoDeCadastroDeRanking): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.repositorioDeMonstros.obtemMonstroObservavel(solicitacao.proprietarioId).pipe(
        first(),
        tap((value) => this.log.debug('cadastraRanking: value: ', value)),
      ).subscribe(monstro => {
        const rankingId = this.repositorioDeRankings.createId();

        const ranking = new Ranking(
          rankingId,
          solicitacao.nome,
          monstro,
          solicitacao.proprietarioId,
          solicitacao.feitoCom as TipoDeBalanca
        );

        const result = this.repositorioDeRankings.add(ranking);

        return resolve(result);
      });
    });
  }

  atualizaRanking(rankingId: string, solicitacao: SolicitacaoDeCadastroDeRanking): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.repositorioDeRankings.obtemRankingObservavel(rankingId).pipe(
        first()
      ).subscribe(ranking => {
        ranking.defineNome(solicitacao.nome);

        const result = this.repositorioDeRankings.update(ranking);

        resolve(result);
      });
    });
  }

  async excluiRanking(rankingId: string): Promise<void> {
    return await this.repositorioDeRankings.remove(rankingId);
  }
}
