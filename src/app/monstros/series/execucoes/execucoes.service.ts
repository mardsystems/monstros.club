import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { CONST_TIMESTAMP_FALSO, Tempo } from 'src/app/app-common.domain-model';
import { Academia } from 'src/app/cadastro/academias/academias.domain-model';
import { AparelhosService } from 'src/app/cadastro/aparelhos/aparelhos.service';
import { Serie } from '../series.domain-model';
import { SeriesService } from '../series.service';
import { ExecucaoDeExercicio, ExecucaoDeSerie } from './execucoes.domain-model';
import { AcademiasService } from 'src/app/cadastro/academias/academias.service';

@Injectable({
  providedIn: 'root'
})
export class ExecucoesService {
  private METANAME = 'execucoes';

  constructor(
    private db: AngularFirestore,
    private repositorioDeSeries: SeriesService,
    private repositorioDeAparelhos: AparelhosService,
    private repositorioDeAcademias: AcademiasService,
  ) { }

  createId(): string {
    const id = this.db.createId();

    return id;
  }

  path(monstroId: string, serieId: string): string {
    const path = `${this.repositorioDeSeries.path(monstroId)}/${serieId}/${this.METANAME}`;

    return path;
  }

  ref(monstroId: string, serieId: string, id: string): DocumentReference {
    const path = `${this.path(monstroId, serieId)}/${id}`;

    const collection = this.db.collection<ExecucaoDeSerieDocument>(path);

    const document = collection.doc<ExecucaoDeSerieDocument>(id);

    return document.ref;
  }

  obtemExecucoesDeSerieObservaveisParaExibicao(monstroId: string, serie: Serie): Observable<ExecucaoDeSerie[]> {
    const path = this.path(monstroId, serie.id);

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
          const exercicio$ = this.repositorioDeAparelhos.obtemAparelhoObservavel(execucaoDeExercicioValue.feitoCom.id).pipe(
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

  add(monstroId: string, serie: Serie, execucao: ExecucaoDeSerie): Promise<void> {
    const path = this.path(monstroId, serie.id);

    const collection = this.db.collection<ExecucaoDeSerieDocument>(path);

    const document = collection.doc<ExecucaoDeSerieDocument>(execucao.id);

    const doc = this.mapTo(monstroId, execucao);

    const result = document.set(doc);

    return result;
  }

  private mapTo(monstroId: string, execucao: ExecucaoDeSerie): ExecucaoDeSerieDocument {
    const serieRef = this.repositorioDeSeries.ref(monstroId, execucao.serie.id);

    const feitaNaAcademiaRef = this.repositorioDeAcademias.ref(execucao.feitaNa.id);

    const doc: ExecucaoDeSerieDocument = {
      id: execucao.id,
      serieRef: serieRef,
      dia: firebase.firestore.Timestamp.fromDate(execucao.dia),
      numero: execucao.numero,
      feitaNa: feitaNaAcademiaRef,
      exercicios: execucao.exercicios.map(execucaoDeSerieDeExercicio => {
        const referenciaId = execucaoDeSerieDeExercicio.referencia.id;

        const feitaComAparelhoRef = this.repositorioDeAparelhos.ref(execucaoDeSerieDeExercicio.feitoCom.id);

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
