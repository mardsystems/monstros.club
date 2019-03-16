import { Academia } from '../academias.domain-model';
import { SolicitacaoDeCadastroDeAcademia } from './cadastro.application-model';

export class CadastroDeAcademiaViewModel extends SolicitacaoDeCadastroDeAcademia {
  isEdit: boolean;
  id?: string; // Usado apenas na edição.

  static toAddViewModel(): CadastroDeAcademiaViewModel {
    const solicitacao = SolicitacaoDeCadastroDeAcademia.toAdd();

    return {
      isEdit: false,
      id: null,
      nome: solicitacao.nome,
      logo: solicitacao.logo,
    };
  }

  static toEditViewModel(academia: Academia): CadastroDeAcademiaViewModel {
    const solicitacao = SolicitacaoDeCadastroDeAcademia.toEdit(academia);

    return {
      isEdit: true,
      id: academia.id,
      nome: solicitacao.nome,
      logo: solicitacao.logo,
    };
  }
}
