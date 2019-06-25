import { Injectable } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { combineLatest, Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { MonstrosDbContext } from 'src/app/@app-firebase.service';
import { FirebaseService } from 'src/app/common/firebase.service';
import { Academia } from '../academias/@academias-domain.model';
import { AcademiasFirebaseService } from '../academias/@academias-firebase.service';
import { Exercicio } from '../exercicios/@exercicios-domain.model';
import { ExerciciosFirebaseService } from '../exercicios/@exercicios-firebase.service';
import { ConsultaDeAparelhos } from './@aparelhos-application.model';
import { Aparelho, RepositorioDeAparelhos } from './@aparelhos-domain.model';

@Injectable()
export class AparelhosFirebaseService
  extends FirebaseService<AparelhoDocument>
  implements RepositorioDeAparelhos, ConsultaDeAparelhos {

  constructor(
    protected readonly db: MonstrosDbContext,
    protected readonly academiasFirebaseService: AcademiasFirebaseService,
    protected readonly exerciciosFirebaseService: ExerciciosFirebaseService,
  ) {
    super(db);
  }

  path(): string {
    return this.db.aparelhosPath();
  }

  ref(id: string): DocumentReference {
    const path = this.path();

    const collection = this.db.firebase.collection<AparelhoDocument>(path);

    const document = collection.doc<AparelhoDocument>(id);

    return document.ref;
  }

  async add(aparelho: Aparelho): Promise<void> {
    try {
      const path = this.path();

      const collection = this.db.firebase.collection<AparelhoDocument>(path);

      const document = collection.doc<AparelhoDocument>(aparelho.id);

      const doc = this.mapTo(aparelho);

      await document.set(doc);
    } catch (e) {
      throw e;
    }
  }

  async update(aparelho: Aparelho): Promise<void> {
    try {
      const path = this.path();

      const collection = this.db.firebase.collection<AparelhoDocument>(path);

      const document = collection.doc<AparelhoDocument>(aparelho.id);

      const doc = this.mapTo(aparelho);

      await document.update(doc);
    } catch (e) {
      throw e;
    }
  }

  private mapTo(aparelho: Aparelho): AparelhoDocument {
    const academiaRef = this.academiasFirebaseService.ref(aparelho.academia.id);

    const doc: AparelhoDocument = {
      id: aparelho.id,
      codigo: aparelho.codigo,
      academia: academiaRef,
      exercicios: aparelho.exercicios.map(exercicio => {
        const exercicioRef = this.exerciciosFirebaseService.ref(exercicio.id);

        return exercicioRef;
      }),
      imagemURL: aparelho.imagemURL,
    };

    return doc;
  }

  async remove(aparelho: Aparelho): Promise<void> {
    try {
      const path = this.path();

      const collection = this.db.firebase.collection<AparelhoDocument>(path);

      const document = collection.doc<AparelhoDocument>(aparelho.id);

      await document.delete();
    } catch (e) {
      throw e;
    }
  }

  async obtemAparelho(id: string): Promise<Aparelho> {
    try {
      const path = this.path();

      const collection = this.db.firebase.collection<AparelhoDocument>(path);

      const document = collection.doc<AparelhoDocument>(id);

      const aparelho$ = document.valueChanges().pipe(
        first(),
        switchMap(value => this.mapAparelhoInner(value))
      );

      return await aparelho$.toPromise();
    } catch (e) {
      throw e;
    }
  }

  async localizaAparelho(exercicio: Exercicio, academia: Academia): Promise<Aparelho> {
    try {
      const path = this.path();

      const academiaRef = this.academiasFirebaseService.ref(academia.id);

      const exercicioRef = this.exerciciosFirebaseService.ref(exercicio.id);

      const collection = this.db.firebase.collection<AparelhoDocument>(path, reference => {
        return reference
          .where('academia', '==', academiaRef)
          .where('exercicios', 'array-contains', exercicioRef);
      });

      const aparelho$ = collection.valueChanges().pipe(
        first(),
        switchMap(values => {
          if (values.length === 0) {
            throw new Error(`Aparelho não encontrado para o exercício ${exercicio.nome}.`);
          } else {
            return this.mapAparelhoInner(values[0]);
          }

          // return values.map((value, index) => {

          // });
        })
      );

      return await aparelho$.toPromise();
    } catch (e) {
      throw e;
    }
  }

  private async mapAparelhoInner(value: AparelhoDocument): Promise<Aparelho> {
    const academia = await this.academiasFirebaseService.obtemAcademia(value.academia.id);

    const exercicios = await Promise.all(
      value.exercicios.map(async (exercicioRef) => await this.exerciciosFirebaseService.obtemExercicio(exercicioRef.id))
    );

    return this.mapAparelho(value, academia, exercicios);
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

  // Consultas.

  obtemAparelhoObservavel(id: string): Observable<Aparelho> {
    const path = this.path();

    const collection = this.db.firebase.collection<AparelhoDocument>(path);

    const document = collection.doc<AparelhoDocument>(id);

    const aparelho$ = document.valueChanges().pipe(
      switchMap(value => this.mapAparelhoInner(value))
    );

    return aparelho$;
  }

  obtemAparelhosParaAdministracao(): Observable<Aparelho[]> {
    const path = this.path();

    const collection = this.db.firebase.collection<AparelhoDocument>(path, reference => {
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

  private mapAparelhoObservavel(value: AparelhoDocument): Observable<Aparelho> {
    return this.academiasFirebaseService.obtemAcademiaObservavel(value.academia.id).pipe(
      switchMap(academia => {
        let exercicios$: Observable<Exercicio[]>;

        if (value.exercicios.length === 0) {
          exercicios$ = of([]);
        } else {
          exercicios$ = combineLatest(
            value.exercicios.map(exercicioRef => this.exerciciosFirebaseService.obtemExercicioObservavel(exercicioRef.id))
          );
        }

        return exercicios$.pipe(
          map(exercicios => this.mapAparelho(value, academia, exercicios))
        );
      })
    );
  }
}

interface AparelhoDocument {
  id: string;
  codigo: string;
  academia: firebase.firestore.DocumentReference; // TODO: corrigir nome.
  exercicios: firebase.firestore.DocumentReference[];
  imagemURL: string;
}
