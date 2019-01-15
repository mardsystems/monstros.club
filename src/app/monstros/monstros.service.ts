import { Injectable, Query } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, CollectionReference } from '@angular/fire/firestore';
import { Monstro } from './monstros.model';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MonstrosService {
  PATH = '/monstros';

  // monstros: AngularFirestoreCollection<Monstro>;

  constructor(
    private db: AngularFirestore
  ) {
    // if (true) {
    //   this.monstroId = `monstros/vQeCUnaAWmzr2YxP5wB1`;
    // }

    // this.monstros = db.collection<Monstro>('/monstros',
    //   (ref: CollectionReference) => ref.orderBy('data', 'desc').where('monstroId', '==', this.monstroId));
  }

  obtemMonstroObservavel(id: string): Observable<Monstro> {
    const collection = this.db.collection<IMonstro>(this.PATH, reference => {
      return reference
        .orderBy('data', 'desc');
    });

    return collection
      .doc<IMonstro>(id)
      .valueChanges().pipe(
        map(value => this.mapMonstro(value))
      );
  }

  private mapMonstro(value: IMonstro): Monstro {
    return new Monstro(
      value.id,
      value.nome,
      value.usuario,
      value.genero,
      value.dataDeNascimento,
      value.altura,
      value.foto
    );
  }

  // cadastraMonstro(monstro: Monstro): Promise<void> {
  //   const collection = this.db.collection<Monstro>(this.PATH);

  //   const id = this.db.createId();

  //   const document = collection.doc<Monstro>(id);

  //   const result = document.set({
  //     id,
  //     monstroId: monstro.monstroId,
  //     data: monstro.data,
  //     peso: monstro.peso,
  //     gordura: monstro.gordura,
  //     gorduraVisceral: monstro.gorduraVisceral,
  //     musculo: monstro.musculo,
  //     idadeCorporal: monstro.idadeCorporal,
  //     metabolismoBasal: monstro.metabolismoBasal,
  //     indiceDeMassaCorporal: monstro.indiceDeMassaCorporal
  //   });

  //   return result;
  // }

  atualizaMonstro(monstro: Monstro): Promise<void> {
    const collection = this.db.collection<IMonstro>(this.PATH);

    const document = collection.doc<IMonstro>(monstro.id);

    const result = document.update(monstro);

    return result;
  }

  excluiMonstro(monstro: Monstro): Promise<void> {
    const collection = this.db.collection<IMonstro>(this.PATH);

    const document = collection.doc<IMonstro>(monstro.id);

    const result = document.delete();

    return result;
  }
}

// tslint:disable-next-line:class-name
interface IMonstro {
  id: string;
  nome: string;
  usuario: string;
  genero: string;
  dataDeNascimento: Date;
  altura: number;
  foto: string;
}
