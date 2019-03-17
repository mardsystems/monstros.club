import { Aparelho } from '../aparelhos.domain-model';
import { SolicitacaoDeCadastroDeAparelho } from './cadastro.application-model';

export class CadastroDeAparelhoViewModel extends SolicitacaoDeCadastroDeAparelho {
  isEdit: boolean;
  id?: string; // Usado apenas na edição.

  static toAddViewModel(): CadastroDeAparelhoViewModel {
    const solicitacao = SolicitacaoDeCadastroDeAparelho.toAdd();

    return {
      isEdit: false,
      id: null,
      codigo: solicitacao.codigo,
      academia: solicitacao.academia,
      exercicios: solicitacao.exercicios,
      imagemURL: solicitacao.imagemURL,
    };
  }

  static toEditViewModel(aparelho: Aparelho): CadastroDeAparelhoViewModel {
    const solicitacao = SolicitacaoDeCadastroDeAparelho.toEdit(aparelho);

    return {
      isEdit: true,
      id: aparelho.id,
      codigo: solicitacao.codigo,
      academia: solicitacao.academia,
      exercicios: solicitacao.exercicios,
      imagemURL: solicitacao.imagemURL,
    };
  }
}
