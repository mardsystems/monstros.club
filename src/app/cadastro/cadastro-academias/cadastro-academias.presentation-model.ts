import { Academia } from '../academias/academias.domain-model';
import { SolicitacaoDeCadastroDeAcademia } from './cadastro-academias.application-model';

export class CadastroDeAcademiaViewModel extends SolicitacaoDeCadastroDeAcademia {
  isEdit: boolean;
  id?: string; // Usado apenas na edição.

  static toAddViewModel(): CadastroDeAcademiaViewModel {
    const solicitacao = SolicitacaoDeCadastroDeAcademia.toAdd();

    return {
      isEdit: false,
      id: null,
      nome: solicitacao.nome,
      logoURL: solicitacao.logoURL,
    };
  }

  static toEditViewModel(academia: Academia): CadastroDeAcademiaViewModel {
    const solicitacao = SolicitacaoDeCadastroDeAcademia.toEdit(academia);

    return {
      isEdit: true,
      id: academia.id,
      nome: solicitacao.nome,
      logoURL: solicitacao.logoURL,
    };
  }
}
