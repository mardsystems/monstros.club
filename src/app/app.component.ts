import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { AuthService } from './auth/@auth.service';
import { Monstro } from './monstros/monstros.domain-model';
import { MonstrosFirecloudRepository } from './monstros/monstros.firecloud-repository';
import { SobreComponent } from './sobre/sobre.component';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './app-routing.animations';

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
    private monstrosService: MonstrosFirecloudRepository
  ) {
    this.ehAnonimo$ = this.monstrosService.ehAnonimo();

    this.monstroLogado$ = this.monstrosService.monstroLogado$;
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

