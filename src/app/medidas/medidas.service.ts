import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Medida } from './medidas.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedidasService {
  medidas: AngularFirestoreCollection<Medida>;

  constructor(
    private db: AngularFirestore
  ) {
    this.medidas = db.collection<Medida>('/medidas');
  }

  obtemMedidas(): Observable<Medida[]> {
    return this.medidas.valueChanges();
  }

  cadastraMedida(medida: Medida): Promise<void> {
    const id = this.db.createId();

    const document = this.medidas.doc<Medida>(id);

    const result = document.set({
      id,
      monstroId: medida.monstroId,
      data: medida.data,
      peso: medida.peso,
      gordura: medida.gordura,
      gorduraVisceral: medida.gorduraVisceral,
      musculo: medida.musculo,
      idadeCorporal: medida.idadeCorporal,
      metabolistmoBasal: medida.metabolistmoBasal,
      indiceDeMassaCorporal: medida.indiceDeMassaCorporal
    });

    return result;
  }

  atualizaMedida(medida: Medida): Promise<void> {
    const document = this.medidas.doc<Medida>(medida.id);

    const result = document.update(medida);

    return result;
  }

  excluiMedida(medida: Medida): Promise<void> {
    const document = this.medidas.doc<Medida>(medida.id);

    const result = document.delete();

    return result;
  }
}