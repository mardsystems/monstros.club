import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { combineLatest, Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { MonstrosDbContext } from 'src/app/@app-firebase.service';
import { Monstro } from 'src/app/cadastro/monstros/@monstros-domain.model';
import { MonstrosFirebaseService } from 'src/app/cadastro/monstros/@monstros-firebase.service';
import { LogService } from 'src/app/common/common.service';
import { FirebaseService } from 'src/app/common/firebase.service';
import { ConsultaDeMedidas } from './@medidas-application.model';
import { Medida, RepositorioDeMedidas, TipoDeBalanca } from './@medidas-domain.model';

@Injectable()
export class MedidasFirebaseService
  extends FirebaseService<MedidaDocument>
  implements RepositorioDeMedidas, ConsultaDeMedidas {

  constructor(
    protected readonly db: MonstrosDbContext,
    protected readonly monstrosFirebaseService: MonstrosFirebaseService,
    protected readonly log: LogService
  ) {
    super(db);
  }

  path(): string {
    return this.db.medidasPath();
  }

  async add(medida: Medida): Promise<void> {
    try {
      const path = this.path();

      const collection = this.db.firebase.collection<MedidaDocument>(path);

      const document = collection.doc<MedidaDocument>(medida.id);

      const doc = this.mapTo(medida);

      await document.set(doc);
    } catch (e) {
      throw e;
    }
  }

  async update(medida: Medida): Promise<void> {
    try {
      const path = this.path();

      const collection = this.db.firebase.collection<MedidaDocument>(path);

      const document = collection.doc<MedidaDocument>(medida.id);

      const doc = this.mapTo(medida);

      const result = document.update(doc);

      return result;
    } catch (e) {
      throw e;
    }
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

  async remove(medida: Medida): Promise<void> {
    try {
      const path = this.path();

      const collection = this.db.firebase.collection<MedidaDocument>(path);

      const document = collection.doc<MedidaDocument>(medida.id);

      const result = document.delete();

      return result;
    } catch (e) {
      throw e;
    }
  }

  async obtemMedida(id: string): Promise<Medida> {
    try {
      const path = this.path();

      const collection = this.db.firebase.collection<MedidaDocument>(path);

      const document = collection.doc<MedidaDocument>(id);

      const medida$ = document.valueChanges().pipe(
        first(),
        map(value => {
          const monstro = null;

          return this.mapMedida(value, monstro);
        })
      );

      return await medida$.toPromise();
    } catch (e) {
      throw e;
    }
  }

  private mapMedida(value: MedidaDocument, monstro: Monstro): Medida {
    const monstroId = value.monstroId.substring(this.monstrosFirebaseService.path().length, value.monstroId.length);

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

  // Consultas.

  obtemMedidaObservavel(id: string): Observable<Medida> {
    const path = this.path();

    const collection = this.db.firebase.collection<MedidaDocument>(path);

    const document = collection.doc<MedidaDocument>(id);

    const medida$ = document.valueChanges().pipe(
      map(value => {
        const monstro = null;

        return this.mapMedida(value, monstro);
      })
    );

    return medida$;
  }

  obtemMedidasParaExibicao(monstro: Monstro): Observable<Medida[]> {
    const path = this.path();

    const collection = this.db.firebase.collection<MedidaDocument>(path, reference => {
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

  obtemMedidasParaAdministracao(): Observable<Medida[]> {
    const path = this.path();

    const collection = this.db.firebase.collection<MedidaDocument>(path, reference => {
      return reference
        .orderBy('data', 'desc');
    });

    const medidas$ = collection.valueChanges().pipe(
      switchMap(values => {
        const arrayDeMedidas = values
          .filter(value => value.monstroId !== 'monstros/OJUFB66yLBwIOE2hk8hs')
          .map((value) => {

            const monstroId = value.monstroId.substring(this.monstrosFirebaseService.path().length, value.monstroId.length);

            const medidaComMonstro$ = this.monstrosFirebaseService.obtemMonstroObservavel(monstroId).pipe(
              // first(),
              map(monstro => this.mapMedida(value, monstro))
            );

            return medidaComMonstro$;
          });

        const todasAsMedidas$ = combineLatest(arrayDeMedidas);

        return todasAsMedidas$;
      })
    );

    // return merge(medidas$, new Observable<Medida[]>(() => [])); // TODO: Problema quando não tem medidas.

    return medidas$;
  }

  // Rankings.

  obtemUltimaMedidaObservavel(monstro: Monstro): Observable<Medida> {
    const path = this.path();

    const collection = this.db.firebase.collection<MedidaDocument>(path, reference => {
      return reference
        .where('monstroId', '==', `monstros/${monstro.id}`)
        .orderBy('data', 'desc')
        .limit(1);
    });

    const medidas$ = collection.valueChanges().pipe(
      // first(),
      map(values => {
        const medida = values[0];

        this.log.debug('monstro: ' + monstro.nome + '; data: ' + medida.data);

        return this.mapMedida(medida, monstro);
      })
    );

    return medidas$;
  }

  obtemMenorMedidaDeGorduraObservavel(monstro: Monstro): Observable<Medida> {
    const path = this.path();

    const collection = this.db.firebase.collection<MedidaDocument>(path, reference => {
      return reference
        .where('monstroId', '==', `monstros/${monstro.id}`)
        .orderBy('gordura', 'asc')
        .orderBy('data', 'desc')
        .limit(1);
    });

    const medidas$ = collection.valueChanges().pipe(
      // first(),
      map(values => {
        const medida = values[0];

        this.log.debug('monstro: ' + monstro.nome + '; gordura: ' + medida.gordura);

        return this.mapMedida(medida, monstro);
      })
    );

    return medidas$;
  }

  obtemMaiorMedidaDeMusculoObservavel(monstro: Monstro): Observable<Medida> {
    const path = this.path();

    const collection = this.db.firebase.collection<MedidaDocument>(path, reference => {
      return reference
        .where('monstroId', '==', `monstros/${monstro.id}`)
        .orderBy('musculo', 'desc')
        .orderBy('data', 'desc')
        .limit(1);
    });

    const medidas$ = collection.valueChanges().pipe(
      // first(),
      map(values => {
        const medida = values[0];

        this.log.debug('monstro: ' + monstro.nome + '; musculo: ' + medida.musculo);

        return this.mapMedida(medida, monstro);
      })
    );

    return medidas$;
  }

  obtemMenorMedidaDeIndiceDeMassaCorporalObservavel(monstro: Monstro): Observable<Medida> {
    const path = this.path();

    const collection = this.db.firebase.collection<MedidaDocument>(path, reference => {
      return reference
        .where('monstroId', '==', `monstros/${monstro.id}`)
        .orderBy('indiceDeMassaCorporal', 'asc')
        .orderBy('data', 'desc')
        .limit(1);
    });

    const medidas$ = collection.valueChanges().pipe(
      // first(),
      map(values => {
        const medida = values[0];

        this.log.debug('monstro: ' + monstro.nome + '; indiceDeMassaCorporal: ' + medida.indiceDeMassaCorporal);

        return this.mapMedida(medida, monstro);
      })
    );

    return medidas$;
  }

  // Importação.

  importaMedidas() {
    const idAntigo = 'monstros/FCmLKJPLf4ejTazweTCP';

    const path = this.path();

    const collection = this.db.firebase.collection<MedidaDocument>(path, reference =>
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
