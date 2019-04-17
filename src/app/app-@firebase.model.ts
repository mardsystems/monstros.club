import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Repository } from './app-@domain.model';
import { UnitOfWork } from './app-@transactions.model';

export class DbContext {
  constructor(
    readonly firebase: AngularFirestore,
  ) {

  }
}

export class MonstrosDbContext extends DbContext {
  constructor(
    readonly firebase: AngularFirestore,
  ) {
    super(firebase);
  }

  academiasPath(): string {
    return '/academias';
  }

  aparelhosPath(): string {
    return '/aparelhos';
  }

  exerciciosPath(): string {
    return '/exercicios';
  }

  monstrosPath(): string {
    return '/monstros';
  }

  medidasPath(): string {
    return '/medidas';
  }

  // seriesPath(monstroId: string, serieId?: string): string {
  //   if (serieId) {
  //     return `/monstros/${monstroId}/series/${serieId}`;
  //   } else {
  //     return `/monstros/${monstroId}/series`;
  //   }
  // }

  seriesPath(monstroId: string, serieId?: string, execucaoId?: string): string {
    if (execucaoId) {
      if (serieId) {
        return `/monstros/${monstroId}/series/${serieId}/execucoes/${execucaoId}`;
      } else {
        return `/monstros/${monstroId}/series`;
      }
    } else {
      if (serieId) {
        return `/monstros/${monstroId}/series/${serieId}`;
      } else {
        return `/monstros/${monstroId}/series`;
      }
    }
  }
}

export abstract class FirebaseService<TDocument extends AggregateDocument>
  implements Repository {
  constructor(
    protected readonly db: DbContext,
    // protected readonly metaname: string,
  ) {

  }

  createId(): string {
    const id = this.db.firebase.createId();

    return id;
  }

  abstract path(): string;

  // path(): string {
  //   const path = `/${this.metaname}`;

  //   return path;
  // }

  ref(id: string): DocumentReference {
    const path = this.path();

    const collection = this.db.firebase.collection<TDocument>(path);

    const document = collection.doc<TDocument>(id);

    return document.ref;
  }
}

export class AggregateDocument {
  id: string;
}

export class FireclouldTransactionManager
  implements UnitOfWork {

  private level: number;

  constructor(

  ) { }

  async beginTransaction(): Promise<void> {
    firebase.firestore();

    // firebase.firestore().runTransaction(t => {
    //   return t.set()
    // });

    return null;
  }

  async commit(): Promise<void> {

  }

  async rollback(): Promise<void> {

  }
}
