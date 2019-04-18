import { MediaMatcher } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogService } from 'src/app/@app-common.model';
import { Monstro } from 'src/app/cadastro/monstros/@monstros-domain.model';
import { MonstrosMembershipService } from 'src/app/cadastro/monstros/@monstros-membership.service';
import { AuthService } from '../../auth/@auth.service';

@Component({
  selector: 'admin-monstros',
  templateUrl: './monstros.component.html',
  styleUrls: ['./monstros.component.scss']
})
export class MonstrosComponent {
  monstroLogado$: Observable<Monstro>;
  monstroEstaLogado = false;

  monstroId: string;
  monstro$: Observable<Monstro>;

  desktopQuery: MediaQueryList;

  links = [
    // { title: 'Listagem', path: '/admin/dashboard', icon: 'dashboard' },
    { title: 'Listagem', path: '/admin/monstros/listagem', icon: 'supervised_user_circle' },
    { title: 'Medidas', path: '/admin/monstros/medidas', icon: 'group_work' },
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
