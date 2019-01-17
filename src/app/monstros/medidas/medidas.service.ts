import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Medida } from './medidas.model';

@Injectable({
  providedIn: 'root'
})
export class MedidasService {
  PATH = '/medidas';

  constructor(
    private db: AngularFirestore
  ) { }

  obtemMedidasObservaveisParaRanking(): Observable<Medida[]> {
    const collection = this.db.collection<Medida>(this.PATH, reference =>
      reference
        .orderBy('data', 'desc')
    );

    return collection.valueChanges();
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
