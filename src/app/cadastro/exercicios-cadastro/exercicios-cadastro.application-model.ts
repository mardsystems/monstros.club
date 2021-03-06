import { Exercicio } from '../exercicios/exercicios.domain-model';
import { Musculatura } from '../exercicios/exercicios.domain-model';

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
