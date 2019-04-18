import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { MonstrosMembershipService } from '../cadastro/monstros/@monstros-membership.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private monstrosMembershipService: MonstrosMembershipService,
  ) { }

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
    const ehAdministrador$ = this.monstrosMembershipService.ehAdministrador().pipe(
      first(),
      // map((auth) => {
      //   if (auth) {
      //     return true;
      //   } else {
      //     // Store the attempted URL for redirecting
      //     this.authService.redirectUrl = url;

      //     // Create a dummy session id
      //     const sessionId = 123456789;

      //     // Set our navigation extras object
      //     // that contains our global query params and fragment
      //     const navigationExtras: NavigationExtras = {
      //       queryParams: { 'session_id': sessionId },
      //       fragment: 'anchor'
      //     };

      //     // Navigate to the login page with extras
      //     this.router.navigate(['/login'], navigationExtras);

      //     // this.router.navigateByUrl('login');

      //     return false;
      //   }
      // })
    );

    return ehAdministrador$;
  }
}
