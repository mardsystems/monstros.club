import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { LogService } from 'src/app/@app-common.model';
import { Monstro } from 'src/app/cadastro/monstros/@monstros-domain.model';
import { CadastroDeSerieViewModel } from '../series-cadastro/@series-cadastro-presentation.model';
import { SeriesCadastroService } from '../series-cadastro/@series-cadastro.service';
import { SeriesCadastroComponent } from '../series-cadastro/series-cadastro.component';
import { ExecucaoDeSerieViewModel } from '../series-execucao/@series-execucao-presentation.model';
import { SeriesExecucaoComponent } from '../series-execucao/series-execucao.component';
import { Serie } from './@series-domain.model';
import { SeriesFirebaseService } from './@series-firebase.service';
import { ConsultaDeMonstros } from 'src/app/cadastro/monstros/@monstros-application.model';
import { AdaptadorParaUserInfo } from 'src/app/cadastro/monstros/@monstros-integration.model';

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
    private repositorioDeSeries: SeriesFirebaseService,
    private cadastroDeSeries: SeriesCadastroService,
    private consultaDeMonstros: ConsultaDeMonstros,
    private adaptadorParaUserInfo: AdaptadorParaUserInfo,
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

        return source$;
      }),
      shareReplay()
    );

    this.series$ = monstro$.pipe(
      switchMap(monstro => {
        this.monstro = monstro;

        return this.repositorioDeSeries.obtemSeriesParaExibicao(monstro);
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
