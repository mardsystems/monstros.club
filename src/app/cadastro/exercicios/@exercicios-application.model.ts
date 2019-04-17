import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Exercicio } from './@exercicios-domain.model';

export interface ConsultaDeExercicios {
  obtemExerciciosParaAdministracao(): Observable<Exercicio[]>;
}

export const CONSULTA_DE_EXERCICIOS = new InjectionToken<ConsultaDeExercicios>('CONSULTA_DE_EXERCICIOS');
