import { Injectable, Query } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, CollectionReference } from '@angular/fire/firestore';
import { Medida } from './medidas.model';
import { Observable } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MedidasService {
  PATH = '/medidas';

  constructor(
    private db: AngularFirestore
  ) {
  }

  obtemMedidasObservaveisParaExibicao(monstroId: string): Observable<Medida[]> {
    const collection = this.db.collection<Medida>(this.PATH, reference =>
      reference
        .where('monstroId', '==', `monstros/${monstroId}`)
        .orderBy('data', 'desc')
    );

    return collection.valueChanges();
  }

  cadastraMedida(medida: Medida): Promise<void> {
    const collection = this.db.collection<Medida>(this.PATH);

    const id = this.db.createId();

    const document = collection.doc<Medida>(id);

    const result = document.set({
      id,
      monstroId: medida.monstroId,
      data: medida.data,
      peso: medida.peso,
      gordura: medida.gordura,
      gorduraVisceral: medida.gorduraVisceral,
      musculo: medida.musculo,
      idadeCorporal: medida.idadeCorporal,
      metabolismoBasal: medida.metabolismoBasal,
      indiceDeMassaCorporal: medida.indiceDeMassaCorporal
    });

    return result;
  }

  atualizaMedida(medida: Medida): Promise<void> {
    const collection = this.db.collection<Medida>(this.PATH);

    const document = collection.doc<Medida>(medida.id);

    const result = document.update(medida);

    return result;
  }

  excluiMedida(medida: Medida): Promise<void> {
    const collection = this.db.collection<Medida>(this.PATH);

    const document = collection.doc<Medida>(medida.id);

    const result = document.delete();

    return result;
  }
}
