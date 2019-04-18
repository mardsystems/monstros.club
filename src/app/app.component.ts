import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth/@auth.service';
import { Monstro } from './cadastro/monstros/@monstros-domain.model';
import { AdaptadorParaUserInfo } from './cadastro/monstros/@monstros-integration.model';
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
    private adaptadorParaUserInfo: AdaptadorParaUserInfo
  ) {
    this.ehAnonimo$ = this.adaptadorParaUserInfo.ehAnonimo();

    this.monstroLogado$ = this.adaptadorParaUserInfo.monstroLogado$;
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

