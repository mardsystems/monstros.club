import { AngularFirestore } from '@angular/fire/firestore';
import { Transaction, UnitOfWork } from './app-common.model';

export class FireclouldTransactionManager
  implements UnitOfWork {

  level: number;

  constructor(
    private db: AngularFirestore,
  ) { }

  async beginTransaction(): Promise<Transaction> {
    return null;
  }

  async commit(): Promise<void> {

  }

  async rollback(): Promise<void> {

  }
}
