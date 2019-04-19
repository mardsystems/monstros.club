import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import * as _ from 'lodash';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, first, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Monstro } from 'src/app/cadastro/monstros/@monstros-domain.model';
import { MonstrosFirebaseService } from 'src/app/cadastro/monstros/@monstros-firebase.service';
import { LogService } from 'src/app/common/common.service';
import { CONST_TIMESTAMP_FALSO } from 'src/app/common/domain.model';
import { TipoDeBalanca } from '../medidas/@medidas-domain.model';
import { MedidasFirebaseService } from '../medidas/@medidas-firebase.service';
import { PosicaoDeMedida } from './@rankings-application.model';
import { Participacao, Ranking } from './@rankings-domain.model';

@Injectable({
  providedIn: 'root'
})
export class RankingsFirebaseService {
  private METANAME = 'rankings';
  private METANAME_PARTICIPACOES = 'participacoes';

  constructor(
    private db: AngularFirestore,
    private monstrosFirebaseService: MonstrosFirebaseService,
    private medidasFirebaseService: MedidasFirebaseService,
    private log: LogService
  ) { }

  createId(): string {
    const id = this.db.createId();

    return id;
  }

  path(): string {
    const path = `/${this.METANAME}`;

    return path;
  }

  ref(id: string): DocumentReference {
    const path = this.path();

    const collection = this.db.collection<RankingDocument>(path);

    const document = collection.doc<RankingDocument>(id);

    return document.ref;
  }

  obtemRankingsParaExibicao(monstro: Monstro): Observable<Ranking[]> {
    const rankingsProprietarios$ = this.obtemRankingsParaExibicaoPorProprietario(monstro);

    const rankingsPorParticipantes$ = this.obtemRankingsPorParticipante(monstro);

    // const rankings$ = forkJoin(rankingsProprietarios$, rankingsPorParticipantes$).pipe(
    //   first(),
    //   tap((value) => this.log.debug('obtemRankingsParaExibicao', value)),
    //   switchMap(arrayDeArray => {
    //     const x = combineLatest(arrayDeArray);

    //     return x;
    //   })
    // );

    // const rankings$ = merge(...[rankingsProprietarios$]).pipe(
    //   first(),
    //   tap((value) => this.log.debug('obtemRankingsParaExibicao', value)),
    //   mergeMap(flat => flat),
    //   toArray(),
    //   catchError((error, source$) => {
    //     this.log.debug('obtemRankingsParaExibicao: error: ', error);

    //     return source$;
    //   })
    // );

    const rankings$ = combineLatest(rankingsProprietarios$, rankingsPorParticipantes$).pipe(
      // first(),
      tap((value) => this.log.debug('obtemRankingsParaExibicao: merge', value)),
      map(tuplaDeArrayDeRankings => tuplaDeArrayDeRankings.reduce((previous, current) => _.unionBy(previous, current, 'id')))
      // mergeMap(flat => flat),
      // toArray()
      // shareReplay()
    );

    return rankings$;
  }

  obtemRankingsParaExibicaoPorProprietario(proprietario: Monstro): Observable<Ranking[]> {
    this.log.debug('obtemRankingsParaExibicaoPorProprietario');

    const monstroRef = this.monstrosFirebaseService.ref(proprietario.id);

    const path = this.path();

    const collection = this.db.collection<RankingDocument>(path, reference => {
      return reference
        .where('monstroRef', '==', monstroRef);
      // .orderBy('data', 'desc');
    });

    const rankings$ = collection.valueChanges().pipe(
      // first(),
      tap((value) => this.log.debug('obtemRankingsParaExibicaoPorProprietario: valueChanges', value)),
      switchMap(values => this.mapRankings(proprietario, values)),
      // shareReplay()
    );

    return rankings$;
  }

  private mapRankings(proprietario: Monstro, values: RankingDocument[]): Observable<Ranking[]> {
    this.log.debug('mapRankings', values);

    const rankings$Array = values.map(value => this.mapRankingObservavel(proprietario, value));

    if (values.length === 0) {
      return of([]);
    } else {
      return combineLatest(rankings$Array);
    }

    // const rankings$ = combineLatest(rankings$Array);

    // return rankings$;
  }

  private mapRankingObservavel(proprietario: Monstro, value: RankingDocument): Observable<Ranking> {
    this.log.debug('mapRankingObservavel', value);

    const rankings$ = this.mapParticipacoes(value).pipe(
      // first(),
      map(participantes => this.mapRanking(value, proprietario, participantes)),
      shareReplay()
    );

    return rankings$;
  }

  private mapParticipacoes(value: RankingDocument): Observable<Participacao[]> {
    const participacoes$Array = value.participantes.map(participacaoValue => {
      const monstro$ = this.monstrosFirebaseService.obtemMonstroObservavel(participacaoValue.participanteId.id).pipe(
        // first(),
        // tap((value2) => this.log.debug('mapParticipacoes', value2)),
        map(monstro => {
          const participacao = new Participacao(
            monstro,
            participacaoValue.desde.toDate(),
            participacaoValue.ehAdministrador
          );

          return participacao;
        }),
        shareReplay()
      );

      return monstro$;
    });

    const participacoes$ = combineLatest(participacoes$Array);

    return participacoes$;
  }

  obtemRankingsPorParticipante(participante: Monstro): Observable<Ranking[]> {
    this.log.debug('obtemRankingsPorParticipante');

    const rankingsPorParticipante$ = this.obtemRankingParticipacoes(participante).pipe(
      // first(),
      tap((value) => this.log.debug('obtemRankingsPorParticipante: obtemRankingParticipacoes', value)),
      switchMap(rankingsParticipacoes => {
        const rankings$Array = rankingsParticipacoes.map(rankingParticipacao => {
          return this.obtemRankingObservavel(rankingParticipacao.rankingId.id);
        });

        if (rankingsParticipacoes.length === 0) {
          return of([]);
        } else {
          const ranking$ = combineLatest(rankings$Array).pipe(
            // first(),
            // tap((value) => this.log.debug('obtemRankingsPorParticipante: combineLatest', value)),
            catchError((error, source$) => {
              this.log.debug('obtemRankingsPorParticipante: error: ', error);

              return source$;
            })
          );

          return ranking$;
        }
      }),
      shareReplay()
    );

    // const rankings$ = collection.valueChanges().pipe(
    //   switchMap(values => {
    //     const rankingsComProprietario$Array = values.map(value => {
    //       const rankingComProprietario$ = this.monstrosService.obtemMonstroObservavel(value.monstroId.id).pipe(
    //         switchMap(monstro => this.mapRankingObservavel(monstro, value))
    //       );

    //       return rankingComProprietario$;
    //     });

    //     const rankingsComProprietario$ = combineLatest(rankingsComProprietario$Array);

    //     return rankingsComProprietario$;
    //   })
    // );

    return rankingsPorParticipante$;

    // // return merge(rankings$, new Observable<Ranking[]>(() => [])); // TODO: Problema quando não tem rankings.

    // return rankings$;
  }

  obtemRankingObservavel(id: string): Observable<Ranking> {
    this.log.debug('obtemRankingObservavel');

    const path = this.path();

    const collection = this.db.collection<RankingDocument>(path);

    const document = collection.doc<RankingDocument>(id);

    const ranking$ = document.valueChanges().pipe(
      // first(),
      tap((value) => this.log.debug('obtemRankingObservavel: valueChanges: ')),
      switchMap(value => {
        const rankingComProprietario$ = this.monstrosFirebaseService.obtemMonstroObservavel(value.monstroRef.id).pipe(
          // first(),
          switchMap(monstro => this.mapRankingObservavel(monstro, value)),
          catchError((error, source$) => {
            this.log.debug('obtemRankingObservavel: error: ', error);

            return source$;
          })
        );

        return rankingComProprietario$;
      }),
      shareReplay()
    );

    return ranking$;
  }

  private mapRanking(value: RankingDocument, proprietario: Monstro, participantes: Participacao[]): Ranking {
    const monstroId = value.monstroRef.id;

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

  obtemPosicoesDeMedidasParaExibicaoPorRanking(ranking: Ranking): Observable<PosicaoDeMedida[]> {
    const participantes = ranking.participantes.map(participacao => participacao.participante);

    const melhoresMedidasPorParticipante$Array = participantes.map(participante => {
      const ultimaMedida$ = this.medidasFirebaseService.obtemUltimaMedidaObservavel(participante).pipe(
        map(ultimaMedida => PosicaoDeMedida.fromMedida(ultimaMedida, true))
      );

      const menorMedidaDeGordura$ = this.medidasFirebaseService.obtemMenorMedidaDeGorduraObservavel(participante).pipe(
        map(menorMedidaDeGordura => PosicaoDeMedida.fromMedida(menorMedidaDeGordura, false, true))
      );

      const maiorMedidaDeMusculo$ = this.medidasFirebaseService.obtemMaiorMedidaDeMusculoObservavel(participante).pipe(
        map(maiorMedidaDeMusculo => PosicaoDeMedida.fromMedida(maiorMedidaDeMusculo, false, false, true))
      );

      const menorMedidaDeIndiceDeMassaCorporal$ =
        this.medidasFirebaseService.obtemMenorMedidaDeIndiceDeMassaCorporalObservavel(participante).pipe(
          map(menorMedidaDeIndiceDeMassaCorporal => {
            return PosicaoDeMedida.fromMedida(menorMedidaDeIndiceDeMassaCorporal, false, false, false, true);
          })
        );

      //

      const melhoresMedidas$ =
        combineLatest([ultimaMedida$, menorMedidaDeGordura$, maiorMedidaDeMusculo$, menorMedidaDeIndiceDeMassaCorporal$]);

      return melhoresMedidas$;
    });

    const melhoresMedidasPorParticipante$ = combineLatest(melhoresMedidasPorParticipante$Array);

    let combineCount = 0;

    const medidasPorMonstrosUnificado$ = melhoresMedidasPorParticipante$.pipe(
      map(melhoresMedidasPorParticipante => {
        this.log.debug(
          'combine: ' + '' + '; combine-count: ' + ++combineCount + '; arrayDeArray.length: ' + melhoresMedidasPorParticipante.length,
          melhoresMedidasPorParticipante);

        const posicoes: PosicaoDeMedida[] = [];

        melhoresMedidasPorParticipante.forEach(melhoresMedidas => melhoresMedidas.forEach(melhorMedida => {
          // this.log.debug(melhorMedida);

          // const melhorPosicaoDeMedida = PosicaoDeMedida.fromMedida(melhorMedida);

          posicoes.push(melhorMedida);
        }));


        _(posicoes)
          .groupBy(posicao => posicao.medidaId)
          .map(posicoesPorMedida => {
            let ehUltimaMedida = false;

            let ehMenorMedidaDeGordura = false;

            let ehMaiorMedidaDeMusculo = false;

            let ehMenorMedidaDeIndiceDeMassaCorporal = false;

            posicoesPorMedida.map(posicaoPorMedida => {
              ehUltimaMedida = ehUltimaMedida || posicaoPorMedida.ehUltimaMedida;

              ehMenorMedidaDeGordura = ehMenorMedidaDeGordura || posicaoPorMedida.ehMenorMedidaDeGordura;

              ehMaiorMedidaDeMusculo = ehMaiorMedidaDeMusculo || posicaoPorMedida.ehMaiorMedidaDeMusculo;

              ehMenorMedidaDeIndiceDeMassaCorporal =
                ehMenorMedidaDeIndiceDeMassaCorporal || posicaoPorMedida.ehMenorMedidaDeIndiceDeMassaCorporal;
            });

            posicoesPorMedida.map(posicaoPorMedida => {
              posicaoPorMedida.ehUltimaMedida = ehUltimaMedida;

              posicaoPorMedida.ehMenorMedidaDeGordura = ehMenorMedidaDeGordura;

              posicaoPorMedida.ehMaiorMedidaDeMusculo = ehMaiorMedidaDeMusculo;

              posicaoPorMedida.ehMenorMedidaDeIndiceDeMassaCorporal = ehMenorMedidaDeIndiceDeMassaCorporal;
            });
          })
          .value();

        _(posicoes)
          .filter(['ehMaiorMedidaDeMusculo', true])
          .orderBy(['musculo'], ['desc'])
          .map((posicao, index) => posicao.posicaoDeMaiorMusculo = index + 1)
          .value();

        _(posicoes)
          .filter(['ehMenorMedidaDeIndiceDeMassaCorporal', true])
          .orderBy(['indiceDeMassaCorporal'], ['asc'])
          .map((posicao, index) => posicao.posicaoDeMenorIndiceDeMassaCorporal = index + 1)
          .value();


        const posicoesSemRepeticaoDeMedida = _.uniqBy(posicoes, 'medidaId');

        _(posicoesSemRepeticaoDeMedida)
          .filter(['ehMenorMedidaDeGordura', true])
          .orderBy(['gordura'], ['asc'])
          .map((posicao, index) => posicao.posicaoDeMenorGordura = index + 1)
          .value();

        _(posicoesSemRepeticaoDeMedida)
          .filter(['ehMaiorMedidaDeMusculo', true])
          .orderBy(['musculo'], ['desc'])
          .map((posicao, index) => posicao.posicaoDeMaiorMusculo = index + 1)
          .value();

        _(posicoesSemRepeticaoDeMedida)
          .filter(['ehMenorMedidaDeIndiceDeMassaCorporal', true])
          .orderBy(['indiceDeMassaCorporal'], ['asc'])
          .map((posicao, index) => posicao.posicaoDeMenorIndiceDeMassaCorporal = index + 1)
          .value();

        return posicoesSemRepeticaoDeMedida;
      })
    );

    return medidasPorMonstrosUnificado$;
  }

  obtemPosicoesDeMedidasParaExibicaoPorRankingGeral(ranking: Ranking): Observable<PosicaoDeMedida[]> {
    // let mergeCount = 0;

    const participantes = ranking.participantes.map(participacao => participacao.participante);

    const melhoresMedidasPorParticipante$Array = participantes.map(participante => {
      const ultimaMedida$ = this.medidasFirebaseService.obtemUltimaMedidaObservavel(participante);

      const menorMedidaDeGordura$ = this.medidasFirebaseService.obtemMenorMedidaDeGorduraObservavel(participante);

      const maiorMedidaDeMusculo$ = this.medidasFirebaseService.obtemMaiorMedidaDeMusculoObservavel(participante);

      const menorMedidaDeIndiceDeMassaCorporal$ = this.medidasFirebaseService.obtemMenorMedidaDeIndiceDeMassaCorporalObservavel(
        participante
      );

      //

      const melhoresMedidas$ =
        combineLatest([ultimaMedida$, menorMedidaDeGordura$, maiorMedidaDeMusculo$, menorMedidaDeIndiceDeMassaCorporal$]);

      // const melhoresMedidas$ =
      //   merge(ultimaMedida$, menorMedidaDeGordura$, maiorMedidaDeMusculo$, menorMedidaDeIndiceDeMassaCorporal$).pipe(
      //     // first(),
      //     // mergeMap(flat => flat),
      //     // toArray(),
      //     // tap(medidas2 => {
      //     //   this.log.debug('monstro: ' + monstro.nome + '; merge-count: ' + ++mergeCount + '; medidas.length: ' + medidas2.length);
      //     // })
      //   );

      return melhoresMedidas$;
    });

    const melhoresMedidasPorParticipante$ = combineLatest(melhoresMedidasPorParticipante$Array);

    let combineCount = 0;

    const medidasPorMonstrosUnificado$ = melhoresMedidasPorParticipante$.pipe(
      map(melhoresMedidasPorParticipante => {
        this.log.debug(
          'combine: ' + '' + '; combine-count: ' + ++combineCount + '; arrayDeArray.length: ' + melhoresMedidasPorParticipante.length,
          melhoresMedidasPorParticipante);

        const posicoes: PosicaoDeMedida[] = [];

        melhoresMedidasPorParticipante.forEach(melhoresMedidas => melhoresMedidas.forEach(melhorMedida => {
          // this.log.debug(melhorMedida);

          const melhorPosicaoDeMedida = PosicaoDeMedida.fromMedida(melhorMedida);

          posicoes.push(melhorPosicaoDeMedida);
        }));

        const posicoesSemRepeticaoDeMedida = _.uniqBy(posicoes, 'medidaId');

        _(posicoesSemRepeticaoDeMedida)
          .groupBy(posicao => posicao.monstroId)
          .map((posicoesPorMonstro, monstroId) => {
            // this.log.debug('groupBy', posicoesPorMonstro);

            _(posicoesPorMonstro)
              // .filter(['monstroId', monstroId])
              .orderBy(['data'], ['desc'])
              .map((posicao, index) => {
                // this.log.debug('orderBy', posicao);

                posicao.ehUltimaMedida = index === 0;
              })
              .value();
          })
          .value();

        // _.orderBy(posicoesSemRepeticaoDeMedida, ['monstroId', 'data'], ['desc'])
        //   .map((posicao, index) => posicao.ehUltimaMedida = index === 0);

        _.orderBy(posicoesSemRepeticaoDeMedida, ['gordura'], ['asc'])
          .map((posicao, index) => posicao.posicaoDeMenorGordura = index + 1);

        _.orderBy(posicoesSemRepeticaoDeMedida, ['musculo'], ['desc'])
          .map((posicao, index) => posicao.posicaoDeMaiorMusculo = index + 1);

        _.orderBy(posicoesSemRepeticaoDeMedida, ['indiceDeMassaCorporal'], ['asc'])
          .map((posicao, index) => posicao.posicaoDeMenorIndiceDeMassaCorporal = index + 1);

        return posicoesSemRepeticaoDeMedida;
      })
    );

    return medidasPorMonstrosUnificado$;
  }

  importaRankings() {
    const idAntigo = 'monstros/FCmLKJPLf4ejTazweTCP';

    const path = this.path();

    const collection = this.db.collection<RankingDocument>(path, reference =>
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

  add(ranking: Ranking): Promise<void> {
    const path = this.path();

    const collection = this.db.collection<RankingDocument>(path);

    const document = collection.doc<RankingDocument>(ranking.id);

    const doc = this.mapTo(ranking);

    const result = document.set(doc);

    //

    const addRankingsParticipacoesResult = this.addRankingsParticipacoes(ranking);

    const allResult = Promise.all([result, addRankingsParticipacoesResult]).then((results) => {
      this.log.debug('add: ' + results);
      // return new Promisse<void>((resolve, reject)=>{
      //   return
      // })
    });

    return allResult;
  }

  update(ranking: Ranking): Promise<void> {
    const path = this.path();

    const collection = this.db.collection<RankingDocument>(path);

    const document = collection.doc<RankingDocument>(ranking.id);

    const doc = this.mapTo(ranking);

    const result = document.update(doc);

    //

    const updateRankingsParticipacoesResult = this.updateRankingsParticipacoes(ranking);

    const allResult = Promise.all([result, updateRankingsParticipacoesResult]).then((results) => {
      this.log.debug('update: ' + results);
    });

    return allResult;
  }

  private mapTo(ranking: Ranking): RankingDocument {
    const monstroRef = this.monstrosFirebaseService.ref(ranking.proprietarioId);

    const doc: RankingDocument = {
      id: ranking.id,
      nome: ranking.nome,
      // monstroId: `monstros/${ranking.monstro.id}`,
      // monstroId: `monstros/${ranking.proprietarioId}`,
      monstroRef: monstroRef,
      dataDeCriacao: firebase.firestore.Timestamp.fromDate(ranking.dataDeCriacao),
      feitoCom: ranking.feitoCom,
      participantes: ranking.participantes.map(participacao => {
        const participanteRef = this.monstrosFirebaseService.ref(participacao.participante.id);

        const participacaoDocument: ParticipacaoDocument = {
          participanteId: participanteRef,
          desde: firebase.firestore.Timestamp.fromDate(participacao.desde),
          ehAdministrador: participacao.ehAdministrador
        };

        return participacaoDocument;
      })
    };

    return doc;
  }

  remove(rankingId: string): Promise<void> {
    const path = this.path();

    const collection = this.db.collection<RankingDocument>(path);

    const document = collection.doc<RankingDocument>(rankingId);

    //

    const excluiRankingsParticicacoesResult = this.excluiRankingsParticicacoesPorRanking(rankingId);

    //

    const result = document.delete();

    //

    const allResult = Promise.all([result, excluiRankingsParticicacoesResult]).then((results) => {
      this.log.debug('excluiRanking: ' + results);
    });

    return allResult;
  }

  // Rankings - Participações.

  obtemRankingParticipacoes(participante: Monstro): Observable<RankingParticipacaoDocument[]> {
    const monstroRef = this.monstrosFirebaseService.ref(participante.id);

    const path = `${this.path()}-${this.METANAME_PARTICIPACOES}`;

    const collection = this.db.collection<RankingParticipacaoDocument>(path, reference => {
      return reference
        .where('participanteId', '==', monstroRef);
      // .where('ehProprietario', '==', false);
      // .orderBy('data', 'desc');
    });

    const participacoes$ = collection.valueChanges();

    return participacoes$;
  }

  addRankingsParticipacoes(ranking: Ranking): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const rankingRef = this.ref(ranking.id);

      const participanteResults = ranking.participantes.map(participacao => {
        const rankingParticipacaoId = this.db.createId();

        const participanteRef = this.monstrosFirebaseService.ref(participacao.participante.id);

        // const ehProprietario = (participacao.participante === ranking.proprietario);

        const doc: RankingParticipacaoDocument = {
          id: rankingParticipacaoId,
          participanteId: participanteRef,
          rankingId: rankingRef,
          // ehProprietario: ehProprietario
        };

        const result = this.addRankingParticipacao(doc);

        return result;
      });

      const allResult = Promise.all(participanteResults).then((results) => {
        this.log.debug('addRankingsParticipacoes: ' + results);
      });

      resolve(allResult);
    });
  }

  private updateRankingsParticipacoes(ranking: Ranking): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const rankingRef = this.ref(ranking.id);

      const path = `${this.path()}-${this.METANAME_PARTICIPACOES}`;

      const collection = this.db.collection<RankingParticipacaoDocument>(path, reference => {
        return reference
          .where('rankingId', '==', rankingRef);
      });

      collection.valueChanges().pipe(
        first()
      ).subscribe(values => {
        const participantesAindaNaoCadastrados = _.differenceBy(ranking.participantes, values, 'participanteId');

        const participantesAindaNaoCadastradosResult = participantesAindaNaoCadastrados.map(participanteAindaNaoCadastrado => {
          const rankingParticipacaoId = this.db.createId();

          const participanteRef = this.monstrosFirebaseService.ref(participanteAindaNaoCadastrado.participante.id);

          // const ehProprietario = (participanteAindaNaoCadastrado.participante === ranking.proprietario);

          const doc: RankingParticipacaoDocument = {
            id: rankingParticipacaoId,
            participanteId: participanteRef,
            rankingId: rankingRef,
            // ehProprietario: ehProprietario
          };

          const result = this.addRankingParticipacao(doc);

          return result;
        });

        const participantesRemovidos = _.differenceBy(values, ranking.participantes, 'participanteId');

        const participantesRemovidosResult = participantesRemovidos.map(participanteRemovido => {
          const document = collection.doc<RankingParticipacaoDocument>(participanteRemovido.id);

          const result = document.delete();

          return result;
        });

        const bothResults = [participantesAindaNaoCadastradosResult, participantesRemovidosResult];

        const allResult = Promise.all(bothResults).then((results) => {
          this.log.debug('updateRankingsParticipacoes: ' + results);
        });

        resolve(allResult);
      });
    });
  }

  addRankingParticipacao(rankingParticipacaoDoc: RankingParticipacaoDocument): Promise<void> {
    const path = `${this.path()}-${this.METANAME_PARTICIPACOES}`;

    const collection = this.db.collection<RankingParticipacaoDocument>(path);

    const document = collection.doc<RankingParticipacaoDocument>(rankingParticipacaoDoc.id);

    const result = document.set(rankingParticipacaoDoc);

    return result;
  }

  excluiRankingsParticicacoesPorRanking(rankingId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const rankingRef = this.ref(rankingId);

      const path = `${this.path()}-${this.METANAME_PARTICIPACOES}`;

      const collection = this.db.collection<RankingParticipacaoDocument>(path, reference => {
        return reference
          .where('rankingId', '==', rankingRef);
      });

      collection.valueChanges().pipe(
        first()
      ).subscribe(values => {
        const deleteResults = values.map(doc => {
          const document = collection.doc<RankingParticipacaoDocument>(doc.id);

          const result = document.delete();

          return result;
        });

        const allResult = Promise.all(deleteResults).then((results) => {
          this.log.debug('excluiRankingsParticicacoesPorRanking: ' + results);
        });

        resolve(allResult);
      });
    });
  }

  excluiRankingsParticicacoesPorParticipante(participanteId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const monstroRef = this.monstrosFirebaseService.ref(participanteId);

      const path = `${this.path()}-${this.METANAME_PARTICIPACOES}`;

      const collection = this.db.collection<RankingParticipacaoDocument>(path, reference => {
        return reference
          .where('participanteId', '==', monstroRef);
      });

      collection.valueChanges().pipe(
        first()
      ).subscribe(values => {
        const deleteResults = values.map(doc => {
          const document = collection.doc<RankingParticipacaoDocument>(doc.id);

          const result = document.delete();

          return result;
        });

        const allResult = Promise.all(deleteResults).then((results) => {
          this.log.debug('excluiRankingsParticicacoesPorParticipante: ' + results);
        });

        resolve(allResult);
      });
    });
  }
}

interface RankingDocument {
  id: string;
  nome: string;
  monstroRef: firebase.firestore.DocumentReference;
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

interface RankingParticipacaoDocument {
  id: string;
  participanteId: firebase.firestore.DocumentReference;
  rankingId: firebase.firestore.DocumentReference;
  // ehProprietario: boolean;
}
