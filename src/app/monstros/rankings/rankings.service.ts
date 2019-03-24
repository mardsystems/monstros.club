import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import * as _ from 'lodash';
import { combineLatest, merge, Observable, empty, EMPTY, forkJoin, of } from 'rxjs';
import { first, map, mergeMap, switchMap, toArray, tap, shareReplay, catchError } from 'rxjs/operators';
import { LogService } from 'src/app/app-common.services';
import { TipoDeBalanca } from '../medidas/medidas.domain-model';
import { Monstro } from '../monstros.domain-model';
import { MonstrosService } from '../monstros.service';
import {
  ICadastroDeRanking,
  SolicitacaoDeCadastroDeRanking,
  SolicitacaoDeParticipacaoDeRanking
} from './cadastro/cadastro.application-model';
import { Participacao, Ranking } from './rankings.domain-model';
import { PosicaoDeMedida } from './rankings.application-model';
import { MedidasService } from '../medidas/medidas.service';
import { CONST_TIMESTAMP_FALSO } from 'src/app/app-common.domain-model';

@Injectable({
  providedIn: 'root'
})
export class RankingsService
  implements ICadastroDeRanking {
  PATH = '/rankings';
  PATH_PARTICIPACOES = this.PATH + '-participacoes';

  constructor(
    private db: AngularFirestore,
    private monstrosService: MonstrosService,
    private medidasService: MedidasService,
    private log: LogService
  ) { }

  ref(id: string): DocumentReference {
    const collection = this.db.collection<RankingDocument>(this.PATH);

    const document = collection.doc<RankingDocument>(id);

    return document.ref;
  }

  obtemRankingsObservaveisParaExibicao(monstro: Monstro): Observable<Ranking[]> {
    const rankingsProprietarios$ = this.obtemRankingsObservaveisParaExibicaoPorProprietario(monstro);

    const rankingsPorParticipantes$ = this.obtemRankingsObservaveisPorParticipante(monstro);

    // const rankings$ = forkJoin(rankingsProprietarios$, rankingsPorParticipantes$).pipe(
    //   first(),
    //   tap((value) => this.log.debug('obtemRankingsObservaveisParaExibicao', value)),
    //   switchMap(arrayDeArray => {
    //     const x = combineLatest(arrayDeArray);

    //     return x;
    //   })
    // );

    // const rankings$ = merge(...[rankingsProprietarios$]).pipe(
    //   first(),
    //   tap((value) => this.log.debug('obtemRankingsObservaveisParaExibicao', value)),
    //   mergeMap(flat => flat),
    //   toArray(),
    //   catchError((error, source$) => {
    //     this.log.debug('obtemRankingsObservaveisParaExibicao: error: ', error);

    //     return source$;
    //   })
    // );

    const rankings$ = merge(rankingsProprietarios$, rankingsPorParticipantes$).pipe(
      // first(),
      tap((value) => this.log.debug('obtemRankingsObservaveisParaExibicao', value)),
      // mergeMap(flat => flat),
      // toArray()
      // shareReplay()
    );

    // const rankings$ = rankingsProprietarios$;

    // const rankings$ = rankingsPorParticipantes$;

    return rankings$;
  }

  obtemRankingsObservaveisParaExibicaoPorProprietario(proprietario: Monstro): Observable<Ranking[]> {
    const monstroRef = this.monstrosService.ref(proprietario.id);

    const collection = this.db.collection<RankingDocument>(this.PATH, reference => {
      return reference
        .where('monstroRef', '==', monstroRef);
      // .orderBy('data', 'desc');
    });

    const rankings$ = collection.valueChanges().pipe(
      // first(),
      tap((value) => this.log.debug('obtemRankingsObservaveisParaExibicaoPorProprietario', value)),
      switchMap(values => this.mapRankingsObservaveis(proprietario, values)),
      // shareReplay()
    );

    return rankings$;
  }

  private mapRankingsObservaveis(proprietario: Monstro, values: RankingDocument[]): Observable<Ranking[]> {
    this.log.debug('mapRankingsObservaveis', values);

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

    const rankings$ = this.mapParticipacoesObservaveis(value).pipe(
      // first(),
      map(participantes => this.mapRanking(value, proprietario, participantes)),
      shareReplay()
    );

    return rankings$;
  }

  private mapParticipacoesObservaveis(value: RankingDocument): Observable<Participacao[]> {
    const participacoes$Array = value.participantes.map(participacaoValue => {
      const monstro$ = this.monstrosService.obtemMonstroObservavel(participacaoValue.participanteId.id).pipe(
        // first(),
        // tap((value2) => this.log.debug('mapParticipacoesObservaveis', value2)),
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

  obtemRankingsObservaveisPorParticipante(participante: Monstro): Observable<Ranking[]> {
    const rankingsPorParticipante$ = this.obtemRankingParticipacoes(participante).pipe(
      // first(),
      tap((value) => this.log.debug('obtemRankingsObservaveisPorParticipante', value)),
      switchMap(rankingsParticipacoes => {
        const rankings$Array = rankingsParticipacoes.map(rankingParticipacao => {
          return this.obtemRankingObservavel(rankingParticipacao.rankingId.id);
        });

        const ranking$ = combineLatest(rankings$Array).pipe(
          // first(),
          tap((value) => this.log.debug('obtemRankingsObservaveisPorParticipante: combined', value)),
          catchError((error, source$) => {
            this.log.debug('obtemRankingsObservaveisPorParticipante: error: ', error);

            return source$;
          })
        );

        return ranking$;
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
    const collection = this.db.collection<RankingDocument>(this.PATH);

    this.log.debug('obtemRankingObservavel: id: ', id);

    const document = collection.doc<RankingDocument>(id);

    const ranking$ = document.valueChanges().pipe(
      // first(),
      tap((value) => this.log.debug('obtemRankingObservavel: value: ', value)),
      switchMap(value => {
        const rankingComProprietario$ = this.monstrosService.obtemMonstroObservavel(value.monstroRef.id).pipe(
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

  obtemPosicoesDeMedidasObservaveisParaExibicaoPorRanking(ranking: Ranking): Observable<PosicaoDeMedida[]> {
    const participantes = ranking.participantes.map(participacao => participacao.participante);

    const melhoresMedidasPorParticipante$Array = participantes.map(participante => {
      const ultimaMedida$ = this.medidasService.obtemUltimaMedidaObservavel(participante).pipe(
        map(ultimaMedida => PosicaoDeMedida.fromMedida(ultimaMedida, true))
      );

      const menorMedidaDeGordura$ = this.medidasService.obtemMenorMedidaDeGorduraObservavel(participante).pipe(
        map(menorMedidaDeGordura => PosicaoDeMedida.fromMedida(menorMedidaDeGordura, false, true))
      );

      const maiorMedidaDeMusculo$ = this.medidasService.obtemMaiorMedidaDeMusculoObservavel(participante).pipe(
        map(maiorMedidaDeMusculo => PosicaoDeMedida.fromMedida(maiorMedidaDeMusculo, false, false, true))
      );

      const menorMedidaDeIndiceDeMassaCorporal$ = this.medidasService.obtemMenorMedidaDeIndiceDeMassaCorporalObservavel(participante).pipe(
        map(menorMedidaDeIndiceDeMassaCorporal => PosicaoDeMedida.fromMedida(menorMedidaDeIndiceDeMassaCorporal, false, false, false, true))
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

  obtemPosicoesDeMedidasObservaveisParaExibicaoPorRankingGeral(ranking: Ranking): Observable<PosicaoDeMedida[]> {
    // let mergeCount = 0;

    const participantes = ranking.participantes.map(participacao => participacao.participante);

    const melhoresMedidasPorParticipante$Array = participantes.map(participante => {
      const ultimaMedida$ = this.medidasService.obtemUltimaMedidaObservavel(participante);

      const menorMedidaDeGordura$ = this.medidasService.obtemMenorMedidaDeGorduraObservavel(participante);

      const maiorMedidaDeMusculo$ = this.medidasService.obtemMaiorMedidaDeMusculoObservavel(participante);

      const menorMedidaDeIndiceDeMassaCorporal$ = this.medidasService.obtemMenorMedidaDeIndiceDeMassaCorporalObservavel(participante);

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
      this.monstrosService.obtemMonstroObservavel(solicitacao.proprietarioId).pipe(
        first(),
        tap((value) => this.log.debug('cadastraRanking: value: ', value)),
      ).subscribe(monstro => {
        const rankingId = this.db.createId();

        const ranking = new Ranking(
          rankingId,
          solicitacao.nome,
          monstro,
          solicitacao.proprietarioId,
          solicitacao.feitoCom as TipoDeBalanca
        );

        const result = this.add(ranking);

        return resolve(result);
      });
    });
  }

  private add(ranking: Ranking): Promise<void> {
    const collection = this.db.collection<RankingDocument>(this.PATH);

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

  atualizaRanking(rankingId: string, solicitacao: SolicitacaoDeCadastroDeRanking): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.obtemRankingObservavel(rankingId).pipe(
        first()
      ).subscribe(ranking => {
        ranking.defineNome(solicitacao.nome);

        const result = this.update(ranking);

        resolve(result);
      });
    });
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
        this.monstrosService.obtemMonstroObservavel(solicitacao.participanteId).pipe(
          first()
        ).subscribe(monstro => {
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
        this.monstrosService.obtemMonstroObservavel(participanteId).pipe(
          first()
        ).subscribe(monstro => {
          const participante = monstro; // solicitacao.participanteId;

          const agora = new Date(Date.now());

          ranking.removeParticipante(participante.id);

          const result = this.update(ranking);

          resolve(result);
        });
      });
    });
  }

  private update(ranking: Ranking): Promise<void> {
    const collection = this.db.collection<RankingDocument>(this.PATH);

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
    const monstroRef = this.monstrosService.ref(ranking.proprietarioId);

    const doc: RankingDocument = {
      id: ranking.id,
      nome: ranking.nome,
      // monstroId: `monstros/${ranking.monstro.id}`,
      // monstroId: `monstros/${ranking.proprietarioId}`,
      monstroRef: monstroRef,
      dataDeCriacao: firebase.firestore.Timestamp.fromDate(ranking.dataDeCriacao),
      feitoCom: ranking.feitoCom,
      participantes: ranking.participantes.map(participacao => {
        const participanteRef = this.monstrosService.ref(participacao.participante.id);

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

  excluiRanking(rankingId: string): Promise<void> {
    const collection = this.db.collection<RankingDocument>(this.PATH);

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
    const monstroRef = this.monstrosService.ref(participante.id);

    const collection = this.db.collection<RankingParticipacaoDocument>(this.PATH_PARTICIPACOES, reference => {
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

        const participanteRef = this.monstrosService.ref(participacao.participante.id);

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

      const collection = this.db.collection<RankingParticipacaoDocument>(this.PATH_PARTICIPACOES, reference => {
        return reference
          .where('rankingId', '==', rankingRef);
      });

      collection.valueChanges().pipe(
        first()
      ).subscribe(values => {
        const participantesAindaNaoCadastrados = _.differenceBy(ranking.participantes, values, 'participanteId');

        const participantesAindaNaoCadastradosResult = participantesAindaNaoCadastrados.map(participanteAindaNaoCadastrado => {
          const rankingParticipacaoId = this.db.createId();

          const participanteRef = this.monstrosService.ref(participanteAindaNaoCadastrado.participante.id);

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
    const collection = this.db.collection<RankingParticipacaoDocument>(this.PATH_PARTICIPACOES);

    const document = collection.doc<RankingParticipacaoDocument>(rankingParticipacaoDoc.id);

    const result = document.set(rankingParticipacaoDoc);

    return result;
  }

  excluiRankingsParticicacoesPorRanking(rankingId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const rankingRef = this.ref(rankingId);

      const collection = this.db.collection<RankingParticipacaoDocument>(this.PATH_PARTICIPACOES, reference => {
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
      const monstroRef = this.monstrosService.ref(participanteId);

      const collection = this.db.collection<RankingParticipacaoDocument>(this.PATH_PARTICIPACOES, reference => {
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
