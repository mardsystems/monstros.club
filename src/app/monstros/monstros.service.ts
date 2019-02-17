import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, tap, first } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Monstro, SolicitacaoDeCadastroDeMonstro, Genero } from './monstros.model';
import * as moment from 'moment';
import { CalculoDeIdade } from '../app.services';

@Injectable({
  providedIn: 'root'
})
export class MonstrosService {
  monstroLogado$: Observable<Monstro>;
  PATH = '/monstros';

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    private calculoDeIdade: CalculoDeIdade
  ) {
    this.monstroLogado$ = this.authService.user$.pipe(
      // first(),
      switchMap(user => {
        if (user) {
          // console.log(user);

          const monstro$ = this.obtemMonstroObservavel(user.uid).pipe(
            first(),
            tap(monstro => {
              // console.log(monstro);

              const solicitacao: SolicitacaoDeCadastroDeMonstro = {
                isEdit: true,
                id: monstro.id,
                admin: monstro.admin,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                nome: monstro.nome,
                usuario: monstro.usuario,
                genero: monstro.genero,
                altura: monstro.altura,
                dataDeNascimento: (monstro.dataDeNascimento ? moment(monstro.dataDeNascimento) : null),
                dataDoUltimoLogin: moment()
              };

              this.atualizaMonstro(user.uid, solicitacao);
            }),
            catchError((error, monstro) => {
              const solicitacao: SolicitacaoDeCadastroDeMonstro = {
                isEdit: false,
                id: user.uid,
                admin: false,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                nome: user.displayName || user.email,
                usuario: user.uid,
                genero: null,
                altura: null,
                dataDeNascimento: null,
                dataDoUltimoLogin: moment()
              };

              this.cadastraMonstro(solicitacao);

              const monstroCadastrado$ = this.obtemMonstroObservavel(user.uid).pipe(
                first(),
                catchError((error2, monstro2) => {
                  console.log(`Retornando nenhum monstro após o cadastro do mesmo.\nRazão:\n${error2}`);

                  return of(null);
                })
              );

              return monstroCadastrado$;
            })
          );

          return monstro$;
        } else {
          return of(null);
        }
      })
    );
  }

  public estaAutenticado(): Observable<boolean> {
    return this.monstroLogado$.pipe(
      map(monstroLogado => monstroLogado != null)
    );
  }

  public ehVoceMesmo(id: string): Observable<boolean> {
    return this.monstroLogado$.pipe(
      map(monstroLogado => monstroLogado != null && monstroLogado.id === id)
    );
  }

  public ehProprietario(monstrosId: string): Observable<boolean> {
    return this.monstroLogado$.pipe(
      map(monstroLogado => ('monstros/' + monstroLogado.id) === monstrosId)
    );
  }

  public ehAdministrador(): Observable<boolean> {
    return this.monstroLogado$.pipe(
      map(monstroLogado => monstroLogado != null && monstroLogado.admin)
    );
  }

  obtemMonstrosObservaveisParaExibicao(): Observable<Monstro[]> {
    const collection = this.db.collection<MonstroDocument>(this.PATH, reference => {
      return reference;
      // .orderBy('dataDoUltimoLogin', 'desc');
    });

    const monstros$ = collection.valueChanges().pipe(
      map(values => {
        return values.map((value, index) => {
          return this.mapMonstro(value);
        });
      })
    );

    return monstros$;
  }

  obtemMonstroObservavel(id: string): Observable<Monstro> {
    const collection = this.db.collection<MonstroDocument>(this.PATH);

    const document = collection.doc<MonstroDocument>(id);

    const monstro$ = document.valueChanges().pipe(
      map(value => {
        if (value) {
          return this.mapMonstro(value);
        } else {
          throw new Error(`Monstro não encontrado (id: '${id}').`);
        }
      })
    );

    return monstro$;
  }

  private mapMonstro(value: MonstroDocument): Monstro {
    return new Monstro(
      value.admin,
      value.displayName,
      value.email,
      value.photoURL,
      value.id,
      value.nome,
      value.usuario,
      (value.genero ? Genero[value.genero] : null),
      value.altura,
      (value.dataDeNascimento ? value.dataDeNascimento.toDate() : null),
      (value.dataDoUltimoLogin ? value.dataDoUltimoLogin.toDate() : null),
      this.calculoDeIdade
    );
  }

  cadastraMonstro(solicitacao: SolicitacaoDeCadastroDeMonstro): Promise<void> {
    // const monstroId = this.db.createId();

    const monstro = new Monstro(
      solicitacao.admin,
      solicitacao.displayName,
      solicitacao.email,
      solicitacao.photoURL,
      solicitacao.id,
      solicitacao.nome,
      solicitacao.usuario,
      solicitacao.genero,
      solicitacao.altura,
      (solicitacao.dataDeNascimento ? solicitacao.dataDeNascimento.toDate() : null),
      solicitacao.dataDoUltimoLogin.toDate(),
      this.calculoDeIdade
    );

    const result = this.add(monstro);

    return result;
  }

  private add(monstro: Monstro): Promise<void> {
    const collection = this.db.collection<MonstroDocument>(this.PATH);

    const document = collection.doc<MonstroDocument>(monstro.id);

    const newDocument = this.mapTo(monstro);

    const result = document.set(newDocument);

    console.log({ 'monstro adicionado': newDocument });

    return result;
  }

  atualizaMonstro(monstroId: string, solicitacao: SolicitacaoDeCadastroDeMonstro): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.obtemMonstroObservavel(monstroId).pipe(first()).subscribe(monstro => {
        monstro.defineDisplayName(solicitacao.displayName);

        monstro.defineEmail(solicitacao.email);

        monstro.definePhotoURL(solicitacao.photoURL);

        monstro.defineNome(solicitacao.nome);

        monstro.defineUsuario(solicitacao.usuario);

        monstro.defineGenero(solicitacao.genero);

        monstro.defineAltura(solicitacao.altura);

        if (solicitacao.dataDeNascimento) {
          monstro.defineDataDeNascimento(solicitacao.dataDeNascimento.toDate());
        }

        monstro.defineDataDoUltimoLogin(solicitacao.dataDoUltimoLogin.toDate());

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
      admin: (monstro.admin ? monstro.admin : false),
      displayName: monstro.displayName,
      email: monstro.email,
      photoURL: monstro.photoURL,
      id: monstro.id,
      nome: monstro.nome,
      usuario: monstro.usuario,
      genero: monstro.genero,
      altura: monstro.altura,
      dataDeNascimento: (monstro.dataDeNascimento ? firebase.firestore.Timestamp.fromDate(monstro.dataDeNascimento) : null),
      dataDoUltimoLogin: firebase.firestore.Timestamp.fromDate(monstro.dataDoUltimoLogin),
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
  admin?: boolean;
  displayName?: string;
  email?: string;
  photoURL?: string;
  id: string;
  nome?: string;
  usuario?: string;
  genero?: string;
  altura?: number;
  dataDeNascimento?: firebase.firestore.Timestamp;
  dataDoUltimoLogin?: firebase.firestore.Timestamp;
}
