import { AngularFirestore } from '@angular/fire/firestore';
import * as moment from 'moment';
import { of, Observable } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { CalculoDeIdade, LogService } from '../app-common.services';
import { AuthService } from '../auth/auth.service';
import { SolicitacaoDeCadastroDeMonstro } from './cadastro/cadastro.application-model';
import { Monstro, RepositorioDeMonstros, IRepositorioDeMonstros } from './monstros.domain-model';
import { Inject } from '@angular/core';

export class AdaptadorParaUserInfo {
  monstroLogado$: Observable<Monstro>;

  constructor(
    private authService: AuthService,
    @Inject(RepositorioDeMonstros)
    private repositorioDeMonstros: IRepositorioDeMonstros,
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
}
