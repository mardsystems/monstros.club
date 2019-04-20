import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Serie } from '../@series-domain.model';
import { ExecucaoDeSerie } from './@execucoes-domain.model';

export const CONSULTA_DE_EXECUCOES_DE_SERIES = new InjectionToken<ConsultaDeExecucoesDeSeries>('CONSULTA_DE_EXECUCOES_DE_SERIES');

export interface ConsultaDeExecucoesDeSeries {
  obtemExecucoesDeSerieParaExibicao(monstroId: string, serieId: string): Observable<ExecucaoDeSerie[]>;
}
