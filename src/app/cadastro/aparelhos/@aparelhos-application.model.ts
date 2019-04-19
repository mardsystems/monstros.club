import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Aparelho } from './@aparelhos-domain.model';

export const CONSULTA_DE_APARELHOS = new InjectionToken<ConsultaDeAparelhos>('CONSULTA_DE_APARELHOS');

export interface ConsultaDeAparelhos {
  obtemAparelhosParaAdministracao(): Observable<Aparelho[]>;
}
