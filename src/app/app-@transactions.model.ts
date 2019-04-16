import { InjectionToken } from '@angular/core';

export const UNIT_OF_WORK = new InjectionToken<UnitOfWork>('UNIT_OF_WORK');

export interface UnitOfWork {
  beginTransaction(): Promise<void>;

  commit(): Promise<void>;

  rollback(): Promise<void>;
}
