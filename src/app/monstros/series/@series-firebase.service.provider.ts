import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError, first, map, switchMap } from 'rxjs/operators';
import { MonstrosDbContext } from 'src/app/@app-firebase.service';
import { ExerciciosFirebaseService } from 'src/app/cadastro/exercicios/@exercicios-firebase.service';
import { MonstrosFirebaseService } from 'src/app/cadastro/monstros/@monstros-firebase.service';
import { ConsultaDeSeries } from './@series-application.model';
import { RepositorioDeSeries, Serie } from './@series-domain.model';
import { SeriesFirebaseService } from './@series-firebase.service';

const seriesFirebaseServiceFactory = async (
  db: MonstrosDbContext,
  monstrosFirebaseService: MonstrosFirebaseService,
  exerciciosFirebaseService: ExerciciosFirebaseService,
  route: ActivatedRoute,
) => {
  const monstro$ = route.paramMap.pipe(
    first(),
    map(params => params.get('monstroId')),
    switchMap(monstroId => monstrosFirebaseService.obtemMonstroObservavel(monstroId)),
    catchError((error, source$) => {
      console.log(`Não foi possível montar as séries do monstro.\nRazão:\n${error}`);

      return EMPTY; // source$;
    }),
  );

  const monstro = await monstro$.toPromise();

  return new SeriesFirebaseService(
    db,
    monstrosFirebaseService,
    exerciciosFirebaseService,
    // monstro
  );
};

export class SeriesFirebaseServiceProvider
  implements RepositorioDeSeries, ConsultaDeSeries {

  constructor(readonly seriesFirebaseService: SeriesFirebaseService) {

  }

  createId(): string {
    return this.seriesFirebaseService.createId();
  }

  add(monstroId: string, serie: Serie): Promise<void> {
    return this.seriesFirebaseService.add(monstroId, serie);
  }

  update(monstroId: string, serie: Serie): Promise<void> {
    return this.seriesFirebaseService.add(monstroId, serie);
  }

  remove(monstroId: string, serie: Serie): Promise<void> {
    return this.seriesFirebaseService.add(monstroId, serie);
  }

  obtemSerie(monstroId: string, id: string): Promise<Serie> {
    return this.seriesFirebaseService.obtemSerie(monstroId, id);
  }

  obtemSerieObservavel(monstroId: string, id: string): Observable<Serie> {
    return this.seriesFirebaseService.obtemSerieObservavel(monstroId, id);
  }

  obtemSeriesParaExibicao(monstroId: string): Observable<Serie[]> {
    return this.seriesFirebaseService.obtemSeriesParaExibicao(monstroId);
  }
}

export let seriesFirebaseServiceProvider = {
  provide: SeriesFirebaseService,
  useFactory: seriesFirebaseServiceFactory,
  deps: [
    MonstrosDbContext,
    MonstrosFirebaseService,
    ExerciciosFirebaseService,
    ActivatedRoute,
  ]
};
