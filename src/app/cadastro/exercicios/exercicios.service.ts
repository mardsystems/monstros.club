import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Exercicio, Musculatura } from './exercicios.domain-model';

@Injectable({
  providedIn: 'root'
})
export class ExerciciosService {
  PATH = '/exercicios'; // TODO.

  constructor(
    private db: AngularFirestore,
  ) { }

  createId(): string {
    const id = this.db.createId();

    return id;
  }

  ref(id: string): DocumentReference {
    const collection = this.db.collection<ExercicioDocument>(this.PATH);

    const document = collection.doc<ExercicioDocument>(id);

    return document.ref;
  }

  obtemExerciciosObservaveisParaAdministracao(): Observable<Exercicio[]> {
    const collection = this.db.collection<ExercicioDocument>(this.PATH, reference => {
      return reference
        .orderBy('nome', 'asc');
    });

    const exercicios$ = collection.valueChanges().pipe(
      map(values => {
        const exercicios = values
          .map((value) => {
            const exercicio = this.mapExercicio(value);

            return exercicio;
          });

        return exercicios;
      })
    );

    return exercicios$;
  }

  obtemExercicioObservavel(id: string): Observable<Exercicio> {
    const collection = this.db.collection<ExercicioDocument>(this.PATH);

    const document = collection.doc<ExercicioDocument>(id);

    const exercicio$ = document.valueChanges().pipe(
      map(value => {
        return this.mapExercicio(value);
      })
    );

    return exercicio$;
  }

  private mapExercicio(value: ExercicioDocument): Exercicio {
    return new Exercicio(
      value.id,
      value.codigo,
      value.nome,
      value.musculatura as Musculatura,
      value.imagemURL,
    );
  }

  add(exercicio: Exercicio): Promise<void> {
    const collection = this.db.collection<ExercicioDocument>(this.PATH);

    const document = collection.doc<ExercicioDocument>(exercicio.id);

    const doc = this.mapTo(exercicio);

    const result = document.set(doc);

    return result;
  }

  update(exercicio: Exercicio): Promise<void> {
    const collection = this.db.collection<ExercicioDocument>(this.PATH);

    const document = collection.doc<ExercicioDocument>(exercicio.id);

    const doc = this.mapTo(exercicio);

    const result = document.update(doc);

    return result;
  }

  private mapTo(exercicio: Exercicio): ExercicioDocument {
    const doc: ExercicioDocument = {
      id: exercicio.id,
      codigo: exercicio.codigo,
      nome: exercicio.nome,
      musculatura: exercicio.musculatura,
      imagemURL: exercicio.imagemURL,
    };

    return doc;
  }

  remove(exercicioId: string): Promise<void> {
    const collection = this.db.collection<ExercicioDocument>(this.PATH);

    const document = collection.doc<ExercicioDocument>(exercicioId);

    const result = document.delete();

    return result;
  }
}

interface ExercicioDocument {
  id: string;
  codigo: string;
  nome: string;
  musculatura: string;
  imagemURL: string;
}
