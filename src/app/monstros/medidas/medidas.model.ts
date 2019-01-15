import { Monstro } from '../monstros.model';

export class Medida {
  public constructor(
    public _id: string,
    public _monstro: Monstro,
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
}
