import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SobreComponent } from './sobre/sobre.component';
import { MonstrosService } from './monstros/monstros.service';
import { Monstro } from './monstros/monstros.model';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';
// import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  monstroLogado$: Observable<Monstro>;
  monstroEstaLogado = true; // TODO: Refatorar.

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private monstrosService: MonstrosService,
  ) {
    this.monstroLogado$ = this.monstrosService.monstroLogado$;

    this.monstroLogado$.subscribe((monstroLogado) => {
      if (monstroLogado) {
        this.monstroEstaLogado = true;
      } else {
        this.monstroEstaLogado = false;
      }
    });
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

  // getAnimationData(outlet: RouterOutlet) {
  //   return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  // }
}

