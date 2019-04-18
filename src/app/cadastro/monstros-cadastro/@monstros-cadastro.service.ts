import { Inject } from '@angular/core';
import { CalculoDeIdade, CALCULO_DE_IDADE } from 'src/app/@app-domain.model';
import { UnitOfWork, UNIT_OF_WORK } from 'src/app/@app-transactions.model';
import { Monstro, RepositorioDeMonstros, REPOSITORIO_DE_MONSTROS } from '../monstros/@monstros-domain.model';
import { CadastroDeMonstros, SolicitacaoDeCadastroDeMonstro } from './@monstros-cadastro-application.model';

export class MonstrosCadastroService implements CadastroDeMonstros {
  constructor(
    @Inject(UNIT_OF_WORK)
    protected readonly unitOfWork: UnitOfWork,
    @Inject(REPOSITORIO_DE_MONSTROS)
    protected readonly repositorioDeMonstros: RepositorioDeMonstros,
    @Inject(CALCULO_DE_IDADE)
    protected readonly calculoDeIdade: CalculoDeIdade,
  ) {

  }

  async cadastraMonstro(solicitacao: SolicitacaoDeCadastroDeMonstro): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      // const monstroId = this.repositorioDeMonstros.createId();

      //

      const monstro = new Monstro(
        solicitacao.admin,
        solicitacao.displayName,
        solicitacao.email,
        solicitacao.photoURL,
        solicitacao.id,
        solicitacao.nome,
        solicitacao.usuario,
        solicitacao.genero,
        solicitacao.altura,
        (solicitacao.dataDeNascimento ? solicitacao.dataDeNascimento.toDate() : null),
        solicitacao.dataDoUltimoLogin.toDate(),
        this.calculoDeIdade
      );

      //

      await this.repositorioDeMonstros.add(monstro);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }

  async atualizaMonstro(monstroId: string, solicitacao: SolicitacaoDeCadastroDeMonstro): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const monstro = await this.repositorioDeMonstros.obtemMonstro(monstroId);

      //

      monstro.defineDisplayName(solicitacao.displayName);

      monstro.defineEmail(solicitacao.email);

      monstro.definePhotoURL(solicitacao.photoURL);

      monstro.defineNome(solicitacao.nome);

      monstro.defineUsuario(solicitacao.usuario);

      monstro.defineGenero(solicitacao.genero);

      monstro.defineAltura(solicitacao.altura);

      if (solicitacao.dataDeNascimento) {
        monstro.defineDataDeNascimento(solicitacao.dataDeNascimento.toDate());
      }

      monstro.defineDataDoUltimoLogin(solicitacao.dataDoUltimoLogin.toDate());

      //

      await this.repositorioDeMonstros.update(monstro);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }


  async excluiMonstro(monstroId: string): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const monstro = await this.repositorioDeMonstros.obtemMonstro(monstroId);

      //

      await this.repositorioDeMonstros.remove(monstro);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }
}
