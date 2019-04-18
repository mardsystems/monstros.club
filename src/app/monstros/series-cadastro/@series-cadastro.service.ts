import { Inject, Injectable } from '@angular/core';
import { UnitOfWork, UNIT_OF_WORK } from 'src/app/@app-transactions.model';
import { RepositorioDeExercicios, REPOSITORIO_DE_EXERCICIOS } from 'src/app/cadastro/exercicios/@exercicios-domain.model';
import { RepositorioDeSeries, REPOSITORIO_DE_SERIES, Serie } from '../series/@series-domain.model';
import { CadastroDeSeries, SolicitacaoDeCadastroDeExercicio, SolicitacaoDeCadastroDeSerie } from './@series-cadastro-application.model';
import { FirebaseTransactionManager } from 'src/app/@app-firebase.model';
import { SeriesFirebaseService } from '../series/@series-firebase.service';
import { ExerciciosFirebaseService } from 'src/app/cadastro/exercicios/@exercicios-firebase.service';

@Injectable({
  providedIn: 'root'
})
export class SeriesCadastroService implements CadastroDeSeries {
  constructor(
    // @Inject(UNIT_OF_WORK)
    protected readonly unitOfWork: FirebaseTransactionManager, // UnitOfWork
    // @Inject(REPOSITORIO_DE_SERIES)
    protected readonly repositorioDeSeries: SeriesFirebaseService, //RepositorioDeSeries
    // @Inject(REPOSITORIO_DE_EXERCICIOS)
    protected readonly repositorioDeExercicios: ExerciciosFirebaseService, //RepositorioDeExercicios
  ) { }

  async cadastraSerie(solicitacao: SolicitacaoDeCadastroDeSerie): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const serieId = this.repositorioDeSeries.createId();

      //

      const serie = new Serie(
        serieId,
        solicitacao.nome,
        solicitacao.cor,
        solicitacao.ativa,
        solicitacao.data.toDate(),
      );

      //

      await this.repositorioDeSeries.add(solicitacao.monstroId, serie);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }

  async atualizaSerie(serieId: string, solicitacao: SolicitacaoDeCadastroDeSerie): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const serie = await this.repositorioDeSeries.obtemSerie(solicitacao.monstroId, serieId);

      //

      serie.corrigeNome(solicitacao.nome);

      serie.ajustaCor(solicitacao.cor);

      if (serie.ativa && !solicitacao.ativa) {
        serie.desativa();
      }

      if (!serie.ativa && solicitacao.ativa) {
        serie.reativa();
      }

      serie.corrigeData(solicitacao.data.toDate());

      //

      await this.repositorioDeSeries.update(solicitacao.monstroId, serie);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }

  async adicionaExercicio(solicitacao: SolicitacaoDeCadastroDeExercicio): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const serie = await this.repositorioDeSeries.obtemSerie(solicitacao.monstroId, solicitacao.serieId);

      const exercicio = await this.repositorioDeExercicios.obtemExercicio(solicitacao.exercicioId);

      //

      serie.adicionaExercicio(exercicio, solicitacao.quantidade, solicitacao.repeticoes, solicitacao.carga, solicitacao.nota);

      //

      await this.repositorioDeSeries.update(solicitacao.monstroId, serie);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }

  async atualizaExercicio(serieDeExercicioId: number, solicitacao: SolicitacaoDeCadastroDeExercicio): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const serie = await this.repositorioDeSeries.obtemSerie(solicitacao.monstroId, solicitacao.serieId);

      const exercicio = await this.repositorioDeExercicios.obtemExercicio(solicitacao.exercicioId);

      //

      const serieDeExercicio = serie.obtemSerieDeExercicio(serieDeExercicioId);

      serieDeExercicio.alteraSequencia(solicitacao.sequencia);

      serieDeExercicio.acertaExercicio(exercicio);

      serieDeExercicio.corrigeQuantidade(solicitacao.quantidade);

      serieDeExercicio.ajustaRepeticoes(solicitacao.repeticoes);

      serieDeExercicio.ajustaCarga(solicitacao.carga);

      serieDeExercicio.atualizaNota(solicitacao.nota);

      //

      await this.repositorioDeSeries.update(solicitacao.monstroId, serie);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }

  async removeExercicio(monstroId: string, serieId: string, serieDeExercicioId: number): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const serie = await this.repositorioDeSeries.obtemSerie(monstroId, serieId);

      //

      serie.removeSerieDeExercicio(serieDeExercicioId);

      //

      await this.repositorioDeSeries.update(monstroId, serie);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }

  async excluiSerie(monstroId: string, serieId: string): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const serie = await this.repositorioDeSeries.obtemSerie(monstroId, serieId);

      //

      await this.repositorioDeSeries.remove(monstroId, serie);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }
}
