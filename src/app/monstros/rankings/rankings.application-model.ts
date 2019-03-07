import * as moment from 'moment';
import {
  IMedidaDeGordura,
  IMedidaDeGorduraVisceral,
  IMedidaDeIndiceDeMassaCorporal,
  IMedidaDeMusculo,
  Medida,
  TipoDeBalanca
} from '../medidas/medidas.domain-model';
import { Monstro } from '../monstros.domain-model';

export class PosicaoDeMedida
  implements IMedidaDeGordura, IMedidaDeGorduraVisceral, IMedidaDeMusculo, IMedidaDeIndiceDeMassaCorporal {
  medidaId: string;
  monstroId: string;
  monstro: Monstro;
  ehUltimaMedida: boolean;
  data: moment.Moment;
  feitaCom: TipoDeBalanca;
  peso?: number;
  posicaoDeMenorGordura: number;
  gordura?: number;
  gorduraVisceral?: number;
  posicaoDeMaiorMusculo: number;
  musculo?: number;
  idadeCorporal?: number;
  metabolismoBasal?: number;
  posicaoDeMenorIndiceDeMassaCorporal: number;
  indiceDeMassaCorporal?: number;

  static fromMedida(medida: Medida): PosicaoDeMedida {
    return {
      medidaId: medida.id,
      monstroId: medida.monstro.id,
      monstro: medida.monstro,
      ehUltimaMedida: false,
      data: moment(medida.data),
      feitaCom: medida.feitaCom,
      peso: medida.peso,
      posicaoDeMenorGordura: 0,
      gordura: medida.gordura,
      gorduraVisceral: medida.gorduraVisceral,
      posicaoDeMaiorMusculo: 0,
      musculo: medida.musculo,
      idadeCorporal: medida.idadeCorporal,
      metabolismoBasal: medida.metabolismoBasal,
      posicaoDeMenorIndiceDeMassaCorporal: 0,
      indiceDeMassaCorporal: medida.indiceDeMassaCorporal,
    };
  }
}
