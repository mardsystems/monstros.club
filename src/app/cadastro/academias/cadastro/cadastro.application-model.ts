import { Academia } from '../academias.domain-model';

export class SolicitacaoDeCadastroDeAcademia {
  nome: string;
  logo: string;

  static toAdd(): SolicitacaoDeCadastroDeAcademia {
    return {
      nome: null,
      logo: null,
    };
  }

  static toEdit(academia: Academia): SolicitacaoDeCadastroDeAcademia {
    return {
      nome: academia.nome,
      logo: academia.logo,
    };
  }
}
