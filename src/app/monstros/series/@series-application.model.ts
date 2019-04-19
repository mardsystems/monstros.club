import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Monstro } from 'src/app/cadastro/monstros/@monstros-domain.model';
import { Serie } from './@series-domain.model';

export const CONSULTA_DE_SERIES = new InjectionToken<ConsultaDeSeries>('CONSULTA_DE_SERIES');

export interface ConsultaDeSeries {
  obtemSerieObservavel(monstroId: string, id: string): Observable<Serie>;

  obtemSeriesParaExibicao(monstro: Monstro): Observable<Serie[]>;
}
