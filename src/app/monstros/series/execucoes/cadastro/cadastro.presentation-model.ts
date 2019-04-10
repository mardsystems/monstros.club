import { Monstro } from '../..//../monstros.domain-model';
import { Serie, SerieDeExercicio, } from '../../series.domain-model';
import { SolicitacaoDeExecucaoDeSerie, SolicitacaoDeExecucaoDeExercicio } from '../cadastro/cadastro.application-model';
import { Academia } from 'src/app/cadastro/academias/academias.domain-model';

export class ExecucaoDeSerieViewModel extends SolicitacaoDeExecucaoDeSerie {
  isEdit: boolean;
  id?: string; // Usado apenas na edição.
  monstro: Monstro;
  serie: Serie;
  feitaNa: Academia;

  static toViewModel(monstro: Monstro, serie: Serie, feitaNa: Academia): ExecucaoDeSerieViewModel {
    const solicitacao = SolicitacaoDeExecucaoDeSerie.create(monstro.id);

    return {
      isEdit: false,
      id: null,
      monstro: monstro,
      monstroId: solicitacao.monstroId,
      serie: serie,
      serieId: solicitacao.serieId,
      feitaNa: feitaNa,
      feitaNaId: solicitacao.feitaNaId,
      dia: solicitacao.dia,
      numero: solicitacao.numero,
    };
  }
}

export class ExecucaoDeExercicioViewModel extends SolicitacaoDeExecucaoDeExercicio {
  isEdit: boolean;
  id?: number;
  // monstro: Monstro;
  serie: Serie;

  static toAddViewModel(monstroId: string, serie: Serie): ExecucaoDeExercicioViewModel {
    const solicitacao = SolicitacaoDeExecucaoDeExercicio.toAdd(monstroId, serie.id);

    return {
      isEdit: false,
      id: null,
      // monstro: monstro,
      monstroId: solicitacao.monstroId,
      serie: serie,
      serieId: solicitacao.serieId,
      sequencia: solicitacao.sequencia,
      exercicioId: solicitacao.exercicioId,
      quantidade: solicitacao.quantidade,
      repeticoes: solicitacao.repeticoes,
      carga: solicitacao.carga,
      nota: solicitacao.nota,
    };
  }

  static toEditViewModel(monstroId: string, serie: Serie, serieDeExercicio: SerieDeExercicio): ExecucaoDeExercicioViewModel {
    const solicitacao = SolicitacaoDeExecucaoDeExercicio.toEdit(monstroId, serie.id, serieDeExercicio);

    return {
      isEdit: true,
      id: serieDeExercicio.id,
      // monstro: monstro,
      monstroId: solicitacao.monstroId,
      serie: serie,
      serieId: solicitacao.serieId,
      sequencia: solicitacao.sequencia,
      exercicioId: solicitacao.exercicioId,
      quantidade: solicitacao.quantidade,
      repeticoes: solicitacao.repeticoes,
      carga: solicitacao.carga,
      nota: solicitacao.nota,
    };
  }
}
