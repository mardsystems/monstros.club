import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Monstro } from '../cadastro/monstros/@monstros-domain.model';
import { MonstrosFirebaseService } from '../cadastro/monstros/@monstros-firebase.service';
import { AdaptadorParaUserInfo } from '../cadastro/monstros/@monstros-integration.model';

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
    private adaptadorParaUserInfo: AdaptadorParaUserInfo
  ) {
    this.ehAnonimo$ = this.adaptadorParaUserInfo.ehAnonimo();

    this.monstroLogado$ = this.adaptadorParaUserInfo.monstroLogado$;

    this.ehAdministrador$ = this.adaptadorParaUserInfo.ehAdministrador();
  }

  ngOnInit() {
  }
}
