import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Repository } from './domain.model';
import { UnitOfWork } from './transactions.model';

export abstract class FirebaseService<TDocument extends FirebaseDocument>
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

export abstract class FirebaseDocument {
  id: string;
}

export abstract class DbContext {
  constructor(
    readonly firebase: AngularFirestore,
  ) {

  }
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseTransactionManager implements UnitOfWork {
  private level: number;

  constructor(

  ) { }

  async beginTransaction(): Promise<void> {
    // firebase.firestore();

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
