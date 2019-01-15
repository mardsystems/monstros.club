import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Monstro } from '../monstros.model';
import { MonstrosService } from '../monstros.service';
import { Medida } from './medidas.model';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MedidasService {
  PATH = '/medidas';

  constructor(
    private monstrosService: MonstrosService,
    private db: AngularFirestore
  ) { }

  obtemMedidasObservaveisParaRanking(): Observable<Medida[]> {
    const collection = this.db.collection<IMedida>(this.PATH, reference => {
      return reference
        .orderBy('data', 'desc');
    });

    return collection.valueChanges().pipe(
      map(values => this.mapMedidas(values))
    );
  }

  obtemMedidasObservaveisParaExibicao(monstroId: string): Observable<Medida[]> {
    const collection = this.db.collection<IMedida>(this.PATH, reference => {
      return reference
        .where('monstroId', '==', `monstros/${monstroId}`)
        .orderBy('data', 'desc');
    });

    return collection.valueChanges().pipe(
      map(values => {
        return values.map((value, index) => {
          return this.mapMedida(value, null);
        });
      })
    );
  }

  // return this.monstrosService.obtemMonstroObservavel(value.monstroId).pipe(
  //   switchMap(monstro => {
  //     return this.mapMedida(value, monstro)
  //   })
  // );

  private mapMedidas(values: IMedida[]): Medida[] {
    return values.map((value, index) => {
      return new Medida(
        value.id,
        null,
        value.data,
        value.peso,
        value.gordura,
        value.gorduraVisceral,
        value.musculo,
        value.idadeCorporal,
        value.metabolismoBasal,
        value.indiceDeMassaCorporal
      );
    });
  }

  private mapMedida(value: IMedida, monstro: Monstro): Medida {
    return new Medida(
      value.id,
      monstro,
      value.data,
      value.peso,
      value.gordura,
      value.gorduraVisceral,
      value.musculo,
      value.idadeCorporal,
      value.metabolismoBasal,
      value.indiceDeMassaCorporal
    );
  }

  cadastraMedida(medida: Medida): Promise<void> {
    const collection = this.db.collection<IMedida>(this.PATH);

    const id = this.db.createId();

    const document = collection.doc<IMedida>(id);

    const result = document.set({
      id,
      monstroId: `monstros/${medida.monstro.id}`,
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
    const collection = this.db.collection<IMedida>(this.PATH);

    const document = collection.doc<IMedida>(medida.id);

    const result = document.update(medida);

    return result;
  }

  excluiMedida(medida: Medida): Promise<void> {
    const collection = this.db.collection<IMedida>(this.PATH);

    const document = collection.doc<IMedida>(medida.id);

    const result = document.delete();

    return result;
  }
}

// tslint:disable-next-line:class-name
interface IMedida {
  id: string;
  monstroId: string;
  data: Date;
  peso: number;
  gordura: number;
  gorduraVisceral: number;
  musculo: number;
  idadeCorporal: number;
  metabolismoBasal: number;
  indiceDeMassaCorporal: number;
}
