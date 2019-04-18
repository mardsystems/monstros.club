import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Monstro } from '../cadastro/monstros/@monstros-domain.model';
import { MonstrosFirebaseService } from '../cadastro/monstros/@monstros-firebase.service';
import { MonstrosMembershipService } from '../cadastro/monstros/@monstros-membership.service';

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
    private monstrosMembershipService: MonstrosMembershipService
  ) {
    this.ehAnonimo$ = this.monstrosMembershipService.ehAnonimo();

    this.monstroLogado$ = this.monstrosMembershipService.monstroLogado$;

    this.ehAdministrador$ = this.monstrosMembershipService.ehAdministrador();
  }

  ngOnInit() {
  }
}
