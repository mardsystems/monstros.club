import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Monstro } from 'src/app/cadastro/monstros/@monstros-domain.model';
import { Medida } from './@medidas-domain.model';

export interface ConsultaDeMedidas {
  obtemMedidasParaExibicao(monstro: Monstro): Observable<Medida[]>;

  obtemMedidasParaAdministracao(): Observable<Medida[]>;
}

export const CONSULTA_DE_MEDIDAS = new InjectionToken<ConsultaDeMedidas>('CONSULTA_DE_MEDIDAS');
