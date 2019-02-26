import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, first, switchMap, tap, map } from 'rxjs/operators';
import { Monstro } from '../monstros.domain-model';
import { MonstrosService } from '../monstros.service';
import { CadastroComponent } from './cadastro/cadastro.component';
import { CadastroDeSerieViewModel } from './cadastro/cadastro.presentation-model';
import { Serie } from './series.domain-model';
import { SeriesService } from './series.service';
import { LogService } from 'src/app/app.services';

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
  { showMobile: true, def: 'menu' },
];

@Component({
  selector: 'monstros-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})
export class SeriesComponent implements OnInit {
  medidas$: Observable<Serie[]>;
  monstro: Monstro;
  // balanca: Balanca;
  loading = true;
  disabledWrite: boolean;

  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;

  desktopQuery: MediaQueryList;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private medidasService: SeriesService,
    private monstrosService: MonstrosService,
    private log: LogService,
    media: MediaMatcher
  ) {
    // this.balanca = new OmronHBF214();

    this.desktopQuery = media.matchMedia('(min-width: 600px)');
  }

  ngOnInit() {
    const monstro$ = this.route.paramMap.pipe(
      first(),
      tap((value) => this.log.debug('paramMap1', value)),
      map(params => params.get('monstroId')),
      tap((value) => this.log.debug('paramMap2', value)),
      switchMap((monstroId) => this.monstrosService.obtemMonstroObservavel(monstroId)),
      catchError((error, source$) => {
        console.log(`Não foi possível montar as medidas do monstro.\nRazão:\n${error}`);

        return of(null);
      })
    );

    this.medidas$ = monstro$.pipe(
      switchMap(monstro => {
        this.monstro = monstro;

        return this.medidasService.obtemMedidasObservaveisParaExibicao(monstro);
      })
    );

    this.medidas$.pipe(
      first()
    ).subscribe(() => this.loading = false);

    this.medidas$.subscribe(medidas => {
      this.dataSource = new MatTableDataSource(medidas);

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
    const model = CadastroDeSerieViewModel.toAddViewModel(this.monstro);

    const config: MatDialogConfig<CadastroDeSerieViewModel> = { data: model };

    this.dialog.open(CadastroComponent, config);
  }

  onEdit(medida: Serie): void {
    const model = CadastroDeSerieViewModel.toEditViewModel(this.monstro, medida);

    const config: MatDialogConfig<CadastroDeSerieViewModel> = { data: model };

    this.dialog.open(CadastroComponent, config);
  }

  onDelete(medida: Serie): void {
    this.medidasService.excluiMedida(medida.id);
  }
}
