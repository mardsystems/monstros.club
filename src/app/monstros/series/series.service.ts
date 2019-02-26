import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { combineLatest, Observable, of, merge, forkJoin } from 'rxjs';
import { first, map, switchMap, combineAll, mergeAll, tap, mergeMap, toArray } from 'rxjs/operators';
import { Monstro } from '../monstros.domain-model';
import { MonstrosService } from '../monstros.service';
import { SolicitacaoDeCadastroDeMedida } from './cadastro/cadastro.application-model';
import { Medida, TipoDeBalanca } from './series.domain-model';
import * as _ from 'lodash';
import { LogService } from 'src/app/app.services';

@Injectable({
  providedIn: 'root'
})
export class MedidasService {
  PATH = '/medidas';

  constructor(
    private db: AngularFirestore,
    private monstrosService: MonstrosService,
    private log: LogService
  ) { }

  obtemMedidasObservaveisParaAdministracao(): Observable<Medida[]> {
    const collection = this.db.collection<MedidaDocument>(this.PATH, reference => {
      return reference
        .orderBy('data', 'desc');
    });

    const medidas$ = collection.valueChanges().pipe(
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

    // return merge(medidas$, new Observable<Medida[]>(() => [])); // TODO: Problema quando não tem medidas.

    return medidas$;
  }

  obtemMedidasObservaveisParaExibicao(monstro: Monstro): Observable<Medida[]> {
    const collection = this.db.collection<MedidaDocument>(this.PATH, reference => {
      return reference
        .where('monstroId', '==', `monstros/${monstro.id}`)
        .orderBy('data', 'desc');
    });

    const medidas$ = collection.valueChanges().pipe(
      map(values => {
        return values.map((value, index) => {
          return this.mapMedida(value, monstro);
        });
      })
    );

    return medidas$;
  }

  obtemMedidasObservaveisParaExibicaoPorMonstros(monstros: Monstro[]): Observable<Medida[]> {
    let mergeCount = 0;

    const medidasPorMonstros$Array = monstros.map(monstro => {
      const collection1 = this.db.collection<MedidaDocument>(this.PATH, reference => {
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

      const collection2 = this.db.collection<MedidaDocument>(this.PATH, reference => {
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

      const collection3 = this.db.collection<MedidaDocument>(this.PATH, reference => {
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

      const collection4 = this.db.collection<MedidaDocument>(this.PATH, reference => {
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

      const medidas$ = merge(...[medidas1$, medidas2$, medidas3$, medidas4$]).pipe(
        // first(),
        mergeMap(flat => flat),
        toArray(),
        tap(medidas2 => {
          this.log.debug('monstro: ' + monstro.nome + '; merge-count: ' + ++mergeCount + '; medidas.length: ' + medidas2.length);
        })
      );

      return medidas$;
    });

    const medidasPorMonstros$ = combineLatest(medidasPorMonstros$Array);

    let combineCount = 0;

    const medidasPorMonstrosUnificado$ = medidasPorMonstros$.pipe(
      map(arrayDeArray => {
        this.log.debug('combine: ' + '' + '; combine-count: ' + ++combineCount + '; arrayDeArray.length: ' + arrayDeArray.length);

        const medidas: Medida[] = [];

        arrayDeArray.forEach(array => array.forEach(medida => medidas.push(medida)));

        const medidasSemRepeticao = _.uniqBy(medidas, 'id');

        return medidasSemRepeticao;
      })
    );

    return medidasPorMonstrosUnificado$;
  }

  obtemMedidaObservavel(id: string): Observable<Medida> {
    const collection = this.db.collection<MedidaDocument>(this.PATH);

    const document = collection.doc<MedidaDocument>(id);

    const medida$ = document.valueChanges().pipe(
      map(value => {
        const monstro = null;

        return this.mapMedida(value, monstro);
      })
    );

    return medida$;
  }

  // private mapMedidas(values: MedidaDocument[]): Medida[] {
  //   return values.map((value, index) => {
  //     const monstroId = value.monstroId.substring(this.monstrosService.PATH.length, value.monstroId.length);

  //     return new Medida(
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

  private mapMedida(value: MedidaDocument, monstro: Monstro): Medida {
    const monstroId = value.monstroId.substring(this.monstrosService.PATH.length, value.monstroId.length);

    return new Medida(
      value.id,
      monstro,
      monstroId,
      value.data.toDate(),
      value.feitaCom as TipoDeBalanca,
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

    const collection = this.db.collection<MedidaDocument>(this.PATH, reference =>
      reference
        .where('monstroId', '==', idAntigo)
        .orderBy('data', 'desc')
    );

    collection.valueChanges().subscribe(medidas => {
      medidas.forEach(medida => {
        medida.monstroId = 'monstros/2MvVXS8931bRukYSnGCJZo98BrH3';

        const document = collection.doc<MedidaDocument>(medida.id);

        document.update(medida);
      });
    });
  }

  cadastraMedida(solicitacao: SolicitacaoDeCadastroDeMedida): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.monstrosService.obtemMonstroObservavel(solicitacao.monstroId).pipe(first()).subscribe(monstro => {
        const medidaId = this.db.createId();

        const medida = new Medida(
          medidaId,
          monstro,
          solicitacao.monstroId,
          solicitacao.data.toDate(),
          solicitacao.feitaCom,
          solicitacao.peso,
          solicitacao.gordura,
          solicitacao.gorduraVisceral,
          solicitacao.musculo,
          solicitacao.idadeCorporal,
          solicitacao.metabolismoBasal,
          solicitacao.indiceDeMassaCorporal
        );

        const result = this.add(medida);

        resolve(result);
      });
    });
  }

  private add(medida: Medida): Promise<void> {
    const collection = this.db.collection<MedidaDocument>(this.PATH);

    const document = collection.doc<MedidaDocument>(medida.id);

    const doc = this.mapTo(medida);

    const result = document.set(doc);

    return result;
  }

  atualizaMedida(medidaId: string, solicitacao: SolicitacaoDeCadastroDeMedida): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.obtemMedidaObservavel(medidaId).pipe(first()).subscribe(medida => {
        medida.defineData(solicitacao.data.toDate());

        medida.defineTipoDeBalanca(solicitacao.feitaCom);

        medida.definePeso(solicitacao.peso);

        medida.defineGordura(solicitacao.gordura);

        medida.defineGorduraVisceral(solicitacao.gorduraVisceral);

        medida.defineMusculo(solicitacao.musculo);

        medida.defineIdadeCorporal(solicitacao.idadeCorporal);

        medida.defineMetabolismoBasal(solicitacao.metabolismoBasal);

        medida.defineIndiceDeMassaCorporal(solicitacao.indiceDeMassaCorporal);

        const result = this.update(medida);

        resolve(result);
      });
    });
  }

  private update(medida: Medida): Promise<void> {
    const collection = this.db.collection<MedidaDocument>(this.PATH);

    const document = collection.doc<MedidaDocument>(medida.id);

    const doc = this.mapTo(medida);

    const result = document.update(doc);

    return result;
  }

  private mapTo(medida: Medida): MedidaDocument {
    const doc: MedidaDocument = {
      id: medida.id,
      // monstroId: `monstros/${medida.monstro.id}`,
      monstroId: `monstros/${medida.monstroId}`,
      data: firebase.firestore.Timestamp.fromDate(medida.data),
      feitaCom: medida.feitaCom,
      peso: medida.peso,
      gordura: medida.gordura,
      gorduraVisceral: medida.gorduraVisceral,
      musculo: medida.musculo,
      idadeCorporal: medida.idadeCorporal,
      metabolismoBasal: medida.metabolismoBasal,
      indiceDeMassaCorporal: medida.indiceDeMassaCorporal
    };

    return doc;
  }

  excluiMedida(medidaId: string): Promise<void> {
    const collection = this.db.collection<MedidaDocument>(this.PATH);

    const document = collection.doc<MedidaDocument>(medidaId);

    const result = document.delete();

    return result;
  }
}

interface MedidaDocument {
  id: string;
  monstroId: string;
  data: firebase.firestore.Timestamp;
  feitaCom: string;
  peso: number;
  gordura: number;
  gorduraVisceral: number;
  musculo: number;
  idadeCorporal: number;
  metabolismoBasal: number;
  indiceDeMassaCorporal: number;
}
