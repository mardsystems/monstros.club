import { MediaMatcher } from '@angular/cdk/layout';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { Balanca, OmronHBF214 } from '../medidas/@medidas-domain.model';
import { ConsultaDeRankings, CONSULTA_DE_RANKINGS, PosicaoDeMedida } from './@rankings-application.model';
import { Ranking } from './@rankings-domain.model';
import { FiltroComponent } from './filtro/filtro.component';

const columnDefinitions = [
  { showMobile: true, def: 'monstro' },
  { showMobile: true, def: 'data' },
  { showMobile: false, def: 'peso' },
  { showMobile: true, def: 'gordura' },
  { showMobile: false, def: 'gorduraVisceral' },
  { showMobile: true, def: 'musculo' },
  { showMobile: false, def: 'idadeCorporal' },
  { showMobile: false, def: 'metabolismoBasal' },
  { showMobile: true, def: 'indiceDeMassaCorporal' },
];

@Component({
  selector: 'rankings-item',
  templateUrl: './rankings-item.component.html',
  styleUrls: ['./rankings-item.component.scss']
})
export class RankingsItemComponent implements OnInit {
  ranking: Ranking;

  posicoes$: Observable<PosicaoDeMedida[]>;

  balanca: Balanca;

  dataSource: any;

  @ViewChild(MatSort) sort: MatSort;

  desktopQuery: MediaQueryList;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    @Inject(CONSULTA_DE_RANKINGS)
    private consultaDeRankings: ConsultaDeRankings,
    media: MediaMatcher
  ) {
    this.balanca = new OmronHBF214();

    this.desktopQuery = media.matchMedia('(min-width: 600px)');
  }

  ngOnInit() {
    const ranking$ = this.route.paramMap.pipe(
      // first(),
      map(params => params.get('rankingId')),
      switchMap(rankingId => this.consultaDeRankings.obtemRankingObservavel(rankingId)),
      catchError((error, source$) => {
        console.log(`Não foi possível montar o ranking.\nRazão:\n${error}`);

        return EMPTY; // Observable.throw(e);
      }),
      // shareReplay()
    );

    this.posicoes$ = ranking$.pipe(
      switchMap(ranking => {
        this.ranking = ranking;

        return this.consultaDeRankings.obtemPosicoesDeMedidasParaExibicaoPorRanking(ranking);
      }),
      shareReplay()
    );

    this.posicoes$.subscribe(posicoes => {
      this.dataSource = new MatTableDataSource(posicoes);

      this.dataSource.sort = this.sort;
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

  onFilter(): void {
    const model = {}; // CadastroDeMedidaViewModel.toAddViewModel(this.monstro);

    const config: MatDialogConfig<any> = { data: model };

    this.dialog.open(FiltroComponent, config);
  }
}
