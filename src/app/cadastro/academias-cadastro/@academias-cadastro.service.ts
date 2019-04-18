import { Inject, Injectable } from '@angular/core';
import { UnitOfWork, UNIT_OF_WORK } from 'src/app/@app-transactions.model';
import { Academia, RepositorioDeAcademias, REPOSITORIO_DE_ACADEMIAS } from '../academias/@academias-domain.model';
import { CadastroDeAcademias, SolicitacaoDeCadastroDeAcademia } from './@academias-cadastro-application.model';

@Injectable()
export class AcademiasCadastroService implements CadastroDeAcademias {
  constructor(
    @Inject(UNIT_OF_WORK)
    protected readonly unitOfWork: UnitOfWork,
    @Inject(REPOSITORIO_DE_ACADEMIAS)
    protected readonly repositorioDeAcademias: RepositorioDeAcademias,
  ) { }

  async cadastraAcademia(solicitacao: SolicitacaoDeCadastroDeAcademia): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const academiaId = this.repositorioDeAcademias.createId();

      //

      const academia = new Academia(
        academiaId,
        solicitacao.nome,
        solicitacao.logoURL,
      );

      //

      await this.repositorioDeAcademias.add(academia);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }

  async atualizaAcademia(academiaId: string, solicitacao: SolicitacaoDeCadastroDeAcademia): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const academia = await this.repositorioDeAcademias.obtemAcademia(academiaId);

      //

      academia.defineNome(solicitacao.nome);

      academia.definelogoURL(solicitacao.logoURL);

      //

      await this.repositorioDeAcademias.update(academia);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }

  async excluiAcademia(academiaId: string): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const academia = await this.repositorioDeAcademias.obtemAcademia(academiaId);

      //

      await this.repositorioDeAcademias.remove(academia);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }
}
