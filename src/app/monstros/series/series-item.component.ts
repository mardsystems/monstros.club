import { MediaMatcher } from '@angular/cdk/layout';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { ConsultaDeMonstros, CONSULTA_DE_MONSTROS } from 'src/app/cadastro/monstros/@monstros-application.model';
import { MonstrosMembershipService } from 'src/app/cadastro/monstros/@monstros-membership.service';
import { CadastroDeSeries, CADASTRO_DE_SERIES } from '../series-cadastro/@series-cadastro-application.model';
import { CadastroDeExercicioViewModel } from '../series-cadastro/@series-cadastro-presentation.model';
import { SeriesCadastroExercicioComponent } from '../series-cadastro/series-cadastro-exercicio.component';
import { SeriesExecucaoComponent } from '../series-execucao/series-execucao.component';
import { ConsultaDeSeries, CONSULTA_DE_SERIES } from './@series-application.model';
import { Serie, SerieDeExercicio } from './@series-domain.model';
import { ConsultaDeExecucoesDeSeries, CONSULTA_DE_EXECUCOES_DE_SERIES } from './execucoes/@execucoes-application.model';
import { ExecucaoDeSerie } from './execucoes/@execucoes-domain.model';

const columnDefinitions = [
  { showMobile: true, def: 'icone' },
  { showMobile: false, def: 'exercicio' },
  { showMobile: true, def: 'sequencia' },
  { showMobile: true, def: 'quantidade' },
  { showMobile: true, def: 'repeticoes' },
  { showMobile: true, def: 'carga' },
  { showMobile: true, def: 'nota' },
  { showMobile: true, def: 'menu' },
];

@Component({
  selector: 'series-item',
  templateUrl: './series-item.component.html',
  styleUrls: ['./series-item.component.scss']
})
export class SeriesItemComponent implements OnInit {
  monstroId: string;

  serie: Serie;

  execucoes$: Observable<ExecucaoDeSerie[]>;

  disabledWrite$: Observable<boolean>;

  exerciciosDataSource: any;

  execucoesDataSource: any;

  @ViewChild(MatSort) sort: MatSort;

  desktopQuery: MediaQueryList;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    @Inject(CONSULTA_DE_SERIES)
    private consultaDeSeries: ConsultaDeSeries,
    @Inject(CONSULTA_DE_EXECUCOES_DE_SERIES)
    private consultaDeExecucoesDeSerie: ConsultaDeExecucoesDeSeries,
    @Inject(CADASTRO_DE_SERIES)
    private cadastroDeSeries: CadastroDeSeries,
    @Inject(CONSULTA_DE_MONSTROS)
    private consultaDeMonstros: ConsultaDeMonstros,
    private monstrosMembershipService: MonstrosMembershipService,
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

    const serie$ = this.route.paramMap.pipe(
      // first(),
      // map(params => params.get('serieId')),
      switchMap(params => {
        this.monstroId = params.get('monstroId');

        const serieId = params.get('serieId');

        return this.consultaDeSeries.obtemSerieObservavel(this.monstroId, serieId);
      }),
      catchError((error, source$) => {
        console.log(`Não foi possível montar a série.\nRazão:\n${error}`);

        return EMPTY; // Observable.throw(e);
      }),
      // shareReplay()
    );

    this.execucoes$ = serie$.pipe(
      switchMap(serie => {
        this.serie = serie;

        this.exerciciosDataSource = new MatTableDataSource(serie.exercicios);

        this.exerciciosDataSource.sort = this.sort;

        return this.consultaDeExecucoesDeSerie.obtemExecucoesDeSerieParaExibicao(this.monstroId, serie);
      }),
      shareReplay()
    );

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

    this.execucoes$.subscribe(execucoes => {
      this.execucoesDataSource = new MatTableDataSource(execucoes);

      this.execucoesDataSource.sort = this.sort;
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

  onPlay(): void {
    const model = CadastroDeExercicioViewModel.toAddViewModel(this.monstroId, this.serie);

    const config: MatDialogConfig<CadastroDeExercicioViewModel> = { data: model };

    this.dialog.open(SeriesExecucaoComponent, config);
  }

  onAddExercicio(): void {
    const model = CadastroDeExercicioViewModel.toAddViewModel(this.monstroId, this.serie);

    const config: MatDialogConfig<CadastroDeExercicioViewModel> = { data: model };

    this.dialog.open(SeriesCadastroExercicioComponent, config);
  }

  onEditExercicio(serieDeExercicio: SerieDeExercicio): void {
    const model = CadastroDeExercicioViewModel.toEditViewModel(this.monstroId, this.serie, serieDeExercicio);

    const config: MatDialogConfig<CadastroDeExercicioViewModel> = { data: model };

    this.dialog.open(SeriesCadastroExercicioComponent, config);
  }

  onDeleteExercicio(serieDeExercicio: SerieDeExercicio): void {
    this.cadastroDeSeries.removeExercicio(this.monstroId, this.serie.id, serieDeExercicio.id);
  }
}
