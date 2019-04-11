import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { Exercicio } from '../exercicios/exercicios.domain-model';
import { ExerciciosService } from '../exercicios/exercicios.service';
import { SolicitacaoDeCadastroDeExercicio } from './exercicios-cadastro.application-model';

@Injectable({
  providedIn: 'root'
})
export class ExerciciosCadastroService {
  constructor(
    private repositorioDeExercicios: ExerciciosService,
  ) { }

  cadastraExercicio(solicitacao: SolicitacaoDeCadastroDeExercicio): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const exercicioId = this.repositorioDeExercicios.createId();

      const exercicio = new Exercicio(
        exercicioId,
        solicitacao.codigo,
        solicitacao.nome,
        solicitacao.musculatura,
        solicitacao.imagemURL,
      );

      const result = this.repositorioDeExercicios.add(exercicio);

      resolve(result);
    });
  }

  atualizaExercicio(exercicioId: string, solicitacao: SolicitacaoDeCadastroDeExercicio): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.repositorioDeExercicios.obtemExercicioObservavel(exercicioId).pipe(
        first()
      ).subscribe(exercicio => {
        exercicio.ajustaCodigo(solicitacao.codigo);

        exercicio.corrigeNome(solicitacao.nome);

        exercicio.corrigeMusculatura(solicitacao.musculatura);

        exercicio.alteraImagemURL(solicitacao.imagemURL);

        const result = this.repositorioDeExercicios.update(exercicio);

        resolve(result);
      });
    });
  }

  async excluiExercicio(exercicioId: string): Promise<void> {
    return await this.repositorioDeExercicios.remove(exercicioId);
  }
}
