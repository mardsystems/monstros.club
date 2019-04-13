import { IRepository } from './app-common.domain-model';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';

export abstract class FirecloudRepository<TDocument extends AggregateDocument>
  implements IRepository {
  constructor(
    private readonly metaname: string,
    private db: AngularFirestore,
  ) { }

  createId(): string {
    const id = this.db.createId();

    return id;
  }

  path(): string {
    const path = `/${this.metaname}`;

    return path;
  }

  ref(id: string): DocumentReference {
    const path = this.path();

    const collection = this.db.collection<TDocument>(path);

    const document = collection.doc<TDocument>(id);

    return document.ref;
  }
}

export class AggregateDocument {
  id: string;
}
