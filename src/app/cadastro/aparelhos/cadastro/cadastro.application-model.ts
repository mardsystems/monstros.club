import { Academia } from '../../academias/academias.domain-model';
import { Aparelho } from '../aparelhos.domain-model';

export class SolicitacaoDeCadastroDeAparelho {
  codigo: string;
  academia: Academia;
  imagemURL: string;

  static toAdd(): SolicitacaoDeCadastroDeAparelho {
    return {
      codigo: null,
      academia: null,
      imagemURL: null,
    };
  }

  static toEdit(aparelho: Aparelho): SolicitacaoDeCadastroDeAparelho {
    return {
      codigo: aparelho.codigo,
      academia: aparelho.academia,
      imagemURL: aparelho.imagemURL,
    };
  }
}

export class SolicitacaoDeAdicaoDeExercicio {
  aparelhoId: string;
  exercicioId: string;

  static create(aparelhoId: string): SolicitacaoDeAdicaoDeExercicio {
    return {
      aparelhoId: aparelhoId,
      exercicioId: null,
    };
  }
}
