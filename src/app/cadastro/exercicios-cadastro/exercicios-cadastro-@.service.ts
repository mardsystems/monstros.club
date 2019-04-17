import { Inject } from '@angular/core';
import { UnitOfWork, UNIT_OF_WORK } from 'src/app/app-@transactions.model';
import { Exercicio, RepositorioDeExercicios, REPOSITORIO_DE_EXERCICIOS } from '../exercicios/exercicios-@domain.model';
import { CadastroDeExercicios, SolicitacaoDeCadastroDeExercicio } from './exercicios-cadastro-@application.model';

export class ExerciciosCadastroService implements CadastroDeExercicios {
  constructor(
    @Inject(UNIT_OF_WORK)
    private unitOfWork: UnitOfWork,
    @Inject(REPOSITORIO_DE_EXERCICIOS)
    private repositorioDeExercicios: RepositorioDeExercicios,
  ) { }

  async cadastraExercicio(solicitacao: SolicitacaoDeCadastroDeExercicio): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const exercicioId = this.repositorioDeExercicios.createId();

      //

      const exercicio = new Exercicio(
        exercicioId,
        solicitacao.codigo,
        solicitacao.nome,
        solicitacao.musculatura,
        solicitacao.imagemURL,
      );

      //

      await this.repositorioDeExercicios.add(exercicio);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }

  async atualizaExercicio(exercicioId: string, solicitacao: SolicitacaoDeCadastroDeExercicio): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const exercicio = await this.repositorioDeExercicios.obtemExercicio(exercicioId);

      //

      exercicio.ajustaCodigo(solicitacao.codigo);

      exercicio.corrigeNome(solicitacao.nome);

      exercicio.corrigeMusculatura(solicitacao.musculatura);

      exercicio.alteraImagemURL(solicitacao.imagemURL);

      //

      await this.repositorioDeExercicios.update(exercicio);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }

  async excluiExercicio(exercicioId: string): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const exercicio = await this.repositorioDeExercicios.obtemExercicio(exercicioId);

      //

      await this.repositorioDeExercicios.remove(exercicio);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }
}
