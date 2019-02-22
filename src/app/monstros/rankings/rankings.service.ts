import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { combineLatest, Observable } from 'rxjs';
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

  obtemRankingsObservaveisParaRanking(): Observable<Ranking[]> {
    const collection = this.db.collection<RankingDocument>(this.PATH, reference => {
      return reference;
      // .orderBy('data', 'desc');
    });

    const rankings$ = collection.valueChanges().pipe(
      switchMap(values => {
        const arrayDeRankingsObservaveis = values
          // .filter(value => value.monstroId !== 'monstros/OJUFB66yLBwIOE2hk8hs')
          .map((value) => {
            const monstroId = value.monstroId.id;

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
    const monstroRef = this.monstrosService.obtemMonstroRef(monstro.id);

    const collection = this.db.collection<RankingDocument>(this.PATH, reference => {
      return reference
        .where('monstroId', '==', monstroRef);
      // .where('monstroId', '==', `/monstros/${monstro.id}`);
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
    const monstroId = value.monstroId.id;

    const CONST_TIMESTAMP_FALSO = 1;

    const participantes = value.participantes.map(participacaoDoc => {
      const participanteFake = monstro;

      const participacao = new Participacao(
        participanteFake,
        participacaoDoc.desde.toDate(),
        participacaoDoc.ehAdministrador
      );

      return participacao;
    });

    return new Ranking(
      value.id,
      value.nome,
      monstro,
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

        const participacaoDocument: ParticipacaoNoRankingDocument = {
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
      this.obtemRankingObservavel(solicitacao.rankingId).pipe(first()).subscribe(ranking => {
        const participante = null; // solicitacao.participanteId;

        const agora = new Date(Date.now());

        ranking.adicionaParticipante(participante, agora, solicitacao.ehAdministrador);

        const result = this.update(ranking);

        resolve(result);
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
  participantes: ParticipacaoNoRankingDocument[];
}

interface ParticipacaoNoRankingDocument {
  participanteId: firebase.firestore.DocumentReference;
  // rankingId: firebase.firestore.DocumentReference;
  desde: firebase.firestore.Timestamp;
  ehAdministrador: boolean;
}
