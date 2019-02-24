// import { Injectable } from '@angular/core';
// import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
// import * as firebase from 'firebase/app';
// import { Observable } from 'rxjs';
// import { LogService } from 'src/app/app.services';
// import { Monstro } from '../monstros.domain-model';
// import { MonstrosService } from '../monstros.service';
// import { Participacao, Ranking } from './rankings.domain-model';

// @Injectable({
//   providedIn: 'root'
// })
// export class RankingsParticipacoesService {
//   PATH_RANKINGS = '/rankings';
//   PATH = this.PATH_RANKINGS + '-participacoes';

//   constructor(
//     private db: AngularFirestore,
//     private monstrosService: MonstrosService,
//     private log: LogService
//   ) { }

//   obtemRankingParticipacoes(participante: Monstro): Observable<RankingParticipacaoDocument[]> {
//     const monstroRef = this.monstrosService.obtemMonstroRef(participante.id);

//     const collection = this.db.collection<RankingParticipacaoDocument>(this.PATH, reference => {
//       return reference
//         .where('participanteId', '==', monstroRef);
//       // .orderBy('data', 'desc');
//     });

//     const participacoes$ = collection.valueChanges();

//     return participacoes$;
//   }

//   cadastraRankingParticipacao(rankingRef: DocumentReference, ranking: Ranking): Promise<void> {
//     return new Promise<void>((resolve, reject) => {
//       const participanteResults = ranking.participantes.map(participacao => {
//         const rankingParticipacaoId = this.db.createId();

//         const result = this.add(rankingRef, rankingParticipacaoId, participacao);

//         return result;
//       });

//       const allResult = Promise.all(participanteResults).then((results) => {
//         this.log.debug('cadastraRankingParticipacao: ' + results);
//       });

//       resolve(allResult);
//     });
//   }

//   add(rankingRef: DocumentReference, rankingParticipacaoId: string, participacao: Participacao): Promise<void> {
//     const collection = this.db.collection<RankingParticipacaoDocument>(this.PATH);

//     const document = collection.doc<RankingParticipacaoDocument>(rankingParticipacaoId);

//     const doc = this.mapTo(rankingRef, rankingParticipacaoId, participacao);

//     const result = document.set(doc);

//     return result;
//   }

//   private mapTo(
//     rankingRef: DocumentReference,
//     rankingParticipacaoId: string,
//     participacao: Participacao
//   ): RankingParticipacaoDocument {
//     const participanteRef = this.monstrosService.obtemMonstroRef(participacao.participante.id);

//     const doc: RankingParticipacaoDocument = {
//       id: rankingParticipacaoId,
//       participanteId: participanteRef,
//       rankingId: rankingRef
//     };

//     return doc;
//   }

//   // add(participacao: RankingParticipacaoDocument): Promise<void> {
//   //   const collection = this.db.collection<RankingParticipacaoDocument>(this.PATH);

//   //   const document = collection.doc<RankingParticipacaoDocument>(participacao.id.id);

//   //   const doc = participacao;

//   //   const result = document.set(doc);

//   //   return result;
//   // }
// }

// interface RankingParticipacaoDocument {
//   id: string;
//   participanteId: firebase.firestore.DocumentReference;
//   rankingId: firebase.firestore.DocumentReference;
// }
