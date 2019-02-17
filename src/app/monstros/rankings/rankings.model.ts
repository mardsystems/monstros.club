import { Monstro, Genero } from '../monstros.model';
import * as moment from 'moment';
import { TipoDeBalanca } from '../medidas/medidas.model';

export class Ranking {
  private _dataDeCriacao: Date;
  private _participantes: Monstro[];

  public constructor(
    private _id: string,
    private _proprietario: Monstro,
    private _proprietarioId: string,
    private _feitoCom: TipoDeBalanca,
    private _timestamp?: number
  ) {
    if (!_timestamp) {
      this._dataDeCriacao = new Date(Date.now());
    }
  }

  public get id() { return this._id; }

  public get proprietario() { return this._proprietario; }

  public get proprietarioId() { return this._proprietarioId; }

  public get dataDeCriacao() { return this._dataDeCriacao; }

  public get feitoCom() { return this._feitoCom; }

  public get participantes() { return this._participantes; }

  public get timestamp() { return this._timestamp; }

  public adicionaParticipante(participante: Monstro) {
    this._participantes.push(participante);
  }
}

export class SolicitacaoDeCadastroDeRanking {
  proprietarioId: string;
  feitoCom: TipoDeBalanca;

  static toAdd(monstroId: string): SolicitacaoDeCadastroDeRanking {
    return {
      proprietarioId: monstroId,
      feitoCom: TipoDeBalanca.OmronHBF214,
    };
  }

  static toEdit(medida: Ranking): SolicitacaoDeCadastroDeRanking {
    return {
      proprietarioId: medida.proprietarioId,
      feitoCom: medida.feitoCom,
    };
  }
}
