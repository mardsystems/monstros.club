import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { LogService } from 'src/app/app-common.services';
import { ExerciciosService } from 'src/app/cadastro/exercicios/exercicios.service';
import { Serie } from '../series/series.domain-model';
import { SeriesService } from '../series/series.service';
import { SolicitacaoDeCadastroDeExercicio, SolicitacaoDeCadastroDeSerie } from './series-cadastro.application-model';

@Injectable({
  providedIn: 'root'
})
export class SeriesCadastroService {
  constructor(
    private repositorioDeSeries: SeriesService,
    private exerciciosService: ExerciciosService,
    private log: LogService
  ) { }

  cadastraSerie(solicitacao: SolicitacaoDeCadastroDeSerie): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const serieId = this.repositorioDeSeries.createId();

      const serie = new Serie(
        serieId,
        solicitacao.nome,
        solicitacao.cor,
        solicitacao.ativa,
        solicitacao.data.toDate(),
      );

      const result = this.repositorioDeSeries.add(solicitacao.monstroId, serie);

      resolve(result);
    });
  }

  atualizaSerie(serieId: string, solicitacao: SolicitacaoDeCadastroDeSerie): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.repositorioDeSeries.obtemSerieObservavel(solicitacao.monstroId, serieId).pipe(first()).subscribe(serie => {
        serie.corrigeNome(solicitacao.nome);

        serie.ajustaCor(solicitacao.cor);

        if (serie.ativa && !solicitacao.ativa) {
          serie.desativa();
        }

        if (!serie.ativa && solicitacao.ativa) {
          serie.reativa();
        }

        serie.corrigeData(solicitacao.data.toDate());

        const result = this.repositorioDeSeries.update(solicitacao.monstroId, serie);

        resolve(result);
      });
    });
  }

  adicionaExercicio(solicitacao: SolicitacaoDeCadastroDeExercicio): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.repositorioDeSeries.obtemSerieObservavel(solicitacao.monstroId, solicitacao.serieId).pipe(
        first()
      ).subscribe(serie => {
        this.exerciciosService.obtemExercicioObservavel(solicitacao.exercicioId).pipe(
          first()
        ).subscribe(exercicio => {
          serie.adicionaExercicio(exercicio, solicitacao.quantidade, solicitacao.repeticoes, solicitacao.carga, solicitacao.nota);

          const result = this.repositorioDeSeries.update(solicitacao.monstroId, serie);

          resolve(result);
        });
      });
    });
  }

  atualizaExercicio(serieDeExercicioId: number, solicitacao: SolicitacaoDeCadastroDeExercicio): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.repositorioDeSeries.obtemSerieObservavel(solicitacao.monstroId, solicitacao.serieId).pipe(
        first()
      ).subscribe(serie => {
        const serieDeExercicio = serie.obtemSerieDeExercicio(serieDeExercicioId);

        serieDeExercicio.alteraSequencia(solicitacao.sequencia);

        // serieDeExercicio.acertaExercicio(solicitacao.exercicio);

        serieDeExercicio.corrigeQuantidade(solicitacao.quantidade);

        serieDeExercicio.ajustaRepeticoes(solicitacao.repeticoes);

        serieDeExercicio.ajustaCarga(solicitacao.carga);

        serieDeExercicio.atualizaNota(solicitacao.nota);

        const result = this.repositorioDeSeries.update(solicitacao.monstroId, serie);

        resolve(result);
      });
    });
  }

  removeExercicio(monstroId: string, serieId: string, serieDeExercicioId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.repositorioDeSeries.obtemSerieObservavel(monstroId, serieId).pipe(
        first()
      ).subscribe(serie => {
        serie.removeSerieDeExercicio(serieDeExercicioId);

        const result = this.repositorioDeSeries.update(monstroId, serie);

        resolve(result);
      });
    });
  }

  async excluiSerie(monstroId: string, serieId: string): Promise<void> {
    return await this.repositorioDeSeries.remove(monstroId, serieId);
  }
}
