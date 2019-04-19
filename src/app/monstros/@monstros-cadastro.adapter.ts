// import { Injectable } from '@angular/core';
// import * as moment from 'moment';
// import { Observable, of } from 'rxjs';
// import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
// import { SolicitacaoDeCadastroDeMonstro } from '../cadastro/monstros-cadastro/@monstros-cadastro-application.model';
// import { Monstro } from '../cadastro/monstros/@monstros-domain.model';
// import { LogService } from '../common/common.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class MonstrosCadastroAdapter {
//   monstroLogado$: Observable<Monstro>;

//   constructor(
//     private log: LogService
//   ) {
//     this.monstroLogado$ = this.authService.user$.pipe(
//       // first(),
//       tap((value) => this.log.debug('MonstrosService: constructor: user: ', value)),
//       switchMap(user => {
//         if (user) {
//           const monstro$ = this.obtemMonstroObservavel(user.uid).pipe(
//             // first(), // TODO: Evita depedência cíclica com a atualização posterior do mostro.
//             catchError((error, source$) => {
//               const solicitacao: SolicitacaoDeCadastroDeMonstro = {
//                 isEdit: false,
//                 id: user.uid,
//                 admin: false,
//                 displayName: user.displayName,
//                 email: user.email,
//                 photoURL: user.photoURL,
//                 nome: user.displayName || user.email,
//                 usuario: user.uid,
//                 genero: null,
//                 altura: null,
//                 dataDeNascimento: null,
//                 dataDoUltimoLogin: moment()
//               };

//               this.cadastraMonstro(solicitacao);

//               const monstroCadastrado$ = this.obtemMonstroObservavel(user.uid).pipe(
//                 // first(),
//                 tap((value) => this.log.debug('MonstrosService: monstroCadastrado: ', value)),
//                 catchError((error2, source2$) => {
//                   // this.log.debug(`Retornando nenhum monstro após o cadastro do mesmo.\nRazão:\n${error2}`);
//                   console.log(`Retornando nenhum monstro após o cadastro do mesmo.\nRazão:\n${error2}`);

//                   return source2$;
//                 })
//               );

//               return monstroCadastrado$;
//             }),
//             map(monstro => {
//               const solicitacao: SolicitacaoDeCadastroDeMonstro = {
//                 isEdit: true,
//                 id: monstro.id,
//                 admin: monstro.admin,
//                 displayName: user.displayName,
//                 email: user.email,
//                 photoURL: user.photoURL,
//                 nome: monstro.nome,
//                 usuario: monstro.usuario,
//                 genero: monstro.genero,
//                 altura: monstro.altura,
//                 dataDeNascimento: (monstro.dataDeNascimento ? moment(monstro.dataDeNascimento) : null),
//                 dataDoUltimoLogin: moment()
//               };

//               // this.atualizaMonstro(user.uid, solicitacao);

//               return monstro;
//             }),
//           );

//           return monstro$;
//         } else {
//           return of(null); // EMPTY; Observable.throw(e); // TODO: Test.
//         }
//       }),
//       shareReplay()
//     );
//   }
// }
