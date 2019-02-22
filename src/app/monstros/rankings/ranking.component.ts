import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, first, switchMap } from 'rxjs/operators';
import { Balanca, Medida, OmronHBF214 } from '../../monstros/medidas/medidas.domain-model';
import { MedidasService } from '../../monstros/medidas/medidas.service';
import { Ranking } from './rankings.domain-model';
import { RankingsService } from './rankings.service';

const columnDefinitions = [
  { showMobile: true, def: 'foto' },
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
  medidas$: Observable<Medida[]>;
  balanca: Balanca;
  loading = true;

  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;

  desktopQuery: MediaQueryList;

  constructor(
    private route: ActivatedRoute,
    private rankingsService: RankingsService,
    private medidasService: MedidasService,
    media: MediaMatcher
  ) {
    this.balanca = new OmronHBF214();

    this.desktopQuery = media.matchMedia('(min-width: 600px)');
  }

  ngOnInit() {
    const ranking$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const rankingId = params.get('rankingId');

        return this.rankingsService.obtemRankingObservavel(rankingId);
      }),
      catchError((error, source$) => {
        console.log(`Não foi possível montar o ranking.\nRazão:\n${error}`);

        return source$;
      })
    );

    this.medidas$ = ranking$.pipe(
      switchMap(ranking => {
        this.ranking = ranking;

        const participantes = ranking.participantes.map(participacao => participacao.participante);

        return this.medidasService.obtemMedidasObservaveisParaExibicaoPorMonstros(participantes);
      })
    );

    this.medidas$.pipe(
      first()
    ).subscribe(() => this.loading = false);

    this.medidas$.subscribe(medidas => {
      this.dataSource = new MatTableDataSource(medidas);

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
