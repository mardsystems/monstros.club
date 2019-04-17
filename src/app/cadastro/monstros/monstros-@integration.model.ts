import { Inject } from '@angular/core';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { LogService } from 'src/app/app-@common.model';
import {
  CadastroDeMonstros, CADASTRO_DE_MONSTROS, SolicitacaoDeCadastroDeMonstro
} from '../monstros-cadastro/monstros-cadastro-@application.model';
import { Monstro, RepositorioDeMonstros, REPOSITORIO_DE_MONSTROS } from './monstros-@domain.model';

export class AdaptadorParaUserInfo {
  monstroLogado$: Observable<Monstro>;

  constructor(
    @Inject(AUTH)
    private auth: Auth,
    @Inject(CADASTRO_DE_MONSTROS)
    private cadastroDeMonstros: CadastroDeMonstros,
    @Inject(REPOSITORIO_DE_MONSTROS)
    private repositorioDeMonstros: RepositorioDeMonstros,
    private log: LogService
  ) {
    this.monstroLogado$ = this.auth.user$.pipe(
      // first(),
      tap((value) => this.log.debug('MonstrosService: constructor: user: ', value)),
      switchMap(user => {
        if (user) {
          const monstro$ = this.repositorioDeMonstros.obtemMonstro(user.uid).pipe(
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

              this.cadastroDeMonstros.cadastraMonstro(solicitacao);

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

              // this.cadastroDeMonstros.atualizaMonstro(user.uid, solicitacao);

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
}
