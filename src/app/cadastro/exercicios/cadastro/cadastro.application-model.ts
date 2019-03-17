import { Exercicio } from '../exercicios.domain-model';
import { Musculatura } from '../exercicios.domain-model';

export class SolicitacaoDeCadastroDeExercicio {
  nome: string;
  musculatura: Musculatura;
  imagemURL: string;

  static toAdd(): SolicitacaoDeCadastroDeExercicio {
    return {
      nome: null,
      musculatura: null,
      imagemURL: null,
    };
  }

  static toEdit(exercicio: Exercicio): SolicitacaoDeCadastroDeExercicio {
    return {
      nome: exercicio.nome,
      musculatura: exercicio.musculatura,
      imagemURL: exercicio.imagemURL,
    };
  }
}
