import { Injectable } from '@angular/core';
import { first, tap } from 'rxjs/operators';
import { LogService } from 'src/app/app-@shared.services';
import { TipoDeBalanca } from '../medidas/medidas-@domain.model';
import { MonstrosFirecloudRepository } from '../monstros.firecloud-repository';
import { Ranking } from '../rankings/rankings-@domain.model';
import { RankingsService } from '../rankings/rankings-@firebase.service';
import { ICadastroDeRanking, SolicitacaoDeCadastroDeRanking } from './rankings-cadastro-@application.model';

@Injectable({
  providedIn: 'root'
})
export class RankingsCadastroService
  implements ICadastroDeRanking {

  constructor(
    private repositorioDeMonstros: MonstrosFirecloudRepository,
    private repositorioDeRankings: RankingsService,
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
