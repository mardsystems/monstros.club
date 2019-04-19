import { Inject, Injectable } from '@angular/core';
import { UnitOfWork, UNIT_OF_WORK } from 'src/app/common/transactions.model';
import { RepositorioDeAcademias, REPOSITORIO_DE_ACADEMIAS } from '../academias/@academias-domain.model';
import { Aparelho, RepositorioDeAparelhos, REPOSITORIO_DE_APARELHOS } from '../aparelhos/@aparelhos-domain.model';
import { RepositorioDeExercicios, REPOSITORIO_DE_EXERCICIOS } from '../exercicios/@exercicios-domain.model';
import { CadastroDeAparelhos, SolicitacaoDeCadastroDeAparelho } from './@aparelhos-cadastro-application.model';

@Injectable()
export class AparelhosCadastroService implements CadastroDeAparelhos {
  constructor(
    @Inject(UNIT_OF_WORK)
    protected readonly unitOfWork: UnitOfWork,
    @Inject(REPOSITORIO_DE_APARELHOS)
    protected readonly repositorioDeAparelhos: RepositorioDeAparelhos,
    @Inject(REPOSITORIO_DE_ACADEMIAS)
    protected readonly repositorioDeAcademias: RepositorioDeAcademias,
    @Inject(REPOSITORIO_DE_EXERCICIOS)
    protected readonly repositorioDeExercicios: RepositorioDeExercicios,
  ) { }

  async cadastraAparelho(solicitacao: SolicitacaoDeCadastroDeAparelho): Promise<void> {
    await this.unitOfWork.beginTransaction();

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
    await this.unitOfWork.beginTransaction();

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
    await this.unitOfWork.beginTransaction();

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
