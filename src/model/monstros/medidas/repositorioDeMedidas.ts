import { Medida } from './medida';
import { Observable } from 'rxjs';

export interface RepositorioDeMedidas {
  obtemMedidas(): Observable<Medida[]>;
}
