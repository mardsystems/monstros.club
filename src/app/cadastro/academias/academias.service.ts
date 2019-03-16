import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { LogService } from 'src/app/app-common.services';
import { Academia } from './academias.domain-model';
import { SolicitacaoDeCadastroDeAcademia } from './cadastro/cadastro.application-model';
import * as firebase from 'firebase/app';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AcademiasService {
  PATH = '/academias';

  constructor(
    private db: AngularFirestore,
    private log: LogService
  ) { }

  obtemAcademiasObservaveisParaAdministracao(): Observable<Academia[]> {
    const collection = this.db.collection<AcademiaDocument>(this.PATH, reference => {
      return reference
        .orderBy('nome', 'asc');
    });

    const academias$ = collection.valueChanges().pipe(
      map(values => {
        const academias = values
          .map((value) => {
            const academia = this.mapAcademia(value);

            return academia;
          });

        return academias;
      })
    );

    return academias$;
  }

  obtemAcademiaObservavel(id: string): Observable<Academia> {
    const collection = this.db.collection<AcademiaDocument>(this.PATH);

    const document = collection.doc<AcademiaDocument>(id);

    const academia$ = document.valueChanges().pipe(
      map(value => {
        return this.mapAcademia(value);
      })
    );

    return academia$;
  }

  private mapAcademia(value: AcademiaDocument): Academia {
    return new Academia(
      value.id,
      value.nome,
      value.logoURL,
    );
  }

  cadastraAcademia(solicitacao: SolicitacaoDeCadastroDeAcademia): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const academiaId = this.db.createId();

      const academia = new Academia(
        academiaId,
        solicitacao.nome,
        solicitacao.logoURL,
      );

      const result = this.add(academia);

      resolve(result);
    });
  }

  private add(academia: Academia): Promise<void> {
    const collection = this.db.collection<AcademiaDocument>(this.PATH);

    const document = collection.doc<AcademiaDocument>(academia.id);

    const doc = this.mapTo(academia);

    const result = document.set(doc);

    return result;
  }

  atualizaAcademia(academiaId: string, solicitacao: SolicitacaoDeCadastroDeAcademia): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.obtemAcademiaObservavel(academiaId).pipe(
        first()
      ).subscribe(academia => {
        academia.defineNome(solicitacao.nome);

        academia.definelogoURL(solicitacao.logoURL);

        const result = this.update(academia);

        resolve(result);
      });
    });
  }

  private update(academia: Academia): Promise<void> {
    const collection = this.db.collection<AcademiaDocument>(this.PATH);

    const document = collection.doc<AcademiaDocument>(academia.id);

    const doc = this.mapTo(academia);

    const result = document.update(doc);

    return result;
  }

  private mapTo(academia: Academia): AcademiaDocument {
    const doc: AcademiaDocument = {
      id: academia.id,
      nome: academia.nome,
      logoURL: academia.logoURL,
    };

    return doc;
  }

  excluiAcademia(academiaId: string): Promise<void> {
    const collection = this.db.collection<AcademiaDocument>(this.PATH);

    const document = collection.doc<AcademiaDocument>(academiaId);

    const result = document.delete();

    return result;
  }
}

interface AcademiaDocument {
  id: string;
  nome: string;
  logoURL: string;
}
