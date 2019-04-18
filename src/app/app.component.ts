import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth/@auth.service';
import { Monstro } from './cadastro/monstros/@monstros-domain.model';
import { MonstrosMembershipService } from './cadastro/monstros/@monstros-membership.service';
import { SobreComponent } from './sobre/sobre.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // animations: [slideInAnimation]
})
export class AppComponent implements OnInit {
  ehAnonimo$: Observable<boolean>;

  monstroLogado$: Observable<Monstro>;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private monstrosMembershipService: MonstrosMembershipService
  ) {
    this.ehAnonimo$ = this.monstrosMembershipService.ehAnonimo();

    this.monstroLogado$ = this.monstrosMembershipService.monstroLogado$;
  }

  ngOnInit() {

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

