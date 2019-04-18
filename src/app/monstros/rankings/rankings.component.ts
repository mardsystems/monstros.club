import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, first, map, shareReplay, switchMap } from 'rxjs/operators';
import { Monstro } from 'src/app/cadastro/monstros/@monstros-domain.model';
import { MonstrosFirebaseService } from 'src/app/cadastro/monstros/@monstros-firebase.service';
import { AdaptadorParaUserInfo } from 'src/app/cadastro/monstros/@monstros-integration.model';
import { Balanca, OmronHBF214 } from '../medidas/@medidas-domain.model';
import { RankingViewModel } from '../rankings-cadastro/@rankings-cadastro-presentation.model';
import { RankingsCadastroComponent } from '../rankings-cadastro/rankings-cadastro.component';
import { Ranking } from './@rankings-domain.model';
import { RankingsFirebaseService } from './@rankings-firebase.service';

const columnDefinitions = [
  { showMobile: false, def: 'proprietario' },
  { showMobile: true, def: 'nome' },
  { showMobile: true, def: 'participantes' },
  { showMobile: false, def: 'feitoCom' },
  { showMobile: false, def: 'dataDeCriacao' },
  { showMobile: true, def: 'menu' },
];

@Component({
  selector: 'rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.scss']
})
export class RankingsComponent implements OnInit {
  monstro: Monstro;

  rankings$: Observable<Ranking[]>;

  balanca: Balanca;

  disabledWrite$: Observable<boolean>;

  dataSource: any;

  @ViewChild(MatSort) sort: MatSort;

  desktopQuery: MediaQueryList;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private rankingsFirebaseService: RankingsFirebaseService,
    private monstrosFirebaseService: MonstrosFirebaseService,
    private adaptadorParaUserInfo: AdaptadorParaUserInfo,
    media: MediaMatcher
  ) {
    this.balanca = new OmronHBF214();

    this.desktopQuery = media.matchMedia('(min-width: 600px)');
  }

  ngOnInit() {
    const monstro$ = this.route.paramMap.pipe(
      // first(),
      map(params => params.get('monstroId')),
      switchMap((monstroId) => this.monstrosFirebaseService.obtemMonstroObservavel(monstroId).pipe(first())),
      catchError((error, source$) => {
        console.log(`Não foi possível montar os rankings do monstro.\nRazão:\n${error}`);

        return EMPTY; // Observable.throw(e);
      }),
      shareReplay()
    );

    this.rankings$ = monstro$.pipe(
      switchMap(monstro => {
        this.monstro = monstro;

        return this.rankingsFirebaseService.obtemRankingsParaExibicao(monstro);
      }),
      shareReplay()
    );

    this.rankings$.subscribe(rankings => {
      this.dataSource = new MatTableDataSource(rankings);

      this.dataSource.sort = this.sort;
    });

    this.disabledWrite$ = monstro$.pipe(
      // first(),
      switchMap(monstro => {
        return this.adaptadorParaUserInfo.ehVoceMesmo(monstro.id);
      }),
      switchMap(value => {
        if (value) {
          return of(true);
        } else {
          return this.adaptadorParaUserInfo.ehAdministrador();
        }
      }),
      map(value => !value),
      shareReplay()
    );
  }

  get isDesktop(): boolean {
    return this.desktopQuery.matches;
  }

  getDisplayedColumns(): string[] {
    const isDesktop = this.isDesktop;

    const displayedColumns = columnDefinitions
      .filter(cd => isDesktop || cd.showMobile)
      .map(cd => cd.def);

    return displayedColumns;
  }

  onAdd(): void {
    const model = RankingViewModel.toAddViewModel(this.monstro);

    const config: MatDialogConfig<RankingViewModel> = { data: model };

    this.dialog.open(RankingsCadastroComponent, config);
  }

  onEdit(ranking: Ranking): void {
    const model = RankingViewModel.toEditViewModel(this.monstro, ranking);

    const config: MatDialogConfig<RankingViewModel> = { data: model };

    this.dialog.open(RankingsCadastroComponent, config);
  }

  onDelete(ranking: Ranking): void {
    this.rankingsFirebaseService.remove(ranking.id);
  }
}
