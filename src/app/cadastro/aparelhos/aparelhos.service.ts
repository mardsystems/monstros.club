import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { LogService } from 'src/app/app-common.services';
import { Aparelho } from './aparelhos.domain-model';
import { SolicitacaoDeCadastroDeAparelho } from './cadastro/cadastro.application-model';
import * as firebase from 'firebase/app';
import * as _ from 'lodash';
import { AcademiasService } from '../academias/academias.service';
import { Academia } from '../academias/academias.domain-model';

@Injectable({
  providedIn: 'root'
})
export class AparelhosService {
  PATH = '/aparelhos';

  constructor(
    private db: AngularFirestore,
    private academiasService: AcademiasService,
    private log: LogService
  ) { }

  obtemAparelhosObservaveisParaAdministracao(): Observable<Aparelho[]> {
    const collection = this.db.collection<AparelhoDocument>(this.PATH, reference => {
      return reference
        .orderBy('codigo', 'asc');
    });

    const aparelhos$ = collection.valueChanges().pipe(
      map(values => {
        const aparelhos = values
          .map((value) => {
            const aparelho = this.mapAparelho(value);

            return aparelho;
          });

        return aparelhos;
      })
    );

    return aparelhos$;
  }

  obtemAparelhoObservavel(id: string): Observable<Aparelho> {
    const collection = this.db.collection<AparelhoDocument>(this.PATH);

    const document = collection.doc<AparelhoDocument>(id);

    const aparelho$ = document.valueChanges().pipe(
      map(value => {
        return this.mapAparelho(value);
      })
    );

    return aparelho$;
  }

  private mapAparelho(value: AparelhoDocument): Aparelho {
    return new Aparelho(
      value.id,
      value.codigo,
      new Academia('teste', 'teste', 'teste'), // value.academia as Academia,
      value.imagemURL,
      0,
      []
    );
  }

  cadastraAparelho(solicitacao: SolicitacaoDeCadastroDeAparelho): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const aparelhoId = this.db.createId();

      const aparelho = new Aparelho(
        aparelhoId,
        solicitacao.codigo,
        solicitacao.academia,
        solicitacao.imagemURL,
      );

      const result = this.add(aparelho);

      resolve(result);
    });
  }

  private add(aparelho: Aparelho): Promise<void> {
    const collection = this.db.collection<AparelhoDocument>(this.PATH);

    const document = collection.doc<AparelhoDocument>(aparelho.id);

    const doc = this.mapTo(aparelho);

    const result = document.set(doc);

    return result;
  }

  atualizaAparelho(aparelhoId: string, solicitacao: SolicitacaoDeCadastroDeAparelho): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.obtemAparelhoObservavel(aparelhoId).pipe(
        first()
      ).subscribe(aparelho => {
        aparelho.alteraCodigo(solicitacao.codigo);

        aparelho.corrigeAcademia(solicitacao.academia);

        aparelho.alteraImagemURL(solicitacao.imagemURL);

        const result = this.update(aparelho);

        resolve(result);
      });
    });
  }

  private update(aparelho: Aparelho): Promise<void> {
    const collection = this.db.collection<AparelhoDocument>(this.PATH);

    const document = collection.doc<AparelhoDocument>(aparelho.id);

    const doc = this.mapTo(aparelho);

    const result = document.update(doc);

    return result;
  }

  private mapTo(aparelho: Aparelho): AparelhoDocument {
    const academiaRef = this.academiasService.ref(aparelho.academia.id);

    const doc: AparelhoDocument = {
      id: aparelho.id,
      codigo: aparelho.codigo,
      academia: academiaRef,
      imagemURL: aparelho.imagemURL,
      exercicios: aparelho.exercicios.map(exercicio => {
        const exercicioRef = this.academiasService.ref(exercicio.id);

        return exercicioRef;
      })
    };

    return doc;
  }

  excluiAparelho(aparelhoId: string): Promise<void> {
    const collection = this.db.collection<AparelhoDocument>(this.PATH);

    const document = collection.doc<AparelhoDocument>(aparelhoId);

    const result = document.delete();

    return result;
  }
}

interface AparelhoDocument {
  id: string;
  codigo: string;
  academia: firebase.firestore.DocumentReference;
  imagemURL: string;
  exercicios: firebase.firestore.DocumentReference[];
}
