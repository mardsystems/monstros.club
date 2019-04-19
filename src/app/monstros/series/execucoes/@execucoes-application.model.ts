import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Serie } from '../@series-domain.model';
import { ExecucaoDeSerie } from './@execucoes-domain.model';

export const CONSULTA_DE_EXECUCOES_DE_SERIE = new InjectionToken<ConsultaDeExecucoesDeSerie>('CONSULTA_DE_EXECUCOES_DE_SERIE');

export interface ConsultaDeExecucoesDeSerie {
  obtemExecucoesDeSerieParaExibicao(monstroId: string, serie: Serie): Observable<ExecucaoDeSerie[]>;
}
