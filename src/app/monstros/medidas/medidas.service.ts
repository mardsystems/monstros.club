import { Injectable, Query } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, CollectionReference } from '@angular/fire/firestore';
import { Medida } from './medidas.model';
import { Observable } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MedidasService {
  medidas: AngularFirestoreCollection<Medida>;
  monstroId: string;

  constructor(
    private db: AngularFirestore,
    private authService: AuthService
  ) {
    if (true) {
      this.monstroId = `monstros/vQeCUnaAWmzr2YxP5wB1`;
    }

    this.medidas = db.collection<Medida>('/medidas',
      (ref: CollectionReference) => ref.orderBy('data', 'desc').where('monstroId', '==', this.monstroId));

    this.authService.user.subscribe((user) => {
      this.monstroId = `monstros/${user.id}`;

      this.medidas.valueChanges();
    });
  }

  obtemMedidas(monstro: string): Observable<Medida[]> {
    return this.medidas.valueChanges();
  }

  cadastraMedida(medida: Medida): Promise<void> {
    const id = this.db.createId();

    const document = this.medidas.doc<Medida>(id);

    const result = document.set({
      id,
      monstroId: this.monstroId,
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
