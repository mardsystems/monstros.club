import { Aparelho } from '../aparelhos/aparelhos.domain-model';

export class SolicitacaoDeCadastroDeAparelho {
  codigo: string;
  academia: string;
  exercicios: string[];
  imagemURL: string;

  static toAdd(): SolicitacaoDeCadastroDeAparelho {
    return {
      codigo: null,
      academia: null,
      exercicios: [],
      imagemURL: null,
    };
  }

  static toEdit(aparelho: Aparelho): SolicitacaoDeCadastroDeAparelho {
    return {
      codigo: aparelho.codigo,
      academia: aparelho.academia.id,
      exercicios: aparelho.exercicios.map(exercicio => exercicio.id),
      imagemURL: aparelho.imagemURL,
    };
  }
}

