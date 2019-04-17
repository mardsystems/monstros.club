import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Monstro } from './monstros-@domain.model';

export interface ConsultaDeMonstros {
  obtemMonstroObservavel(id: string): Observable<Monstro>;

  obtemMonstros(ids: string[]): Observable<Monstro[]>;

  obtemMonstrosParaAdministracao(): Observable<Monstro[]>;
}

export const CONSULTA_DE_MONSTROS = new InjectionToken<ConsultaDeMonstros>('CONSULTA_DE_MONSTROS');
