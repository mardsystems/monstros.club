import { Monstro } from '../monstros.model';
import * as moment from 'moment';

export class Medida {
  public constructor(
    public _id: string,
    public _monstro: Monstro,
    public _monstroId: string,
    public _data: Date,
    public _peso: number,
    public _gordura: number,
    public _gorduraVisceral: number,
    public _musculo: number,
    public _idadeCorporal: number,
    public _metabolismoBasal: number,
    public _indiceDeMassaCorporal: number
  ) {

  }

  public get id() { return this._id; }

  public get monstro() { return this._monstro; }

  public get monstroId() { return this._monstroId; }

  public get data() { return this._data; }

  public get peso() { return this._peso; }

  public get gordura() { return this._gordura; }

  public get gorduraVisceral() { return this._gorduraVisceral; }

  public get musculo() { return this._musculo; }

  public get idadeCorporal() { return this._idadeCorporal; }

  public get metabolismoBasal() { return this._metabolismoBasal; }

  public get indiceDeMassaCorporal() { return this._indiceDeMassaCorporal; }

  public get gorduraVisceral2(): string {
    let indice: number;

    if (this._gorduraVisceral > 14) {
      indice = +2;
    } else if (this._gorduraVisceral < 10) {
      indice = 0;
    } else {
      indice = +1;
    }

    switch (indice) {
      case 0:
        return '<span class="hint normal">&#10003;</span>';
      case +1:
        return '<span class="hint bad">&#43;</span>';
      case +2:
        return '<span class="hint bad">&#43;&#43;</span>';
    }
  }

  public get indiceDeMassaCorporal2(): string {
    let indice: number;

    if (this._indiceDeMassaCorporal < 18.5) {
      indice = -1;
    } else if (this._indiceDeMassaCorporal >= 30) {
      indice = +2;
    } else if (this._indiceDeMassaCorporal >= 25) {
      indice = +1;
    } else {
      indice = 0;
    }

    switch (indice) {
      case -1:
        return '<span class="hint good">&#8722;</span>';
      case 0:
        return '<span class="hint normal">&#10003;</span>';
      case +1:
        return '<span class="hint bad">&#43;</span>';
      case +2:
        return '<span class="hint bad">&#43;&#43;</span>';
    }
  }

  defineData(data: Date) {
    this._data = data;
  }

  definePeso(peso: number) {
    this._peso = peso;
  }

  defineGordura(gordura: number) {
    this._gordura = gordura;
  }

  defineGorduraVisceral(gorduraVisceral: number) {
    this._gorduraVisceral = gorduraVisceral;
  }

  defineMusculo(musculo: number) {
    this._musculo = musculo;
  }

  defineIdadeCorporal(idadeCorporal: number) {
    this._idadeCorporal = idadeCorporal;
  }

  defineMetabolismoBasal(metabolismoBasal: number) {
    this._metabolismoBasal = metabolismoBasal;
  }

  defineIndiceDeMassaCorporal(indiceDeMassaCorporal: number) {
    this._indiceDeMassaCorporal = indiceDeMassaCorporal;
  }
}

export class SolicitacaoDeCadastroDeMedida {
  isEdit: boolean;
  // Usado apenas na edição.
  id?: string;
  monstroId?: string;
  data?: moment.Moment;
  peso?: number;
  gordura?: number;
  gorduraVisceral?: number;
  musculo?: number;
  idadeCorporal?: number;
  metabolismoBasal?: number;
  indiceDeMassaCorporal?: number;

  static toAdd(monstroId: string): SolicitacaoDeCadastroDeMedida {
    return {
      isEdit: false,
      // id: medida.id,
      monstroId: monstroId,
      data: moment(new Date(Date.now())),
      // peso: medida.peso,
      // gordura: medida.gordura,
      // gorduraVisceral: medida.gorduraVisceral,
      // musculo: medida.musculo,
      // idadeCorporal: medida.idadeCorporal,
      // metabolismoBasal: medida.metabolismoBasal,
      // indiceDeMassaCorporal: medida.indiceDeMassaCorporal
    };
  }

  static toEdit(medida: Medida): SolicitacaoDeCadastroDeMedida {
    return {
      isEdit: true,
      id: medida.id,
      // monstroId: medida.monstro.id,
      monstroId: medida.monstroId,
      data: moment(medida.data),
      peso: medida.peso,
      gordura: medida.gordura,
      gorduraVisceral: medida.gorduraVisceral,
      musculo: medida.musculo,
      idadeCorporal: medida.idadeCorporal,
      metabolismoBasal: medida.metabolismoBasal,
      indiceDeMassaCorporal: medida.indiceDeMassaCorporal
    };
  }
}
