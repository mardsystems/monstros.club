import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { combineLatest, Observable, of, merge, forkJoin } from 'rxjs';
import { first, map, switchMap, combineAll, mergeAll, tap, mergeMap, toArray } from 'rxjs/operators';
import { Monstro } from '../monstros.domain-model';
import { MonstrosService } from '../monstros.service';
import { SolicitacaoDeCadastroDeSerie } from './cadastro/cadastro.application-model';
import { Serie, TipoDeSerie } from './series.domain-model';
import * as _ from 'lodash';
import { LogService } from 'src/app/app.services';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  PATH = '/series';

  constructor(
    private db: AngularFirestore,
    private monstrosService: MonstrosService,
    private log: LogService
  ) { }

  obtemMedidasObservaveisParaAdministracao(): Observable<Serie[]> {
    const collection = this.db.collection<SerieDocument>(this.PATH, reference => {
      return reference
        .orderBy('data', 'desc');
    });

    const series$ = collection.valueChanges().pipe(
      switchMap(values => {
        const arrayDeMedidasObservaveis = values
          .filter(value => value.monstroId !== 'monstros/OJUFB66yLBwIOE2hk8hs')
          .map((value) => {
            const monstroId = value.monstroId.substring(this.monstrosService.PATH.length, value.monstroId.length);

            const medidaComMonstro$ = this.monstrosService.obtemMonstroObservavel(monstroId).pipe(
              map(monstro => this.mapMedida(value, monstro))
            );

            return medidaComMonstro$;
          });

        const todasAsMedidas$ = combineLatest(arrayDeMedidasObservaveis);

        return todasAsMedidas$;
      })
    );

    // return merge(series$, new Observable<Serie[]>(() => [])); // TODO: Problema quando não tem series.

    return series$;
  }

  obtemMedidasObservaveisParaExibicao(monstro: Monstro): Observable<Serie[]> {
    const collection = this.db.collection<SerieDocument>(this.PATH, reference => {
      return reference
        .where('monstroId', '==', `monstros/${monstro.id}`)
        .orderBy('data', 'desc');
    });

    const series$ = collection.valueChanges().pipe(
      map(values => {
        return values.map((value, index) => {
          return this.mapMedida(value, monstro);
        });
      })
    );

    return series$;
  }

  obtemMedidasObservaveisParaExibicaoPorMonstros(monstros: Monstro[]): Observable<Serie[]> {
    let mergeCount = 0;

    const medidasPorMonstros$Array = monstros.map(monstro => {
      const collection1 = this.db.collection<SerieDocument>(this.PATH, reference => {
        return reference
          .where('monstroId', '==', `monstros/${monstro.id}`)
          .orderBy('data', 'desc')
          .limit(1);
      });

      const medidas1$ = collection1.valueChanges().pipe(
        first(),
        map(values => {
          return values.map((value, index) => {
            this.log.debug('monstro: ' + monstro.nome + '; data: ' + value.data);

            return this.mapMedida(value, monstro);
          });
        })
      );

      //

      const collection2 = this.db.collection<SerieDocument>(this.PATH, reference => {
        return reference
          .where('monstroId', '==', `monstros/${monstro.id}`)
          .orderBy('gordura', 'asc')
          .limit(1);
      });

      const medidas2$ = collection2.valueChanges().pipe(
        first(),
        map(values => {
          return values.map((value, index) => {
            this.log.debug('monstro: ' + monstro.nome + '; gordura: ' + value.gordura);

            return this.mapMedida(value, monstro);
          });
        })
      );

      //

      const collection3 = this.db.collection<SerieDocument>(this.PATH, reference => {
        return reference
          .where('monstroId', '==', `monstros/${monstro.id}`)
          .orderBy('musculo', 'desc')
          .limit(1);
      });

      const medidas3$ = collection3.valueChanges().pipe(
        first(),
        map(values => {
          return values.map((value, index) => {
            this.log.debug('monstro: ' + monstro.nome + '; musculo: ' + value.musculo);

            return this.mapMedida(value, monstro);
          });
        })
      );

      //

      const collection4 = this.db.collection<SerieDocument>(this.PATH, reference => {
        return reference
          .where('monstroId', '==', `monstros/${monstro.id}`)
          .orderBy('indiceDeMassaCorporal', 'asc')
          .limit(1);
      });

      const medidas4$ = collection4.valueChanges().pipe(
        first(),
        map(values => {
          return values.map((value, index) => {
            this.log.debug('monstro: ' + monstro.nome + '; indiceDeMassaCorporal: ' + value.indiceDeMassaCorporal);

            return this.mapMedida(value, monstro);
          });
        })
      );

      //

      const series$ = merge(...[medidas1$, medidas2$, medidas3$, medidas4$]).pipe(
        // first(),
        mergeMap(flat => flat),
        toArray(),
        tap(medidas2 => {
          this.log.debug('monstro: ' + monstro.nome + '; merge-count: ' + ++mergeCount + '; series.length: ' + medidas2.length);
        })
      );

      return series$;
    });

    const medidasPorMonstros$ = combineLatest(medidasPorMonstros$Array);

    let combineCount = 0;

    const medidasPorMonstrosUnificado$ = medidasPorMonstros$.pipe(
      map(arrayDeArray => {
        this.log.debug('combine: ' + '' + '; combine-count: ' + ++combineCount + '; arrayDeArray.length: ' + arrayDeArray.length);

        const series: Serie[] = [];

        arrayDeArray.forEach(array => array.forEach(serie => series.push(serie)));

        const medidasSemRepeticao = _.uniqBy(series, 'id');

        return medidasSemRepeticao;
      })
    );

    return medidasPorMonstrosUnificado$;
  }

  obtemMedidaObservavel(id: string): Observable<Serie> {
    const collection = this.db.collection<SerieDocument>(this.PATH);

    const document = collection.doc<SerieDocument>(id);

    const serie$ = document.valueChanges().pipe(
      map(value => {
        const monstro = null;

        return this.mapMedida(value, monstro);
      })
    );

    return serie$;
  }

  // private mapMedidas(values: MedidaDocument[]): Serie[] {
  //   return values.map((value, index) => {
  //     const monstroId = value.monstroId.substring(this.monstrosService.PATH.length, value.monstroId.length);

  //     return new Serie(
  //       value.id,
  //       null,
  //       monstroId,
  //       value.data.toDate(),
  //       value.peso,
  //       value.gordura,
  //       value.gorduraVisceral,
  //       value.musculo,
  //       value.idadeCorporal,
  //       value.metabolismoBasal,
  //       value.indiceDeMassaCorporal
  //     );
  //   });
  // }

  private mapMedida(value: SerieDocument, monstro: Monstro): Serie {
    const monstroId = value.monstroId.substring(this.monstrosService.PATH.length, value.monstroId.length);

    return new Serie(
      value.id,
      null,
      null,
      monstro,
      monstroId,
      value.data.toDate(),
      // value.feitaCom as TipoDeSerie,
      value.peso,
      value.gordura,
      value.gorduraVisceral,
      value.musculo,
      value.idadeCorporal,
      value.metabolismoBasal,
      value.indiceDeMassaCorporal
    );
  }

  importaMedidas() {
    const idAntigo = 'monstros/FCmLKJPLf4ejTazweTCP';

    const collection = this.db.collection<SerieDocument>(this.PATH, reference =>
      reference
        .where('monstroId', '==', idAntigo)
        .orderBy('data', 'desc')
    );

    collection.valueChanges().subscribe(series => {
      series.forEach(serie => {
        serie.monstroId = 'monstros/2MvVXS8931bRukYSnGCJZo98BrH3';

        const document = collection.doc<SerieDocument>(serie.id);

        document.update(serie);
      });
    });
  }

  cadastraMedida(solicitacao: SolicitacaoDeCadastroDeSerie): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.monstrosService.obtemMonstroObservavel(solicitacao.monstroId).pipe(first()).subscribe(monstro => {
        const serieId = this.db.createId();

        const serie = new Serie(
          serieId,
          null,
          null,
          monstro,
          solicitacao.monstroId,
          solicitacao.data.toDate(),
          // solicitacao.feitaCom,
          solicitacao.peso,
          solicitacao.gordura,
          solicitacao.gorduraVisceral,
          solicitacao.musculo,
          solicitacao.idadeCorporal,
          solicitacao.metabolismoBasal,
          solicitacao.indiceDeMassaCorporal
        );

        const result = this.add(serie);

        resolve(result);
      });
    });
  }

  private add(serie: Serie): Promise<void> {
    const collection = this.db.collection<SerieDocument>(this.PATH);

    const document = collection.doc<SerieDocument>(serie.id);

    const doc = this.mapTo(serie);

    const result = document.set(doc);

    return result;
  }

  atualizaMedida(medidaId: string, solicitacao: SolicitacaoDeCadastroDeSerie): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.obtemMedidaObservavel(medidaId).pipe(first()).subscribe(serie => {
        // serie.defineData(solicitacao.data.toDate());

        // serie.defineTipoDeBalanca(solicitacao.feitaCom);

        serie.definePeso(solicitacao.peso);

        serie.defineGordura(solicitacao.gordura);

        serie.defineGorduraVisceral(solicitacao.gorduraVisceral);

        serie.defineMusculo(solicitacao.musculo);

        serie.defineIdadeCorporal(solicitacao.idadeCorporal);

        serie.defineMetabolismoBasal(solicitacao.metabolismoBasal);

        serie.defineIndiceDeMassaCorporal(solicitacao.indiceDeMassaCorporal);

        const result = this.update(serie);

        resolve(result);
      });
    });
  }

  private update(serie: Serie): Promise<void> {
    const collection = this.db.collection<SerieDocument>(this.PATH);

    const document = collection.doc<SerieDocument>(serie.id);

    const doc = this.mapTo(serie);

    const result = document.update(doc);

    return result;
  }

  private mapTo(serie: Serie): SerieDocument {
    const doc: SerieDocument = {
      id: serie.id,
      // monstroId: `monstros/${serie.monstro.id}`,
      monstroId: `monstros/${serie.monstroId}`,
      data: firebase.firestore.Timestamp.fromDate(serie.data),
      // feitaCom: serie.tipo,
      peso: serie.quantidade,
      gordura: serie.gordura,
      gorduraVisceral: serie.gorduraVisceral,
      musculo: serie.musculo,
      idadeCorporal: serie.idadeCorporal,
      metabolismoBasal: serie.metabolismoBasal,
      indiceDeMassaCorporal: serie.indiceDeMassaCorporal
    };

    return doc;
  }

  excluiMedida(medidaId: string): Promise<void> {
    const collection = this.db.collection<SerieDocument>(this.PATH);

    const document = collection.doc<SerieDocument>(medidaId);

    const result = document.delete();

    return result;
  }
}

interface SerieDocument {
  id: string;
  monstroId: string;
  data: firebase.firestore.Timestamp;
  // feitaCom: string;
  peso: number;
  gordura: number;
  gorduraVisceral: number;
  musculo: number;
  idadeCorporal: number;
  metabolismoBasal: number;
  indiceDeMassaCorporal: number;
}
