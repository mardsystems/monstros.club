import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, CollectionReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Medida } from 'src/domain/monstros/medidas/medida';
import { RepositorioDeMedidas } from 'src/domain/monstros/medidas/repositorioDeMedidas';

@Injectable({
  providedIn: 'root'
})
export class RepositorioDeMedidasFirebase implements RepositorioDeMedidas {
  medidas: AngularFirestoreCollection<Medida>;

  constructor(
    private db: AngularFirestore
  ) {
    this.medidas = db.collection<Medida>('/medidas',
      (ref: CollectionReference) => ref.orderBy('data', 'desc'));
  }

  obtemMedidas(): Observable<Medida[]> {
    return this.medidas.valueChanges();
  }
}
