import * as moment from 'moment';
import { TipoDeBalanca } from '../medidas/medidas.domain-model';
import { Ranking } from '../rankings/rankings.domain-model';

export class SolicitacaoDeCadastroDeRanking {
  nome: string;
  proprietarioId: string;
  dataDeCriacao: moment.Moment;
  feitoCom: TipoDeBalanca;

  static toAdd(proprietarioId: string): SolicitacaoDeCadastroDeRanking {
    return {
      nome: null,
      proprietarioId: proprietarioId,
      dataDeCriacao: moment(new Date(Date.now())),
      feitoCom: TipoDeBalanca.OmronHBF214,
    };
  }

  static toEdit(ranking: Ranking): SolicitacaoDeCadastroDeRanking {
    return {
      nome: ranking.nome,
      proprietarioId: ranking.proprietarioId,
      dataDeCriacao: moment(ranking.dataDeCriacao),
      feitoCom: ranking.feitoCom,
    };
  }
}

export interface ICadastroDeRanking {
  cadastraRanking(solicitacao: SolicitacaoDeCadastroDeRanking): Promise<void>;

  atualizaRanking(rankingId: string, solicitacao: SolicitacaoDeCadastroDeRanking): Promise<void>;

  excluiRanking(rankingId: string): Promise<void>;
}
