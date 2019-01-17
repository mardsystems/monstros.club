import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Monstro } from './monstros.model';

@Injectable({
  providedIn: 'root'
})
export class MonstrosService {
  monstroLogado$: Observable<Monstro>;
  PATH = '/monstros';

  constructor(
    public authService: AuthService,
    private db: AngularFirestore
  ) {
    this.monstroLogado$ = this.authService.userInfo$.pipe(
      switchMap(user => {
        if (user) {
          const informacoesDoMonstroMescladas: Monstro = {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            id: user.uid,
            // nome: user.email,
            // altura: user.altura,
            // genero: user.genero,
            // dataDeNascimento: user.dataDeNascimento,
          };

          const document = this.db.doc<Monstro>(`${this.PATH}/${user.uid}`);

          document.set(informacoesDoMonstroMescladas, { merge: true });

          return document.valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  // public get foto(): string {
  //   if (true) {
  //     return `../assets/foto-${this.monstroId.replace('monstros/', '')}.jpg`;
  //   } else {

  //   }
  // }

  obtemMonstrosObservaveisParaExibicao(monstroId: string): Observable<Monstro[]> {
    const collection = this.db.collection<Monstro>(this.PATH, reference =>
      reference
        .where('monstroId', '==', `monstros/${monstroId}`)
        .orderBy('data', 'desc')
    );

    return collection.valueChanges();
  }

  cadastraMonstro(monstro: Monstro): Promise<void> {
    const collection = this.db.collection<Monstro>(this.PATH);

    const id = this.db.createId();

    const document = collection.doc<Monstro>(id);

    const result = document.set({
      displayName: monstro.displayName,
      email: monstro.email,
      photoURL: monstro.photoURL,
      id: monstro.id,
      nome: monstro.email,
      altura: monstro.altura,
      genero: monstro.genero,
      dataDeNascimento: monstro.dataDeNascimento,
    });

    return result;
  }

  atualizaMonstro(monstro: Monstro): Promise<void> {
    const collection = this.db.collection<Monstro>(this.PATH);

    const document = collection.doc<Monstro>(monstro.id);

    const result = document.update(monstro);

    return result;
  }

  excluiMonstro(monstro: Monstro): Promise<void> {
    const collection = this.db.collection<Monstro>(this.PATH);

    const document = collection.doc<Monstro>(monstro.id);

    const result = document.delete();

    return result;
  }
}
