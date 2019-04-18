import { MediaMatcher } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/@auth.service';
import { SobreComponent } from '../sobre/sobre.component';
import { slideInAnimation } from './monstros-routing.animations';
import { MonstrosMembershipService } from '../cadastro/monstros/@monstros-membership.service';
import { Monstro } from '../cadastro/monstros/@monstros-domain.model';
import { StorageService, LogService } from '../@app-common.model';

@Component({
  selector: 'app-monstros',
  templateUrl: './monstros.component.html',
  styleUrls: ['./monstros.component.scss'],
  animations: [slideInAnimation]
})
export class MonstrosComponent {
  loading = true;

  monstro: Monstro;

  monstroLogado$: Observable<Monstro>;

  desktopQuery: MediaQueryList;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private monstrosMembershipService: MonstrosMembershipService,
    private authService: AuthService,
    private storageService: StorageService,
    private log: LogService,
    media: MediaMatcher
  ) {
    this.router.events.subscribe(event => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;

          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;

          break;
        }

        default: {
          break;
        }
      }
    });

    this.route.data.subscribe((data: { monstro: Monstro }) => {
      this.monstro = data.monstro;
    });

    this.desktopQuery = media.matchMedia('(min-width: 600px)');

    this.monstroLogado$ = this.monstrosMembershipService.monstroLogado$;

    // this.monstroLogado$.pipe(
    //   // tap((value) => this.log.debug('MonstrosComponent: constructor: monstroLogado: ', value)),
    // ).subscribe((monstroLogado) => {
    //   if (monstroLogado) {
    //     this.monstroLogado = monstroLogado;

    //     this.monstroEstaLogado = true;
    //   } else {
    //     this.monstroLogado = null;

    //     this.monstroEstaLogado = false;
    //   }
    // });

    // this.monstro$ = this.route.paramMap.pipe(
    //   // first(),
    //   // tap((value) => this.log.debug('MonstrosComponent: paramMap1', value)),
    //   map(params => params.get('monstroId')),
    //   tap((value) => this.log.debug('MonstrosComponent: monstroId', value)),
    //   switchMap(monstroId => this.monstrosService.obtemMonstroObservavel(monstroId)),
    //   catchError((error, source$) => {
    //     console.log(`Não foi possível montar o ambiente 'Monstros'.\nRazão:\n${error}`);

    //     this.router.navigateByUrl('404', { skipLocationChange: true });

    //     return of(null);
    //   })
    // );
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

  getAnimationData(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
