import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { MonstrosService } from './monstros.service';
import { Monstro } from './monstros.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-monstros',
  templateUrl: './monstros.component.html',
  styleUrls: ['./monstros.component.scss']
})
export class MonstrosComponent implements OnDestroy {
  monstroLogado$: Observable<Monstro>;

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(
    private router: Router,
    public authService: AuthService,
    private monstrosService: MonstrosService,
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.monstroLogado$ = this.monstrosService.monstroLogado$;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  public logout() {
    const result = this.authService.logout();

    result.then(() => {
      // this.router.navigate(['/']);
    });
  }
}
