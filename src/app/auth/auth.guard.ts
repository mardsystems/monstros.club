import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  CanLoad, Route
} from '@angular/router';
import { AuthService } from './auth.service';

import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const url: string = state.url;

    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): Observable<boolean> {
    const url = `/${route.path}`;

    return this.checkLogin(url);
  }

  checkLogin(url: string): Observable<boolean> {
    return this.authService.user$.pipe(
      map((auth) => {
        if (!auth) {
          this.router.navigateByUrl('login');
          return false;
        }
        return true;
      }),
      take(1)
    );

    // if (this.authService.authenticated) { return true; }

    // // Store the attempted URL for redirecting
    // this.authService.redirectUrl = url;

    // // Create a dummy session id
    // const sessionId = 123456789;

    // // Set our navigation extras object
    // // that contains our global query params and fragment
    // const navigationExtras: NavigationExtras = {
    //   queryParams: { 'session_id': sessionId },
    //   fragment: 'anchor'
    // };

    // // Navigate to the login page with extras
    // this.router.navigate(['/login'], navigationExtras);

    // return false;
  }
}
