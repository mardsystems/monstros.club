import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { FirebaseService, MonstrosDbContext } from 'src/app/app-@firebase.model';
import { ConsultaDeAcademias } from './academias-@application.model';
import { Academia, RepositorioDeAcademias } from './academias-@domain.model';

export class AcademiasFirebaseService
  extends FirebaseService<AcademiaDocument>
  implements RepositorioDeAcademias, ConsultaDeAcademias {

  constructor(
    readonly db: MonstrosDbContext,
  ) {
    super(db);
  }

  path(): string {
    return this.db.academiasPath();
  }

  async add(academia: Academia): Promise<void> {
    try {
      const path = this.path();

      const collection = this.db.firebase.collection<AcademiaDocument>(path);

      const document = collection.doc<AcademiaDocument>(academia.id);

      const doc = this.mapTo(academia);

      await document.set(doc);
    } catch (e) {
      throw e;
    }
  }

  async update(academia: Academia): Promise<void> {
    try {
      const path = this.path();

      const collection = this.db.firebase.collection<AcademiaDocument>(path);

      const document = collection.doc<AcademiaDocument>(academia.id);

      const doc = this.mapTo(academia);

      await document.update(doc);
    } catch (e) {
      throw e;
    }
  }

  private mapTo(academia: Academia): AcademiaDocument {
    const doc: AcademiaDocument = {
      id: academia.id,
      nome: academia.nome,
      logoURL: academia.logoURL,
    };

    return doc;
  }

  async remove(academia: Academia): Promise<void> {
    try {
      const path = this.path();

      const collection = this.db.firebase.collection<AcademiaDocument>(path);

      const document = collection.doc<AcademiaDocument>(academia.id);

      await document.delete();
    } catch (e) {
      throw e;
    }
  }

  async obtemAcademia(id: string): Promise<Academia> {
    try {
      const path = this.path();

      const collection = this.db.firebase.collection<AcademiaDocument>(path);

      const document = collection.doc<AcademiaDocument>(id);

      const academia$ = document.valueChanges().pipe(
        first(),
        map(value => {
          return this.mapAcademia(value);
        })
      );

      return await academia$.toPromise();
    } catch (e) {
      throw e;
    }
  }

  private mapAcademia(value: AcademiaDocument): Academia {
    return new Academia(
      value.id,
      value.nome,
      value.logoURL,
    );
  }

  // Consultas.

  obtemAcademiasParaAdministracao(): Observable<Academia[]> {
    const path = this.path();

    const collection = this.db.firebase.collection<AcademiaDocument>(path, reference => {
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
}

interface AcademiaDocument {
  id: string;
  nome: string;
  logoURL: string;
}
