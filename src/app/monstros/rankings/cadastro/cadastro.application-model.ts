import * as moment from 'moment';
import { TipoDeBalanca } from '../../medidas/medidas.domain-model';
import { Ranking } from '../rankings.domain-model';

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

export class SolicitacaoDeParticipacaoDeRanking {
  rankingId: string;
  participanteId: string;
  ehAdministrador: boolean;

  static create(rankingId: string): SolicitacaoDeParticipacaoDeRanking {
    return {
      rankingId: rankingId,
      participanteId: null,
      ehAdministrador: false,
    };
  }
}

export interface ICadastroDeRanking {
  cadastraRanking(solicitacao: SolicitacaoDeCadastroDeRanking): Promise<void>;

  atualizaRanking(rankingId: string, solicitacao: SolicitacaoDeCadastroDeRanking): Promise<void>;

  adicionaParticipante(solicitacao: SolicitacaoDeParticipacaoDeRanking): Promise<void>;

  excluiRanking(rankingId: string): Promise<void>;
}
