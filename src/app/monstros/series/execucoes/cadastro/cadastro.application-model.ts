import * as moment from 'moment';
import { Serie, SerieDeExercicio } from '../../series.domain-model';

export class SolicitacaoDeExecucaoDeSerie {
  monstroId: string;
  serieId: string;
  dia: moment.Moment;
  numero: number;
  feitaNaId: string;

  static create(monstroId: string): SolicitacaoDeExecucaoDeSerie {
    return {
      monstroId: monstroId,
      serieId: monstroId,
      dia: moment(new Date(Date.now())),
      numero: null,
      feitaNaId: null,
    };
  }
}

export class SolicitacaoDeExecucaoDeExercicio {
  monstroId: string;
  sequencia: number;
  serieId: string;
  exercicioId: string;
  quantidade: number;
  repeticoes: number;
  carga: number;
  nota: string;

  static toAdd(monstroId: string, serieId: string): SolicitacaoDeExecucaoDeExercicio {
    return {
      monstroId: monstroId,
      sequencia: null,
      serieId: serieId,
      exercicioId: null,
      quantidade: null,
      repeticoes: null,
      carga: null,
      nota: null,
    };
  }

  static toEdit(monstroId: string, serieId: string, serieDeExercicio: SerieDeExercicio): SolicitacaoDeExecucaoDeExercicio {
    return {
      monstroId: monstroId,
      sequencia: serieDeExercicio.sequencia,
      serieId: serieId,
      exercicioId: serieDeExercicio.exercicio.id,
      quantidade: serieDeExercicio.quantidade,
      repeticoes: serieDeExercicio.repeticoes,
      carga: serieDeExercicio.carga,
      nota: serieDeExercicio.nota,
    };
  }
}

export interface IExecucaoDeSerie {
  cadastraSerie(solicitacao: SolicitacaoDeExecucaoDeSerie): Promise<void>;

  atualizaSerie(serieId: string, solicitacao: SolicitacaoDeExecucaoDeSerie): Promise<void>;

  adicionaExercicio(solicitacao: SolicitacaoDeExecucaoDeExercicio): Promise<void>;

  excluiSerie(serieId: string): Promise<void>;
}
