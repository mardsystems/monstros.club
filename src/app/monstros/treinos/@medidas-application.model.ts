import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Monstro } from 'src/app/cadastro/monstros/@monstros-domain.model';
import { Treino } from './@treinos-domain.model';

export const CONSULTA_DE_TREINOS = new InjectionToken<ConsultaDeTreinos>('CONSULTA_DE_TREINOS');

export interface ConsultaDeTreinos {
  obtemTreinosParaExibicao(monstro: Monstro): Observable<Treino[]>;

  obtemTreinosParaAdministracao(): Observable<Treino[]>;
}
