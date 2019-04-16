import { InjectionToken } from '@angular/core';
import { Academia } from '../academias/academias-@domain.model';

export const CADASTRO_DE_ACADEMIAS = new InjectionToken<CadastroDeAcademias>('CADASTRO_DE_ACADEMIAS');

export interface CadastroDeAcademias {
  cadastraAcademia(solicitacao: SolicitacaoDeCadastroDeAcademia): Promise<void>;

  atualizaAcademia(academiaId: string, solicitacao: SolicitacaoDeCadastroDeAcademia): Promise<void>;

  excluiAcademia(academiaId: string): Promise<void>;
}

export class SolicitacaoDeCadastroDeAcademia {
  nome: string;
  logoURL: string;

  static toAdd(): SolicitacaoDeCadastroDeAcademia {
    return {
      nome: null,
      logoURL: null,
    };
  }

  static toEdit(academia: Academia): SolicitacaoDeCadastroDeAcademia {
    return {
      nome: academia.nome,
      logoURL: academia.logoURL,
    };
  }
}
