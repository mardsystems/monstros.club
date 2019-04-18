import { Inject, Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { combineLatest, Observable } from 'rxjs';
import { first, map, shareReplay } from 'rxjs/operators';
import { CalculoDeIdade, CALCULO_DE_IDADE } from 'src/app/@app-domain.model';
import { FirebaseService, MonstrosDbContext } from 'src/app/@app-firebase.model';
import { ConsultaDeMonstros } from './@monstros-application.model';
import { Genero, Monstro, RepositorioDeMonstros } from './@monstros-domain.model';

@Injectable()
export class MonstrosFirebaseService
  extends FirebaseService<MonstroDocument>
  implements RepositorioDeMonstros, ConsultaDeMonstros {
  constructor(
    protected readonly db: MonstrosDbContext,
    @Inject(CALCULO_DE_IDADE)
    protected readonly calculoDeIdade: CalculoDeIdade,
  ) {
    super(db);
  }

  path(): string {
    return this.db.monstrosPath();
  }

  async add(monstro: Monstro): Promise<void> {
    try {
      const path = this.path();

      const collection = this.db.firebase.collection<MonstroDocument>(path);

      const document = collection.doc<MonstroDocument>(monstro.id);

      const doc = this.mapTo(monstro);

      await document.set(doc);
    } catch (e) {
      throw e;
    }
  }

  async update(monstro: Monstro): Promise<void> {
    try {
      const path = this.path();

      const collection = this.db.firebase.collection<MonstroDocument>(path);

      const document = collection.doc<MonstroDocument>(monstro.id);

      const doc = this.mapTo(monstro);

      await document.update(doc);
    } catch (e) {
      throw e;
    }
  }

  private mapTo(monstro: Monstro): MonstroDocument {
    const doc: MonstroDocument = {
      admin: (monstro.admin ? monstro.admin : false),
      displayName: monstro.displayName,
      email: monstro.email,
      photoURL: monstro.photoURL,
      id: monstro.id,
      nome: monstro.nome,
      usuario: monstro.usuario,
      genero: monstro.genero,
      altura: monstro.altura,
      dataDeNascimento: (monstro.dataDeNascimento ? firebase.firestore.Timestamp.fromDate(monstro.dataDeNascimento) : null),
      dataDoUltimoLogin: firebase.firestore.Timestamp.fromDate(monstro.dataDoUltimoLogin),
    };

    return doc;
  }

  async remove(monstro: Monstro): Promise<void> {
    try {
      const path = this.path();

      const collection = this.db.firebase.collection<MonstroDocument>(path);

      const document = collection.doc<MonstroDocument>(monstro.id);

      await document.delete();
    } catch (e) {
      throw e;
    }
  }

  async obtemMonstro(id: string): Promise<Monstro> {
    try {
      const path = this.path();

      const collection = this.db.firebase.collection<MonstroDocument>(path);

      const document = collection.doc<MonstroDocument>(id);

      const monstro$ = document.valueChanges().pipe(
        first(),
        map(value => {
          if (value) {
            return this.mapMonstro(value);
          } else {
            throw new Error(`Monstro não encontrado (id: '${id}').`);
          }
        }),
      );

      return await monstro$.toPromise();
    } catch (e) {
      throw e;
    }
  }

  private mapMonstro(value: MonstroDocument): Monstro {
    return new Monstro(
      value.admin,
      value.displayName,
      value.email,
      value.photoURL,
      value.id,
      value.nome,
      value.usuario,
      (value.genero ? Genero[value.genero] : null),
      value.altura,
      (value.dataDeNascimento ? value.dataDeNascimento.toDate() : null),
      (value.dataDoUltimoLogin ? value.dataDoUltimoLogin.toDate() : null),
      this.calculoDeIdade
    );
  }

  obtemMonstroObservavel(id: string): Observable<Monstro> {
    const path = this.path();

    const collection = this.db.firebase.collection<MonstroDocument>(path);

    const document = collection.doc<MonstroDocument>(id);

    const monstro$ = document.valueChanges().pipe(
      // first(),
      // tap((value2) => this.log.debug('obtemMonstroObservavel', value2)),
      map(value => {
        if (value) {
          return this.mapMonstro(value);
        } else {
          throw new Error(`Monstro não encontrado (id: '${id}').`);
        }
      }),
      shareReplay()
    );

    return monstro$;
  }

  obtemMonstros(ids: string[]): Observable<Monstro[]> {
    const arrayDeMonstros = ids
      .map((id) => this.obtemMonstroObservavel(id).pipe(
        // first()
      ));

    const todosOsMonstros$ = combineLatest(arrayDeMonstros);

    return todosOsMonstros$;
  }

  // Consultas.

  obtemMonstrosParaAdministracao(): Observable<Monstro[]> {
    const path = this.path();

    const collection = this.db.firebase.collection<MonstroDocument>(path, reference => {
      return reference
        .orderBy('dataDoUltimoLogin', 'desc');
    });

    const monstros$ = collection.valueChanges().pipe(
      map(values => {
        return values.map((value, index) => {
          return this.mapMonstro(value);
        });
      })
    );

    return monstros$;
  }
}

export interface MonstroDocument {
  admin?: boolean;
  displayName?: string;
  email?: string;
  photoURL?: string;
  id: string;
  nome?: string;
  usuario?: string;
  genero?: string;
  altura?: number;
  dataDeNascimento?: firebase.firestore.Timestamp;
  dataDoUltimoLogin?: firebase.firestore.Timestamp;
}
