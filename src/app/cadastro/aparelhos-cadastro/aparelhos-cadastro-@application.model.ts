import { InjectionToken } from '@angular/core';
import { Aparelho } from '../aparelhos/aparelhos-@domain.model';

export const CADASTRO_DE_APARELHOS = new InjectionToken<CadastroDeAparelhos>('CADASTRO_DE_APARELHOS');

export interface CadastroDeAparelhos {
  cadastraAparelho(solicitacao: SolicitacaoDeCadastroDeAparelho): Promise<void>;

  atualizaAparelho(aparelhoId: string, solicitacao: SolicitacaoDeCadastroDeAparelho): Promise<void>;

  excluiAparelho(aparelhoId: string): Promise<void>;
}

export class SolicitacaoDeCadastroDeAparelho {
  codigo: string;
  academiaId: string;
  exerciciosIds: string[];
  imagemURL: string;

  static toAdd(): SolicitacaoDeCadastroDeAparelho {
    return {
      codigo: null,
      academiaId: null,
      exerciciosIds: [],
      imagemURL: null,
    };
  }

  static toEdit(aparelho: Aparelho): SolicitacaoDeCadastroDeAparelho {
    return {
      codigo: aparelho.codigo,
      academiaId: aparelho.academia.id,
      exerciciosIds: aparelho.exercicios.map(exercicio => exercicio.id),
      imagemURL: aparelho.imagemURL,
    };
  }
}

