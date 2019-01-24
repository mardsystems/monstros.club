import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Monstro } from '../monstros.model';
import { MonstrosService } from '../monstros.service';
import { Medida, SolicitacaoDeCadastroDeMedida } from './medidas.model';

@Injectable({
  providedIn: 'root'
})
export class MedidasService {
  PATH = '/medidas';

  constructor(
    private db: AngularFirestore,
    private monstrosService: MonstrosService
  ) { }

  obtemMedidasObservaveisParaRanking(): Observable<Medida[]> {
    const collection = this.db.collection<MedidaDocument>(this.PATH, reference => {
      return reference
        .orderBy('data', 'desc');
    });

    const medidas$ = collection.valueChanges().pipe(
      map(values => this.mapMedidas(values))
    );

    return medidas$;
  }

  obtemMedidasObservaveisParaExibicao(monstroId: string): Observable<Medida[]> {
    const collection = this.db.collection<MedidaDocument>(this.PATH, reference => {
      return reference
        .where('monstroId', '==', `monstros/${monstroId}`)
        .orderBy('data', 'desc');
    });

    const medidas$ = collection.valueChanges().pipe(
      map(values => {
        return values.map((value, index) => {
          const monstro = null;

          return this.mapMedida(value, monstro);
        });
      })
    );

    // return this.monstrosService.obtemMonstroObservavel(value.monstroId).pipe(
    //   switchMap(monstro => {
    //     return this.mapMedida(value, monstro)
    //   })
    // );

    return medidas$;
  }

  obtemMedidaObservavel(id: string): Observable<Medida> {
    const collection = this.db.collection<MedidaDocument>(this.PATH);

    const document = collection.doc<MedidaDocument>(id);

    const medida$ = document.valueChanges().pipe(
      map(value => {
        const monstro = null;

        return this.mapMedida(value, monstro);
      })
    );

    return medida$;
  }

  private mapMedidas(values: MedidaDocument[]): Medida[] {
    return values.map((value, index) => {
      return new Medida(
        value.id,
        null,
        value.data.toDate(),
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

  private mapMedida(value: MedidaDocument, monstro: Monstro): Medida {
    return new Medida(
      value.id,
      monstro,
      value.data.toDate(),
      value.peso,
      value.gordura,
      value.gorduraVisceral,
      value.musculo,
      value.idadeCorporal,
      value.metabolismoBasal,
      value.indiceDeMassaCorporal
    );
  }

  importaMedidas() {
    const idDoMarcelo = 'pnYbAnxEyOctBJldlABrtz0l6Jc2';

    const collection = this.db.collection<MedidaDocument>(this.PATH, reference =>
      reference
        .where('monstroId', '==', `monstros/${idDoMarcelo}`)
        .orderBy('data', 'desc')
    );

    collection.valueChanges().subscribe(medidas => {
      medidas.forEach(medida => {
        medida.monstroId = 'monstros/pnYbAnxEyOctBJldlABrtz0l6Jc2';

        const document = collection.doc<MedidaDocument>(medida.id);

        document.update(medida);
      });
    });
  }

  cadastraMedida(solicitacao: SolicitacaoDeCadastroDeMedida): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.monstrosService.obtemMonstroObservavel(solicitacao.monstroId).subscribe(monstro => {
        const medidaId = this.db.createId();

        const medida = new Medida(
          medidaId,
          monstro,
          solicitacao.data,
          solicitacao.peso,
          solicitacao.gordura,
          solicitacao.gorduraVisceral,
          solicitacao.musculo,
          solicitacao.idadeCorporal,
          solicitacao.metabolismoBasal,
          solicitacao.indiceDeMassaCorporal
        );

        const result = this.add(medida);

        resolve(result);
      });
    });
  }

  private add(medida: Medida): Promise<void> {
    const collection = this.db.collection<MedidaDocument>(this.PATH);

    const document = collection.doc<MedidaDocument>(medida.id);

    const newDocument = this.mapTo(medida);

    const result = document.set(newDocument);

    return result;
  }

  atualizaMedida(medidaId: string, solicitacao: SolicitacaoDeCadastroDeMedida): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.obtemMedidaObservavel(medidaId).subscribe(medida => {
        medida.defineData(solicitacao.data);

        medida.definePeso(solicitacao.peso);

        const result = this.update(medida);

        resolve(result);
      });
    });
  }

  private update(medida: Medida): Promise<void> {
    const collection = this.db.collection<MedidaDocument>(this.PATH);

    const document = collection.doc<MedidaDocument>(medida.id);

    const newDocument = this.mapTo(medida);

    const result = document.update(newDocument);

    return result;
  }

  private mapTo(medida: Medida): MedidaDocument {
    const newDocument: MedidaDocument = {
      id: medida.id,
      monstroId: `monstros/${medida.monstro.id}`,
      data: firebase.firestore.Timestamp.fromDate(medida.data),
      peso: medida.peso,
      gordura: medida.gordura,
      gorduraVisceral: medida.gorduraVisceral,
      musculo: medida.musculo,
      idadeCorporal: medida.idadeCorporal,
      metabolismoBasal: medida.metabolismoBasal,
      indiceDeMassaCorporal: medida.indiceDeMassaCorporal
    };

    return newDocument;
  }

  excluiMedida(medidaId: string): Promise<void> {
    const collection = this.db.collection<MedidaDocument>(this.PATH);

    const document = collection.doc<MedidaDocument>(medidaId);

    const result = document.delete();

    return result;
  }
}

interface MedidaDocument {
  id: string;
  monstroId: string;
  data: firebase.firestore.Timestamp;
  peso: number;
  gordura: number;
  gorduraVisceral: number;
  musculo: number;
  idadeCorporal: number;
  metabolismoBasal: number;
  indiceDeMassaCorporal: number;
}
