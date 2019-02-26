import { Monstro } from '../monstros.domain-model';
import { Exercicio } from 'src/app/cadastro/exercicios/exercicios.domain-model';

export class Serie {
  public constructor(
    private _id: string,
    private _exercicio: Exercicio,
    private _exercicioId: string,
    private _monstro: Monstro,
    private _monstroId: string,
    private _data: Date,
    // private _tipo: TipoDeSerie,
    private _quantidade: number,
    private _gordura: number,
    private _gorduraVisceral: number,
    private _musculo: number,
    private _idadeCorporal: number,
    private _metabolismoBasal: number,
    private _indiceDeMassaCorporal: number
  ) {

  }

  public get id() { return this._id; }

  public get exercicio() { return this._exercicio; }

  public get exercicioId() { return this._exercicioId; }

  public get monstro() { return this._monstro; }

  public get monstroId() { return this._monstroId; }

  public get data() { return this._data; }

  // public get tipo() { return this._tipo; }

  public get quantidade() { return this._quantidade; }

  public get gordura() { return this._gordura; }

  public get gorduraVisceral() { return this._gorduraVisceral; }

  public get musculo() { return this._musculo; }

  public get idadeCorporal() { return this._idadeCorporal; }

  public get metabolismoBasal() { return this._metabolismoBasal; }

  public get indiceDeMassaCorporal() { return this._indiceDeMassaCorporal; }

  // public defineData(data: Date) {
  //   this._data = data;
  // }

  // public defineTipoDeBalanca(tipoDeBalanca: TipoDeSerie) {
  //   this._tipo = tipoDeBalanca;
  // }

  public definePeso(peso: number) {
    this._quantidade = peso;
  }

  public defineGordura(gordura: number) {
    this._gordura = gordura;
  }

  public defineGorduraVisceral(gorduraVisceral: number) {
    this._gorduraVisceral = gorduraVisceral;
  }

  public defineMusculo(musculo: number) {
    this._musculo = musculo;
  }

  public defineIdadeCorporal(idadeCorporal: number) {
    this._idadeCorporal = idadeCorporal;
  }

  public defineMetabolismoBasal(metabolismoBasal: number) {
    this._metabolismoBasal = metabolismoBasal;
  }

  public defineIndiceDeMassaCorporal(indiceDeMassaCorporal: number) {
    this._indiceDeMassaCorporal = indiceDeMassaCorporal;
  }
}

export enum NomeDaSerie {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F'
}

export enum TipoDeSerie {
  Original = 'Original',
  Executada = 'Executada'
}
