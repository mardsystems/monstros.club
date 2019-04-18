import { Inject, Injectable } from '@angular/core';
import { UnitOfWork, UNIT_OF_WORK } from 'src/app/@app-transactions.model';
import { RepositorioDeAcademias, REPOSITORIO_DE_ACADEMIAS } from 'src/app/cadastro/academias/@academias-domain.model';
import { RepositorioDeAparelhos, REPOSITORIO_DE_APARELHOS } from 'src/app/cadastro/aparelhos/@aparelhos-domain.model';
import { RepositorioDeSeries, REPOSITORIO_DE_SERIES } from '../series/@series-domain.model';
import { ExecucaoDeSerie } from '../series/execucoes/@execucoes-domain.model';
import { ExecucoesFirebaseService } from '../series/execucoes/@execucoes-firebase.service';
import { ExecucaoDeSeries, SolicitacaoDeExecucaoDeSerie } from './@series-execucao-application.model';
import { FirebaseTransactionManager } from 'src/app/@app-firebase.model';
import { AparelhosFirebaseService } from 'src/app/cadastro/aparelhos/@aparelhos-firebase.service';
import { SeriesFirebaseService } from '../series/@series-firebase.service';
import { AcademiasFirebaseService } from 'src/app/cadastro/academias/@academias-firebase.service';

@Injectable({
  providedIn: 'root'
})
export class SeriesExecucaoService
  implements ExecucaoDeSeries {
  constructor(
    // @Inject(UNIT_OF_WORK)
    protected readonly unitOfWork: FirebaseTransactionManager, //  UnitOfWork
    // @Inject(REPOSITORIO_DE_SERIES)
    protected readonly repositorioDeSeries: SeriesFirebaseService, // RepositorioDeSeries;
    // @Inject(REPOSITORIO_DE_ACADEMIAS)
    private repositorioDeAcademias: AcademiasFirebaseService,  // RepositorioDeAcademias
    // @Inject(REPOSITORIO_DE_APARELHOS)
    private repositorioDeAparelhos: AparelhosFirebaseService,  // RepositorioDeAparelhos
    // @Inject(REPOSITORIO_DE_ACADEMIAS)
    private repositorioDeExecucoes: ExecucoesFirebaseService, // ExecucoesFirebaseService
  ) { }

  async iniciaExecucao(solicitacao: SolicitacaoDeExecucaoDeSerie): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const serie = await this.repositorioDeSeries.obtemSerie(solicitacao.monstroId, solicitacao.serieId);

      const academia = await this.repositorioDeAcademias.obtemAcademia(solicitacao.feitaNaId);

      const execucaoId = this.repositorioDeExecucoes.createId();

      //

      const execucao = new ExecucaoDeSerie(
        execucaoId,
        serie,
        solicitacao.dia.toDate(),
        solicitacao.numero,
        academia
      );

      await execucao.prepara(this.repositorioDeAparelhos);

      //

      await this.repositorioDeExecucoes.add(solicitacao.monstroId, serie, execucao);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }
}
