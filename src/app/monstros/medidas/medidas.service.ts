import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import { Observable, combineLatest } from 'rxjs';
import { first, map, mergeMap, merge, switchMap } from 'rxjs/operators';
import { Monstro } from '../monstros.model';
import { MonstrosService, MonstroDocument } from '../monstros.service';
import { Medida, SolicitacaoDeCadastroDeMedida } from './medidas.model';
import * as _ from 'lodash';

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
      mergeMap(values => {
        const arrayDeMedidasObservaveis = values
          .filter(value => value.monstroId !== 'monstros/OJUFB66yLBwIOE2hk8hs')
          .map((value) => {
            const monstroId = value.monstroId.substring(this.monstrosService.PATH.length, value.monstroId.length);

            const medidaComMonstro$ = this.monstrosService.obtemMonstroObservavel(monstroId).pipe(
              map(monstro => this.mapMedida(value, monstro))
            );

            return medidaComMonstro$;
          });

        const todasAsMedidas$ = combineLatest(arrayDeMedidasObservaveis);

        return todasAsMedidas$;
      })
    );

    return medidas$;
  }

  obtemMedidasObservaveisParaExibicao(monstroId: string): Observable<Medida[]> {
    const medidaComMonstro$ = this.monstrosService.obtemMonstroObservavel(monstroId).pipe(
      mergeMap(monstro => {
        const collection = this.db.collection<MedidaDocument>(this.PATH, reference => {
          return reference
            .where('monstroId', '==', `monstros/${monstroId}`)
            .orderBy('data', 'desc');
        });

        const medidas$ = collection.valueChanges().pipe(
          map(values => {
            return values.map((value, index) => {
              return this.mapMedida(value, monstro);
            });
          })
        );

        return medidas$;
      })
    );

    return medidaComMonstro$;
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
      const monstroId = value.monstroId.substring(this.monstrosService.PATH.length, value.monstroId.length);

      return new Medida(
        value.id,
        null,
        monstroId,
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
    const monstroId = value.monstroId.substring(this.monstrosService.PATH.length, value.monstroId.length);

    return new Medida(
      value.id,
      monstro,
      monstroId,
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
    const idAntigo = 'monstros/FCmLKJPLf4ejTazweTCP';

    const collection = this.db.collection<MedidaDocument>(this.PATH, reference =>
      reference
        .where('monstroId', '==', idAntigo)
        .orderBy('data', 'desc')
    );

    collection.valueChanges().subscribe(medidas => {
      medidas.forEach(medida => {
        medida.monstroId = 'monstros/2MvVXS8931bRukYSnGCJZo98BrH3';

        const document = collection.doc<MedidaDocument>(medida.id);

        document.update(medida);
      });
    });
  }

  cadastraMedida(solicitacao: SolicitacaoDeCadastroDeMedida): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.monstrosService.obtemMonstroObservavel(solicitacao.monstroId).pipe(first()).subscribe(monstro => {
        const medidaId = this.db.createId();

        const medida = new Medida(
          medidaId,
          monstro,
          solicitacao.monstroId,
          solicitacao.data.toDate(),
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
      this.obtemMedidaObservavel(medidaId).pipe(first()).subscribe(medida => {
        medida.defineData(solicitacao.data.toDate());

        medida.definePeso(solicitacao.peso);

        medida.defineGordura(solicitacao.gordura);

        medida.defineGorduraVisceral(solicitacao.gorduraVisceral);

        medida.defineMusculo(solicitacao.musculo);

        medida.defineIdadeCorporal(solicitacao.idadeCorporal);

        medida.defineMetabolismoBasal(solicitacao.metabolismoBasal);

        medida.defineIndiceDeMassaCorporal(solicitacao.indiceDeMassaCorporal);

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
      // monstroId: `monstros/${medida.monstro.id}`,
      monstroId: `monstros/${medida.monstroId}`,
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
  // monstro: MonstroDocument;
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
