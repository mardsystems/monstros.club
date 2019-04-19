import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { MonstrosDbContext } from 'src/app/@app-firebase.service';
import { Academia } from 'src/app/cadastro/academias/@academias-domain.model';
import { AcademiasFirebaseService } from 'src/app/cadastro/academias/@academias-firebase.service';
import { AparelhosFirebaseService } from 'src/app/cadastro/aparelhos/@aparelhos-firebase.service';
import { CONST_TIMESTAMP_FALSO } from 'src/app/common/domain.model';
import { FirebaseService } from 'src/app/common/firebase.service';
import { Serie } from '../@series-domain.model';
import { SeriesFirebaseService } from '../@series-firebase.service';
import { ConsultaDeExecucoesDeSerie } from './@execucoes-application.model';
import { ExecucaoDeExercicio, ExecucaoDeSerie, RepositorioDeExecucoesDeSerie } from './@execucoes-domain.model';

@Injectable()
export class ExecucoesFirebaseService
  extends FirebaseService<ExecucaoDeSerieDocument>
  implements RepositorioDeExecucoesDeSerie, ConsultaDeExecucoesDeSerie {

  constructor(
    protected readonly db: MonstrosDbContext,
    protected readonly seriesFirebaseService: SeriesFirebaseService,
    protected readonly aparelhosFirebaseService: AparelhosFirebaseService,
    protected readonly academiasFirebaseService: AcademiasFirebaseService,
  ) {
    super(db);
  }

  path(): string {
    return this.db.medidasPath();
  }

  // path(monstroId: string, serieId: string): string {
  //   const path = `${this.seriesFirebaseService.path()}/${serieId}/${this.METANAME}`; // monstroId

  //   return path;
  // }

  async add(monstroId: string, serie: Serie, execucao: ExecucaoDeSerie): Promise<void> {
    try {
      const path = this.path(); // monstroId, execucao.serie.id

      const collection = this.db.firebase.collection<ExecucaoDeSerieDocument>(path);

      const document = collection.doc<ExecucaoDeSerieDocument>(execucao.id);

      const doc = this.mapTo(monstroId, execucao);

      await document.set(doc);
    } catch (e) {
      throw e;
    }
  }

  private mapTo(monstroId: string, execucao: ExecucaoDeSerie): ExecucaoDeSerieDocument {
    const serieRef = this.seriesFirebaseService.ref(execucao.serie.id); // monstroId

    const feitaNaAcademiaRef = this.academiasFirebaseService.ref(execucao.feitaNa.id);

    const doc: ExecucaoDeSerieDocument = {
      id: execucao.id,
      serieRef: serieRef,
      dia: firebase.firestore.Timestamp.fromDate(execucao.dia),
      numero: execucao.numero,
      feitaNa: feitaNaAcademiaRef,
      exercicios: execucao.exercicios.map(execucaoDeSerieDeExercicio => {
        const referenciaId = execucaoDeSerieDeExercicio.referencia.id;

        const feitaComAparelhoRef = this.aparelhosFirebaseService.ref(execucaoDeSerieDeExercicio.feitoCom.id);

        const serieDeExercicioDocument: ExecucaoDeExercicioDocument = {
          id: execucaoDeSerieDeExercicio.id,
          sequencia: execucaoDeSerieDeExercicio.sequencia,
          referenciaId: referenciaId,
          repeticoes: execucaoDeSerieDeExercicio.repeticoes,
          carga: execucaoDeSerieDeExercicio.carga,
          nota: execucaoDeSerieDeExercicio.nota,
          feitoCom: feitaComAparelhoRef,
          duracao: null,
        };

        return serieDeExercicioDocument;
      })
    };

    return doc;
  }

  obtemExecucaoDeSerie(monstroId: string, id: string): Promise<ExecucaoDeSerie> {
    throw new Error('Method not implemented.');
  }

  // Consultas.

  obtemExecucoesDeSerieParaExibicao(monstroId: string, serie: Serie): Observable<ExecucaoDeSerie[]> {
    const path = this.path(); // monstroId, serie.id

    const collection = this.db.firebase.collection<ExecucaoDeSerieDocument>(path, reference => {
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
          const exercicio$ = this.aparelhosFirebaseService.obtemAparelhoObservavel(execucaoDeExercicioValue.feitoCom.id).pipe(
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
                null
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
  referenciaId: number;
  repeticoes: number;
  carga: number;
  nota: string;
  feitoCom?: firebase.firestore.DocumentReference;
  duracao: string;
}
