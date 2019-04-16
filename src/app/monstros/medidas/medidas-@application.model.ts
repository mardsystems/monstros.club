import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Medida } from './medidas-@domain.model';

export interface ConsultaDeMedidas {
  obtemMedidasParaAdministracao(): Observable<Medida[]>;
}

export const CONSULTA_DE_MEDIDAS = new InjectionToken<ConsultaDeMedidas>('CONSULTA_DE_MEDIDAS');
