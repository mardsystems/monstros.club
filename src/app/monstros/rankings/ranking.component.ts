import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { Balanca, OmronHBF214 } from '../../monstros/medidas/medidas.domain-model';
import { PosicaoDeMedida } from './rankings.application-model';
import { Ranking } from './rankings.domain-model';
import { RankingsService } from './rankings.service';

const columnDefinitions = [
  { showMobile: true, def: 'monstro' },
  { showMobile: true, def: 'data' },
  { showMobile: true, def: 'peso' },
  { showMobile: true, def: 'gordura' },
  { showMobile: false, def: 'gorduraVisceral' },
  { showMobile: true, def: 'musculo' },
  { showMobile: false, def: 'idadeCorporal' },
  { showMobile: false, def: 'metabolismoBasal' },
  { showMobile: true, def: 'indiceDeMassaCorporal' },
];

@Component({
  selector: 'monstros-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
  ranking: Ranking;

  posicoes$: Observable<PosicaoDeMedida[]>;

  balanca: Balanca;

  dataSource: any;

  @ViewChild(MatSort) sort: MatSort;

  desktopQuery: MediaQueryList;

  constructor(
    private route: ActivatedRoute,
    private rankingsService: RankingsService,
    media: MediaMatcher
  ) {
    this.balanca = new OmronHBF214();

    this.desktopQuery = media.matchMedia('(min-width: 600px)');
  }

  ngOnInit() {
    const ranking$ = this.route.paramMap.pipe(
      // first(),
      map(params => params.get('rankingId')),
      switchMap(rankingId => this.rankingsService.obtemRankingObservavel(rankingId)),
      catchError((error, source$) => {
        console.log(`Não foi possível montar o ranking.\nRazão:\n${error}`);

        return EMPTY; // Observable.throw(e);
      }),
      // shareReplay()
    );

    this.posicoes$ = ranking$.pipe(
      switchMap(ranking => {
        this.ranking = ranking;

        return this.rankingsService.obtemPosicoesDeMedidasObservaveisParaExibicaoPorRanking(ranking);
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
}
