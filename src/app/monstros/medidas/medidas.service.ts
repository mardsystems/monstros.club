import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LogService } from 'src/app/app-common.services';
import { Monstro } from '../monstros.domain-model';
import { MonstrosService } from '../monstros.service';
import { Medida, TipoDeBalanca } from './medidas.domain-model';

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

  createId(): string {
    const id = this.db.createId();

    return id;
  }

  ref(id: string): DocumentReference {
    const collection = this.db.collection<MedidaDocument>(this.PATH);

    const document = collection.doc<MedidaDocument>(id);

    return document.ref;
  }

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
              // first(),
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

  obtemUltimaMedidaObservavel(monstro: Monstro): Observable<Medida> {
    const collection1 = this.db.collection<MedidaDocument>(this.PATH, reference => {
      return reference
        .where('monstroId', '==', `monstros/${monstro.id}`)
        .orderBy('data', 'desc')
        .limit(1);
    });

    const medidas1$ = collection1.valueChanges().pipe(
      // first(),
      map(values => {
        const medida = values[0];

        this.log.debug('monstro: ' + monstro.nome + '; data: ' + medida.data);

        return this.mapMedida(medida, monstro);
      })
    );

    return medidas1$;
  }

  obtemMenorMedidaDeGorduraObservavel(monstro: Monstro): Observable<Medida> {
    const collection2 = this.db.collection<MedidaDocument>(this.PATH, reference => {
      return reference
        .where('monstroId', '==', `monstros/${monstro.id}`)
        .orderBy('gordura', 'asc')
        .orderBy('data', 'desc')
        .limit(1);
    });

    const medidas2$ = collection2.valueChanges().pipe(
      // first(),
      map(values => {
        const medida = values[0];

        this.log.debug('monstro: ' + monstro.nome + '; gordura: ' + medida.gordura);

        return this.mapMedida(medida, monstro);
      })
    );

    return medidas2$;
  }

  obtemMaiorMedidaDeMusculoObservavel(monstro: Monstro): Observable<Medida> {
    const collection3 = this.db.collection<MedidaDocument>(this.PATH, reference => {
      return reference
        .where('monstroId', '==', `monstros/${monstro.id}`)
        .orderBy('musculo', 'desc')
        .orderBy('data', 'desc')
        .limit(1);
    });

    const medidas3$ = collection3.valueChanges().pipe(
      // first(),
      map(values => {
        const medida = values[0];

        this.log.debug('monstro: ' + monstro.nome + '; musculo: ' + medida.musculo);

        return this.mapMedida(medida, monstro);
      })
    );

    return medidas3$;
  }

  obtemMenorMedidaDeIndiceDeMassaCorporalObservavel(monstro: Monstro): Observable<Medida> {
    const collection4 = this.db.collection<MedidaDocument>(this.PATH, reference => {
      return reference
        .where('monstroId', '==', `monstros/${monstro.id}`)
        .orderBy('indiceDeMassaCorporal', 'asc')
        .orderBy('data', 'desc')
        .limit(1);
    });

    const medidas4$ = collection4.valueChanges().pipe(
      // first(),
      map(values => {
        const medida = values[0];

        this.log.debug('monstro: ' + monstro.nome + '; indiceDeMassaCorporal: ' + medida.indiceDeMassaCorporal);

        return this.mapMedida(medida, monstro);
      })
    );

    return medidas4$;
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

  add(medida: Medida): Promise<void> {
    const collection = this.db.collection<MedidaDocument>(this.PATH);

    const document = collection.doc<MedidaDocument>(medida.id);

    const doc = this.mapTo(medida);

    const result = document.set(doc);

    return result;
  }

  update(medida: Medida): Promise<void> {
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

  remove(medidaId: string): Promise<void> {
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
