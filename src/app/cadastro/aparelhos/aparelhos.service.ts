import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Academia } from '../academias/academias.domain-model';
import { AcademiasService } from '../academias/academias.service';
import { Exercicio } from '../exercicios/exercicios.domain-model';
import { ExerciciosService } from '../exercicios/exercicios.service';
import { Aparelho, IRepositorioDeAparelhos } from './aparelhos.domain-model';

@Injectable({
  providedIn: 'root'
})
export class AparelhosService implements IRepositorioDeAparelhos {
  PATH = '/aparelhos'; // TODO.

  constructor(
    private db: AngularFirestore,
    private repositorioDeAcademias: AcademiasService,
    private repositorioDeExercicios: ExerciciosService,
  ) { }

  createId(): string {
    const id = this.db.createId();

    return id;
  }

  ref(id: string): DocumentReference {
    const collection = this.db.collection<AparelhoDocument>(this.PATH);

    const document = collection.doc<AparelhoDocument>(id);

    return document.ref;
  }

  localiza(exercicio: Exercicio, academia: Academia): Observable<Aparelho> {
    const academiaRef = this.repositorioDeAcademias.ref(academia.id);

    const exercicioRef = this.repositorioDeExercicios.ref(exercicio.id);

    const collection = this.db.collection<AparelhoDocument>(this.PATH, reference => {
      return reference
        .where('academia', '==', academiaRef)
        .where('exercicios', 'array-contains', exercicioRef)
    });

    const aparelho$ = collection.valueChanges().pipe(
      switchMap(values => {
        return this.mapAparelhoObservavel(values[0]);

        // return values.map((value, index) => {

        // });
      })
    );

    return aparelho$;
  }

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
    return this.repositorioDeAcademias.obtemAcademiaObservavel(value.academia.id).pipe(
      switchMap(academia => {
        let exercicios$: Observable<Exercicio[]>;

        if (value.exercicios.length === 0) {
          exercicios$ = of([]);
        } else {
          exercicios$ = combineLatest(
            value.exercicios.map(exercicioRef => this.repositorioDeExercicios.obtemExercicioObservavel(exercicioRef.id))
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

  add(aparelho: Aparelho): Promise<void> {
    const collection = this.db.collection<AparelhoDocument>(this.PATH);

    const document = collection.doc<AparelhoDocument>(aparelho.id);

    const doc = this.mapTo(aparelho);

    const result = document.set(doc);

    return result;
  }

  update(aparelho: Aparelho): Promise<void> {
    const collection = this.db.collection<AparelhoDocument>(this.PATH);

    const document = collection.doc<AparelhoDocument>(aparelho.id);

    const doc = this.mapTo(aparelho);

    const result = document.update(doc);

    return result;
  }

  private mapTo(aparelho: Aparelho): AparelhoDocument {
    const academiaRef = this.repositorioDeAcademias.ref(aparelho.academia.id);

    const doc: AparelhoDocument = {
      id: aparelho.id,
      codigo: aparelho.codigo,
      academia: academiaRef,
      exercicios: aparelho.exercicios.map(exercicio => {
        const exercicioRef = this.repositorioDeExercicios.ref(exercicio.id);

        return exercicioRef;
      }),
      imagemURL: aparelho.imagemURL,
    };

    return doc;
  }

  remove(aparelhoId: string): Promise<void> {
    const collection = this.db.collection<AparelhoDocument>(this.PATH);

    const document = collection.doc<AparelhoDocument>(aparelhoId);

    const result = document.delete();

    return result;
  }
}

interface AparelhoDocument {
  id: string;
  codigo: string;
  academia: firebase.firestore.DocumentReference; // TODO: corrigir nome.
  exercicios: firebase.firestore.DocumentReference[];
  imagemURL: string;
}
