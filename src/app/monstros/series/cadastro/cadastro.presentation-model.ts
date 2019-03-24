import { Monstro } from '../../monstros.domain-model';
import { Serie, SerieDeExercicio, } from '../series.domain-model';
import { SolicitacaoDeCadastroDeSerie, SolicitacaoDeCadastroDeExercicio } from './cadastro.application-model';

export class CadastroDeSerieViewModel extends SolicitacaoDeCadastroDeSerie {
  isEdit: boolean;
  id?: string; // Usado apenas na edição.
  monstro: Monstro;

  static toAddViewModel(monstro: Monstro): CadastroDeSerieViewModel {
    const solicitacao = SolicitacaoDeCadastroDeSerie.toAdd(monstro.id);

    return {
      isEdit: false,
      id: null,
      nome: solicitacao.nome,
      cor: solicitacao.cor,
      ativa: solicitacao.ativa,
      monstro: monstro,
      monstroId: solicitacao.monstroId,
      data: solicitacao.data,
    };
  }

  static toEditViewModel(monstro: Monstro, serie: Serie): CadastroDeSerieViewModel {
    const solicitacao = SolicitacaoDeCadastroDeSerie.toEdit(monstro.id, serie);

    return {
      isEdit: true,
      id: serie.id,
      nome: solicitacao.nome,
      cor: solicitacao.cor,
      ativa: solicitacao.ativa,
      monstro: monstro,
      monstroId: solicitacao.monstroId,
      data: solicitacao.data,
    };
  }
}

export class CadastroDeExercicioViewModel extends SolicitacaoDeCadastroDeExercicio {
  isEdit: boolean;
  monstro: Monstro;
  serie: Serie;

  static toAddViewModel(monstro: Monstro, serie: Serie): CadastroDeExercicioViewModel {
    const solicitacao = SolicitacaoDeCadastroDeExercicio.toAdd(monstro.id, serie.id);

    return {
      isEdit: false,
      monstro: monstro,
      monstroId: solicitacao.monstroId,
      serie: serie,
      serieId: solicitacao.serieId,
      exercicioId: solicitacao.exercicioId,
      quantidade: solicitacao.quantidade,
      repeticoes: solicitacao.repeticoes,
      carga: solicitacao.carga,
      assento: solicitacao.assento,
    };
  }

  static toEditViewModel(monstro: Monstro, serie: Serie, serieDeExercicio: SerieDeExercicio): CadastroDeExercicioViewModel {
    const solicitacao = SolicitacaoDeCadastroDeExercicio.toEdit(monstro.id, serie.id, serieDeExercicio);

    return {
      isEdit: true,
      monstro: monstro,
      monstroId: solicitacao.monstroId,
      serie: serie,
      serieId: solicitacao.serieId,
      exercicioId: solicitacao.exercicioId,
      quantidade: solicitacao.quantidade,
      repeticoes: solicitacao.repeticoes,
      carga: solicitacao.carga,
      assento: solicitacao.assento,
    };
  }
}
