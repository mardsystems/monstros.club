import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  NavigationExtras,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { LogService } from '../app.services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
    private log: LogService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const url: string = state.url;

    this.log.debug('canActivate: ', url);

    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.log.debug('canActivateChild: ', route.url);

    return this.canActivate(route, state);
  }

  canLoad(route: Route): Observable<boolean> {
    const url = `/${route.path}`;

    this.log.debug('canLoad: ', url);

    return this.checkLogin(url);
  }

  checkLogin(url: string): Observable<boolean> {
    const isLoggedIn$ = this.authService.user$.pipe(
      first(),
      map((auth) => {
        this.log.debug('checkLogin: ', (auth !== null ? auth.uid : 'nulo') + '"');
        this.log.debug('url: ', url);

        if (auth) {
          // if (this.authService.authenticated) { return true; }

          return true;
        } else {
          // Store the attempted URL for redirecting
          this.authService.redirectUrl = url;

          // Create a dummy session id
          const sessionId = 123456789;

          // Set our navigation extras object
          // that contains our global query params and fragment
          const navigationExtras: NavigationExtras = {
            queryParams: { 'session_id': sessionId },
            fragment: 'anchor'
          };

          // Navigate to the login page with extras
          this.router.navigate(['/login'], navigationExtras);

          // this.router.navigateByUrl('login');

          return false;
        }
      }),
      tap(value => this.log.debug('isLoggedIn', value))
    );

    return isLoggedIn$;
  }
}
