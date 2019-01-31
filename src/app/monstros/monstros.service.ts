import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Monstro, SolicitacaoDeCadastroDeMonstro } from './monstros.model';

@Injectable({
  providedIn: 'root'
})
export class MonstrosService {
  monstroLogado$: Observable<Monstro>;
  PATH = '/monstros';

  constructor(
    private db: AngularFirestore,
    private authService: AuthService
  ) {
    this.monstroLogado$ = this.authService.user$.pipe(
      switchMap(user => {
        if (user) {
          const newDocument: MonstroDocument = {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            id: user.uid,
            nome: user.displayName,
            usuario: user.uid,
            genero: 'Masculino',
            altura: 1.72,
            dataDeNascimento: firebase.firestore.Timestamp.fromDate(new Date(1982, 4, 8))
          };

          const document = this.db.doc<MonstroDocument>(`${this.PATH}/${user.uid}`);

          document.set(newDocument, { merge: true });

          const monstro$ = document.valueChanges().pipe(
            map(value => this.mapMonstro(value))
          );

          return monstro$;
        } else {
          return of(null);
        }
      })
    );
  }

  obtemMonstroObservavel(id: string): Observable<Monstro> {
    const collection = this.db.collection<MonstroDocument>(this.PATH);

    const document = collection.doc<MonstroDocument>(id);

    const monstro$ = document.valueChanges().pipe(
      map(value => this.mapMonstro(value))
    );

    return monstro$;
  }

  private mapMonstro(value: MonstroDocument): Monstro {
    return new Monstro(
      value.displayName,
      value.email,
      value.photoURL,
      value.id,
      value.nome,
      value.usuario,
      value.genero,
      value.altura,
      (value.dataDeNascimento ? value.dataDeNascimento.toDate() : null)
    );
  }

  cadastraMonstro(solicitacao: SolicitacaoDeCadastroDeMonstro): Promise<void> {
    const monstroId = this.db.createId();

    const monstro = new Monstro(
      solicitacao.displayName,
      solicitacao.email,
      solicitacao.photoURL,
      monstroId,
      solicitacao.nome,
      solicitacao.usuario,
      solicitacao.genero,
      solicitacao.altura,
      solicitacao.dataDeNascimento
    );

    const result = this.add(monstro);

    return result;
  }

  private add(monstro: Monstro): Promise<void> {
    const collection = this.db.collection<MonstroDocument>(this.PATH);

    const document = collection.doc<MonstroDocument>(monstro.id);

    const newDocument = this.mapTo(monstro);

    const result = document.set(newDocument);

    return result;
  }

  atualizaMonstro(monstroId: string, solicitacao: SolicitacaoDeCadastroDeMonstro): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.obtemMonstroObservavel(monstroId).subscribe(monstro => {
        monstro.defineNome(solicitacao.nome);

        const result = this.update(monstro);

        resolve(result);
      });
    });
  }

  private update(monstro: Monstro): Promise<void> {
    const collection = this.db.collection<MonstroDocument>(this.PATH);

    const document = collection.doc<MonstroDocument>(monstro.id);

    const newDocument = this.mapTo(monstro);

    const result = document.update(newDocument);

    return result;
  }

  private mapTo(monstro: Monstro): MonstroDocument {
    const newDocument: MonstroDocument = {
      displayName: monstro.displayName,
      email: monstro.email,
      photoURL: monstro.photoURL,
      id: monstro.id,
      nome: monstro.nome,
      usuario: monstro.usuario,
      genero: monstro.genero,
      altura: monstro.altura,
      dataDeNascimento: firebase.firestore.Timestamp.fromDate(monstro.dataDeNascimento),
    };

    return newDocument;
  }

  excluiMonstro(monstroId: string): Promise<void> {
    const collection = this.db.collection<MonstroDocument>(this.PATH);

    const document = collection.doc<MonstroDocument>(monstroId);

    const result = document.delete();

    return result;
  }
}

export interface MonstroDocument {
  displayName?: string;
  email?: string;
  photoURL?: string;
  id: string;
  nome?: string;
  usuario?: string;
  genero?: string;
  altura?: number;
  dataDeNascimento?: firebase.firestore.Timestamp;
}
