import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { combineLatest, Observable, of } from 'rxjs';
import { first, map, shareReplay, switchMap } from 'rxjs/operators';
import { CONST_TIMESTAMP_FALSO, Tempo } from 'src/app/app-common.domain-model';
import { LogService } from 'src/app/app-common.services';
import { ExerciciosService } from 'src/app/cadastro/exercicios/exercicios.service';
import { Monstro } from '../monstros.domain-model';
import { MonstrosService } from '../monstros.service';
import { SolicitacaoDeCadastroDeExercicio, SolicitacaoDeCadastroDeSerie } from './cadastro/cadastro.application-model';
import { Serie, SerieDeExercicio, ExecucaoDeSerie, ExecucaoDeExercicio } from './series.domain-model';
import { Academia } from 'src/app/cadastro/academias/academias.domain-model';
import { AparelhosService } from 'src/app/cadastro/aparelhos/aparelhos.service';
import { AcademiasService } from 'src/app/cadastro/academias/academias.service';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  PATH = '/series';
  PATH_EXECUCOES = '/execucoes';

  constructor(
    private db: AngularFirestore,
    private monstrosService: MonstrosService,
    private academiasService: AcademiasService,
    private exerciciosService: ExerciciosService,
    private aparelhosService: AparelhosService,
    private log: LogService
  ) { }

  obtemSeriesObservaveisParaExibicao_(monstro: Monstro): Observable<Serie[]> {
    const path = `${this.monstrosService.PATH}/${monstro.id}${this.PATH}`;

    const collection = this.db.collection<SerieDocument>(path, reference => {
      return reference
        // .where('monstroId', '==', `monstros/${monstro.id}`)
        .orderBy('nome', 'asc');
    });

    const series$ = collection.valueChanges().pipe(
      switchMap(values => this.mapSeriesObservaveis_(values)),
      // map(values => {
      //   return values.map((value, index) => {
      //     return this.mapSerie(value, null);
      //   });
      // })
    );

    return series$;
  }

  private mapSeriesObservaveis_(values: SerieDocument[]): Observable<Serie[]> {
    const series$Array = values.map(value => this.mapSerieObservavel_(value));

    if (values.length === 0) {
      return of([]);
    } else {
      return combineLatest(series$Array);
    }
  }

  private mapSerieObservavel_(value: SerieDocument): Observable<Serie> {
    const series$ = this.mapSerieDeExerciciosObservaveis_(value).pipe(
      map(exercicios => this.mapSerie(value, exercicios)),
      shareReplay()
    );

    return series$;
  }

  private mapSerieDeExerciciosObservaveis_(value: SerieDocument): Observable<SerieDeExercicio[]> {
    const serieDeExercicios$Array = value.exercicios.map(serieDeExercicioValue => {
      const exercicio$ = this.exerciciosService.obtemExercicioObservavel(serieDeExercicioValue.exercicioRef.id).pipe(
        map(exercicio => {
          const serieDeExercicio = new SerieDeExercicio(
            serieDeExercicioValue.id,
            serieDeExercicioValue.sequencia,
            exercicio,
            serieDeExercicioValue.quantidade,
            serieDeExercicioValue.repeticoes,
            serieDeExercicioValue.carga,
            serieDeExercicioValue.nota
          );

          return serieDeExercicio;
        }),
        shareReplay()
      );

      return exercicio$;
    });

    const serieDeExercicios$ = combineLatest(serieDeExercicios$Array);

    return serieDeExercicios$;
  }

  obtemSerieObservavel_(monstroId: string, id: string): Observable<Serie> {
    const path = `${this.monstrosService.PATH}/${monstroId}${this.PATH}`;

    const collection = this.db.collection<SerieDocument>(path);

    const document = collection.doc<SerieDocument>(id);

    const serie$ = document.valueChanges().pipe(
      // first(),
      switchMap(value => this.mapSerieObservavel_(value)),
      shareReplay()
    );

    return serie$;
  }

  obtemSeriesObservaveisParaExibicao(monstro: Monstro): Observable<Serie[]> {
    const path = `${this.monstrosService.PATH}/${monstro.id}${this.PATH}`;

    const collection = this.db.collection<SerieDocument>(path, reference => {
      return reference
        .orderBy('nome', 'asc');
    });

    return collection.valueChanges().pipe(
      switchMap(values => {
        let series$: Observable<Serie[]>;

        if (values.length === 0) {
          series$ = of([]);
        } else {
          series$ = combineLatest(values.map(value => this.mapSerieObservavel(value)));
        }

        return series$;
      })
    );
  }

  obtemSerieObservavel(monstroId: string, id: string): Observable<Serie> {
    const path = `${this.monstrosService.PATH}/${monstroId}${this.PATH}`;

    const collection = this.db.collection<SerieDocument>(path);

    const document = collection.doc<SerieDocument>(id);

    const serie$ = document.valueChanges().pipe(
      switchMap(value => this.mapSerieObservavel(value))
    );

    return serie$;
  }

  private mapSerieObservavel(value: SerieDocument): Observable<Serie> {
    let exercicios$: Observable<SerieDeExercicio[]>;

    if (value.exercicios.length === 0) {
      exercicios$ = of([]);
    } else {
      exercicios$ = combineLatest(
        value.exercicios.map(serieDeExercicioValue => {
          const exercicio$ = this.exerciciosService.obtemExercicioObservavel(serieDeExercicioValue.exercicioRef.id).pipe(
            map(exercicio => {
              const serieDeExercicio = new SerieDeExercicio(
                serieDeExercicioValue.id,
                serieDeExercicioValue.sequencia,
                exercicio,
                serieDeExercicioValue.quantidade,
                serieDeExercicioValue.repeticoes,
                serieDeExercicioValue.carga,
                serieDeExercicioValue.nota
              );

              return serieDeExercicio;
            }),
            shareReplay()
          );

          return exercicio$;
        })
      );
    }

    return exercicios$.pipe(
      map(exercicios => this.mapSerie(value, exercicios))
    );
  }

  private mapSerie(value: SerieDocument, exercicios: SerieDeExercicio[]): Serie {
    return new Serie(
      value.id,
      value.nome,
      value.cor,
      value.ativa,
      value.data.toDate(),
      CONST_TIMESTAMP_FALSO,
      exercicios
    );
  }

  importaSeries() {
    const idAntigo = 'monstros/FCmLKJPLf4ejTazweTCP';

    const collection = this.db.collection<SerieDocument>(this.PATH, reference =>
      reference
        .where('monstroId', '==', idAntigo)
        .orderBy('data', 'desc')
    );

    collection.valueChanges().subscribe(series => {
      series.forEach(serie => {
        // serie.monstroId = 'monstros/2MvVXS8931bRukYSnGCJZo98BrH3';

        const document = collection.doc<SerieDocument>(serie.id);

        document.update(serie);
      });
    });
  }

  cadastraSerie(solicitacao: SolicitacaoDeCadastroDeSerie): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const serieId = this.db.createId();

      const serie = new Serie(
        serieId,
        solicitacao.nome,
        solicitacao.cor,
        solicitacao.ativa,
        solicitacao.data.toDate(),
      );

      const result = this.add(solicitacao.monstroId, serie);

      resolve(result);
    });
  }

  private add(monstroId: string, serie: Serie): Promise<void> {
    const path = `${this.monstrosService.PATH}/${monstroId}${this.PATH}`;

    const collection = this.db.collection<SerieDocument>(path);

    const document = collection.doc<SerieDocument>(serie.id);

    const doc = this.mapTo(serie);

    const result = document.set(doc);

    return result;
  }

  atualizaSerie(serieId: string, solicitacao: SolicitacaoDeCadastroDeSerie): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.obtemSerieObservavel(solicitacao.monstroId, serieId).pipe(first()).subscribe(serie => {
        serie.corrigeNome(solicitacao.nome);

        serie.ajustaCor(solicitacao.cor);

        if (serie.ativa && !solicitacao.ativa) {
          serie.desativa();
        }

        if (!serie.ativa && solicitacao.ativa) {
          serie.reativa();
        }

        serie.corrigeData(solicitacao.data.toDate());

        const result = this.update(solicitacao.monstroId, serie);

        resolve(result);
      });
    });
  }

  adicionaExercicio(solicitacao: SolicitacaoDeCadastroDeExercicio): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.obtemSerieObservavel(solicitacao.monstroId, solicitacao.serieId).pipe(
        first()
      ).subscribe(serie => {
        this.exerciciosService.obtemExercicioObservavel(solicitacao.exercicioId).pipe(
          first()
        ).subscribe(exercicio => {
          serie.adicionaExercicio(exercicio, solicitacao.quantidade, solicitacao.repeticoes, solicitacao.carga, solicitacao.nota);

          const result = this.update(solicitacao.monstroId, serie);

          resolve(result);
        });
      });
    });
  }

  atualizaExercicio(serieDeExercicioId: number, solicitacao: SolicitacaoDeCadastroDeExercicio): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.obtemSerieObservavel(solicitacao.monstroId, solicitacao.serieId).pipe(
        first()
      ).subscribe(serie => {
        const serieDeExercicio = serie.obtemSerieDeExercicio(serieDeExercicioId);

        serieDeExercicio.alteraSequencia(solicitacao.sequencia);

        // serieDeExercicio.acertaExercicio(solicitacao.exercicio);

        serieDeExercicio.corrigeQuantidade(solicitacao.quantidade);

        serieDeExercicio.ajustaRepeticoes(solicitacao.repeticoes);

        serieDeExercicio.ajustaCarga(solicitacao.carga);

        serieDeExercicio.atualizaNota(solicitacao.nota);

        const result = this.update(solicitacao.monstroId, serie);

        resolve(result);
      });
    });
  }

  removeExercicio(monstroId: string, serieId: string, serieDeExercicioId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.obtemSerieObservavel(monstroId, serieId).pipe(
        first()
      ).subscribe(serie => {
        serie.removeSerieDeExercicio(serieDeExercicioId);

        const result = this.update(monstroId, serie);

        resolve(result);
      });
    });
  }

  private update(monstroId: string, serie: Serie): Promise<void> {
    const path = `${this.monstrosService.PATH}/${monstroId}${this.PATH}`;

    const collection = this.db.collection<SerieDocument>(path);

    const document = collection.doc<SerieDocument>(serie.id);

    const doc = this.mapTo(serie);

    const result = document.update(doc);

    return result;
  }

  private mapTo(serie: Serie): SerieDocument {
    const doc: SerieDocument = {
      id: serie.id,
      nome: serie.nome,
      cor: serie.cor,
      ativa: serie.ativa,
      data: firebase.firestore.Timestamp.fromDate(serie.data),
      exercicios: serie.exercicios.map(serieDeExercicio => {
        const exercicioRef = this.exerciciosService.ref(serieDeExercicio.exercicio.id);

        const serieDeExercicioDocument: SerieDeExercicioDocument = {
          id: serieDeExercicio.id,
          sequencia: serieDeExercicio.sequencia,
          exercicioRef: exercicioRef,
          quantidade: serieDeExercicio.quantidade,
          repeticoes: serieDeExercicio.repeticoes,
          carga: serieDeExercicio.carga,
          nota: serieDeExercicio.nota
        };

        return serieDeExercicioDocument;
      })
    };

    return doc;
  }

  excluiSerie(monstroId: string, serieId: string): Promise<void> {
    const path = `${this.monstrosService.PATH}/${monstroId}${this.PATH}`;

    const collection = this.db.collection<SerieDocument>(path);

    const document = collection.doc<SerieDocument>(serieId);

    const result = document.delete();

    return result;
  }

  // Execução de Série.

  obtemExecucoesDeSerieObservaveisParaExibicao(monstroId: string, serie: Serie): Observable<ExecucaoDeSerie[]> {
    const path = `${this.monstrosService.PATH}/${monstroId}${this.PATH}/${serie.id}${this.PATH_EXECUCOES}`;

    const collection = this.db.collection<ExecucaoDeSerieDocument>(path, reference => {
      return reference
        .orderBy('nome', 'asc');
    });

    return collection.valueChanges().pipe(
      switchMap(values => {
        let series$: Observable<ExecucaoDeSerie[]>;

        if (values.length === 0) {
          series$ = of([]);
        } else {
          series$ = combineLatest(values.map(value => this.mapExecucaoDeSerieObservavel(value, serie)));
        }

        return series$;
      })
    );
  }

  private mapExecucaoDeSerieObservavel(value: ExecucaoDeSerieDocument, serie: Serie): Observable<ExecucaoDeSerie> {
    let exercicios$: Observable<ExecucaoDeExercicio[]>;

    if (value.exercicios.length === 0) {
      exercicios$ = of([]);
    } else {
      exercicios$ = combineLatest(
        value.exercicios.map(execucaoDeExercicioValue => {
          const exercicio$ = this.aparelhosService.obtemAparelhoObservavel(execucaoDeExercicioValue.feitoCom.id).pipe(
            map(aparelho => {
              const referencia = serie.obtemSerieDeExercicio(execucaoDeExercicioValue.id);

              const execucaoDeExercicio = new ExecucaoDeExercicio(
                execucaoDeExercicioValue.id,
                execucaoDeExercicioValue.sequencia,
                referencia,
                execucaoDeExercicioValue.repeticoes,
                execucaoDeExercicioValue.carga,
                execucaoDeExercicioValue.nota,
                aparelho,
                execucaoDeExercicioValue.duracao
              );

              return execucaoDeExercicio;
            }),
            shareReplay()
          );

          return exercicio$;
        })
      );
    }

    return exercicios$.pipe(
      map(exercicios => this.mapExecucaoDeSerie(value, serie, null, exercicios))
    );
  }

  private mapExecucaoDeSerie(
    value: ExecucaoDeSerieDocument,
    serie: Serie,
    feitaNa: Academia,
    exercicios: ExecucaoDeExercicio[]
  ): ExecucaoDeSerie {
    return new ExecucaoDeSerie(
      value.id,
      serie,
      value.dia.toDate(),
      value.numero,
      feitaNa,
      CONST_TIMESTAMP_FALSO,
      exercicios
    );
  }
}

interface SerieDocument {
  id: string;
  nome: string;
  cor: string;
  ativa: boolean;
  data: firebase.firestore.Timestamp;
  exercicios: SerieDeExercicioDocument[];
}

interface SerieDeExercicioDocument {
  id: number;
  sequencia: number;
  exercicioRef: firebase.firestore.DocumentReference;
  quantidade: number;
  repeticoes: number;
  carga: number;
  nota: string;
}

interface ExecucaoDeSerieDocument {
  id: string;
  serieRef: firebase.firestore.DocumentReference;
  dia: firebase.firestore.Timestamp;
  numero: number;
  feitaNa?: firebase.firestore.DocumentReference;
  exercicios: ExecucaoDeExercicioDocument[];
}

interface ExecucaoDeExercicioDocument {
  id: number;
  sequencia: number;
  ref: firebase.firestore.DocumentReference;
  repeticoes: number;
  carga: number;
  nota: string;
  feitoCom?: firebase.firestore.DocumentReference;
  duracao: Tempo;
}
