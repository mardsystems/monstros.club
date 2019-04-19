import { InjectionToken } from '@angular/core';
import * as _ from 'lodash';
import { Monstro } from 'src/app/cadastro/monstros/@monstros-domain.model';
import { Repository } from 'src/app/common/domain.model';
import { TipoDeBalanca } from '../medidas/@medidas-domain.model';

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

  public removeParticipante(participanteId: string) {
    _.remove(this._participantes, participante => participante.participante.id === participanteId);
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

export const REPOSITORIO_DE_RANKINGS = new InjectionToken<RepositorioDeRankings>('REPOSITORIO_DE_RANKINGS');

export interface RepositorioDeRankings extends Repository {
  obtemRanking(id: string): Promise<Ranking>;

  add(medida: Ranking): Promise<void>;

  update(medida: Ranking): Promise<void>;

  remove(medida: Ranking): Promise<void>;
}
