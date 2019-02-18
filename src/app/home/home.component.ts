import { Component, OnInit } from '@angular/core';
import { Monstro } from '../monstros/monstros.model';
import { Observable } from 'rxjs';
import { MonstrosService } from '../monstros/monstros.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loading = true;
  monstroLogado$: Observable<Monstro>;
  monstroEstaLogado = false;
  ehAdministrador = false;

  constructor(
    private monstrosService: MonstrosService,
  ) {

    this.monstroLogado$ = this.monstrosService.monstroLogado$;

    this.monstroLogado$.subscribe((monstroLogado) => {
      this.loading = false;

      if (monstroLogado) {
        this.monstroEstaLogado = true;
      } else {
        this.monstroEstaLogado = false;
      }
    });

    this.monstrosService.ehAdministrador().subscribe((ehAdministrador) => {
      this.ehAdministrador = ehAdministrador;
    });
  }

  ngOnInit() {
  }
}
