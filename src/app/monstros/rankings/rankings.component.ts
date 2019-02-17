import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, first, switchMap } from 'rxjs/operators';
import { Monstro } from '../monstros.model';
import { MonstrosService } from '../monstros.service';
import { Ranking } from './rankings.model';
import { RankingsService } from './rankings.service';
import { Balanca, OmronHBF214 } from '../medidas/medidas.model';

const columnDefinitions = [
  { showMobile: true, def: 'foto' },
  { showMobile: true, def: 'dataDeCriacao' },
  { showMobile: true, def: 'menu' },
];

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.scss']
})
export class RankingsComponent implements OnInit {
  rankings$: Observable<Ranking[]>;
  monstro: Monstro;
  balanca: Balanca;
  loading = true;
  disabledWrite: boolean;

  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;

  desktopQuery: MediaQueryList;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private rankingsService: RankingsService,
    private monstrosService: MonstrosService,
    media: MediaMatcher
  ) {
    this.balanca = new OmronHBF214();

    this.desktopQuery = media.matchMedia('(min-width: 600px)');
  }

  ngOnInit() {
    const monstro$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const monstroId = params.get('monstroId');

        return this.monstrosService.obtemMonstroObservavel(monstroId);
      }),
      catchError((error, monstro) => {
        console.log(`Não foi possível montar os rankings do monstro.\nRazão:\n${error}`);

        return of(null);
      })
    );

    this.rankings$ = monstro$.pipe(
      switchMap(monstro => {
        this.monstro = monstro;

        return this.rankingsService.obtemRankingsObservaveisParaExibicao(monstro);
      })
    );

    this.rankings$.pipe(
      first()
    ).subscribe(() => this.loading = false);

    this.rankings$.subscribe(rankings => {
      this.dataSource = new MatTableDataSource(rankings);

      this.dataSource.sort = this.sort;
    });

    monstro$.pipe(
      first(),
      switchMap(monstro => {
        return this.monstrosService.ehVoceMesmo(monstro.id);
      }),
      switchMap(value => {
        if (value) {
          return of(true);
        } else {
          return this.monstrosService.ehAdministrador();
        }
      })
    ).subscribe(value => {
      this.disabledWrite = !value;
    });
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

  // onAdd(): void {
  //   const model = RankingViewModel.toAddViewModel(this.monstro);

  //   const config: MatDialogConfig<RankingViewModel> = { data: model };

  //   this.dialog.open(RankingComponent, config);
  // }

  // onEdit(ranking: Ranking): void {
  //   const model = RankingViewModel.toEditViewModel(this.monstro, ranking);

  //   const config: MatDialogConfig<RankingViewModel> = { data: model };

  //   this.dialog.open(RankingComponent, config);
  // }

  onDelete(ranking: Ranking): void {
    this.rankingsService.excluiRanking(ranking.id);
  }
}
