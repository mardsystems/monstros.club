import { MediaMatcher } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth/@auth.service';
import { LogService } from '../common/common.service';
import { Monstro } from './monstros/@monstros-domain.model';
import { MonstrosMembershipService } from './monstros/@monstros-membership.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {
  monstroLogado$: Observable<Monstro>;
  monstroEstaLogado = false;

  monstroId: string;
  monstro$: Observable<Monstro>;

  desktopQuery: MediaQueryList;

  links = [
    { title: 'Academias', path: '/admin/cadastro/academias', icon: 'supervised_user_circle' },
    { title: 'Exercícios', path: '/admin/cadastro/exercicios', icon: 'group_work' },
    { title: 'Aparelhos', path: '/admin/cadastro/aparelhos', icon: 'dashboard' },
  ];
  activePath: string;

  constructor(
    private monstrosMembershipService: MonstrosMembershipService,
    private authService: AuthService,
    private router: Router,
    private log: LogService,
    media: MediaMatcher
  ) {
    this.desktopQuery = media.matchMedia('(min-width: 600px)');

    this.activePath = this.router.url;

    this.monstroLogado$ = this.monstrosMembershipService.monstroLogado$;

    this.monstroLogado$.pipe(
      tap((value) => this.log.debug('AdminComponent: constructor: monstroLogado: ', value))
    ).subscribe((monstroLogado) => {
      if (monstroLogado) {
        this.monstroEstaLogado = true;
      } else {
        this.monstroEstaLogado = false;
      }
    });

    this.monstro$ = this.monstroLogado$;

    // this.snav.
  }

  get isMobile(): boolean {
    return !this.desktopQuery.matches;
  }

  public logout() {
    const result = this.authService.logout();

    result.then(() => {
      // this.router.navigate(['/']);
    });
  }
}
