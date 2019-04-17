import * as moment from 'moment';
import { Serie, SerieDeExercicio } from '../series/series-@domain.model';
import { InjectionToken } from '@angular/core';

export const CADASTRO_DE_SERIES = new InjectionToken<CadastroDeSeries>('CADASTRO_DE_SERIES');

export interface CadastroDeSeries {
  cadastraSerie(solicitacao: SolicitacaoDeCadastroDeSerie): Promise<void>;

  atualizaSerie(serieId: string, solicitacao: SolicitacaoDeCadastroDeSerie): Promise<void>;

  adicionaExercicio(solicitacao: SolicitacaoDeCadastroDeExercicio): Promise<void>;

  atualizaExercicio(serieDeExercicioId: number, solicitacao: SolicitacaoDeCadastroDeExercicio): Promise<void>;

  removeExercicio(monstroId: string, serieId: string, serieDeExercicioId: number): Promise<void>;

  excluiSerie(monstroId: string, serieId: string): Promise<void>;
}

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
  sequencia: number;
  serieId: string;
  exercicioId: string;
  quantidade: number;
  repeticoes: number;
  carga: number;
  nota: string;

  static toAdd(monstroId: string, serieId: string): SolicitacaoDeCadastroDeExercicio {
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

  static toEdit(monstroId: string, serieId: string, serieDeExercicio: SerieDeExercicio): SolicitacaoDeCadastroDeExercicio {
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
