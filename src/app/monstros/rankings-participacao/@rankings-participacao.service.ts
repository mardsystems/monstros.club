import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { MonstrosFirecloudRepository } from '../monstros.firecloud-repository';
import { RankingsService } from '../rankings/@rankings-firebase.service';
import { IParticipacaoDeRanking, SolicitacaoDeParticipacaoDeRanking } from './rankings-cadastro.application-model';

@Injectable({
  providedIn: 'root'
})
export class RankingsParticipacaoService
  implements IParticipacaoDeRanking {

  constructor(
    private repositorioDeMonstros: MonstrosFirecloudRepository,
    private repositorioDeRankings: RankingsService,
  ) { }

  convidaParticipante(solicitacao: SolicitacaoDeParticipacaoDeRanking): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // this.monstrosService.obtemMonstroObservavel(solicitacao.participanteId).pipe(
      //   first(),
      //   map(monstro => {
      //     this.obtemRankingObservavel(solicitacao.rankingId).subscribe(ranking => {
      //       const participante = monstro; // solicitacao.participanteId;

      //       const agora = new Date(Date.now());

      //       ranking.adicionaParticipante(participante, agora, solicitacao.ehAdministrador);

      //       const result = this.update(ranking);

      //       resolve(result);
      //     });
      //   })
      // );

      this.repositorioDeRankings.obtemRankingObservavel(solicitacao.rankingId).pipe(
        first()
      ).subscribe(ranking => {
        this.repositorioDeMonstros.obtemMonstroObservavel(solicitacao.participanteId).pipe(
          first()
        ).subscribe(monstro => {
          const participante = monstro; // solicitacao.participanteId;

          const agora = new Date(Date.now());

          ranking.adicionaParticipante(participante, agora, solicitacao.ehAdministrador);

          const result = this.repositorioDeRankings.update(ranking);

          resolve(result);
        });
      });
    });
  }

  removeParticipante(rankingId: string, participanteId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // this.monstrosService.obtemMonstroObservavel(solicitacao.participanteId).pipe(
      //   first(),
      //   map(monstro => {
      //     this.obtemRankingObservavel(solicitacao.rankingId).subscribe(ranking => {
      //       const participante = monstro; // solicitacao.participanteId;

      //       const agora = new Date(Date.now());

      //       ranking.adicionaParticipante(participante, agora, solicitacao.ehAdministrador);

      //       const result = this.update(ranking);

      //       resolve(result);
      //     });
      //   })
      // );

      this.repositorioDeRankings.obtemRankingObservavel(rankingId).pipe(
        first()
      ).subscribe(ranking => {
        this.repositorioDeMonstros.obtemMonstroObservavel(participanteId).pipe(
          first()
        ).subscribe(monstro => {
          const participante = monstro; // solicitacao.participanteId;

          const agora = new Date(Date.now());

          ranking.removeParticipante(participante.id);

          const result = this.repositorioDeRankings.update(ranking);

          resolve(result);
        });
      });
    });
  }
}
