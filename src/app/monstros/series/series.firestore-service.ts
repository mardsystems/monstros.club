import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { CONST_TIMESTAMP_FALSO } from 'src/app/app-common.domain-model';
import { ExerciciosService } from 'src/app/cadastro/exercicios/exercicios.service';
import { Monstro } from '../monstros.domain-model';
import { MonstrosFirecloudRepository } from '../monstros.firecloud-repository';
import { IRepositorioDeSeries, Serie, SerieDeExercicio } from './series.domain-model';

@Injectable()
export class SeriesFirestoreService implements IRepositorioDeSeries {
  private METANAME = 'series';

  constructor(
    private db: AngularFirestore,
    private repositorioDeMonstros: MonstrosFirecloudRepository,
    private repositorioDeExercicios: ExerciciosService,
  ) { }

  createId(): string {
    const id = this.db.createId();

    return id;
  }

  path(monstroId: string): string {
    const path = `${this.repositorioDeMonstros.path()}/${monstroId}/${this.METANAME}`;

    return path;
  }

  ref(monstroId: string, id: string): DocumentReference {
    const path = this.path(monstroId);

    const collection = this.db.collection<SerieDocument>(path);

    const document = collection.doc<SerieDocument>(id);

    return document.ref;
  }

  obtemSeriesObservaveisParaExibicao_(monstro: Monstro): Observable<Serie[]> {
    const path = this.path(monstro.id);

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
      const exercicio$ = this.repositorioDeExercicios.obtemExercicioObservavel(serieDeExercicioValue.exercicioRef.id).pipe(
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
    const path = this.path(monstroId);

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
    const path = this.path(monstro.id);

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
    const path = this.path(monstroId);

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
          const exercicio$ = this.repositorioDeExercicios.obtemExercicioObservavel(serieDeExercicioValue.exercicioRef.id).pipe(
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

    const collection = this.db.collection<SerieDocument>(this.path(''), reference =>
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

  add(monstroId: string, serie: Serie): Promise<void> {
    const path = this.path(monstroId);

    const collection = this.db.collection<SerieDocument>(path);

    const document = collection.doc<SerieDocument>(serie.id);

    const doc = this.mapTo(serie);

    const result = document.set(doc);

    return result;
  }

  update(monstroId: string, serie: Serie): Promise<void> {
    const path = this.path(monstroId);

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
        const exercicioRef = this.repositorioDeExercicios.ref(serieDeExercicio.exercicio.id);

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

  remove(monstroId: string, serieId: string): Promise<void> {
    const path = this.path(monstroId);

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
  id: number;
  sequencia: number;
  exercicioRef: firebase.firestore.DocumentReference;
  quantidade: number;
  repeticoes: number;
  carga: number;
  nota: string;
}
