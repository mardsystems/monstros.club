import { Genero, Monstro } from '../monstros.domain-model';

export class Medida
  implements IMedidaDeGordura, IMedidaDeGorduraVisceral, IMedidaDeMusculo, IMedidaDeIndiceDeMassaCorporal {
  public constructor(
    private _id: string,
    private _monstro: Monstro,
    private _monstroId: string,
    private _data: Date,
    private _feitaCom: TipoDeBalanca,
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

  public get feitaCom() { return this._feitaCom; }

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

  public defineTipoDeBalanca(tipoDeBalanca: TipoDeBalanca) {
    this._feitaCom = tipoDeBalanca;
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
  gordura?: number;
  monstro: Monstro;
  feitaCom: TipoDeBalanca;
}

export interface IMedidaDeGorduraVisceral {
  gorduraVisceral?: number;
  monstro: Monstro;
  feitaCom: TipoDeBalanca;
}

export interface IMedidaDeMusculo {
  musculo?: number;
  monstro: Monstro;
  feitaCom: TipoDeBalanca;
}

export interface IMedidaDeIndiceDeMassaCorporal {
  indiceDeMassaCorporal?: number;
  monstro: Monstro;
  feitaCom: TipoDeBalanca;
}

export abstract class Balanca {
  public abstract classificaGordura(medida: IMedidaDeGordura): number;

  public abstract classificaGorduraVisceral(medida: IMedidaDeGorduraVisceral): number;

  public abstract classificaMusculo(medida: IMedidaDeMusculo): number;

  public abstract classificaIndiceDeMassaCorporal(medida: IMedidaDeIndiceDeMassaCorporal): number;
}

export enum TipoDeBalanca {
  BalancaComum = 'Balança Comum',
  OmronHBF214 = 'Omron HBF-214',
  OmronHBF514C = 'Omron HBF-514C',
  BalancaPersonalizada = 'Balança Personalizada'
}

export class BalancaComum extends Balanca {
  public classificaGordura(medida: IMedidaDeGordura): number {
    throw new Error('Method not implemented.');
  }
  public classificaGorduraVisceral(medida: IMedidaDeGorduraVisceral): number {
    throw new Error('Method not implemented.');
  }
  public classificaMusculo(medida: IMedidaDeMusculo): number {
    throw new Error('Method not implemented.');
  }
  public classificaIndiceDeMassaCorporal(medida: IMedidaDeIndiceDeMassaCorporal): number {
    throw new Error('Method not implemented.');
  }
}

export class OmronHBF214 extends Balanca {
  public classificaGordura(medida: IMedidaDeGordura): number {
    const idade = medida.monstro.idade;

    const genero = medida.monstro.genero;

    const gordura = medida.gordura;

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

  public classificaGorduraVisceral(medida: IMedidaDeGorduraVisceral): number {
    const gorduraVisceral = medida.gorduraVisceral;

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

  public classificaMusculo(medida: IMedidaDeMusculo): number {
    const idade = medida.monstro.idade;

    const genero = medida.monstro.genero;

    const musculo = medida.musculo;

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

  public classificaIndiceDeMassaCorporal(medida: IMedidaDeIndiceDeMassaCorporal): number {
    const indiceDeMassaCorporal = medida.indiceDeMassaCorporal;

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
