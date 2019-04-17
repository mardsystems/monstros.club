import { InjectionToken } from '@angular/core';
import { Exercicio, Musculatura } from '../exercicios/exercicios-@domain.model';

export const CADASTRO_DE_EXERCICIOS = new InjectionToken<CadastroDeExercicios>('CADASTRO_DE_EXERCICIOS');

export interface CadastroDeExercicios {
  cadastraExercicio(solicitacao: SolicitacaoDeCadastroDeExercicio): Promise<void>;

  atualizaExercicio(exercicioId: string, solicitacao: SolicitacaoDeCadastroDeExercicio): Promise<void>;

  excluiExercicio(exercicioId: string): Promise<void>;
}

export class SolicitacaoDeCadastroDeExercicio {
  codigo: string;
  nome: string;
  musculatura: Musculatura;
  imagemURL: string;

  static toAdd(): SolicitacaoDeCadastroDeExercicio {
    return {
      codigo: null,
      nome: null,
      musculatura: null,
      imagemURL: null,
    };
  }

  static toEdit(exercicio: Exercicio): SolicitacaoDeCadastroDeExercicio {
    return {
      codigo: exercicio.codigo,
      nome: exercicio.nome,
      musculatura: exercicio.musculatura,
      imagemURL: exercicio.imagemURL,
    };
  }
}
