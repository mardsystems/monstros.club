import { Academia } from 'src/app/cadastro/academias/@academias-domain.model';
import { Monstro } from 'src/app/cadastro/monstros/@monstros-domain.model';
import { Serie, SerieDeExercicio } from '../series/@series-domain.model';
import { SolicitacaoDeExecucaoDeExercicio, SolicitacaoDeExecucaoDeSerie } from './@series-execucao-application.model';
import { RepositorioDeExecucoesDeSeries } from '../series/execucoes/@execucoes-domain.model';

export class ExecucaoDeSerieViewModel extends SolicitacaoDeExecucaoDeSerie {
  isEdit: boolean;
  id?: string; // Usado apenas na edição.
  monstro: Monstro;
  serie: Serie;
  feitaNa: Academia;

  static async toViewModel(
    monstro: Monstro,
    serie: Serie,
    repositorioDeExecucoesDeSeries: RepositorioDeExecucoesDeSeries
  ): Promise<ExecucaoDeSerieViewModel> {
    const agora = new Date(Date.now());

    const numero = await repositorioDeExecucoesDeSeries.obtemNumero(monstro.id, serie.id, agora);

    const solicitacao = await SolicitacaoDeExecucaoDeSerie.create(monstro.id, serie.id, numero + 1);

    return {
      isEdit: false,
      id: null,
      monstro: monstro,
      monstroId: solicitacao.monstroId,
      serie: serie,
      serieId: solicitacao.serieId,
      feitaNa: null,
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
