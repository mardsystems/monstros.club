import { InjectionToken } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Monstro } from 'src/app/cadastro/monstros/@monstros-domain.model';
import {
  IMedidaDeGordura, IMedidaDeGorduraVisceral, IMedidaDeIndiceDeMassaCorporal, IMedidaDeMusculo, Medida, TipoDeBalanca
} from '../medidas/@medidas-domain.model';
import { Ranking } from './@rankings-domain.model';

export const CONSULTA_DE_RANKINGS = new InjectionToken<ConsultaDeRankings>('CONSULTA_DE_RANKINGS');

export interface ConsultaDeRankings {
  obtemRankingObservavel(id: string): Observable<Ranking>;

  obtemRankingsParaExibicao(monstro: Monstro): Observable<Ranking[]>;

  obtemPosicoesDeMedidasParaExibicaoPorRanking(ranking: Ranking): Observable<PosicaoDeMedida[]>;
}

export class PosicaoDeMedida
  implements IMedidaDeGordura, IMedidaDeGorduraVisceral, IMedidaDeMusculo, IMedidaDeIndiceDeMassaCorporal {
  medidaId: string;
  monstroId: string;
  monstro: Monstro;
  ehUltimaMedida: boolean;
  data: moment.Moment;
  feitaCom: TipoDeBalanca;
  peso?: number;
  ehMenorMedidaDeGordura: boolean;
  posicaoDeMenorGordura?: number;
  gordura?: number;
  gorduraVisceral?: number;
  ehMaiorMedidaDeMusculo: boolean;
  posicaoDeMaiorMusculo?: number;
  musculo?: number;
  idadeCorporal?: number;
  metabolismoBasal?: number;
  ehMenorMedidaDeIndiceDeMassaCorporal: boolean;
  posicaoDeMenorIndiceDeMassaCorporal?: number;
  indiceDeMassaCorporal?: number;

  get posicaoDeMenorGorduraRelativa(): number {
    if (this.ehMenorMedidaDeGordura) {
      return this.posicaoDeMenorGordura;
    } else {
      return null;
    }
  }

  get posicaoDeMaiorMusculoRelativa(): number {
    if (this.ehMaiorMedidaDeMusculo) {
      return this.posicaoDeMaiorMusculo;
    } else {
      return null;
    }
  }

  get posicaoDeMenorIndiceDeMassaCorporalRelativa(): number {
    if (this.ehMenorMedidaDeIndiceDeMassaCorporal) {
      return this.posicaoDeMenorIndiceDeMassaCorporal;
    } else {
      return null;
    }
  }

  get ultimaMedidaEstaEvoluindo(): boolean {
    if (this.ehUltimaMedida) {
      return this.ehMenorMedidaDeGordura || this.ehMaiorMedidaDeMusculo || this.ehMenorMedidaDeIndiceDeMassaCorporal;
    } else {
      return false;
    }
  }

  get ultimaMedidaEstaFicandoPraTraz(): boolean {
    if (this.ehUltimaMedida) {
      return !this.ehMenorMedidaDeGordura && !this.ehMaiorMedidaDeMusculo && !this.ehMenorMedidaDeIndiceDeMassaCorporal;
    } else {
      return false;
    }
  }

  static fromMedida(
    medida: Medida,
    ehUltimaMedida = false,
    ehMenorMedidaDeGordura = false,
    ehMaiorMedidaDeMusculo = false,
    ehMenorMedidaDeIndiceDeMassaCorporal = false
  ): PosicaoDeMedida {
    const model = new PosicaoDeMedida();

    model.medidaId = medida.id;
    model.monstroId = medida.monstro.id;
    model.monstro = medida.monstro;
    model.ehUltimaMedida = ehUltimaMedida;
    model.data = moment(medida.data);
    model.feitaCom = medida.feitaCom;
    model.peso = medida.peso;
    model.ehMenorMedidaDeGordura = ehMenorMedidaDeGordura;
    // posicaoDeMenorGordura = 0;
    model.gordura = medida.gordura;
    model.gorduraVisceral = medida.gorduraVisceral;
    model.ehMaiorMedidaDeMusculo = ehMaiorMedidaDeMusculo;
    // posicaoDeMaiorMusculo = 0;
    model.musculo = medida.musculo;
    model.idadeCorporal = medida.idadeCorporal;
    model.metabolismoBasal = medida.metabolismoBasal;
    model.ehMenorMedidaDeIndiceDeMassaCorporal = ehMenorMedidaDeIndiceDeMassaCorporal;
    // posicaoDeMenorIndiceDeMassaCorporal = 0;
    model.indiceDeMassaCorporal = medida.indiceDeMassaCorporal;

    return model;
  }
}
