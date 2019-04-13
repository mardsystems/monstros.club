import { InjectionToken } from '@angular/core';

export const UNIT_OF_WORK = new InjectionToken<UnitOfWork>('UNIT_OF_WORK');

export interface Transaction {
  level: number;

  commit(): Promise<void>;

  rollback(): Promise<void>;
}

export interface UnitOfWork extends Transaction {
  beginTransaction(): Promise<Transaction>;
}
