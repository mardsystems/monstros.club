import { Exercicio } from '../exercicios.domain-model';
import { SolicitacaoDeCadastroDeExercicio } from './cadastro.application-model';

export class CadastroDeExercicioViewModel extends SolicitacaoDeCadastroDeExercicio {
  isEdit: boolean;
  id?: string; // Usado apenas na edição.

  static toAddViewModel(): CadastroDeExercicioViewModel {
    const solicitacao = SolicitacaoDeCadastroDeExercicio.toAdd();

    return {
      isEdit: false,
      id: null,
      codigo: solicitacao.codigo,
      nome: solicitacao.nome,
      musculatura: solicitacao.musculatura,
      imagemURL: solicitacao.imagemURL,
    };
  }

  static toEditViewModel(exercicio: Exercicio): CadastroDeExercicioViewModel {
    const solicitacao = SolicitacaoDeCadastroDeExercicio.toEdit(exercicio);

    return {
      isEdit: true,
      id: exercicio.id,
      codigo: solicitacao.codigo,
      nome: solicitacao.nome,
      musculatura: solicitacao.musculatura,
      imagemURL: solicitacao.imagemURL,
    };
  }
}
