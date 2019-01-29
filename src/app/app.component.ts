import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SobreComponent } from './sobre/sobre.component';
import { MonstrosService } from './monstros/monstros.service';
import { Monstro } from './monstros/monstros.model';
import { Observable } from 'rxjs';
// import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  monstroLogado$: Observable<Monstro>;

  constructor(
    private dialog: MatDialog,
    private monstrosService: MonstrosService,
  ) {
    this.monstroLogado$ = this.monstrosService.monstroLogado$;
  }

  ngOnInit() {

  }

  sobre() {
    this.dialog.open(SobreComponent);
  }

  // getAnimationData(outlet: RouterOutlet) {
  //   return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  // }
}

