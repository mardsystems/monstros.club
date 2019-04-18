import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { FirebaseService, MonstrosDbContext } from 'src/app/@app-firebase.model';
import { ConsultaDeExercicios } from './@exercicios-application.model';
import { Exercicio, Musculatura, RepositorioDeExercicios } from './@exercicios-domain.model';

export class ExerciciosFirebaseService
  extends FirebaseService<ExercicioDocument>
  implements RepositorioDeExercicios, ConsultaDeExercicios {

  constructor(
    protected readonly db: MonstrosDbContext,
  ) {
    super(db);
  }

  path(): string {
    return this.db.exerciciosPath();
  }

  async add(exercicio: Exercicio): Promise<void> {
    try {
      const path = this.path();

      const collection = this.db.firebase.collection<ExercicioDocument>(path);

      const document = collection.doc<ExercicioDocument>(exercicio.id);

      const doc = this.mapTo(exercicio);

      await document.set(doc);
    } catch (e) {
      throw e;
    }
  }

  async update(exercicio: Exercicio): Promise<void> {
    try {
      const path = this.path();

      const collection = this.db.firebase.collection<ExercicioDocument>(path);

      const document = collection.doc<ExercicioDocument>(exercicio.id);

      const doc = this.mapTo(exercicio);

      await document.update(doc);
    } catch (e) {
      throw e;
    }
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

  async remove(exercicio: Exercicio): Promise<void> {
    try {
      const path = this.path();

      const collection = this.db.firebase.collection<ExercicioDocument>(path);

      const document = collection.doc<ExercicioDocument>(exercicio.id);

      await document.delete();
    } catch (e) {
      throw e;
    }
  }

  async obtemExercicio(id: string): Promise<Exercicio> {
    try {
      const path = this.path();

      const collection = this.db.firebase.collection<ExercicioDocument>(path);

      const document = collection.doc<ExercicioDocument>(id);

      const exercicio$ = document.valueChanges().pipe(
        first(),
        map(value => {
          return this.mapExercicio(value);
        })
      );

      return await exercicio$.toPromise();
    } catch (e) {
      throw e;
    }
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

  obtemExercicioObservavel(id: string): Observable<Exercicio> {
    const path = this.path();

    const collection = this.db.firebase.collection<ExercicioDocument>(path);

    const document = collection.doc<ExercicioDocument>(id);

    const exercicio$ = document.valueChanges().pipe(
      map(value => {
        return this.mapExercicio(value);
      })
    );

    return exercicio$;
  }

  // Consultas.

  obtemExerciciosParaAdministracao(): Observable<Exercicio[]> {
    const path = this.path();

    const collection = this.db.firebase.collection<ExercicioDocument>(path, reference => {
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
}

interface ExercicioDocument {
  id: string;
  codigo: string;
  nome: string;
  musculatura: string;
  imagemURL: string;
}
