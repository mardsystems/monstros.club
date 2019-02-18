import { Monstro, Genero } from '../monstros.model';
import * as moment from 'moment';
import { TipoDeBalanca } from '../medidas/medidas.model';

export class Ranking {
  private _participantes: Participacao[];

  public constructor(
    private _id: string,
    private _nome: string,
    private _proprietario: Monstro,
    private _proprietarioId: string,
    private _feitoCom: TipoDeBalanca,
    private _timestamp?: number,
    private _dataDeCriacao?: Date,
    participantes?: Participacao[]
  ) {
    if (_timestamp) {
      this._participantes = participantes;
    } else {
      const agora = new Date(Date.now());

      this._dataDeCriacao = agora;

      const ehAdministrador = true;

      this._participantes = [];

      this.adicionaParticipante(this._proprietario, agora, ehAdministrador);
    }
  }

  public get id() { return this._id; }

  public get nome() { return this._nome; }

  public get proprietario() { return this._proprietario; }

  public get proprietarioId() { return this._proprietarioId; }

  public get dataDeCriacao() { return this._dataDeCriacao; }

  public get feitoCom() { return this._feitoCom; }

  public get participantes() { return this._participantes; }

  public get timestamp() { return this._timestamp; }

  public defineNome(nome: string) {
    this._nome = nome;
  }

  public adicionaParticipante(participante: Monstro, desde: Date, ehAdministrador: boolean) {
    const participacao = new Participacao(
      participante,
      desde,
      ehAdministrador
    );

    this._participantes.push(participacao);
  }
}

export class Participacao {
  public constructor(
    // private _ranking: Ranking,
    private _participante: Monstro,
    private _desde: Date,
    private _ehAdministrador: boolean,
    private _timestamp?: number
  ) {
    if (!_timestamp) {
      this._desde = new Date(Date.now());
    }
  }

  // public get ranking() { return this._ranking; }

  public get participante() { return this._participante; }

  public get desde() { return this._desde; }

  public get ehAdministrador() { return this._ehAdministrador; }

  public get timestamp() { return this._timestamp; }

  public defineComoAdministrador(ehAdministrador: boolean) {
    this._ehAdministrador = ehAdministrador;
  }
}

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
