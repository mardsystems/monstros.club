import { Monstro, Genero } from '../monstros.model';
import * as moment from 'moment';

export class Medida
  implements IMedidaDeGordura, IMedidaDeGorduraVisceral, IMedidaDeMusculo, IMedidaDeIndiceDeMassaCorporal {
  public constructor(
    private _id: string,
    private _monstro: Monstro,
    private _monstroId: string,
    private _data: Date,
    private _feitaPor: TipoDeBalanca,
    private _peso: number,
    private _gordura: number,
    private _gorduraVisceral: number,
    private _musculo: number,
    private _idadeCorporal: number,
    private _metabolismoBasal: number,
    private _indiceDeMassaCorporal: number
  ) {

  }

  public get id() { return this._id; }

  public get monstro() { return this._monstro; }

  public get monstroId() { return this._monstroId; }

  public get data() { return this._data; }

  public get tipoDeBalanca() { return this._feitaPor; }

  public get peso() { return this._peso; }

  public get gordura() { return this._gordura; }

  public get gorduraVisceral() { return this._gorduraVisceral; }

  public get musculo() { return this._musculo; }

  public get idadeCorporal() { return this._idadeCorporal; }

  public get metabolismoBasal() { return this._metabolismoBasal; }

  public get indiceDeMassaCorporal() { return this._indiceDeMassaCorporal; }

  public defineData(data: Date) {
    this._data = data;
  }

  public definePeso(peso: number) {
    this._peso = peso;
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

export interface IMedidaDeGordura {
  monstro: Monstro;
  tipoDeBalanca: TipoDeBalanca;
  gordura?: number;
}

export interface IMedidaDeGorduraVisceral {
  monstro: Monstro;
  tipoDeBalanca: TipoDeBalanca;
  gorduraVisceral?: number;
}

export interface IMedidaDeMusculo {
  monstro: Monstro;
  tipoDeBalanca: TipoDeBalanca;
  musculo?: number;
}

export interface IMedidaDeIndiceDeMassaCorporal {
  monstro: Monstro;
  tipoDeBalanca: TipoDeBalanca;
  indiceDeMassaCorporal?: number;
}

export abstract class Balanca {
  public abstract classificaGordura(idade: number, genero: string, gordura: number): number;

  public abstract classificaGorduraVisceral(gorduraVisceral: number): number;

  public abstract classificaMusculo(idade: number, genero: string, musculo: number): number;

  public abstract classificaIndiceDeMassaCorporal(indiceDeMassaCorporal: number): number;
}

export enum TipoDeBalanca {
  BalancaComum = 'Balança Comum',
  BalancaOmronHBF214 = 'Omron HBF-214',
  BalancaOmronHBF514C = 'Omron HBF-514C',
  BalancaPersonalizada = 'Balança Personalizada'
}

export class BalancaComum extends Balanca {
  public classificaGordura(idade: number, genero: string, gordura: number): number {
    throw new Error('Method not implemented.');
  }
  public classificaGorduraVisceral(gorduraVisceral: number): number {
    throw new Error('Method not implemented.');
  }
  public classificaMusculo(idade: number, genero: string, musculo: number): number {
    throw new Error('Method not implemented.');
  }
  public classificaIndiceDeMassaCorporal(indiceDeMassaCorporal: number): number {
    throw new Error('Method not implemented.');
  }
}

export class BalancaOmronHBF214 extends Balanca {
  public classificaGordura(idade: number, genero: string, gordura: number): number {
    let classificacao: number;

    switch (genero) {
      case Genero.Masculino:
        if (idade < 40) {
          if (gordura < 8.0) {
            classificacao = -1;
          } else if (gordura >= 25.0) {
            classificacao = +2;
          } else if (gordura < 20.0) {
            classificacao = 0;
          } else {
            classificacao = +1;
          }
        } else if (idade < 60) {
          if (gordura < 11.0) {
            classificacao = -1;
          } else if (gordura >= 28.0) {
            classificacao = +2;
          } else if (gordura < 22.0) {
            classificacao = 0;
          } else {
            classificacao = +1;
          }
        } else {
          if (gordura < 13.0) {
            classificacao = -1;
          } else if (gordura >= 30.0) {
            classificacao = +2;
          } else if (gordura < 25.0) {
            classificacao = 0;
          } else {
            classificacao = +1;
          }
        }

        break;

      case Genero.Feminino:
        if (idade < 40) {
          if (gordura < 21.0) {
            classificacao = -1;
          } else if (gordura >= 39.0) {
            classificacao = +2;
          } else if (gordura < 33.0) {
            classificacao = 0;
          } else {
            classificacao = +1;
          }
        } else if (idade < 60) {
          if (gordura < 23.0) {
            classificacao = -1;
          } else if (gordura >= 40.0) {
            classificacao = +2;
          } else if (gordura < 34.0) {
            classificacao = 0;
          } else {
            classificacao = +1;
          }
        } else {
          if (gordura < 24.0) {
            classificacao = -1;
          } else if (gordura >= 42.0) {
            classificacao = +2;
          } else if (gordura < 36.0) {
            classificacao = 0;
          } else {
            classificacao = +1;
          }
        }

        break;
    }

    return classificacao;
  }

  public classificaGorduraVisceral(gorduraVisceral: number): number {
    let classificacao: number;

    if (gorduraVisceral > 14) {
      classificacao = +2;
    } else if (gorduraVisceral < 10) {
      classificacao = 0;
    } else {
      classificacao = +1;
    }

    return classificacao;
  }

  public classificaMusculo(idade: number, genero: string, musculo: number): number {
    let classificacao: number;

    switch (genero) {
      case Genero.Masculino:
        if (idade < 40) {
          if (musculo < 33.3) {
            classificacao = -1;
          } else if (musculo >= 44.1) {
            classificacao = +2;
          } else if (musculo < 39.4) {
            classificacao = 0;
          } else {
            classificacao = +1;
          }
        } else if (idade < 60) {
          if (musculo < 33.1) {
            classificacao = -1;
          } else if (musculo >= 43.9) {
            classificacao = +2;
          } else if (musculo < 39.2) {
            classificacao = 0;
          } else {
            classificacao = +1;
          }
        } else {
          if (musculo < 32.9) {
            classificacao = -1;
          } else if (musculo >= 43.7) {
            classificacao = +2;
          } else if (musculo < 39.0) {
            classificacao = 0;
          } else {
            classificacao = +1;
          }
        }

        break;

      case Genero.Feminino:
        if (idade < 40) {
          if (musculo < 24.3) {
            classificacao = -1;
          } else if (musculo >= 35.4) {
            classificacao = +2;
          } else if (musculo < 30.4) {
            classificacao = 0;
          } else {
            classificacao = +1;
          }
        } else if (idade < 60) {
          if (musculo < 24.1) {
            classificacao = -1;
          } else if (musculo >= 35.2) {
            classificacao = +2;
          } else if (musculo < 30.2) {
            classificacao = 0;
          } else {
            classificacao = +1;
          }
        } else {
          if (musculo < 23.9) {
            classificacao = -1;
          } else if (musculo >= 35.0) {
            classificacao = +2;
          } else if (musculo < 30.0) {
            classificacao = 0;
          } else {
            classificacao = +1;
          }
        }

        break;
    }

    return classificacao;
  }

  public classificaIndiceDeMassaCorporal(indiceDeMassaCorporal: number): number {
    let classificacao: number;

    if (indiceDeMassaCorporal < 18.5) {
      classificacao = -1;
    } else if (indiceDeMassaCorporal >= 30) {
      classificacao = +2;
    } else if (indiceDeMassaCorporal >= 25) {
      classificacao = +1;
    } else {
      classificacao = 0;
    }

    return classificacao;
  }
}

export class SolicitacaoDeCadastroDeMedida {
  monstroId: string;
  data: moment.Moment;
  tipoDeBalanca: TipoDeBalanca;
  peso?: number;
  gordura?: number;
  gorduraVisceral?: number;
  musculo?: number;
  idadeCorporal?: number;
  metabolismoBasal?: number;
  indiceDeMassaCorporal?: number;

  static toAdd(monstroId: string, idade: number, genero: string): SolicitacaoDeCadastroDeMedida {
    return {
      monstroId: monstroId,
      data: moment(new Date(Date.now())),
      tipoDeBalanca: TipoDeBalanca.BalancaOmronHBF214,
      peso: null,
      gordura: null,
      gorduraVisceral: null,
      musculo: null,
      idadeCorporal: null,
      metabolismoBasal: null,
      indiceDeMassaCorporal: null
    };
  }

  static toEdit(medida: Medida): SolicitacaoDeCadastroDeMedida {
    return {
      monstroId: medida.monstroId,
      data: moment(medida.data),
      tipoDeBalanca: medida.tipoDeBalanca,
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
