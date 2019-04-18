import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Academia } from './@academias-domain.model';

export const CONSULTA_DE_ACADEMIAS = new InjectionToken<ConsultaDeAcademias>('CONSULTA_DE_ACADEMIAS');

export interface ConsultaDeAcademias {
  obtemAcademiasParaAdministracao(): Observable<Academia[]>;
}
