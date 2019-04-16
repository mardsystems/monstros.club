import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Academia } from './academias-@domain.model';

export interface ConsultaDeAcademias {
  obtemAcademiasParaAdministracao(): Observable<Academia[]>;
}

export const CONSULTA_DE_ACADEMIAS = new InjectionToken<ConsultaDeAcademias>('CONSULTA_DE_ACADEMIAS');
