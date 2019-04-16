import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { combineLatest, Observable } from 'rxjs';
import { first, map, shareReplay } from 'rxjs/operators';
import { CalculoDeIdade } from 'src/app/app-@shared.services';
import { Genero, RepositorioDeMonstros, Monstro } from './monstros.domain-model';
import { FirebaseService } from 'src/app/app-common.domain-model-firecloud';

export class MonstrosFirecloudService
  extends FirebaseService<MonstroDocument>
  implements RepositorioDeMonstros {
  constructor(
    private db: AngularFirestore,
    private calculoDeIdade: CalculoDeIdade,
  ) {
    super('monstros', db);
  }

  obtemMonstrosParaAdministracao(): Observable<Monstro[]> {
    const collection = this.db.collection<MonstroDocument>(this.path(), reference => {
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

  obtemMonstros(ids: string[]): Observable<Monstro[]> {
    const arrayDeMonstros = ids
      .map((id) => this.obtemMonstroObservavel(id).pipe(
        // first()
      ));

    const todosOsMonstros$ = combineLatest(arrayDeMonstros);

    return todosOsMonstros$;
  }

  obtemMonstroObservavel(id: string): Observable<Monstro> {
    const collection = this.db.collection<MonstroDocument>(this.path());

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

  async obtemMonstro(id: string): Promise<Monstro> {
    const collection = this.db.collection<MonstroDocument>(this.path());

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

  async add(monstro: Monstro): Promise<void> {
    const collection = this.db.collection<MonstroDocument>(this.path());

    const document = collection.doc<MonstroDocument>(monstro.id);

    const doc = this.mapTo(monstro);

    await document.set(doc);
  }

  async update(monstro: Monstro): Promise<void> {
    const collection = this.db.collection<MonstroDocument>(this.path());

    const document = collection.doc<MonstroDocument>(monstro.id);

    const doc = this.mapTo(monstro);

    await document.update(doc);
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
    const collection = this.db.collection<MonstroDocument>(this.path());

    const document = collection.doc<MonstroDocument>(monstro.id);

    await document.delete();
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
