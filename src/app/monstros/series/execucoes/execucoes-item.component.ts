import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Serie, SerieDeExercicio } from '../@series-domain.model';
import { Observable, EMPTY, of } from 'rxjs';
import { ExecucaoDeSerie, ExecucaoDeExercicio } from './@execucoes-domain.model';
import { MatSort, MatDialog, MatTableDataSource, MatDialogConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CONSULTA_DE_SERIES, ConsultaDeSeries } from '../@series-application.model';
import { CONSULTA_DE_EXECUCOES_DE_SERIES, ConsultaDeExecucoesDeSeries } from './@execucoes-application.model';
import { CADASTRO_DE_SERIES, CadastroDeSeries } from '../../series-cadastro/@series-cadastro-application.model';
import { CONSULTA_DE_MONSTROS, ConsultaDeMonstros } from 'src/app/cadastro/monstros/@monstros-application.model';
import { MonstrosMembershipService } from 'src/app/cadastro/monstros/@monstros-membership.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { map, switchMap, catchError, shareReplay } from 'rxjs/operators';
import { CadastroDeExercicioViewModel } from 'src/app/cadastro/exercicios-cadastro/@exercicios-cadastro-presentation.model';
import { SeriesExecucaoComponent } from '../../series-execucao/series-execucao.component';
import { SeriesCadastroExercicioComponent } from '../../series-cadastro/series-cadastro-exercicio.component';

const columnDefinitions = [
  { showMobile: true, def: 'icone' },
  { showMobile: false, def: 'exercicio' },
  { showMobile: true, def: 'sequencia' },
  { showMobile: true, def: 'carga' },
  { showMobile: true, def: 'nota' },
  { showMobile: true, def: 'menu' },
];

@Component({
  selector: 'execucoes-item',
  templateUrl: './execucoes-item.component.html',
  styleUrls: ['./execucoes-item.component.scss']
})
export class ExecucoesItemComponent implements OnInit {
  monstroId: string;

  serie: Serie;

  execucaoDeSerie$: Observable<ExecucaoDeSerie>;

  execucaoDeSerie: ExecucaoDeSerie;

  // execucoes$: Observable<ExecucaoDeExercicio[]>;

  disabledWrite$: Observable<boolean>;

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

    this.execucaoDeSerie$ = this.route.paramMap.pipe(
      // first(),
      // map(params => params.get('serieId')),
      switchMap(params => {
        this.monstroId = params.get('monstroId');

        const serieId = params.get('serieId');

        const execucaoId = params.get('execucaoId');

        return this.consultaDeExecucoesDeSerie.obtemExecucaoDeSerieParaExibicao(this.monstroId, serieId, execucaoId);

        // return this.consultaDeSeries.obtemSerieObservavel(this.monstroId, serieId);
      }),
      catchError((error, source$) => {
        console.log(`Não foi possível montar a série.\nRazão:\n${error}`);

        return EMPTY; // Observable.throw(e);
      }),
      // shareReplay()
    );

    // this.execucaoDeSerie$$ = serie$.pipe(
    //   switchMap(serie => {
    //     this.serie = serie;

    //     // this.exerciciosDataSource = new MatTableDataSource(serie.exercicios);

    //     // this.exerciciosDataSource.sort = this.sort;

    //     return this.consultaDeExecucoesDeSerie.obtemExecucaoDeSerieParaExibicao(this.monstroId, serie.id,);
    //   }),
    //   shareReplay()
    // );

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

    this.execucaoDeSerie$.subscribe(execucao => {
      this.execucaoDeSerie = execucao;

      this.serie = this.execucaoDeSerie.serie;

      this.execucoesDataSource = new MatTableDataSource(this.execucaoDeSerie.exercicios);

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
    // const model = CadastroDeExercicioViewModel.toAddViewModel(this.monstroId, this.serie);

    // const config: MatDialogConfig<CadastroDeExercicioViewModel> = { data: model };

    // this.dialog.open(SeriesExecucaoComponent, config);
  }

  onAddExercicio(): void {
    // const model = CadastroDeExercicioViewModel.toAddViewModel(this.monstroId, this.serie);

    // const config: MatDialogConfig<CadastroDeExercicioViewModel> = { data: model };

    // this.dialog.open(SeriesCadastroExercicioComponent, config);
  }

  onEditExercicio(serieDeExercicio: SerieDeExercicio): void {
    // const model = CadastroDeExercicioViewModel.toEditViewModel(this.monstroId, this.serie, serieDeExercicio);

    // const config: MatDialogConfig<CadastroDeExercicioViewModel> = { data: model };

    // this.dialog.open(SeriesCadastroExercicioComponent, config);
  }

  onDeleteExercicio(serieDeExercicio: SerieDeExercicio): void {
    // this.cadastroDeSeries.removeExercicio(this.monstroId, this.serie.id, serieDeExercicio.id);
  }
}
