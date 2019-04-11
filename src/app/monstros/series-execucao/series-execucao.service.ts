import { Injectable } from '@angular/core';
import { first, map } from 'rxjs/operators';
import { LogService } from 'src/app/app-common.services';
import { ExerciciosService } from 'src/app/cadastro/exercicios/exercicios.service';
import { Serie } from '../series/series.domain-model';
import { SeriesService } from '../series/series.service';
import { SolicitacaoDeExecucaoDeExercicio, SolicitacaoDeExecucaoDeSerie } from './series-execucao.application-model';
import { ExecucaoDeSerie } from '../series/execucoes/execucoes.domain-model';
import { ExecucoesService } from '../series/execucoes/execucoes.service';
import { CONST_TIMESTAMP_FALSO } from 'src/app/app-common.domain-model';
import { AcademiasService } from 'src/app/cadastro/academias/academias.service';
import { AparelhosService } from 'src/app/cadastro/aparelhos/aparelhos.service';

@Injectable({
  providedIn: 'root'
})
export class SeriesExecucaoService {
  constructor(
    private repositorioDeSeries: SeriesService,
    private repositorioDeExecucoes: ExecucoesService,
    private repositorioDeAcademias: AcademiasService,
    private repositorioDeAparelhos: AparelhosService,
  ) { }

  iniciaExecucao(solicitacao: SolicitacaoDeExecucaoDeSerie): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.repositorioDeSeries.obtemSerieObservavel(solicitacao.monstroId, solicitacao.serieId).pipe(first()).subscribe(serie => {
        this.repositorioDeAcademias.obtemAcademiaObservavel(solicitacao.feitaNaId).pipe(first()).subscribe(academia => {
          const execucaoId = this.repositorioDeExecucoes.createId();

          const execucao = new ExecucaoDeSerie(
            execucaoId,
            serie,
            solicitacao.dia.toDate(),
            solicitacao.numero,
            academia
          );

          execucao.prepara(this.repositorioDeAparelhos).then(() => {
            const result = this.repositorioDeExecucoes.add(solicitacao.monstroId, serie, execucao);

            resolve(result);
          });
        });
      });
    });
  }

  // atualizaSerie(serieId: string, solicitacao: SolicitacaoDeExecucaoDeSerie): Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     this.repositorioDeExecucoes.obtemSerieObservavel(solicitacao.monstroId, serieId).pipe(first()).subscribe(serie => {
  //       serie.corrigeNome(solicitacao.nome);

  //       serie.ajustaCor(solicitacao.cor);

  //       if (serie.ativa && !solicitacao.ativa) {
  //         serie.desativa();
  //       }

  //       if (!serie.ativa && solicitacao.ativa) {
  //         serie.reativa();
  //       }

  //       serie.corrigeData(solicitacao.data.toDate());

  //       const result = this.repositorioDeExecucoes.update(solicitacao.monstroId, serie);

  //       resolve(result);
  //     });
  //   });
  // }

  // adicionaExercicio(solicitacao: SolicitacaoDeExecucaoDeExercicio): Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     this.repositorioDeExecucoes.obtemSerieObservavel(solicitacao.monstroId, solicitacao.serieId).pipe(
  //       first()
  //     ).subscribe(serie => {
  //       this.exerciciosService.obtemExercicioObservavel(solicitacao.exercicioId).pipe(
  //         first()
  //       ).subscribe(exercicio => {
  //         serie.adicionaExercicio(exercicio, solicitacao.quantidade, solicitacao.repeticoes, solicitacao.carga, solicitacao.nota);

  //         const result = this.repositorioDeExecucoes.update(solicitacao.monstroId, serie);

  //         resolve(result);
  //       });
  //     });
  //   });
  // }

  // atualizaExercicio(serieDeExercicioId: number, solicitacao: SolicitacaoDeExecucaoDeExercicio): Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     this.repositorioDeExecucoes.obtemSerieObservavel(solicitacao.monstroId, solicitacao.serieId).pipe(
  //       first()
  //     ).subscribe(serie => {
  //       const serieDeExercicio = serie.obtemSerieDeExercicio(serieDeExercicioId);

  //       serieDeExercicio.alteraSequencia(solicitacao.sequencia);

  //       // serieDeExercicio.acertaExercicio(solicitacao.exercicio);

  //       serieDeExercicio.corrigeQuantidade(solicitacao.quantidade);

  //       serieDeExercicio.ajustaRepeticoes(solicitacao.repeticoes);

  //       serieDeExercicio.ajustaCarga(solicitacao.carga);

  //       serieDeExercicio.atualizaNota(solicitacao.nota);

  //       const result = this.repositorioDeExecucoes.update(solicitacao.monstroId, serie);

  //       resolve(result);
  //     });
  //   });
  // }

  // removeExercicio(monstroId: string, serieId: string, serieDeExercicioId: number): Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     this.repositorioDeExecucoes.obtemSerieObservavel(monstroId, serieId).pipe(
  //       first()
  //     ).subscribe(serie => {
  //       serie.removeSerieDeExercicio(serieDeExercicioId);

  //       const result = this.repositorioDeExecucoes.update(monstroId, serie);

  //       resolve(result);
  //     });
  //   });
  // }

  // async excluiSerie(monstroId: string, serieId: string): Promise<void> {
  //   return await this.repositorioDeExecucoes.remove(monstroId, serieId);
  // }
}
