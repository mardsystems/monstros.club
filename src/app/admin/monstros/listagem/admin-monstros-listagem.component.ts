import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Monstro } from 'src/app/cadastro/monstros/@monstros-domain.model';
import { MonstrosFirebaseService } from 'src/app/cadastro/monstros/@monstros-firebase.service';

const columnDefinitions = [
  { showMobile: true, def: 'foto' },
  { showMobile: true, def: 'nome' },
  { showMobile: true, def: 'idade' },
  { showMobile: true, def: 'genero' },
  { showMobile: true, def: 'altura' },
  { showMobile: false, def: 'dataDoUltimoLogin' },
];
@Component({
  selector: 'admin-monstros-listagem',
  templateUrl: './admin-monstros-listagem.component.html',
  styleUrls: ['./admin-monstros-listagem.component.scss']
})
export class AdminMonstrosListagemComponent implements OnInit {
  loading = true;
  monstros$: Observable<Monstro[]>;

  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;

  desktopQuery: MediaQueryList;

  constructor(
    private monstrosService: MonstrosFirebaseService,
    media: MediaMatcher
  ) {
    this.desktopQuery = media.matchMedia('(min-width: 600px)');
  }

  ngOnInit() {
    this.monstros$ = this.monstrosService.obtemMonstrosParaAdministracao();

    this.monstros$.pipe(
      first(),
    ).subscribe(() => this.loading = false);

    this.monstros$.subscribe(monstros => {
      this.dataSource = new MatTableDataSource(monstros);

      this.dataSource.sort = this.sort;
    });
  }

  get isDesktop(): boolean {
    return this.desktopQuery.matches;
  }

  getDisplayedColumns(): string[] {
    const isDesktop = this.desktopQuery.matches;

    const displayedColumns = columnDefinitions
      .filter(cd => isDesktop || cd.showMobile)
      .map(cd => cd.def);

    return displayedColumns;
  }
}