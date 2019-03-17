import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { LogService } from 'src/app/app-common.services';
import { Aparelho } from './aparelhos.domain-model';
import { SolicitacaoDeCadastroDeAparelho } from './cadastro/cadastro.application-model';
import * as firebase from 'firebase/app';
import * as _ from 'lodash';
import { AcademiasService } from '../academias/academias.service';
import { Academia } from '../academias/academias.domain-model';
import { Exercicio } from '../exercicios/exercicios.domain-model';
import { ExerciciosService } from '../exercicios/exercicios.service';

@Injectable({
  providedIn: 'root'
})
export class AparelhosService {
  PATH = '/aparelhos';

  constructor(
    private db: AngularFirestore,
    private academiasService: AcademiasService,
    private exerciciosService: ExerciciosService,
    private log: LogService
  ) { }

  obtemAparelhosObservaveisParaAdministracao(): Observable<Aparelho[]> {
    const collection = this.db.collection<AparelhoDocument>(this.PATH, reference => {
      return reference
        .orderBy('codigo', 'asc');
    });

    return collection.valueChanges().pipe(
      switchMap(values => {
        let aparelhos$: Observable<Aparelho[]>;

        if (values.length === 0) {
          aparelhos$ = of([]);
        } else {
          aparelhos$ = combineLatest(values.map(value => this.mapAparelhoObservavel(value)));
        }

        return aparelhos$;
      })
    );
  }

  obtemAparelhoObservavel(id: string): Observable<Aparelho> {
    const collection = this.db.collection<AparelhoDocument>(this.PATH);

    const document = collection.doc<AparelhoDocument>(id);

    const aparelho$ = document.valueChanges().pipe(
      switchMap(value => this.mapAparelhoObservavel(value))
    );

    return aparelho$;
  }

  private mapAparelhoObservavel(value: AparelhoDocument): Observable<Aparelho> {
    return this.academiasService.obtemAcademiaObservavel(value.academia.id).pipe(
      switchMap(academia => {
        let exercicios$: Observable<Exercicio[]>;

        if (value.exercicios.length === 0) {
          exercicios$ = of([]);
        } else {
          exercicios$ = combineLatest(
            value.exercicios.map(exercicioRef => this.exerciciosService.obtemExercicioObservavel(exercicioRef.id))
          );
        }

        return exercicios$.pipe(
          map(exercicios => this.mapAparelho(value, academia, exercicios))
        );
      })
    );
  }

  private mapAparelho(value: AparelhoDocument, academia: Academia, exercicios: Exercicio[]): Aparelho {
    return new Aparelho(
      value.id,
      value.codigo,
      academia,
      exercicios,
      value.imagemURL,
    );
  }

  cadastraAparelho(solicitacao: SolicitacaoDeCadastroDeAparelho): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.academiasService.obtemAcademiaObservavel(solicitacao.academia).pipe(
        first()
      ).subscribe(solicitacao_academia => {
        let exercicios$: Observable<Exercicio[]>;

        if (solicitacao.exercicios.length === 0) {
          exercicios$ = of([]);
        } else {
          exercicios$ = combineLatest(
            solicitacao.exercicios.map(exercicio =>
              this.exerciciosService.obtemExercicioObservavel(exercicio).pipe(
                first()
              )
            )
          ).pipe(
            first()
          );
        }

        exercicios$.pipe(
          first()
        ).subscribe(solicitacao_exercicios => {
          const aparelhoId = this.db.createId();

          const aparelho = new Aparelho(
            aparelhoId,
            solicitacao.codigo,
            solicitacao_academia,
            solicitacao_exercicios,
            solicitacao.imagemURL,
          );

          const result = this.add(aparelho);

          resolve(result);
        });
      });
    });
  }

  private add(aparelho: Aparelho): Promise<void> {
    const collection = this.db.collection<AparelhoDocument>(this.PATH);

    const document = collection.doc<AparelhoDocument>(aparelho.id);

    const doc = this.mapTo(aparelho);

    const result = document.set(doc);

    return result;
  }

  atualizaAparelho(aparelhoId: string, solicitacao: SolicitacaoDeCadastroDeAparelho): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.academiasService.obtemAcademiaObservavel(solicitacao.academia).pipe(
        first()
      ).subscribe(solicitacao_academia => {
        let exercicios$: Observable<Exercicio[]>;

        if (solicitacao.exercicios.length === 0) {
          exercicios$ = of([]);
        } else {
          exercicios$ = combineLatest(
            solicitacao.exercicios.map(exercicio =>
              this.exerciciosService.obtemExercicioObservavel(exercicio).pipe(
                first()
              )
            )
          ).pipe(
            first()
          );
        }

        exercicios$.pipe(
          first()
        ).subscribe(solicitacao_exercicios => {
          this.obtemAparelhoObservavel(aparelhoId).pipe(
            first()
          ).subscribe(aparelho => {
            aparelho.alteraCodigo(solicitacao.codigo);

            aparelho.corrigeAcademia(solicitacao_academia);

            aparelho.alteraExercicios(solicitacao_exercicios);

            aparelho.alteraImagemURL(solicitacao.imagemURL);

            const result = this.update(aparelho);

            resolve(result);
          });
        });
      });
    });
  }

  private update(aparelho: Aparelho): Promise<void> {
    const collection = this.db.collection<AparelhoDocument>(this.PATH);

    const document = collection.doc<AparelhoDocument>(aparelho.id);

    const doc = this.mapTo(aparelho);

    const result = document.update(doc);

    return result;
  }

  private mapTo(aparelho: Aparelho): AparelhoDocument {
    const academiaRef = this.academiasService.ref(aparelho.academia.id);

    const doc: AparelhoDocument = {
      id: aparelho.id,
      codigo: aparelho.codigo,
      academia: academiaRef,
      exercicios: aparelho.exercicios.map(exercicio => {
        const exercicioRef = this.exerciciosService.ref(exercicio.id);

        return exercicioRef;
      }),
      imagemURL: aparelho.imagemURL,
    };

    return doc;
  }

  excluiAparelho(aparelhoId: string): Promise<void> {
    const collection = this.db.collection<AparelhoDocument>(this.PATH);

    const document = collection.doc<AparelhoDocument>(aparelhoId);

    const result = document.delete();

    return result;
  }
}

interface AparelhoDocument {
  id: string;
  codigo: string;
  academia: firebase.firestore.DocumentReference;
  exercicios: firebase.firestore.DocumentReference[];
  imagemURL: string;
}
