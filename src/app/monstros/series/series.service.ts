import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { combineLatest, Observable, of } from 'rxjs';
import { first, map, shareReplay, switchMap } from 'rxjs/operators';
import { CONST_TIMESTAMP_FALSO } from 'src/app/app-common.domain-model';
import { LogService } from 'src/app/app-common.services';
import { ExerciciosService } from 'src/app/cadastro/exercicios/exercicios.service';
import { Monstro } from '../monstros.domain-model';
import { MonstrosService } from '../monstros.service';
import { SolicitacaoDeCadastroDeExercicio, SolicitacaoDeCadastroDeSerie } from './cadastro/cadastro.application-model';
import { Serie, SerieDeExercicio } from './series.domain-model';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  PATH = '/series';

  constructor(
    private db: AngularFirestore,
    private monstrosService: MonstrosService,
    private exerciciosService: ExerciciosService,
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
      const exercicio$ = this.exerciciosService.obtemExercicioObservavel(serieDeExercicioValue.exercicioId.id).pipe(
        map(exercicio => {
          const serieDeExercicio = new SerieDeExercicio(
            exercicio.id,
            exercicio,
            serieDeExercicioValue.quantidade,
            serieDeExercicioValue.repeticoes,
            serieDeExercicioValue.carga,
            serieDeExercicioValue.assento
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
          const exercicio$ = this.exerciciosService.obtemExercicioObservavel(serieDeExercicioValue.exercicioId.id).pipe(
            map(exercicio => {
              const serieDeExercicio = new SerieDeExercicio(
                exercicio.id,
                exercicio,
                serieDeExercicioValue.quantidade,
                serieDeExercicioValue.repeticoes,
                serieDeExercicioValue.carga,
                serieDeExercicioValue.assento
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

        // serie.corrigeNome(solicitacao.data.toDate());

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
          serie.adicionaExercicio(exercicio, solicitacao.quantidade, solicitacao.repeticoes, solicitacao.carga, solicitacao.assento);

          const result = this.update(solicitacao.monstroId, serie);

          resolve(result);
        });
      });
    });
  }

  atualizaExercicio(serieId: string, solicitacao: SolicitacaoDeCadastroDeExercicio): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.obtemSerieObservavel(solicitacao.monstroId, solicitacao.serieId).pipe(
        first()
      ).subscribe(serie => {
        const serieDeExercicio = serie.obtemExercicio(solicitacao.exercicioId);

        serieDeExercicio.corrigeQuantidade(solicitacao.quantidade);

        const result = this.update(solicitacao.monstroId, serie);

        resolve(result);
      });
    });
  }

  removeExercicio(monstroId: string, serieId: string, exercicioId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.obtemSerieObservavel(monstroId, serieId).pipe(
        first()
      ).subscribe(serie => {
        serie.removeExercicio(exercicioId);

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
          exercicioId: exercicioRef,
          quantidade: serieDeExercicio.quantidade,
          repeticoes: serieDeExercicio.repeticoes,
          carga: serieDeExercicio.carga,
          assento: serieDeExercicio.assento
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
  exercicioId: firebase.firestore.DocumentReference;
  quantidade: number;
  repeticoes: number;
  carga: number;
  assento: string;
}
