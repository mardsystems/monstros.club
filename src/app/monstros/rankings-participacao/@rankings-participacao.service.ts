import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { MonstrosFirebaseService } from 'src/app/cadastro/monstros/@monstros-firebase.service';
import { RankingsFirebaseService } from '../rankings/@rankings-firebase.service';
import { ParticipacaoDeRanking, SolicitacaoDeParticipacaoDeRanking } from './@rankings-participacao-application.model';

@Injectable({
  providedIn: 'root'
})
export class RankingsParticipacaoService
  implements ParticipacaoDeRanking {

  constructor(
    private repositorioDeMonstros: MonstrosFirebaseService,
    private repositorioDeRankings: RankingsFirebaseService,
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
