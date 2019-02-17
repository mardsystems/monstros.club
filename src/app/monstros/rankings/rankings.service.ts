import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import { Observable, combineLatest } from 'rxjs';
import { first, map, mergeMap, merge, switchMap } from 'rxjs/operators';
import { Monstro } from '../monstros.model';
import { MonstrosService, MonstroDocument } from '../monstros.service';
import { Ranking, SolicitacaoDeCadastroDeRanking } from './rankings.model';
import * as _ from 'lodash';
import { TipoDeBalanca } from '../medidas/medidas.model';

@Injectable({
  providedIn: 'root'
})
export class RankingsService {
  PATH = '/rankings';

  constructor(
    private db: AngularFirestore,
    private monstrosService: MonstrosService
  ) { }

  obtemRankingsObservaveisParaRanking(): Observable<Ranking[]> {
    const collection = this.db.collection<RankingDocument>(this.PATH, reference => {
      return reference;
      // .orderBy('data', 'desc');
    });

    const rankings$ = collection.valueChanges().pipe(
      switchMap(values => {
        const arrayDeRankingsObservaveis = values
          .filter(value => value.monstroId !== 'monstros/OJUFB66yLBwIOE2hk8hs')
          .map((value) => {
            const monstroId = value.monstroId.substring(this.monstrosService.PATH.length, value.monstroId.length);

            const rankingComMonstro$ = this.monstrosService.obtemMonstroObservavel(monstroId).pipe(
              map(monstro => this.mapRanking(value, monstro))
            );

            return rankingComMonstro$;
          });

        const todasAsRankings$ = combineLatest(arrayDeRankingsObservaveis);

        return todasAsRankings$;
      })
    );

    // return merge(rankings$, new Observable<Ranking[]>(() => [])); // TODO: Problema quando não tem rankings.

    return rankings$;
  }

  obtemRankingsObservaveisParaExibicao(monstro: Monstro): Observable<Ranking[]> {
    const collection = this.db.collection<RankingDocument>(this.PATH, reference => {
      return reference
        .where('monstroId', '==', `monstros/${monstro.id}`);
        // .orderBy('data', 'desc');
    });

    const rankings$ = collection.valueChanges().pipe(
      map(values => {
        return values.map((value, index) => {
          return this.mapRanking(value, monstro);
        });
      })
    );

    return rankings$;
  }

  obtemRankingObservavel(id: string): Observable<Ranking> {
    const collection = this.db.collection<RankingDocument>(this.PATH);

    const document = collection.doc<RankingDocument>(id);

    const ranking$ = document.valueChanges().pipe(
      map(value => {
        const monstro = null;

        return this.mapRanking(value, monstro);
      })
    );

    return ranking$;
  }

  private mapRanking(value: RankingDocument, monstro: Monstro): Ranking {
    const monstroId = value.monstroId.substring(this.monstrosService.PATH.length, value.monstroId.length);

    const CONST_TIMESTAMP_FALSO = 0;

    return new Ranking(
      value.id,
      monstro,
      monstroId,
      value.feitoCom as TipoDeBalanca,
      CONST_TIMESTAMP_FALSO
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
        ranking.monstroId = 'monstros/2MvVXS8931bRukYSnGCJZo98BrH3';

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
        // ranking.defineData(solicitacao.data.toDate());

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
    const newDocument: RankingDocument = {
      id: ranking.id,
      // monstroId: `monstros/${ranking.monstro.id}`,
      monstroId: `monstros/${ranking.proprietarioId}`,
      dataDeCriacao: firebase.firestore.Timestamp.fromDate(ranking.dataDeCriacao),
      feitoCom: ranking.feitoCom,
      participantes: []
    };

    return newDocument;
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
  monstroId: string;
  dataDeCriacao: firebase.firestore.Timestamp;
  feitoCom: string;
  participantes: ParticipacaoNoRankingDocument[];
}

interface ParticipacaoNoRankingDocument {
  monstroId: string;
  rankingId: string;
  desde: firebase.firestore.Timestamp;
  ehAdministrador: boolean;
}
