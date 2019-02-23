import { MediaMatcher } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { StorageService } from '../app.services';
import { AuthService } from '../auth/auth.service';
import { SobreComponent } from '../sobre/sobre.component';
import { Monstro } from './monstros.domain-model';
import { MonstrosService } from './monstros.service';

@Component({
  selector: 'app-monstros',
  templateUrl: './monstros.component.html',
  styleUrls: ['./monstros.component.scss']
})
export class MonstrosComponent {
  monstroLogado$: Observable<Monstro>;
  monstroEstaLogado = false;

  monstro$: Observable<Monstro>;

  desktopQuery: MediaQueryList;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private monstrosService: MonstrosService,
    private authService: AuthService,
    private storageService: StorageService,
    media: MediaMatcher
  ) {
    this.desktopQuery = media.matchMedia('(min-width: 600px)');

    this.monstroLogado$ = this.monstrosService.monstroLogado$;

    this.monstroLogado$.subscribe((monstroLogado) => {
      if (monstroLogado) {
        this.monstroEstaLogado = true;
      } else {
        this.monstroEstaLogado = false;
      }
    });

    this.monstro$ = this.route.paramMap.pipe(
      map(params => params.get('monstroId')),
      switchMap(monstroId => this.monstrosService.obtemMonstroObservavel(monstroId)),
      catchError((error, source$) => {
        console.log(`Não foi possível montar o ambiente 'Monstros'.\nRazão:\n${error}`);

        this.router.navigateByUrl('404', { skipLocationChange: true });

        return of(null);
      })
    );
  }

  // private _sidenavOpened: boolean;

  get sidenavOpened(): boolean {
    const sidenavOpened = this.storageService.get('sidenavOpened');

    return sidenavOpened;

    // return this._sidenavOpened;
  }

  set sidenavOpened(value: boolean) {
    // const myData = { foo: 'bar' };

    this.storageService.set('sidenavOpened', value);

    // this._sidenavOpened = value;
  }

  get isMobile(): boolean {
    return !this.desktopQuery.matches;
  }

  sobre() {
    this.dialog.open(SobreComponent);
  }

  public logout() {
    const result = this.authService.logout();

    result.then(() => {
      // this.router.navigate(['/']);
    });
  }
}
