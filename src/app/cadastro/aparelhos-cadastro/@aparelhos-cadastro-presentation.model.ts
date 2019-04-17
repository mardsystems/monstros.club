import { Aparelho } from '../aparelhos/aparelhos-@domain.model';
import { SolicitacaoDeCadastroDeAparelho } from './@aparelhos-cadastro-application.model';

export class CadastroDeAparelhoViewModel extends SolicitacaoDeCadastroDeAparelho {
  isEdit: boolean;
  id?: string; // Usado apenas na edição.

  static toAddViewModel(): CadastroDeAparelhoViewModel {
    const solicitacao = SolicitacaoDeCadastroDeAparelho.toAdd();

    return {
      isEdit: false,
      id: null,
      codigo: solicitacao.codigo,
      academiaId: solicitacao.academiaId,
      exerciciosIds: solicitacao.exerciciosIds,
      imagemURL: solicitacao.imagemURL,
    };
  }

  static toEditViewModel(aparelho: Aparelho): CadastroDeAparelhoViewModel {
    const solicitacao = SolicitacaoDeCadastroDeAparelho.toEdit(aparelho);

    return {
      isEdit: true,
      id: aparelho.id,
      codigo: solicitacao.codigo,
      academiaId: solicitacao.academiaId,
      exerciciosIds: solicitacao.exerciciosIds,
      imagemURL: solicitacao.imagemURL,
    };
  }
}
