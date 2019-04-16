import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Monstro } from '../monstros/monstros.domain-model';
import { MonstrosFirecloudRepository } from '../monstros/monstros.firecloud-repository';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  ehAnonimo$: Observable<boolean>;

  monstroLogado$: Observable<Monstro>;

  ehAdministrador$: Observable<boolean>;

  constructor(
    private monstrosService: MonstrosFirecloudRepository
  ) {
    this.ehAnonimo$ = this.monstrosService.ehAnonimo();

    this.monstroLogado$ = this.monstrosService.monstroLogado$;

    this.ehAdministrador$ = this.monstrosService.ehAdministrador();
  }

  ngOnInit() {
  }
}
