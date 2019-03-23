import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { combineLatest, Observable, of, merge, forkJoin } from 'rxjs';
import { first, map, switchMap, combineAll, mergeAll, tap, mergeMap, toArray } from 'rxjs/operators';
import { Monstro } from '../monstros.domain-model';
import { MonstrosService } from '../monstros.service';
import { SolicitacaoDeCadastroDeSerie } from './cadastro/cadastro.application-model';
import { Serie } from './series.domain-model';
import * as _ from 'lodash';
import { LogService } from 'src/app/app-common.services';

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

  // obtemSeriesObservaveisParaAdministracao(): Observable<Serie[]> {
  //   const collection = this.db.collection<SerieDocument>(this.PATH, reference => {
  //     return reference
  //       .orderBy('data', 'desc');
  //   });

  //   const series$ = collection.valueChanges().pipe(
  //     switchMap(values => {
  //       const arrayDeSeriesObservaveis = values
  //         .map((value) => {
  //           const monstroId = value.monstroId.substring(this.monstrosService.PATH.length, value.monstroId.length);

  //           const serieComMonstro$ = this.monstrosService.obtemMonstroObservavel(monstroId).pipe(
  //             first(),
  //             map(monstro => this.mapSerie(value, monstro))
  //           );

  //           return serieComMonstro$;
  //         });

  //       const todasAsSeries$ = combineLatest(arrayDeSeriesObservaveis);

  //       return todasAsSeries$;
  //     })
  //   );

  //   // return merge(series$, new Observable<Serie[]>(() => [])); // TODO: Problema quando não tem series.

  //   return series$;
  // }

  obtemSeriesObservaveisParaExibicao(monstro: Monstro): Observable<Serie[]> {
    const path = `${this.monstrosService.PATH}/${monstro.id}${this.PATH}`;

    const collection = this.db.collection<SerieDocument>(path, reference => {
      return reference
        // .where('monstroId', '==', `monstros/${monstro.id}`)
        .orderBy('data', 'desc');
    });

    const series$ = collection.valueChanges().pipe(
      map(values => {
        return values.map((value, index) => {
          return this.mapSerie(value);
        });
      })
    );

    return series$;
  }

  obtemSerieObservavel(monstroId: string, id: string): Observable<Serie> {
    const path = `${this.monstrosService.PATH}/${monstroId}${this.PATH}`;

    const collection = this.db.collection<SerieDocument>(path);

    const document = collection.doc<SerieDocument>(id);

    const serie$ = document.valueChanges().pipe(
      map(value => {
        return this.mapSerie(value);
      })
    );

    return serie$;
  }

  private mapSerie(value: SerieDocument): Serie {
    return new Serie(
      value.id,
      value.nome,
      value.cor,
      value.ativa,
      value.data.toDate(),
      null
    );
  }

  importaSeries() {
    const idAntigo = 'monstros/FCmLKJPLf4ejTazweTCP';

    const collection = this.db.collection<SerieDocument>(this.PATH, reference =>
      reference
        .where('monstroId', '==', idAntigo)
        .orderBy('data', 'desc')
    );

    collection.valueChanges().subscribe(series => {
      series.forEach(serie => {
        // serie.monstroId = 'monstros/2MvVXS8931bRukYSnGCJZo98BrH3';

        const document = collection.doc<SerieDocument>(serie.id);

        document.update(serie);
      });
    });
  }

  cadastraSerie(solicitacao: SolicitacaoDeCadastroDeSerie): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.monstrosService.obtemMonstroObservavel(solicitacao.monstroId).pipe(first()).subscribe(monstro => {
        const serieId = this.db.createId();

        const serie = new Serie(
          serieId,
          solicitacao.nome,
          solicitacao.cor,
          solicitacao.ativa,
          solicitacao.data.toDate(),
        );

        const result = this.add(solicitacao.monstroId, serie);

        resolve(result);
      });
    });
  }

  private add(monstroId: string, serie: Serie): Promise<void> {
    const path = `${this.monstrosService.PATH}/${monstroId}${this.PATH}`;

    const collection = this.db.collection<SerieDocument>(path);

    const document = collection.doc<SerieDocument>(serie.id);

    const doc = this.mapTo(serie);

    const result = document.set(doc);

    return result;
  }

  atualizaSerie(serieId: string, solicitacao: SolicitacaoDeCadastroDeSerie): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.obtemSerieObservavel(solicitacao.monstroId, serieId).pipe(first()).subscribe(serie => {
        serie.corrigeNome(solicitacao.nome);

        // serie.corrigeNome(solicitacao.data.toDate());

        const result = this.update(solicitacao.monstroId, serie);

        resolve(result);
      });
    });
  }

  private update(monstroId: string, serie: Serie): Promise<void> {
    const path = `${this.monstrosService.PATH}/${monstroId}${this.PATH}`;

    const collection = this.db.collection<SerieDocument>(path);

    const document = collection.doc<SerieDocument>(serie.id);

    const doc = this.mapTo(serie);

    const result = document.update(doc);

    return result;
  }

  private mapTo(serie: Serie): SerieDocument {
    const doc: SerieDocument = {
      id: serie.id,
      nome: serie.nome,
      cor: serie.cor,
      ativa: serie.ativa,
      data: firebase.firestore.Timestamp.fromDate(serie.data),
    };

    return doc;
  }

  excluiSerie(monstroId: string, serieId: string): Promise<void> {
    const path = `${this.monstrosService.PATH}/${monstroId}${this.PATH}`;

    const collection = this.db.collection<SerieDocument>(path);

    const document = collection.doc<SerieDocument>(serieId);

    const result = document.delete();

    return result;
  }
}

interface SerieDocument {
  id: string;
  nome: string;
  cor: string;
  ativa: boolean;
  data: firebase.firestore.Timestamp;
}
