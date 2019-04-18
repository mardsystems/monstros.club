import { Inject, Injectable } from '@angular/core';
import { UnitOfWork, UNIT_OF_WORK } from 'src/app/@app-transactions.model';
import { RepositorioDeAcademias, REPOSITORIO_DE_ACADEMIAS } from '../academias/@academias-domain.model';
import { Aparelho, RepositorioDeAparelhos, REPOSITORIO_DE_APARELHOS } from '../aparelhos/@aparelhos-domain.model';
import { RepositorioDeExercicios, REPOSITORIO_DE_EXERCICIOS } from '../exercicios/@exercicios-domain.model';
import { CadastroDeAparelhos, SolicitacaoDeCadastroDeAparelho } from './@aparelhos-cadastro-application.model';
import { FirebaseTransactionManager } from 'src/app/@app-firebase.model';
import { AparelhosFirebaseService } from '../aparelhos/@aparelhos-firebase.service';
import { AcademiasFirebaseService } from '../academias/@academias-firebase.service';
import { ExerciciosFirebaseService } from '../exercicios/@exercicios-firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AparelhosCadastroService implements CadastroDeAparelhos {
  constructor(
    // @Inject(UNIT_OF_WORK)
    protected readonly unitOfWork: FirebaseTransactionManager, // UnitOfWork
    // @Inject(REPOSITORIO_DE_APARELHOS)
    protected readonly repositorioDeAparelhos: AparelhosFirebaseService, // RepositorioDeAparelhos
    // @Inject(REPOSITORIO_DE_ACADEMIAS)
    protected readonly repositorioDeAcademias: AcademiasFirebaseService, // RepositorioDeAcademias
    // @Inject(REPOSITORIO_DE_EXERCICIOS)
    protected readonly repositorioDeExercicios: ExerciciosFirebaseService, // RepositorioDeExercicios
  ) { }

  async cadastraAparelho(solicitacao: SolicitacaoDeCadastroDeAparelho): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const aparelhoId = this.repositorioDeAparelhos.createId();

      const academia = await this.repositorioDeAcademias.obtemAcademia(solicitacao.academiaId);

      const exercicios = await Promise.all(
        solicitacao.exerciciosIds.map(exercicioId => this.repositorioDeExercicios.obtemExercicio(exercicioId))
      );

      //

      const aparelho = new Aparelho(
        aparelhoId,
        solicitacao.codigo,
        academia,
        exercicios,
        solicitacao.imagemURL,
      );

      //

      await this.repositorioDeAparelhos.add(aparelho);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }

  async atualizaAparelho(aparelhoId: string, solicitacao: SolicitacaoDeCadastroDeAparelho): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const aparelho = await this.repositorioDeAparelhos.obtemAparelho(aparelhoId);

      const academia = await this.repositorioDeAcademias.obtemAcademia(solicitacao.academiaId);

      const exercicios = await Promise.all(
        solicitacao.exerciciosIds.map(exercicioId => this.repositorioDeExercicios.obtemExercicio(exercicioId))
      );

      //

      aparelho.alteraCodigo(solicitacao.codigo);

      aparelho.corrigeAcademia(academia);

      aparelho.alteraExercicios(exercicios);

      aparelho.alteraImagemURL(solicitacao.imagemURL);

      //

      await this.repositorioDeAparelhos.update(aparelho);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }

  async excluiAparelho(aparelhoId: string): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const aparelho = await this.repositorioDeAparelhos.obtemAparelho(aparelhoId);

      //

      await this.repositorioDeAparelhos.remove(aparelho);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }
}
