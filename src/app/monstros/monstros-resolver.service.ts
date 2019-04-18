import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, first, mergeMap } from 'rxjs/operators';
import { Monstro } from '../cadastro/monstros/@monstros-domain.model';
import { MonstrosFirebaseService } from '../cadastro/monstros/@monstros-firebase.service';

@Injectable({
  providedIn: 'root'
})
export class MonstrosResolverService implements Resolve<Monstro> {
  constructor(
    private monstrosService: MonstrosFirebaseService,
    private router: Router
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Monstro> | Observable<never> {
    const monstroId = route.paramMap.get('monstroId');

    return this.monstrosService.obtemMonstroObservavel(monstroId).pipe(
      first(),
      catchError((error, source$) => {
        console.log(`Não foi possível montar o ambiente 'Monstros'.\nRazão:\n${error}`);

        this.router.navigateByUrl('404', { skipLocationChange: true });

        // this.router.navigate(['404']);

        // return of(null);

        return EMPTY;
      }),
      mergeMap(monstro => {
        return of(monstro);
      })
    );
  }
}
