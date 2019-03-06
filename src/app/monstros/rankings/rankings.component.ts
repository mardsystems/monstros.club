import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, first, switchMap, map, tap, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { Balanca, OmronHBF214 } from '../medidas/medidas.domain-model';
import { Monstro } from '../monstros.domain-model';
import { MonstrosService } from '../monstros.service';
import { CadastroComponent } from './cadastro/cadastro.component';
import { RankingViewModel } from './cadastro/cadastro.presentation-model';
import { Ranking } from './rankings.domain-model';
import { RankingsService } from './rankings.service';
import { LogService } from 'src/app/app-common.services';

const columnDefinitions = [
  { showMobile: false, def: 'proprietario' },
  { showMobile: true, def: 'nome' },
  { showMobile: true, def: 'participantes' },
  { showMobile: false, def: 'feitoCom' },
  { showMobile: false, def: 'dataDeCriacao' },
  { showMobile: true, def: 'menu' },
];

@Component({
  selector: 'monstros-rankings',
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
    private log: LogService,
    media: MediaMatcher
  ) {
    this.balanca = new OmronHBF214();

    this.desktopQuery = media.matchMedia('(min-width: 600px)');
  }

  ngOnInit() {
    const monstro$ = this.route.paramMap.pipe(
      // first(),
      map(params => params.get('monstroId')),
      tap((value) => this.log.debug('RankingsComponent: constructor: monstroId', value)),
      switchMap((monstroId) => this.monstrosService.obtemMonstroObservavel(monstroId).pipe(first())),
      catchError((error, source$) => {
        console.log(`Não foi possível montar os rankings do monstro.\nRazão:\n${error}`);

        return of(null);
      }),
      shareReplay()
    );

    this.rankings$ = monstro$.pipe(
      // first(),
      tap((value) => this.log.debug('RankingsComponent: constructor: monstro', value)),
      switchMap(monstro => {
        this.monstro = monstro;

        return this.rankingsService.obtemRankingsObservaveisParaExibicao(monstro);
      }),
      shareReplay()
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

  onAdd(): void {
    const model = RankingViewModel.toAddViewModel(this.monstro);

    const config: MatDialogConfig<RankingViewModel> = { data: model };

    this.dialog.open(CadastroComponent, config);
  }

  onEdit(ranking: Ranking): void {
    const model = RankingViewModel.toEditViewModel(this.monstro, ranking);

    const config: MatDialogConfig<RankingViewModel> = { data: model };

    this.dialog.open(CadastroComponent, config);
  }

  onDelete(ranking: Ranking): void {
    this.rankingsService.excluiRanking(ranking.id);
  }
}
