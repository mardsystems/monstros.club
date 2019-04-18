import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Aparelho } from './@aparelhos-domain.model';

export interface ConsultaDeAparelhos {
  obtemAparelhosParaAdministracao(): Observable<Aparelho[]>;
}

export const CONSULTA_DE_APARELHOS = new InjectionToken<ConsultaDeAparelhos>('CONSULTA_DE_APARELHOS');
