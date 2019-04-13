import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import { Observable, of, combineLatest, Subject, EMPTY } from 'rxjs';
import { catchError, first, map, switchMap, tap, shareReplay } from 'rxjs/operators';
import { CalculoDeIdade, LogService } from '../app-common.services';
import { AuthService } from '../auth/auth.service';
import { SolicitacaoDeCadastroDeMonstro } from './cadastro/cadastro.application-model';
import { Genero, Monstro } from './monstros.domain-model';

export class MonstrosCadastroService {
  monstroLogado$: Observable<Monstro>;

  private METANAME = 'monstros';

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    private calculoDeIdade: CalculoDeIdade,
    private log: LogService
  ) {
    this.monstroLogado$ = this.authService.user$.pipe(
      // first(),
      tap((value) => this.log.debug('MonstrosService: constructor: user: ', value)),
      switchMap(user => {
        if (user) {
          const monstro$ = this.obtemMonstroObservavel(user.uid).pipe(
            // first(), // TODO: Evita depedência cíclica com a atualização posterior do mostro.
            catchError((error, source$) => {
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
                // first(),
                tap((value) => this.log.debug('MonstrosService: monstroCadastrado: ', value)),
                catchError((error2, source2$) => {
                  // this.log.debug(`Retornando nenhum monstro após o cadastro do mesmo.\nRazão:\n${error2}`);
                  console.log(`Retornando nenhum monstro após o cadastro do mesmo.\nRazão:\n${error2}`);

                  return source2$;
                })
              );

              return monstroCadastrado$;
            }),
            map(monstro => {
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

              // this.atualizaMonstro(user.uid, solicitacao);

              return monstro;
            }),
          );

          return monstro$;
        } else {
          return of(null); // EMPTY; Observable.throw(e); // TODO: Test.
        }
      }),
      shareReplay()
    );
  }

  createId(): string {
    const id = this.db.createId();

    return id;
  }

  path(): string {
    const path = `/${this.METANAME}`;

    return path;
  }

  ref(id: string): DocumentReference {
    const collection = this.db.collection<MonstroDocument>(this.path());

    const document = collection.doc<MonstroDocument>(id);

    return document.ref;
  }

  public estaAutenticado(): Observable<boolean> {
    return this.monstroLogado$.pipe(
      map(monstroLogado => monstroLogado != null)
    );
  }

  public ehAnonimo(): Observable<boolean> {
    return this.monstroLogado$.pipe(
      map(monstroLogado => monstroLogado == null)
    );
  }

  public ehVoceMesmo(id: string): Observable<boolean> {
    return this.monstroLogado$.pipe(
      map(monstroLogado => monstroLogado != null && monstroLogado.id === id)
    );
  }

  public ehProprietario(monstroId: string): Observable<boolean> {
    return this.monstroLogado$.pipe(
      map(monstroLogado => ('monstros/' + monstroLogado.id) === monstroId)
    );
  }

  public ehAdministrador(): Observable<boolean> {
    return this.monstroLogado$.pipe(
      map(monstroLogado => monstroLogado != null && monstroLogado.admin)
    );
  }

  obtemMonstrosObservaveisParaAdministracao(): Observable<Monstro[]> {
    const collection = this.db.collection<MonstroDocument>(this.path(), reference => {
      return reference
        .orderBy('dataDoUltimoLogin', 'desc');
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
    const collection = this.db.collection<MonstroDocument>(this.path());

    const document = collection.doc<MonstroDocument>(id);

    const monstro$ = document.valueChanges().pipe(
      // first(),
      // tap((value2) => this.log.debug('obtemMonstroObservavel', value2)),
      map(value => {
        if (value) {
          return this.mapMonstro(value);
        } else {
          throw new Error(`Monstro não encontrado (id: '${id}').`);
        }
      }),
      shareReplay()
    );

    return monstro$;
  }

  obtemMonstrosObservaveis(ids: string[]): Observable<Monstro[]> {
    const arrayDeMonstrosObservaveis = ids
      .map((id) => this.obtemMonstroObservavel(id).pipe(
        // first()
      ));

    const todosOsMonstros$ = combineLatest(arrayDeMonstrosObservaveis);

    return todosOsMonstros$;
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
    const collection = this.db.collection<MonstroDocument>(this.path());

    const document = collection.doc<MonstroDocument>(monstro.id);

    const doc = this.mapTo(monstro);

    const result = document.set(doc);

    console.log({ 'monstro adicionado': doc });

    return result;
  }

  atualizaMonstro(monstroId: string, solicitacao: SolicitacaoDeCadastroDeMonstro): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.obtemMonstroObservavel(monstroId).pipe(
        first()
      ).subscribe(monstro => {
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
    const collection = this.db.collection<MonstroDocument>(this.path());

    const document = collection.doc<MonstroDocument>(monstro.id);

    const doc = this.mapTo(monstro);

    const result = document.update(doc);

    return result;
  }

  private mapTo(monstro: Monstro): MonstroDocument {
    const doc: MonstroDocument = {
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

    return doc;
  }

  excluiMonstro(monstroId: string): Promise<void> {
    const collection = this.db.collection<MonstroDocument>(this.path());

    const document = collection.doc<MonstroDocument>(monstroId);

    const result = document.delete();

    return result;
  }
}
