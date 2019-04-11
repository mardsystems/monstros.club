import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Academia } from './academias.domain-model';

@Injectable({
  providedIn: 'root'
})
export class AcademiasService {
  PATH = '/academias'; // TODO.

  constructor(
    private db: AngularFirestore,
  ) { }

  createId(): string {
    const id = this.db.createId();

    return id;
  }

  ref(id: string): DocumentReference {
    const collection = this.db.collection<AcademiaDocument>(this.PATH);

    const document = collection.doc<AcademiaDocument>(id);

    return document.ref;
  }

  obtemAcademiasObservaveisParaAdministracao(): Observable<Academia[]> {
    const collection = this.db.collection<AcademiaDocument>(this.PATH, reference => {
      return reference
        .orderBy('nome', 'asc');
    });

    const academias$ = collection.valueChanges().pipe(
      map(values => {
        const academias = values
          .map((value) => {
            const academia = this.mapAcademia(value);

            return academia;
          });

        return academias;
      })
    );

    return academias$;
  }

  obtemAcademiaObservavel(id: string): Observable<Academia> {
    const collection = this.db.collection<AcademiaDocument>(this.PATH);

    const document = collection.doc<AcademiaDocument>(id);

    const academia$ = document.valueChanges().pipe(
      map(value => {
        return this.mapAcademia(value);
      })
    );

    return academia$;
  }

  private mapAcademia(value: AcademiaDocument): Academia {
    return new Academia(
      value.id,
      value.nome,
      value.logoURL,
    );
  }

  add(academia: Academia): Promise<void> {
    const collection = this.db.collection<AcademiaDocument>(this.PATH);

    const document = collection.doc<AcademiaDocument>(academia.id);

    const doc = this.mapTo(academia);

    const result = document.set(doc);

    return result;
  }

  update(academia: Academia): Promise<void> {
    const collection = this.db.collection<AcademiaDocument>(this.PATH);

    const document = collection.doc<AcademiaDocument>(academia.id);

    const doc = this.mapTo(academia);

    const result = document.update(doc);

    return result;
  }

  private mapTo(academia: Academia): AcademiaDocument {
    const doc: AcademiaDocument = {
      id: academia.id,
      nome: academia.nome,
      logoURL: academia.logoURL,
    };

    return doc;
  }

  remove(academiaId: string): Promise<void> {
    const collection = this.db.collection<AcademiaDocument>(this.PATH);

    const document = collection.doc<AcademiaDocument>(academiaId);

    const result = document.delete();

    return result;
  }
}

interface AcademiaDocument {
  id: string;
  nome: string;
  logoURL: string;
}
