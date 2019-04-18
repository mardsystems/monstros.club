import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { combineLatest, Observable, of } from 'rxjs';
import { first, map, shareReplay, switchMap } from 'rxjs/operators';
import { CONST_TIMESTAMP_FALSO } from 'src/app/@app-domain.model';
import { FirebaseService, MonstrosDbContext } from 'src/app/@app-firebase.model';
import { ExerciciosFirebaseService } from 'src/app/cadastro/exercicios/@exercicios-firebase.service';
import { Monstro } from 'src/app/cadastro/monstros/@monstros-domain.model';
import { MonstrosFirebaseService } from 'src/app/cadastro/monstros/@monstros-firebase.service';
import { RepositorioDeSeries, Serie, SerieDeExercicio } from './@series-domain.model';

@Injectable({
  providedIn: 'root'
})
export class SeriesFirebaseService
  extends FirebaseService<SerieDocument>
  implements RepositorioDeSeries {

  constructor(
    protected readonly db: MonstrosDbContext,
    protected readonly monstrosFirebaseService: MonstrosFirebaseService,
    protected readonly exerciciosFirebaseService: ExerciciosFirebaseService,
  ) {
    super(db);
  }

  path(): string {
    throw new Error('path: Method not implemented.');
  }

  // path(monstroId: string): string {
  //   const path = `${this.monstrosFirebaseService.path()}/${monstroId}/${this.METANAME}`;

  //   return path;
  // }

  async add(monstroId: string, serie: Serie): Promise<void> {
    try {
      const path = this.path(); // monstroId

      const collection = this.db.firebase.collection<SerieDocument>(path);

      const document = collection.doc<SerieDocument>(serie.id);

      const doc = this.mapTo(serie);

      await document.set(doc);
    } catch (e) {
      throw e;
    }
  }

  async update(monstroId: string, serie: Serie): Promise<void> {
    try {
      const path = this.path(); // monstroId

      const collection = this.db.firebase.collection<SerieDocument>(path);

      const document = collection.doc<SerieDocument>(serie.id);

      const doc = this.mapTo(serie);

      await document.update(doc);
    } catch (e) {
      throw e;
    }
  }

  private mapTo(serie: Serie): SerieDocument {
    const doc: SerieDocument = {
      id: serie.id,
      nome: serie.nome,
      cor: serie.cor,
      ativa: serie.ativa,
      data: firebase.firestore.Timestamp.fromDate(serie.data),
      exercicios: serie.exercicios.map(serieDeExercicio => {
        const exercicioRef = this.exerciciosFirebaseService.ref(serieDeExercicio.exercicio.id);

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

  async remove(monstroId: string, serie: Serie): Promise<void> {
    try {
      const path = this.path(); // monstroId

      const collection = this.db.firebase.collection<SerieDocument>(path);

      const document = collection.doc<SerieDocument>(serie.id);

      await document.delete();
    } catch (e) {
      throw e;
    }
  }

  async obtemSerie(monstroId: string, id: string): Promise<Serie> {
    try {
      const path = this.path(); // monstroId

      const collection = this.db.firebase.collection<SerieDocument>(path);

      const document = collection.doc<SerieDocument>(id);

      const serie$ = document.valueChanges().pipe(
        first(),
        switchMap(value => this.mapSerieObservavelInner(value))
      );

      return await serie$.toPromise();
    } catch (e) {
      throw e;
    }
  }

  private async mapSerieObservavelInner(value: SerieDocument): Promise<Serie> {
    const exercicios = await Promise.all(
      value.exercicios.map(async (serieDeExercicioValue) => {
        const exercicio = await this.exerciciosFirebaseService.obtemExercicio(serieDeExercicioValue.exercicioRef.id);

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
      })
    );

    return this.mapSerie(value, exercicios);
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

  // Consultas.

  obtemSerieObservavel(monstroId: string, id: string): Observable<Serie> {
    const path = this.path(); // monstroId

    const collection = this.db.firebase.collection<SerieDocument>(path);

    const document = collection.doc<SerieDocument>(id);

    const serie$ = document.valueChanges().pipe(
      switchMap(value => this.mapSerieObservavel(value))
    );

    return serie$;
  }

  obtemSeriesParaExibicao(monstro: Monstro): Observable<Serie[]> {
    const path = this.path(); // monstro.id

    const collection = this.db.firebase.collection<SerieDocument>(path, reference => {
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

  private mapSerieObservavel(value: SerieDocument): Observable<Serie> {
    let exercicios$: Observable<SerieDeExercicio[]>;

    if (value.exercicios.length === 0) {
      exercicios$ = of([]);
    } else {
      exercicios$ = combineLatest(
        value.exercicios.map(serieDeExercicioValue => {
          const exercicio$ = this.exerciciosFirebaseService.obtemExercicioObservavel(serieDeExercicioValue.exercicioRef.id).pipe(
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

  //

  obtemSeriesParaExibicao_(monstro: Monstro): Observable<Serie[]> {
    const path = this.path(); // monstro.id

    const collection = this.db.firebase.collection<SerieDocument>(path, reference => {
      return reference
        // .where('monstroId', '==', `monstros/${monstro.id}`)
        .orderBy('nome', 'asc');
    });

    const series$ = collection.valueChanges().pipe(
      switchMap(values => this.mapSeries_(values)),
      // map(values => {
      //   return values.map((value, index) => {
      //     return this.mapSerie(value, null);
      //   });
      // })
    );

    return series$;
  }

  private mapSeries_(values: SerieDocument[]): Observable<Serie[]> {
    const series$Array = values.map(value => this.mapSerieObservavel_(value));

    if (values.length === 0) {
      return of([]);
    } else {
      return combineLatest(series$Array);
    }
  }

  private mapSerieObservavel_(value: SerieDocument): Observable<Serie> {
    const series$ = this.mapSerieDeExercicios_(value).pipe(
      map(exercicios => this.mapSerie(value, exercicios)),
      shareReplay()
    );

    return series$;
  }

  private mapSerieDeExercicios_(value: SerieDocument): Observable<SerieDeExercicio[]> {
    const serieDeExercicios$Array = value.exercicios.map(serieDeExercicioValue => {
      const exercicio$ = this.exerciciosFirebaseService.obtemExercicioObservavel(serieDeExercicioValue.exercicioRef.id).pipe(
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
    const path = this.path(); // monstroId

    const collection = this.db.firebase.collection<SerieDocument>(path);

    const document = collection.doc<SerieDocument>(id);

    const serie$ = document.valueChanges().pipe(
      // first(),
      switchMap(value => this.mapSerieObservavel_(value)),
      shareReplay()
    );

    return serie$;
  }

  //

  importaSeries() {
    const idAntigo = 'monstros/FCmLKJPLf4ejTazweTCP';

    const collection = this.db.firebase.collection<SerieDocument>(this.path(), reference =>
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
