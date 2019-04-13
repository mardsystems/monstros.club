import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Monstro } from '../../../monstros/monstros.domain-model';
import { MonstrosFirecloudRepository } from '../../../monstros/monstros.firecloud-repository';

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
  templateUrl: './listagem.component.html',
  styleUrls: ['./listagem.component.scss']
})
export class ListagemComponent implements OnInit {
  loading = true;
  monstros$: Observable<Monstro[]>;

  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;

  desktopQuery: MediaQueryList;

  constructor(
    private monstrosService: MonstrosFirecloudRepository,
    media: MediaMatcher
  ) {
    this.desktopQuery = media.matchMedia('(min-width: 600px)');
  }

  ngOnInit() {
    this.monstros$ = this.monstrosService.obtemMonstrosObservaveisParaAdministracao();

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
