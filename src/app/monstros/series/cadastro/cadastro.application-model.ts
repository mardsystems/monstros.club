import * as moment from 'moment';
import { Serie, SerieDeExercicio } from '../series.domain-model';

export class SolicitacaoDeCadastroDeSerie {
  monstroId: string;
  nome: string;
  cor: string;
  ativa?: boolean;
  data?: moment.Moment;

  static toAdd(monstroId: string): SolicitacaoDeCadastroDeSerie {
    return {
      monstroId: monstroId,
      nome: null,
      cor: null,
      ativa: null,
      data: moment(new Date(Date.now())),
    };
  }

  static toEdit(monstroId: string, serie: Serie): SolicitacaoDeCadastroDeSerie {
    return {
      monstroId: monstroId,
      nome: serie.nome,
      cor: serie.cor,
      ativa: serie.ativa,
      data: moment(serie.data),
    };
  }
}

export class SolicitacaoDeCadastroDeExercicio {
  monstroId: string;
  serieId: string;
  exercicioId: string;
  quantidade: number;
  repeticoes: number;
  carga: number;
  assento: string;

  static toAdd(monstroId: string, serieId: string): SolicitacaoDeCadastroDeExercicio {
    return {
      monstroId: monstroId,
      serieId: serieId,
      exercicioId: null,
      quantidade: null,
      repeticoes: null,
      carga: null,
      assento: null,
    };
  }

  static toEdit(monstroId: string, serieId: string, serieDeExercicio: SerieDeExercicio): SolicitacaoDeCadastroDeExercicio {
    return {
      monstroId: monstroId,
      serieId: serieId,
      exercicioId: serieDeExercicio.exercicio.id,
      quantidade: serieDeExercicio.quantidade,
      repeticoes: serieDeExercicio.repeticoes,
      carga: serieDeExercicio.carga,
      assento: serieDeExercicio.assento,
    };
  }
}

export interface ICadastroDeSerie {
  cadastraSerie(solicitacao: SolicitacaoDeCadastroDeSerie): Promise<void>;

  atualizaSerie(serieId: string, solicitacao: SolicitacaoDeCadastroDeSerie): Promise<void>;

  adicionaExercicio(solicitacao: SolicitacaoDeCadastroDeExercicio): Promise<void>;

  excluiSerie(serieId: string): Promise<void>;
}
