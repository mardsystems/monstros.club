import { MediaMatcher } from '@angular/cdk/layout';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { ConsultaDeMonstros, CONSULTA_DE_MONSTROS } from 'src/app/cadastro/monstros/@monstros-application.model';
import { Monstro } from 'src/app/cadastro/monstros/@monstros-domain.model';
import { MonstrosMembershipService } from 'src/app/cadastro/monstros/@monstros-membership.service';
import { LogService } from 'src/app/common/common.service';
import { CadastroDeSeries, CADASTRO_DE_SERIES } from '../series-cadastro/@series-cadastro-application.model';
import { CadastroDeSerieViewModel } from '../series-cadastro/@series-cadastro-presentation.model';
import { SeriesCadastroComponent } from '../series-cadastro/series-cadastro.component';
import { ExecucaoDeSerieViewModel } from '../series-execucao/@series-execucao-presentation.model';
import { SeriesExecucaoComponent } from '../series-execucao/series-execucao.component';
import { ConsultaDeSeries, CONSULTA_DE_SERIES } from './@series-application.model';
import { Serie } from './@series-domain.model';

const columnDefinitions = [
  { showMobile: true, def: 'foto' },
  { showMobile: true, def: 'nome' },
  { showMobile: true, def: 'exercicios' },
  { showMobile: true, def: 'execucoes' },
  { showMobile: true, def: 'menu' },
];

@Component({
  selector: 'series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})
export class SeriesComponent implements OnInit {
  monstro: Monstro;

  series$: Observable<Serie[]>;

  disabledWrite$: Observable<boolean>;

  dataSource: any;

  @ViewChild(MatSort) sort: MatSort;

  desktopQuery: MediaQueryList;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    @Inject(CONSULTA_DE_SERIES)
    private consultaDeSeries: ConsultaDeSeries,
    @Inject(CADASTRO_DE_SERIES)
    private cadastroDeSeries: CadastroDeSeries,
    @Inject(CONSULTA_DE_MONSTROS)
    private consultaDeMonstros: ConsultaDeMonstros,
    private monstrosMembershipService: MonstrosMembershipService,
    private snackBar: MatSnackBar,
    private log: LogService,
    media: MediaMatcher
  ) {
    this.desktopQuery = media.matchMedia('(min-width: 600px)');
  }

  ngOnInit() {
    const monstro$ = this.route.paramMap.pipe(
      // first(),
      map(params => params.get('monstroId')),
      switchMap(monstroId => this.consultaDeMonstros.obtemMonstroObservavel(monstroId)),
      catchError((error, source$) => {
        console.log(`Não foi possível montar as séries do monstro.\nRazão:\n${error}`);

        return EMPTY; // source$;
      }),
      shareReplay()
    );

    this.series$ = monstro$.pipe(
      switchMap(monstro => {
        this.monstro = monstro;

        return this.consultaDeSeries.obtemSeriesParaExibicao(monstro.id);
      }),
      catchError((error, source$) => {
        const message = error.message;

        this.snackBar.open(message, 'FECHAR', {
          duration: 5000,
        });

        return EMPTY;
      }),
      shareReplay()
    );

    this.series$.subscribe(series => {
      this.dataSource = new MatTableDataSource(series);

      this.dataSource.sort = this.sort;
    });

    this.disabledWrite$ = monstro$.pipe(
      // first(),
      switchMap(monstro => {
        return this.monstrosMembershipService.ehVoceMesmo(monstro.id);
      }),
      switchMap(value => {
        if (value) {
          return of(true);
        } else {
          return this.monstrosMembershipService.ehAdministrador();
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

  onPlay(serie: Serie): void {
    const model = ExecucaoDeSerieViewModel.toViewModel(this.monstro, serie);

    const config: MatDialogConfig<ExecucaoDeSerieViewModel> = { data: model };

    this.dialog.open(SeriesExecucaoComponent, config);
  }

  onAdd(): void {
    const model = CadastroDeSerieViewModel.toAddViewModel(this.monstro);

    const config: MatDialogConfig<CadastroDeSerieViewModel> = { data: model };

    this.dialog.open(SeriesCadastroComponent, config);
  }

  onEdit(serie: Serie): void {
    const model = CadastroDeSerieViewModel.toEditViewModel(this.monstro, serie);

    const config: MatDialogConfig<CadastroDeSerieViewModel> = { data: model };

    this.dialog.open(SeriesCadastroComponent, config);
  }

  onDelete(serie: Serie): void {
    this.cadastroDeSeries.excluiSerie(this.monstro.id, serie.id);
  }
}
