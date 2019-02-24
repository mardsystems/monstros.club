import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { combineLatest, Observable, merge } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { TipoDeBalanca } from '../medidas/medidas.domain-model';
import { Monstro } from '../monstros.domain-model';
import { MonstrosService } from '../monstros.service';
import {
  SolicitacaoDeCadastroDeRanking,
  ICadastroDeRanking,
  SolicitacaoDeParticipacaoDeRanking
} from './cadastro/cadastro.application-model';
import { Participacao, Ranking } from './rankings.domain-model';

@Injectable({
  providedIn: 'root'
})
export class RankingsService
  implements ICadastroDeRanking {
  PATH = '/rankings';

  constructor(
    private db: AngularFirestore,
    private monstrosService: MonstrosService
  ) { }

  obtemRankingsObservaveisParaExibicao(monstro: Monstro): Observable<Ranking[]> {
    const rankingsProprietarios$ = this.obtemRankingsObservaveisParaExibicaoPorProprietario(monstro);

    const rankingsPorParticipantes$ = this.obtemRankingsObservaveisPorParticipante(monstro);

    const rankings$ = merge(rankingsProprietarios$, rankingsPorParticipantes$);

    return rankings$;
  }

  obtemRankingsObservaveisParaExibicaoPorProprietario(proprietario: Monstro): Observable<Ranking[]> {
    const monstroRef = this.monstrosService.obtemMonstroRef(proprietario.id);

    const collection = this.db.collection<RankingDocument>(this.PATH, reference => {
      return reference;
      // .where('monstroId', '==', monstroRef);
      // .orderBy('data', 'desc');
    });

    const rankings$ = collection.valueChanges().pipe(
      switchMap(values => this.mapRankingsObservaveis(proprietario, values))
    );

    return rankings$;
  }

  private mapRankingsObservaveis(proprietario: Monstro, values: RankingDocument[]): Observable<Ranking[]> {
    const rankings$Array = values.map((value) => this.mapRankingObservavel(proprietario, value));

    const rankings$ = combineLatest(rankings$Array);

    return rankings$;
  }

  private mapRankingObservavel(proprietario: Monstro, value: RankingDocument): Observable<Ranking> {
    const rankings$ = this.mapParticipacoesObservaveis(value).pipe(
      map(participantes => this.mapRanking(value, proprietario, participantes))
    );

    return rankings$;
  }

  private mapParticipacoesObservaveis(value: RankingDocument): Observable<Participacao[]> {
    const participacoes$Array = value.participantes.map(participacaoValue => {
      const monstro$ = this.monstrosService.obtemMonstroObservavel(participacaoValue.participanteId.id).pipe(
        map(monstro => {
          const participacao = new Participacao(
            monstro,
            participacaoValue.desde.toDate(),
            participacaoValue.ehAdministrador
          );

          return participacao;
        })
      );

      return monstro$;
    });

    const participacoes$ = combineLatest(participacoes$Array);

    return participacoes$;
  }

  obtemRankingsObservaveisPorParticipante(participante: Monstro): Observable<Ranking[]> {
    const monstroRef = this.monstrosService.obtemMonstroRef(participante.id);

    const collection = this.db.collection<RankingDocument>(this.PATH, reference => {
      return reference
        .where('participanteId', '==', monstroRef);
      // .orderBy('data', 'desc');
    });

    // const collection = this.db.collection<RankingDocument>(this.PATH);

    // const document = collection.doc<RankingDocument>('iPNln1DVy2G6Ys29eUU8');

    // const query = document.collection<RankingDocument>('participantess', reference => {
    //   return reference
    //     .where('participanteId', '==', monstroRef);
    //   // .orderBy('data', 'desc');
    // });

    const rankings$ = collection.valueChanges().pipe(
      switchMap(values => {
        const rankingsComProprietario$Array = values.map(value => {
          const rankingComProprietario$ = this.monstrosService.obtemMonstroObservavel(value.monstroId.id).pipe(
            switchMap(monstro => this.mapRankingObservavel(monstro, value))
          );

          return rankingComProprietario$;
        });

        const rankingsComProprietario$ = combineLatest(rankingsComProprietario$Array);

        return rankingsComProprietario$;
      })
    );

    return rankings$;

    // // return merge(rankings$, new Observable<Ranking[]>(() => [])); // TODO: Problema quando não tem rankings.

    // return rankings$;
  }

  obtemRankingObservavel(id: string): Observable<Ranking> {
    const collection = this.db.collection<RankingDocument>(this.PATH);

    const document = collection.doc<RankingDocument>(id);

    const ranking$ = document.valueChanges().pipe(
      switchMap(value => {
        const rankingComProprietario$ = this.monstrosService.obtemMonstroObservavel(value.monstroId.id).pipe(
          switchMap(monstro => this.mapRankingObservavel(monstro, value))
        );

        return rankingComProprietario$;
      })
    );

    return ranking$;
  }

  private mapRanking(value: RankingDocument, proprietario: Monstro, participantes: Participacao[]): Ranking {
    const monstroId = value.monstroId.id;

    const CONST_TIMESTAMP_FALSO = 1;

    return new Ranking(
      value.id,
      value.nome,
      proprietario,
      monstroId,
      value.feitoCom as TipoDeBalanca,
      CONST_TIMESTAMP_FALSO,
      value.dataDeCriacao.toDate(),
      participantes
    );
  }

  importaRankings() {
    const idAntigo = 'monstros/FCmLKJPLf4ejTazweTCP';

    const collection = this.db.collection<RankingDocument>(this.PATH, reference =>
      reference
        .where('monstroId', '==', idAntigo)
      // .orderBy('data', 'desc')
    );

    collection.valueChanges().subscribe(rankings => {
      rankings.forEach(ranking => {
        // ranking.monstroId = 'monstros/2MvVXS8931bRukYSnGCJZo98BrH3';

        const document = collection.doc<RankingDocument>(ranking.id);

        document.update(ranking);
      });
    });
  }

  cadastraRanking(solicitacao: SolicitacaoDeCadastroDeRanking): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.monstrosService.obtemMonstroObservavel(solicitacao.proprietarioId).pipe(first()).subscribe(monstro => {
        const rankingId = this.db.createId();

        const ranking = new Ranking(
          rankingId,
          solicitacao.nome,
          monstro,
          solicitacao.proprietarioId,
          solicitacao.feitoCom as TipoDeBalanca
        );

        const result = this.add(ranking);

        resolve(result);
      });
    });
  }

  private add(ranking: Ranking): Promise<void> {
    const collection = this.db.collection<RankingDocument>(this.PATH);

    const document = collection.doc<RankingDocument>(ranking.id);

    const newDocument = this.mapTo(ranking);

    const result = document.set(newDocument);

    return result;
  }

  atualizaRanking(rankingId: string, solicitacao: SolicitacaoDeCadastroDeRanking): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.obtemRankingObservavel(rankingId).pipe(first()).subscribe(ranking => {
        ranking.defineNome(solicitacao.nome);

        const result = this.update(ranking);

        resolve(result);
      });
    });
  }

  private update(ranking: Ranking): Promise<void> {
    const collection = this.db.collection<RankingDocument>(this.PATH);

    const document = collection.doc<RankingDocument>(ranking.id);

    const newDocument = this.mapTo(ranking);

    const result = document.update(newDocument);

    return result;
  }

  private mapTo(ranking: Ranking): RankingDocument {
    const monstroRef = this.monstrosService.obtemMonstroRef(ranking.proprietarioId);

    const newDocument: RankingDocument = {
      id: ranking.id,
      nome: ranking.nome,
      // monstroId: `monstros/${ranking.monstro.id}`,
      // monstroId: `monstros/${ranking.proprietarioId}`,
      monstroId: monstroRef,
      dataDeCriacao: firebase.firestore.Timestamp.fromDate(ranking.dataDeCriacao),
      feitoCom: ranking.feitoCom,
      participantes: ranking.participantes.map(participacao => {
        const participanteRef = this.monstrosService.obtemMonstroRef(participacao.participante.id);

        const participacaoDocument: ParticipacaoDocument = {
          participanteId: participanteRef,
          desde: firebase.firestore.Timestamp.fromDate(participacao.desde),
          ehAdministrador: participacao.ehAdministrador
        };

        return participacaoDocument;
      })
    };

    return newDocument;
  }

  adicionaParticipante(solicitacao: SolicitacaoDeParticipacaoDeRanking): Promise<void> {
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

      this.obtemRankingObservavel(solicitacao.rankingId).pipe(
        first()
      ).subscribe(ranking => {
        this.monstrosService.obtemMonstroObservavel(solicitacao.participanteId).subscribe(monstro => {
          const participante = monstro; // solicitacao.participanteId;

          const agora = new Date(Date.now());

          ranking.adicionaParticipante(participante, agora, solicitacao.ehAdministrador);

          const result = this.update(ranking);

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

      this.obtemRankingObservavel(rankingId).pipe(
        first()
      ).subscribe(ranking => {
        this.monstrosService.obtemMonstroObservavel(participanteId).subscribe(monstro => {
          const participante = monstro; // solicitacao.participanteId;

          const agora = new Date(Date.now());

          ranking.removeParticipante(participante.id);

          const result = this.update(ranking);

          resolve(result);
        });
      });
    });
  }

  excluiRanking(rankingId: string): Promise<void> {
    const collection = this.db.collection<RankingDocument>(this.PATH);

    const document = collection.doc<RankingDocument>(rankingId);

    const result = document.delete();

    return result;
  }
}

interface RankingDocument {
  id: string;
  nome: string;
  monstroId: firebase.firestore.DocumentReference;
  dataDeCriacao: firebase.firestore.Timestamp;
  feitoCom: string;
  participantes: ParticipacaoDocument[];
}

interface ParticipacaoDocument {
  participanteId: firebase.firestore.DocumentReference;
  // rankingId: firebase.firestore.DocumentReference;
  desde: firebase.firestore.Timestamp;
  ehAdministrador: boolean;
}
