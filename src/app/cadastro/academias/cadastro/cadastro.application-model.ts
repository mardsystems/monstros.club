import { Academia } from '../academias.domain-model';

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
